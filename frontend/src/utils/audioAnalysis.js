import * as tf from '@tensorflow/tfjs';

export class AudioAnalyzer {
    constructor() {
        this.sampleRate = 44100;
        this.fftSize = 2048;
        this.hopLength = 512;
        this.nMfcc = 13;
        this.nMels = 128;
    }

    // Convert audio file to array buffer
    async audioFileToBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    // Decode audio buffer
    async decodeAudioBuffer(arrayBuffer) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        try {
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            return {
                data: audioBuffer.getChannelData(0), // Get mono channel
                sampleRate: audioBuffer.sampleRate,
                duration: audioBuffer.duration
            };
        } finally {
            audioContext.close();
        }
    }

    // Extract waveform data for visualization
    extractWaveform(audioData, downsampleFactor = 10) {
        const length = audioData.length;
        const downsampledLength = Math.floor(length / downsampleFactor);
        const waveform = new Float32Array(downsampledLength);

        for (let i = 0; i < downsampledLength; i++) {
            const start = i * downsampleFactor;
            const end = Math.min(start + downsampleFactor, length);
            let sum = 0;
            for (let j = start; j < end; j++) {
                sum += Math.abs(audioData[j]);
            }
            waveform[i] = sum / (end - start);
        }

        return {
            data: Array.from(waveform),
            timeAxis: Array.from({ length: downsampledLength }, (_, i) =>
                (i * downsampleFactor) / this.sampleRate
            )
        };
    }

    // Compute spectrogram using FFT
    computeSpectrogram(audioData) {
        const hopLength = this.hopLength;
        const fftSize = this.fftSize;
        const numFrames = Math.floor((audioData.length - fftSize) / hopLength) + 1;

        const spectrogram = [];
        const frequencies = Array.from({ length: fftSize / 2 + 1 }, (_, i) =>
            (i * this.sampleRate) / fftSize
        );

        for (let frame = 0; frame < numFrames; frame++) {
            const start = frame * hopLength;
            const frameData = audioData.slice(start, start + fftSize);

            // Apply Hanning window
            const windowed = frameData.map((val, i) =>
                val * (0.5 - 0.5 * Math.cos(2 * Math.PI * i / (fftSize - 1)))
            );

            // Compute FFT magnitude (simplified)
            const magnitudes = this.computeFFTMagnitude(windowed);
            spectrogram.push(magnitudes);
        }

        return {
            data: spectrogram,
            frequencies: frequencies.slice(0, 100), // Limit to first 100 frequency bins
            timeAxis: Array.from({ length: numFrames }, (_, i) =>
                (i * hopLength) / this.sampleRate
            )
        };
    }

    // Simplified FFT magnitude computation
    computeFFTMagnitude(frameData) {
        const N = frameData.length;
        const magnitudes = [];

        for (let k = 0; k < Math.min(N / 2, 100); k++) {
            let real = 0, imag = 0;
            for (let n = 0; n < N; n++) {
                const angle = -2 * Math.PI * k * n / N;
                real += frameData[n] * Math.cos(angle);
                imag += frameData[n] * Math.sin(angle);
            }
            magnitudes.push(Math.sqrt(real * real + imag * imag));
        }

        return magnitudes;
    }

    // Extract basic acoustic features
    extractAcousticFeatures(audioData) {
        const features = {};

        // Fundamental frequency (simplified pitch detection)
        features.f0 = this.estimatePitch(audioData);

        // Jitter (pitch variation)
        features.jitter = this.calculateJitter(audioData);

        // Shimmer (amplitude variation)
        features.shimmer = this.calculateShimmer(audioData);

        // Harmonic-to-noise ratio
        features.hnr = this.calculateHNR(audioData);

        // MFCC features (simplified)
        features.mfcc = this.extractMFCC(audioData);

        return features;
    }

    // Simplified pitch estimation using autocorrelation
    estimatePitch(audioData) {
        const minPitch = 50;  // Hz
        const maxPitch = 400; // Hz
        const minPeriod = Math.floor(this.sampleRate / maxPitch);
        const maxPeriod = Math.floor(this.sampleRate / minPitch);

        let maxCorrelation = -1;
        let bestPeriod = 0;

        for (let period = minPeriod; period <= maxPeriod; period++) {
            let correlation = 0;
            let count = 0;

            for (let i = 0; i < audioData.length - period; i++) {
                correlation += audioData[i] * audioData[i + period];
                count++;
            }

            correlation /= count;

            if (correlation > maxCorrelation) {
                maxCorrelation = correlation;
                bestPeriod = period;
            }
        }

        return bestPeriod > 0 ? this.sampleRate / bestPeriod : 0;
    }

    // Calculate jitter (pitch variability)
    calculateJitter(audioData) {
        const frameSize = 1024;
        const hopSize = 512;
        const pitches = [];

        for (let i = 0; i < audioData.length - frameSize; i += hopSize) {
            const frame = audioData.slice(i, i + frameSize);
            pitches.push(this.estimatePitch(frame));
        }

        if (pitches.length < 2) return 0;

        let jitterSum = 0;
        for (let i = 1; i < pitches.length; i++) {
            if (pitches[i] > 0 && pitches[i - 1] > 0) {
                jitterSum += Math.abs(pitches[i] - pitches[i - 1]) / pitches[i - 1];
            }
        }

        return jitterSum / (pitches.length - 1);
    }

    // Calculate shimmer (amplitude variability)
    calculateShimmer(audioData) {
        const frameSize = 1024;
        const hopSize = 512;
        const amplitudes = [];

        for (let i = 0; i < audioData.length - frameSize; i += hopSize) {
            const frame = audioData.slice(i, i + frameSize);
            const rms = Math.sqrt(frame.reduce((sum, val) => sum + val * val, 0) / frame.length);
            amplitudes.push(rms);
        }

        if (amplitudes.length < 2) return 0;

        let shimmerSum = 0;
        for (let i = 1; i < amplitudes.length; i++) {
            if (amplitudes[i] > 0 && amplitudes[i - 1] > 0) {
                shimmerSum += Math.abs(amplitudes[i] - amplitudes[i - 1]) / amplitudes[i - 1];
            }
        }

        return shimmerSum / (amplitudes.length - 1);
    }

    // Calculate Harmonic-to-Noise Ratio
    calculateHNR(audioData) {
        const frameSize = 1024;
        const frames = [];

        for (let i = 0; i < audioData.length - frameSize; i += frameSize) {
            frames.push(audioData.slice(i, i + frameSize));
        }

        if (frames.length === 0) return 0;

        let totalHNR = 0;
        frames.forEach(frame => {
            const autocorr = this.autocorrelation(frame);
            const maxAC = Math.max(...autocorr.slice(1)); // Skip zero lag
            const noise = 1 - maxAC;
            const hnr = noise > 0 ? 10 * Math.log10(maxAC / noise) : 20;
            totalHNR += hnr;
        });

        return totalHNR / frames.length;
    }

    // Autocorrelation function
    autocorrelation(signal) {
        const result = new Array(signal.length);
        for (let lag = 0; lag < signal.length; lag++) {
            let sum = 0;
            for (let i = 0; i < signal.length - lag; i++) {
                sum += signal[i] * signal[i + lag];
            }
            result[lag] = sum / (signal.length - lag);
        }
        return result;
    }

    // Extract simplified MFCC features
    extractMFCC(audioData) {
        // This is a simplified MFCC implementation
        const spectrogram = this.computeSpectrogram(audioData);
        const mfccFeatures = [];

        spectrogram.data.forEach(frame => {
            // Apply mel filter bank (simplified)
            const melFiltered = this.applyMelFilters(frame);

            // Apply DCT (simplified)
            const mfcc = this.applyDCT(melFiltered);
            mfccFeatures.push(mfcc.slice(0, this.nMfcc));
        });

        // Return mean MFCC across all frames
        const meanMfcc = new Array(this.nMfcc).fill(0);
        mfccFeatures.forEach(frame => {
            frame.forEach((val, i) => {
                meanMfcc[i] += val / mfccFeatures.length;
            });
        });

        return meanMfcc;
    }

    // Apply mel filter bank (simplified)
    applyMelFilters(spectrum) {
        const melFilters = 26;
        const melSpectrum = new Array(melFilters);

        for (let i = 0; i < melFilters; i++) {
            let sum = 0;
            const start = Math.floor(i * spectrum.length / melFilters);
            const end = Math.floor((i + 1) * spectrum.length / melFilters);

            for (let j = start; j < end; j++) {
                sum += spectrum[j];
            }

            melSpectrum[i] = Math.log(sum + 1e-10); // Add small epsilon to avoid log(0)
        }

        return melSpectrum;
    }

    // Apply Discrete Cosine Transform (simplified)
    applyDCT(melSpectrum) {
        const dctCoeffs = new Array(melSpectrum.length);

        for (let k = 0; k < dctCoeffs.length; k++) {
            let sum = 0;
            for (let n = 0; n < melSpectrum.length; n++) {
                sum += melSpectrum[n] * Math.cos(Math.PI * k * (2 * n + 1) / (2 * melSpectrum.length));
            }
            dctCoeffs[k] = sum;
        }

        return dctCoeffs;
    }

    // Generate healthy baseline data (for comparison)
    getHealthyBaseline() {
        return {
            f0: { mean: 150, std: 30, range: [80, 250] },
            jitter: { mean: 0.005, std: 0.002, range: [0.002, 0.012] },
            shimmer: { mean: 0.03, std: 0.01, range: [0.015, 0.055] },
            hnr: { mean: 15, std: 5, range: [8, 25] },
            mfcc: {
                mean: [0, -10, -8, -12, -5, -8, -3, -7, -2, -5, -1, -4, -2],
                std: [2, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
            }
        };
    }

    // Compare user features with healthy baseline
    compareWithBaseline(userFeatures) {
        const baseline = this.getHealthyBaseline();
        const comparison = {};

        // Compare scalar features
        ['f0', 'jitter', 'shimmer', 'hnr'].forEach(feature => {
            const userVal = userFeatures[feature];
            const baselineMean = baseline[feature].mean;
            const baselineStd = baseline[feature].std;
            const [minVal, maxVal] = baseline[feature].range;

            const zScore = (userVal - baselineMean) / baselineStd;
            const isInRange = userVal >= minVal && userVal <= maxVal;
            const deviation = Math.abs(zScore);

            comparison[feature] = {
                userValue: userVal,
                baselineValue: baselineMean,
                zScore: zScore,
                inNormalRange: isInRange,
                deviation: deviation,
                riskLevel: this.assessRiskLevel(deviation)
            };
        });

        // Compare MFCC features
        const mfccComparison = userFeatures.mfcc.map((val, i) => {
            const baselineMean = baseline.mfcc.mean[i];
            const baselineStd = baseline.mfcc.std[i];
            const zScore = (val - baselineMean) / baselineStd;

            return {
                coefficient: i,
                userValue: val,
                baselineValue: baselineMean,
                zScore: zScore,
                deviation: Math.abs(zScore)
            };
        });

        comparison.mfcc = mfccComparison;

        return comparison;
    }

    // Assess risk level based on deviation
    assessRiskLevel(deviation) {
        if (deviation < 1) return { level: 'Normal', color: '#10b981', description: 'Within normal range' };
        if (deviation < 2) return { level: 'Slight', color: '#f59e0b', description: 'Slightly elevated' };
        if (deviation < 3) return { level: 'Moderate', color: '#f97316', description: 'Moderately elevated' };
        return { level: 'High', color: '#ef4444', description: 'Significantly elevated' };
    }
}