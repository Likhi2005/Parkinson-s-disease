import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { usePrediction } from '../hooks/usePrediction';
import VoiceRecorder from '../components/VoiceRecorder';
import VoiceAnalysisVisualization from '../components/VoiceAnalysisVisualization';

const RecorderPage = () => {
    const { translate } = useLanguage();
    const navigate = useNavigate();
    const { setPredictionData } = usePrediction();
    const [backendStatus, setBackendStatus] = useState({ connected: false, modelReady: false });
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        checkBackendStatus();
    }, []);

    const checkBackendStatus = async () => {
        try {
            const response = await fetch('http://localhost:5000/health');
            const data = await response.json();
            setBackendStatus({
                connected: response.ok,
                modelReady: data.model_loaded || false
            });
        } catch (error) {
            console.error('Backend health check failed:', error);
            setBackendStatus({ connected: false, modelReady: false });
        }
    };

    const handleAnalysisComplete = (result) => {
        setPredictionData(result);
        navigate('/results');
    };

    const handleAnalysisStart = () => {
        setIsAnalyzing(true);
    };

    const handleAnalysisEnd = () => {
        setIsAnalyzing(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 min-h-screen">
                {/* Header Section */}
                <div className="pt-8 pb-6 px-4 text-center">
                    <div className="max-w-4xl mx-auto">
                        {/* Status Badge */}
                        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2 mb-6">
                            <div className={`w-2 h-2 rounded-full animate-pulse ${
                                backendStatus.connected && backendStatus.modelReady 
                                    ? 'bg-green-400' 
                                    : 'bg-yellow-400'
                            }`}></div>
                            <span className={`text-sm font-medium ${
                                backendStatus.connected && backendStatus.modelReady 
                                    ? 'text-green-300' 
                                    : 'text-yellow-300'
                            }`}>
                                {backendStatus.connected && backendStatus.modelReady 
                                    ? 'Backend connected & Model ready'
                                    : 'recorder.connecting'
                                }
                            </span>
                        </div>

                        {/* Main Title */}
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
                                {translate('recorder.title')}
                            </span>
                        </h1>

                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                            {translate('recorder.subtitle')} - Now with advanced voice visualization
                        </p>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="px-4 pb-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-8 items-start">
                            {/* Voice Recorder Section */}
                            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-8">
                                <div className="text-center mb-6">
                                    <div className="text-4xl mb-4">🎵</div>
                                    <h2 className="text-2xl font-bold text-white mb-2">
                                        Voice Analysis Studio
                                    </h2>
                                    <p className="text-gray-300">
                                        Click to start recording
                                    </p>
                                </div>

                                <VoiceRecorder
                                    onAnalysisComplete={handleAnalysisComplete}
                                    onAnalysisStart={handleAnalysisStart}
                                    onAnalysisEnd={handleAnalysisEnd}
                                    backendReady={backendStatus.connected && backendStatus.modelReady}
                                />

                                {/* Recording Tips */}
                                <div className="mt-6 p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                        <span className="text-xl">💡</span>
                                        Recording Tips
                                    </h3>
                                    <ul className="text-gray-300 space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-400 mt-1">•</span>
                                            Speak clearly and naturally
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-400 mt-1">•</span>
                                            Record in a quiet environment
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-400 mt-1">•</span>
                                            Maintain consistent volume
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-400 mt-1">•</span>
                                            Minimum 5 seconds recording recommended
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Voice Visualization Section */}
                            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-8">
                                <div className="text-center mb-6">
                                    <div className="text-4xl mb-4">📊</div>
                                    <h2 className="text-2xl font-bold text-white mb-2">
                                        Live Voice Visualization
                                    </h2>
                                    <p className="text-gray-300">
                                        Real-time analysis of your voice patterns
                                    </p>
                                </div>

                                <VoiceAnalysisVisualization 
                                    isActive={isAnalyzing}
                                    className="w-full h-64"
                                />

                                {/* Analysis Status */}
                                {isAnalyzing && (
                                    <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                                        <div className="flex items-center justify-center gap-3 text-purple-300">
                                            <div className="w-4 h-4 bg-purple-400 rounded-full animate-pulse"></div>
                                            <span className="font-medium">
                                                Analyzing voice patterns...
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Features Grid */}
                        <div className="mt-12 grid md:grid-cols-3 gap-6">
                            {[
                                {
                                    icon: '🎯',
                                    title: 'Accurate Analysis',
                                    desc: 'Clinical-grade voice analysis algorithms',
                                    color: 'from-blue-400 to-blue-600'
                                },
                                {
                                    icon: '⚡',
                                    title: 'Fast Results',
                                    desc: 'Get analysis results in under 2 minutes',
                                    color: 'from-purple-400 to-purple-600'
                                },
                                {
                                    icon: '🔒',
                                    title: 'Secure & Private',
                                    desc: 'Your voice data is processed securely and privately',
                                    color: 'from-pink-400 to-pink-600'
                                }
                            ].map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-slate-800/20 backdrop-blur-sm border border-slate-600/40 rounded-xl p-6 hover:border-purple-400/50 transition-all duration-300 hover:scale-105"
                                >
                                    <div className="text-3xl mb-3">{feature.icon}</div>
                                    <h3 className={`text-lg font-bold mb-2 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Medical Disclaimer */}
                        <div className="mt-8 text-center">
                            <div className="bg-slate-800/20 backdrop-blur-sm border border-slate-600/40 rounded-xl p-6 max-w-2xl mx-auto">
                                <div className="flex items-center justify-center gap-2 mb-3">
                                    <span className="text-2xl">🩺</span>
                                    <h3 className="text-lg font-semibold text-white">
                                        Medical Disclaimer
                                    </h3>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    This tool is designed for screening purposes only and should not replace professional medical diagnosis. Please consult with healthcare professionals for proper medical evaluation.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecorderPage;