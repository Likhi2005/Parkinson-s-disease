import React, { useState, useCallback } from 'react';
import { useRecording } from '../hooks/useRecording';
import { formatTime } from '../utils/formatters';

const VoiceRecorder = ({ onAnalyze, isAnalyzing }) => {
    const { isRecording, startRecording, stopRecording, resetRecording, audioFile, recordingTime } = useRecording();
    const [uploadedFile, setUploadedFile] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [error, setError] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isAnalyzingLocal, setIsAnalyzingLocal] = useState(false);

    // Get the current audio file (either recorded or uploaded)
    const currentAudioFile = audioFile || uploadedFile;

    // Combined analyzing state (local or from parent)
    const isCurrentlyAnalyzing = isAnalyzing || isAnalyzingLocal;

    // Handle file upload
    const handleFileUpload = useCallback((event) => {
        const file = event.target.files[0];
        setError(null);

        if (!file) return;

        // Validate file type
        const allowedTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/ogg', 'audio/webm', 'audio/flac', 'audio/m4a'];
        if (!allowedTypes.includes(file.type)) {
            setError('Please upload a valid audio file (WAV, MP3, OGG, WEBM, FLAC, M4A)');
            return;
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            setError('File size must be less than 10MB');
            return;
        }

        setIsUploading(true);
        setUploadedFile(file);
        setAnalysisResult(null);

        // Clear any recorded audio when uploading
        if (audioFile) {
            resetRecording();
        }

        setTimeout(() => setIsUploading(false), 500);
    }, [audioFile, resetRecording]);

    // Handle drag and drop
    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        if (!isCurrentlyAnalyzing && !isRecording) {
            setIsDragOver(true);
        }
    }, [isCurrentlyAnalyzing, isRecording]);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(false);

        if (isCurrentlyAnalyzing || isRecording) {
            return;
        }

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            handleFileUpload({ target: { files: [file] } });
        }
    }, [handleFileUpload, isCurrentlyAnalyzing, isRecording]);

    // Handle analyze button click - FIXED VERSION
    const handleAnalyzeClick = useCallback(async () => {
        if (!currentAudioFile || isCurrentlyAnalyzing) return;

        setError(null);
        setAnalysisResult(null);
        setIsAnalyzingLocal(true);

        try {
            console.log('Starting analysis with file:', currentAudioFile.name);

            const formData = new FormData();
            formData.append('audio', currentAudioFile);

            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Network error' }));
                throw new Error(errorData.detail || errorData.error || `HTTP ${response.status}`);
            }

            const result = await response.json();
            console.log('Raw analysis result:', result);

            // Transform the result to match ResultsDashboard expectations
            const transformedResult = {
                ...result,
                risk_score: result.probability || 0.5, // Use probability as risk_score
                confidence: result.confidence || `${((result.probability || 0.5) * 100).toFixed(1)}%`
            };

            console.log('Transformed result for dashboard:', transformedResult);
            setAnalysisResult(transformedResult);

            // Call the parent callback with transformed result
            if (onAnalyze) {
                console.log('Calling onAnalyze with result:', transformedResult);
                await onAnalyze(transformedResult);
            }
        } catch (error) {
            console.error('Analysis error:', error);
            setError(`Analysis failed: ${error.message}`);
        } finally {
            setIsAnalyzingLocal(false);
        }
    }, [currentAudioFile, onAnalyze, isCurrentlyAnalyzing]);

    // Handle reset
    const handleReset = useCallback(() => {
        if (isCurrentlyAnalyzing) return;

        resetRecording();
        setUploadedFile(null);
        setAnalysisResult(null);
        setError(null);

        const fileInput = document.getElementById('audio-upload');
        if (fileInput) {
            fileInput.value = '';
        }
    }, [resetRecording, isCurrentlyAnalyzing]);

    // Handle start recording
    const handleStartRecording = useCallback(() => {
        if (isCurrentlyAnalyzing) return;

        setError(null);
        setAnalysisResult(null);
        setUploadedFile(null);

        const fileInput = document.getElementById('audio-upload');
        if (fileInput) {
            fileInput.value = '';
        }

        startRecording();
    }, [startRecording, isCurrentlyAnalyzing]);

    // Get status display
    const getStatusDisplay = () => {
        if (isRecording) {
            return {
                icon: '🔴',
                text: 'Recording in progress...',
                color: 'from-red-600 to-red-500',
                animation: 'animate-pulse',
                shadow: 'shadow-red-500/60'
            };
        }

        if (isCurrentlyAnalyzing) {
            return {
                icon: '🔄',
                text: 'AI is analyzing your voice...',
                color: 'from-blue-600 to-blue-500',
                animation: 'animate-spin',
                shadow: 'shadow-blue-500/60'
            };
        }

        if (isUploading) {
            return {
                icon: '📁',
                text: 'Processing your file...',
                color: 'from-yellow-600 to-yellow-500',
                animation: 'animate-bounce',
                shadow: 'shadow-yellow-500/60'
            };
        }

        if (currentAudioFile) {
            return {
                icon: '✅',
                text: 'Audio ready - Click Analyze!',
                color: 'from-green-600 to-emerald-500',
                animation: 'animate-pulse',
                shadow: 'shadow-green-500/40'
            };
        }

        return {
            icon: '🎙️',
            text: 'Click to start recording',
            color: 'from-violet-600 to-pink-500',
            animation: 'hover:animate-pulse',
            shadow: 'shadow-violet-500/40'
        };
    };

    const status = getStatusDisplay();
    const isDisabled = isRecording || isCurrentlyAnalyzing || isUploading;

    return (
        <div className="flex flex-col items-center gap-6 p-8 bg-slate-900/50 rounded-2xl backdrop-blur-sm shadow-xl border border-slate-700/50 transition-all duration-300 hover:bg-slate-900/60 hover:border-slate-600/50">
            {/* Title */}
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 animate-pulse">
                🎵 Voice Analysis Studio
            </h2>

            {/* Interactive Status Circle */}
            <div className="flex flex-col items-center gap-3">
                <div
                    className={`inline-flex items-center justify-center w-32 h-32 rounded-full transition-all duration-500 bg-gradient-to-br ${status.color} shadow-2xl ${status.shadow} ${status.animation} group ${!isRecording && !currentAudioFile && !isDisabled ? 'cursor-pointer hover:scale-105' : 'cursor-default'
                        }`}
                    onClick={!isRecording && !currentAudioFile && !isDisabled ? handleStartRecording : undefined}
                >
                    <span className={`text-6xl transition-transform duration-300 ${status.animation === 'animate-bounce' ? 'animate-bounce' : !isDisabled ? 'group-hover:scale-110' : ''}`}>
                        {status.icon}
                    </span>
                </div>
                <p className="text-lg font-semibold text-gray-300 text-center max-w-xs">
                    {status.text}
                </p>
            </div>

            {/* Recording Time */}
            {recordingTime > 0 && (
                <div className="text-center">
                    <p className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent font-mono animate-pulse">
                        {formatTime(recordingTime)}
                    </p>
                    <div className="w-32 h-1 bg-gray-700 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full animate-pulse"></div>
                    </div>
                </div>
            )}

            {/* Analysis Progress Indicator */}
            {isCurrentlyAnalyzing && (
                <div className="bg-blue-500/10 border border-blue-500/50 rounded-xl p-4 text-center w-full max-w-sm transition-all duration-300">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <span className="text-2xl animate-spin">🔄</span>
                        <p className="text-blue-300 font-medium">Analyzing Audio...</p>
                    </div>
                    <div className="w-full bg-blue-700/30 rounded-full h-2 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-blue-400/70 text-xs mt-2">Please wait while AI processes your voice</p>
                </div>
            )}

            {/* File Info Display */}
            {currentAudioFile && !isRecording && !isCurrentlyAnalyzing && (
                <div className="bg-emerald-500/10 border border-emerald-500/50 rounded-xl p-4 text-center w-full max-w-sm transition-all duration-300 hover:bg-emerald-500/20 hover:border-emerald-400/70">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-2xl animate-bounce">✓</span>
                        <p className="text-emerald-300 font-medium">Audio File Ready</p>
                    </div>
                    <p className="text-emerald-400/70 text-sm mt-1 truncate font-mono">
                        {currentAudioFile.name || 'recorded-audio.wav'}
                    </p>
                    {currentAudioFile.size && (
                        <div className="flex justify-center items-center gap-2 mt-2">
                            <span className="text-emerald-400/50 text-xs">📁</span>
                            <p className="text-emerald-400/50 text-xs">
                                {(currentAudioFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-center w-full max-w-lg transition-all duration-300 hover:bg-red-500/20">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-xl animate-bounce">❌</span>
                        <p className="text-red-300 font-semibold">Error</p>
                    </div>
                    <p className="text-red-200 text-sm">{error}</p>
                </div>
            )}

            {/* Analysis Result Preview */}
            {analysisResult && !isCurrentlyAnalyzing && (
                <div className={`border rounded-xl p-6 text-center w-full max-w-lg transition-all duration-500 hover:scale-102 ${analysisResult.prediction === 1
                        ? 'bg-red-500/10 border-red-500/50 hover:bg-red-500/20'
                        : 'bg-green-500/10 border-green-500/50 hover:bg-green-500/20'
                    }`}>
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="text-4xl animate-pulse">
                            {analysisResult.prediction === 1 ? '⚠️' : '✅'}
                        </span>
                        <div>
                            <h3 className={`text-xl font-bold ${analysisResult.prediction === 1 ? 'text-red-300' : 'text-green-300'
                                }`}>
                                {analysisResult.status}
                            </h3>
                            <p className="text-gray-400 text-sm">AI Analysis Complete</p>
                        </div>
                    </div>

                    {analysisResult.probability && (
                        <div className="space-y-3">
                            <p className="text-gray-300 text-lg">
                                <span className="font-semibold">Confidence:</span>
                                <span className="ml-2 font-bold text-white">{analysisResult.confidence}</span>
                            </p>

                            <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                                <div
                                    className={`h-4 rounded-full transition-all duration-2000 ease-out ${analysisResult.prediction === 1
                                            ? 'bg-gradient-to-r from-red-500 via-red-400 to-red-300'
                                            : 'bg-gradient-to-r from-green-500 via-green-400 to-green-300'
                                        } animate-pulse`}
                                    style={{ width: `${analysisResult.probability * 100}%` }}
                                ></div>
                            </div>

                            <div className="flex justify-between text-xs text-gray-400">
                                <span>0%</span>
                                <span className="font-semibold">
                                    {(analysisResult.probability * 100).toFixed(1)}%
                                </span>
                                <span>100%</span>
                            </div>

                            <p className="text-blue-300 text-sm mt-3">
                                📊 Click "View Detailed Results" to see full analysis
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Control Buttons */}
            <div className="flex gap-3 flex-wrap justify-center">
                {!isRecording ? (
                    <button
                        onClick={handleStartRecording}
                        disabled={isDisabled}
                        className={`group bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 
                                 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-xl 
                                 shadow-lg shadow-violet-500/30 flex items-center gap-3 min-w-[160px] justify-center
                                 ${isDisabled
                                ? 'opacity-50 cursor-not-allowed hover:shadow-lg hover:scale-100'
                                : 'cursor-pointer transform hover:scale-105 active:scale-95'
                            }`}
                    >
                        <span className={`text-xl ${!isDisabled ? 'group-hover:animate-pulse' : ''}`}>🎙️</span>
                        <span>Start Recording</span>
                    </button>
                ) : (
                    <button
                        onClick={stopRecording}
                        disabled={isCurrentlyAnalyzing}
                        className={`group bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 
                                 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-xl 
                                 shadow-lg shadow-amber-500/30 flex items-center gap-3 min-w-[160px] justify-center
                                 ${isCurrentlyAnalyzing
                                ? 'opacity-50 cursor-not-allowed'
                                : 'cursor-pointer transform hover:scale-105 active:scale-95'
                            }`}
                    >
                        <span className={`text-xl ${!isCurrentlyAnalyzing ? 'group-hover:animate-bounce' : ''}`}>⏹️</span>
                        <span>Stop Recording</span>
                    </button>
                )}

                {currentAudioFile && !isRecording && (
                    <button
                        onClick={handleAnalyzeClick}
                        disabled={isCurrentlyAnalyzing}
                        className={`group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 
                                 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-xl 
                                 shadow-lg shadow-emerald-500/30 flex items-center gap-3 min-w-[160px] justify-center
                                 ${isCurrentlyAnalyzing
                                ? 'opacity-50 cursor-not-allowed hover:shadow-lg hover:scale-100'
                                : 'cursor-pointer transform hover:scale-105 active:scale-95'
                            }`}
                    >
                        {isCurrentlyAnalyzing ? (
                            <>
                                <span className="inline-block animate-spin text-xl">🔄</span>
                                <span>Analyzing...</span>
                            </>
                        ) : (
                            <>
                                <span className="text-xl group-hover:animate-pulse">🔍</span>
                                <span>Analyze Audio</span>
                            </>
                        )}
                    </button>
                )}

                {(currentAudioFile || analysisResult) && !isRecording && (
                    <button
                        onClick={handleReset}
                        disabled={isCurrentlyAnalyzing}
                        className={`group bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 
                                 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-xl 
                                 shadow-lg shadow-slate-500/30 flex items-center gap-3 min-w-[120px] justify-center
                                 ${isCurrentlyAnalyzing
                                ? 'opacity-50 cursor-not-allowed hover:shadow-lg hover:scale-100'
                                : 'cursor-pointer transform hover:scale-105 active:scale-95'
                            }`}
                    >
                        <span className={`text-xl ${!isCurrentlyAnalyzing ? 'group-hover:animate-spin' : ''}`}>🔄</span>
                        <span>Reset</span>
                    </button>
                )}
            </div>

            {/* File Upload */}
            <div className="w-full max-w-sm mt-4">
                <label className="block text-center mb-4 text-sm text-gray-300 font-medium">
                    📁 Or upload an audio file:
                </label>

                <div
                    className={`relative transition-all duration-300 ${isDragOver && !isDisabled ? 'scale-105' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className={`border-2 border-dashed rounded-xl p-4 transition-all duration-300 ${isDisabled
                            ? 'border-slate-700 bg-slate-800/50 opacity-50'
                            : isDragOver
                                ? 'border-violet-500 bg-violet-500/10'
                                : 'border-slate-600 hover:border-violet-500/50 hover:bg-slate-800/50'
                        }`}>
                        <input
                            id="audio-upload"
                            type="file"
                            accept=".wav,.mp3,.ogg,.webm,.flac,.m4a,audio/*"
                            onChange={handleFileUpload}
                            disabled={isDisabled}
                            className={`w-full text-sm text-gray-300 
                                     file:mr-4 file:py-3 file:px-5 file:rounded-full file:border-0 
                                     file:text-sm file:font-semibold file:bg-violet-500/50 file:text-white 
                                     file:transition-all file:duration-300
                                     focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:ring-offset-2 focus:ring-offset-slate-900
                                     ${isDisabled
                                    ? 'opacity-50 cursor-not-allowed file:cursor-not-allowed file:opacity-50'
                                    : 'cursor-pointer file:cursor-pointer hover:file:bg-violet-500/70 file:hover:shadow-lg file:shadow-violet-500/30 file:hover:scale-105'
                                }`}
                        />

                        {isDragOver && !isDisabled && (
                            <div className="absolute inset-0 flex items-center justify-center bg-violet-500/20 rounded-xl">
                                <p className="text-violet-300 font-semibold">Drop your audio file here!</p>
                            </div>
                        )}

                        {isDisabled && (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50 rounded-xl">
                                <p className="text-slate-400 font-medium text-sm">
                                    {isCurrentlyAnalyzing ? 'Analysis in progress...' : 'Upload disabled'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-3 text-center">
                    <p className={`text-xs ${isDisabled ? 'text-gray-600' : 'text-gray-500'}`}>
                        Supported formats: WAV, MP3, OGG, WEBM, FLAC, M4A
                    </p>
                    <p className={`text-xs ${isDisabled ? 'text-gray-700' : 'text-gray-600'}`}>
                        Maximum size: 10MB | Drag & drop supported
                    </p>
                </div>
            </div>

            {/* Usage Tips */}
            <div className="w-full max-w-lg mt-4 p-4 bg-slate-800/30 rounded-xl border border-slate-600/30">
                <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                    <span>💡</span>
                    <span>Tips for best results:</span>
                </h4>
                <ul className="text-xs text-gray-400 space-y-1">
                    <li>• Record in a quiet environment</li>
                    <li>• Speak clearly and naturally</li>
                    <li>• Record for at least 3-5 seconds</li>
                    <li>• Use good quality microphone if possible</li>
                </ul>
            </div>
        </div>
    );
};

export default VoiceRecorder;