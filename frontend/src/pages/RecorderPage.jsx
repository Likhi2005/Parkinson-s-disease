import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePredictionContext } from '../context/PredictionContext';
import { useTranslation } from 'react-i18next';
import VoiceRecorder from '../components/VoiceRecorder';
import VoiceAnalysisVisualization from '../components/VoiceAnalysisVisualization';

const RecorderPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { makePrediction, setPrediction, loading } = usePredictionContext();
    const [connectionStatus, setConnectionStatus] = useState('checking');
    const [currentAudioFile, setCurrentAudioFile] = useState(null);
    const [showVisualization, setShowVisualization] = useState(false);
    const [voiceAnalysisData, setVoiceAnalysisData] = useState(null);
    const [analysisComplete, setAnalysisComplete] = useState(false);
    const [predictionResult, setPredictionResult] = useState(null);

    // Check backend connection on component mount
    React.useEffect(() => {
        const checkConnection = async () => {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);

                const response = await fetch('http://127.0.0.1:5000/health', {
                    method: 'GET',
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (response.ok) {
                    const data = await response.json();
                    setConnectionStatus(data.model_loaded ? 'connected' : 'model_error');
                } else {
                    setConnectionStatus('error');
                }
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.error('Backend connection timeout');
                } else {
                    console.error('Backend connection failed:', error);
                }
                setConnectionStatus('error');
            }
        };

        checkConnection();
        const interval = setInterval(checkConnection, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleAnalyze = useCallback(async (audioFileOrResult) => {
        console.log('RecorderPage handleAnalyze called with:', audioFileOrResult);

        // If it's already a result object, store it but don't navigate yet
        if (audioFileOrResult && typeof audioFileOrResult === 'object' && audioFileOrResult.status) {
            console.log('Processing result object:', audioFileOrResult);
            setPredictionResult(audioFileOrResult);
            setAnalysisComplete(true);
            return;
        }

        // If it's an audio file, process it normally
        if (!audioFileOrResult) {
            alert('Please record or upload an audio file');
            return;
        }

        try {
            console.log('Processing audio file:', audioFileOrResult.name);

            // Store audio file for visualization and show it
            setCurrentAudioFile(audioFileOrResult);
            setShowVisualization(true);
            setAnalysisComplete(false);

            // Run AI prediction
            const result = await makePrediction(audioFileOrResult);
            console.log('File analysis result:', result);

            // Store the result but don't navigate automatically
            setPredictionResult(result);
            setAnalysisComplete(true);

        } catch (error) {
            console.error('Prediction error:', error);
            setAnalysisComplete(false);
        }
    }, [makePrediction]);

    const handleVoiceAnalysisComplete = (analysisData) => {
        setVoiceAnalysisData(analysisData);
        console.log('Voice analysis complete:', analysisData);
    };

    const handleViewResults = async () => {
        if (predictionResult) {
            console.log('Navigating to results with prediction:', predictionResult);

            // Update context with the prediction result
            if (setPrediction) {
                setPrediction(predictionResult);
            }

            // Navigate to results page
            navigate('/results');
        } else {
            console.warn('No prediction result available');
        }
    };

    const handleNewAnalysis = () => {
        // Reset all analysis states for a new recording
        setCurrentAudioFile(null);
        setShowVisualization(false);
        setVoiceAnalysisData(null);
        setAnalysisComplete(false);
        setPredictionResult(null);
    };

    const getConnectionStatusDisplay = () => {
        switch (connectionStatus) {
            case 'checking':
                return {
                    icon: '🔄',
                    text: 'Checking connection...',
                    color: 'from-yellow-500 to-orange-500',
                    bgColor: 'bg-yellow-500/10',
                    borderColor: 'border-yellow-500/50'
                };
            case 'connected':
                return {
                    icon: '✅',
                    text: 'Backend connected & Model ready',
                    color: 'from-green-500 to-emerald-500',
                    bgColor: 'bg-green-500/10',
                    borderColor: 'border-green-500/50'
                };
            case 'model_error':
                return {
                    icon: '⚠️',
                    text: 'Backend connected but model not loaded',
                    color: 'from-orange-500 to-red-500',
                    bgColor: 'bg-orange-500/10',
                    borderColor: 'border-orange-500/50'
                };
            case 'error':
                return {
                    icon: '❌',
                    text: 'Backend not available',
                    color: 'from-red-500 to-red-600',
                    bgColor: 'bg-red-500/10',
                    borderColor: 'border-red-500/50'
                };
            default:
                return {
                    icon: '⚪',
                    text: 'Unknown status',
                    color: 'from-gray-500 to-gray-600',
                    bgColor: 'bg-gray-500/10',
                    borderColor: 'border-gray-500/50'
                };
        }
    };

    const connectionDisplay = getConnectionStatusDisplay();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 py-6 sm:py-8 md:py-12 px-4">
            <div className="max-w-6xl mx-auto w-full">
                {/* Header */}
                <div className="text-center mb-8 sm:mb-10 md:mb-12 animate-fadeIn">
                    <div className="mb-6">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-violet-400 bg-clip-text text-transparent mb-2 sm:mb-3 animate-pulse">
                            🎙️ {t('recorder.title')}
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg text-gray-300 px-2 mb-4 leading-relaxed">
                            {t('recorder.instructions')} - Now with advanced voice visualization
                        </p>
                    </div>

                    {/* Connection Status */}
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-full text-sm font-medium bg-gradient-to-r ${connectionDisplay.color} text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-default`}>
                            <span className={`text-base ${connectionStatus === 'checking' ? 'animate-spin' : 'animate-pulse'}`}>
                                {connectionDisplay.icon}
                            </span>
                            <span className="font-semibold">{connectionDisplay.text}</span>
                        </div>
                    </div>

                    {/* Connection Error/Warning Messages */}
                    {(connectionStatus === 'error' || connectionStatus === 'model_error') && (
                        <div className={`${connectionDisplay.bgColor} border ${connectionDisplay.borderColor} rounded-xl p-4 text-center max-w-md mx-auto mb-6 backdrop-blur-sm transition-all duration-500 hover:scale-102`}>
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <span className="text-lg">{connectionDisplay.icon}</span>
                                <h4 className="font-semibold text-white">
                                    {connectionStatus === 'error' ? 'Connection Issue' : 'Model Issue'}
                                </h4>
                            </div>
                            <p className={`text-sm ${connectionStatus === 'error' ? 'text-red-300' : 'text-orange-300'}`}>
                                {connectionStatus === 'error'
                                    ? '⚠️ Unable to connect to the analysis server. Please ensure the backend is running on port 5000.'
                                    : '⚠️ Backend is running but the AI model failed to load. Please check the backend logs.'
                                }
                            </p>
                            {connectionStatus === 'error' && (
                                <button
                                    onClick={() => window.location.reload()}
                                    className="mt-3 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 hover:border-red-500/70 rounded-lg text-red-300 hover:text-white text-sm font-medium transition-all duration-300 cursor-pointer hover:scale-105"
                                >
                                    🔄 Retry Connection
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Voice Recorder Component */}
                <div className="mb-8">
                    <VoiceRecorder
                        onAnalyze={handleAnalyze}
                        isAnalyzing={loading}
                    />
                </div>

                {/* Analysis Status Banner */}
                {analysisComplete && predictionResult && (
                    <div className="mb-8">
                        <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/50 rounded-xl p-6 text-center backdrop-blur-sm animate-fadeIn">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <span className="text-4xl animate-bounce">✅</span>
                                <div>
                                    <h3 className="text-xl font-bold text-green-300">Analysis Complete!</h3>
                                    <p className="text-green-200 text-sm">Voice visualization and AI prediction are ready</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <button
                                    onClick={() => setShowVisualization(true)}
                                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-xl shadow-lg cursor-pointer transform hover:scale-105 active:scale-95 flex items-center gap-2"
                                >
                                    <span className="text-xl">📊</span>
                                    View Voice Analysis
                                </button>
                                <button
                                    onClick={handleViewResults}
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-xl shadow-lg cursor-pointer transform hover:scale-105 active:scale-95 flex items-center gap-2"
                                >
                                    <span className="text-xl">🧠</span>
                                    View AI Results
                                </button>
                                <button
                                    onClick={handleNewAnalysis}
                                    className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-xl shadow-lg cursor-pointer transform hover:scale-105 active:scale-95 flex items-center gap-2"
                                >
                                    <span className="text-xl">🎙️</span>
                                    New Recording
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Voice Analysis Visualization */}
                {(showVisualization && currentAudioFile) && (
                    <div className="mb-8">
                        <VoiceAnalysisVisualization
                            audioFile={currentAudioFile}
                            onAnalysisComplete={handleVoiceAnalysisComplete}
                        />
                    </div>
                )}

                {/* Voice Analysis Toggle (only show if we have an audio file but visualization is hidden) */}
                {currentAudioFile && !showVisualization && (
                    <div className="text-center mb-6">
                        <button
                            onClick={() => setShowVisualization(true)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-xl shadow-lg cursor-pointer transform hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto"
                        >
                            <span className="text-xl">📊</span>
                            Show Voice Analysis
                        </button>
                    </div>
                )}

                {/* Results Preview (if analysis is complete and visualization is shown) */}
                {analysisComplete && predictionResult && showVisualization && (
                    <div className="mb-8">
                        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm">
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                                    <span className="text-2xl">🧠</span>
                                    Quick AI Prediction Preview
                                </h3>
                                <p className="text-gray-300 text-sm">Get a glimpse of your analysis - view full results for detailed insights</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Quick Status */}
                                <div className="bg-gradient-to-br from-slate-700/50 to-slate-600/50 rounded-xl p-4">
                                    <div className="text-center">
                                        <div className="text-3xl mb-2">
                                            {predictionResult.prediction === 1 ? '⚠️' : '✅'}
                                        </div>
                                        <h4 className="font-bold text-white mb-1">Prediction Status</h4>
                                        <p className={`text-sm ${predictionResult.prediction === 1 ? 'text-red-300' : 'text-green-300'}`}>
                                            {predictionResult.status || (predictionResult.prediction === 1 ? 'Risk Detected' : 'Healthy Pattern')}
                                        </p>
                                    </div>
                                </div>

                                {/* Risk Score */}
                                <div className="bg-gradient-to-br from-slate-700/50 to-slate-600/50 rounded-xl p-4">
                                    <div className="text-center">
                                        <div className="text-3xl mb-2">📊</div>
                                        <h4 className="font-bold text-white mb-1">Risk Score</h4>
                                        <p className="text-purple-300 text-lg font-bold">
                                            {predictionResult.risk_score ?
                                                `${(predictionResult.risk_score * 100).toFixed(1)}%` :
                                                predictionResult.probability ?
                                                    `${(predictionResult.probability * 100).toFixed(1)}%` :
                                                    'N/A'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center mt-6">
                                <button
                                    onClick={handleViewResults}
                                    className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-xl shadow-lg cursor-pointer transform hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto"
                                >
                                    <span className="text-xl">🔍</span>
                                    View Complete Analysis & Recommendations
                                    <span className="text-xl">→</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Enhanced Help Section */}
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 backdrop-blur-sm transition-all duration-300 hover:bg-slate-800/70 hover:border-slate-600/70 hover:shadow-xl mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <span className="text-2xl">💡</span>
                        <span>How to use this enhanced tool</span>
                    </h3>

                    <div className="grid gap-3 text-sm text-gray-300 mb-4">
                        <div className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg transition-all duration-300 hover:bg-slate-700/50 cursor-default hover:scale-102">
                            <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                1
                            </div>
                            <div>
                                <p className="font-medium text-white mb-1">Record or Upload Audio</p>
                                <p className="text-gray-400">Click "Start Recording" to record your voice, or upload an existing audio file for analysis</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg transition-all duration-300 hover:bg-slate-700/50 cursor-default hover:scale-102">
                            <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                2
                            </div>
                            <div>
                                <p className="font-medium text-white mb-1">Explore Voice Visualization</p>
                                <p className="text-gray-400">Examine waveforms, spectrograms, and acoustic features to understand your voice patterns</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg transition-all duration-300 hover:bg-slate-700/50 cursor-default hover:scale-102">
                            <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                3
                            </div>
                            <div>
                                <p className="font-medium text-white mb-1">Review Health Comparison</p>
                                <p className="text-gray-400">See how your voice patterns compare to healthy baseline characteristics</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg transition-all duration-300 hover:bg-slate-700/50 cursor-default hover:scale-102">
                            <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                4
                            </div>
                            <div>
                                <p className="font-medium text-white mb-1">Get AI Analysis & Recommendations</p>
                                <p className="text-gray-400">View detailed Parkinson's risk assessment with personalized health advice</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-8">
                    <button
                        onClick={() => navigate('/')}
                        className="group flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-all duration-300 hover:bg-slate-800/50 rounded-lg border border-transparent hover:border-slate-600/50 cursor-pointer"
                    >
                        <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
                        <span>Back to Home</span>
                    </button>

                    {analysisComplete && predictionResult ? (
                        <button
                            onClick={handleViewResults}
                            className="group flex items-center gap-2 px-4 py-2 text-purple-400 hover:text-white transition-all duration-300 hover:bg-slate-800/50 rounded-lg border border-transparent hover:border-slate-600/50 cursor-pointer"
                        >
                            <span>View Complete Results</span>
                            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/results')}
                            className="group flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-all duration-300 hover:bg-slate-800/50 rounded-lg border border-transparent hover:border-slate-600/50 cursor-pointer"
                            disabled={!predictionResult}
                        >
                            <span>View Results</span>
                            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecorderPage;