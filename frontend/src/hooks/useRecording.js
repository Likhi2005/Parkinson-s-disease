import { useState, useEffect, useRef } from 'react';

// Utility: encode Float32Array audio buffer to WAV (16-bit PCM)
const encodeWAV = (samples, sampleRate) => {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    const writeString = (view, offset, string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };

    /* RIFF identifier */
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    /* RIFF type */
    writeString(view, 8, 'WAVE');
    /* format chunk identifier */
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    /* data chunk identifier */
    writeString(view, 36, 'data');
    view.setUint32(40, samples.length * 2, true);

    // write the PCM samples
    let offset = 44;
    for (let i = 0; i < samples.length; i++, offset += 2) {
        let s = Math.max(-1, Math.min(1, samples[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }

    return new Blob([view], { type: 'audio/wav' });
};

export const useRecording = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioFile, setAudioFile] = useState(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => {
        return () => {
            // cleanup on unmount
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
            }
            clearInterval(timerRef.current);
        };
    }, []);

    const startRecording = async () => {
        setAudioFile(null);
        audioChunksRef.current = [];
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            const recorder = new MediaRecorder(stream);
            recorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
            };

            recorder.onstop = async () => {
                try {
                    // combine chunks into a single blob
                    const recordedBlob = new Blob(audioChunksRef.current, { type: audioChunksRef.current[0]?.type || 'audio/webm' });

                    // Convert to WAV via AudioContext for maximum compatibility
                    const arrayBuffer = await recordedBlob.arrayBuffer();
                    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer.slice(0));
                    const channelData = audioBuffer.getChannelData(0);
                    const wavBlob = encodeWAV(channelData, Math.round(audioBuffer.sampleRate));

                    const file = new File([wavBlob], `recording_${Date.now()}.wav`, { type: 'audio/wav' });
                    setAudioFile(file);
                } catch (err) {
                    // Fallback: set raw recorded blob as file
                    const fallbackFile = new File(audioChunksRef.current, `recording_${Date.now()}.webm`, { type: audioChunksRef.current[0]?.type || 'audio/webm' });
                    setAudioFile(fallbackFile);
                } finally {
                    // stop streams
                    if (streamRef.current) {
                        streamRef.current.getTracks().forEach(t => t.stop());
                        streamRef.current = null;
                    }
                }
                audioChunksRef.current = [];
                clearInterval(timerRef.current);
                setRecordingTime(0);
            };

            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);

            // start timer
            let startTs = Date.now();
            timerRef.current = setInterval(() => {
                setRecordingTime(Math.round((Date.now() - startTs) / 1000));
            }, 250);
        } catch (err) {
            console.error('Failed to start recording', err);
            throw err;
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    };

    const resetRecording = () => {
        setAudioFile(null);
        audioChunksRef.current = [];
        setRecordingTime(0);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        clearInterval(timerRef.current);
    };

    return { isRecording, startRecording, stopRecording, resetRecording, audioFile, recordingTime };
};

export default useRecording;