import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePredictionContext } from '../context/PredictionContext';
import ExplainabilityInsights from '../components/ExplainabilityInsights';
import VoiceAnalysisVisualization from '../components/VoiceAnalysisVisualization';
import HealthTips from '../components/HealthTips';

const InsightsPage = () => {
    const navigate = useNavigate();
    const { prediction, loading } = usePredictionContext();
    const [activeTab, setActiveTab] = useState('explainability');
    const [voiceAnalysisData, setVoiceAnalysisData] = useState(null);

    // Check if we have valid prediction data
    const hasPredictionData = prediction && (
        prediction.status ||
        prediction.prediction !== undefined ||
        prediction.probability !== undefined ||
        prediction.confidence !== undefined
    );

    // Redirect to recorder if no prediction data on component mount
    useEffect(() => {
        if (!loading && !hasPredictionData) {
            // Optional: Add a small delay to show the "no prediction" message briefly
            const timer = setTimeout(() => {
                // Don't auto-redirect, let user choose
                console.log('No prediction data available');
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [hasPredictionData, loading, navigate]);

    const tabs = [
        {
            id: 'explainability',
            label: 'AI Explainability',
            icon: '🧠',
            description: 'Understand how AI made the prediction'
        },
        {
            id: 'voice-analysis',
            label: 'Voice Analysis',
            icon: '📊',
            description: 'Detailed voice pattern visualization'
        },
        {
            id: 'health-tips',
            label: 'Health Tips',
            icon: '💡',
            description: 'Personalized health recommendations'
        },
        {
            id: 'clinical-notes',
            label: 'Clinical Notes',
            icon: '📋',
            description: 'Medical insights and observations'
        }
    ];

    const handleVoiceAnalysisComplete = (analysisData) => {
        setVoiceAnalysisData(analysisData);
    };

    const renderClinicalNotes = () => (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                    <span className="text-3xl">📋</span>
                    Clinical Notes & Observations
                </h3>
                <p className="text-gray-300">Medical insights based on voice analysis</p>
            </div>

            {/* Clinical Summary */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm">
                <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-xl">🏥</span>
                    Clinical Assessment Summary
                </h4>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-700/30 rounded-xl p-4">
                        <h5 className="font-semibold text-white mb-3">Assessment Results</h5>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Prediction:</span>
                                <span className={`font-bold ${prediction.prediction === 1 ? 'text-red-300' : 'text-green-300'}`}>
                                    {prediction.status || (prediction.prediction === 1 ? 'Risk Detected' : 'Healthy Pattern')}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Confidence:</span>
                                <span className="text-purple-300 font-bold">
                                    {prediction.confidence ? `${(prediction.confidence * 100).toFixed(1)}%` :
                                        prediction.probability ? `${(prediction.probability * 100).toFixed(1)}%` : 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Risk Level:</span>
                                <span className={`font-bold ${prediction.prediction === 1 ? 'text-red-300' : 'text-green-300'
                                    }`}>
                                    {prediction.prediction === 1 ? 'Elevated' : 'Normal'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-700/30 rounded-xl p-4">
                        <h5 className="font-semibold text-white mb-3">Recommendations</h5>
                        <div className="space-y-2 text-sm">
                            {prediction.prediction === 1 ? (
                                <>
                                    <div className="flex items-start gap-2">
                                        <span className="text-orange-400 mt-1">⚠️</span>
                                        <span className="text-gray-300">Consult with a neurologist for further evaluation</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-blue-400 mt-1">📋</span>
                                        <span className="text-gray-300">Consider comprehensive neurological assessment</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-purple-400 mt-1">🔄</span>
                                        <span className="text-gray-300">Regular monitoring recommended</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-start gap-2">
                                        <span className="text-green-400 mt-1">✅</span>
                                        <span className="text-gray-300">Voice patterns within normal ranges</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-blue-400 mt-1">🔄</span>
                                        <span className="text-gray-300">Continue regular health monitoring</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-purple-400 mt-1">💪</span>
                                        <span className="text-gray-300">Maintain healthy lifestyle habits</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Voice Features Clinical Relevance */}
            {voiceAnalysisData && (
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm">
                    <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <span className="text-xl">🎵</span>
                        Voice Biomarkers Analysis
                    </h4>
                    <div className="grid gap-4">
                        <div className="bg-slate-700/30 rounded-xl p-4">
                            <h5 className="font-semibold text-white mb-2">Jitter Analysis</h5>
                            <p className="text-gray-300 text-sm">
                                Jitter measures pitch variation and is often elevated in Parkinson's disease due to
                                vocal fold rigidity and reduced motor control.
                            </p>
                        </div>
                        <div className="bg-slate-700/30 rounded-xl p-4">
                            <h5 className="font-semibold text-white mb-2">Shimmer Analysis</h5>
                            <p className="text-gray-300 text-sm">
                                Shimmer indicates amplitude variation, which can reflect breath control issues
                                and vocal muscle coordination problems common in neurological conditions.
                            </p>
                        </div>
                        <div className="bg-slate-700/30 rounded-xl p-4">
                            <h5 className="font-semibold text-white mb-2">Harmonic-to-Noise Ratio</h5>
                            <p className="text-gray-300 text-sm">
                                Lower HNR values suggest breathiness or roughness in voice, often associated
                                with reduced vocal cord function in Parkinson's patients.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin text-6xl mb-4">🧠</div>
                    <h2 className="text-xl font-bold text-white mb-2">Loading Insights...</h2>
                    <p className="text-gray-300">Preparing your personalized analysis</p>
                </div>
            </div>
        );
    }

    // No prediction data - Show guidance to make prediction first
    if (!hasPredictionData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center px-4">
                <div className="max-w-2xl mx-auto text-center">
                    {/* Animated Icons */}
                    <div className="mb-8 flex justify-center gap-4">
                        <div className="text-6xl animate-bounce" style={{ animationDelay: '0s' }}>🎙️</div>
                        <div className="text-4xl animate-bounce text-purple-400" style={{ animationDelay: '0.2s' }}>→</div>
                        <div className="text-6xl animate-bounce" style={{ animationDelay: '0.4s' }}>🧠</div>
                        <div className="text-4xl animate-bounce text-purple-400" style={{ animationDelay: '0.6s' }}>→</div>
                        <div className="text-6xl animate-bounce" style={{ animationDelay: '0.8s' }}>📊</div>
                    </div>

                    {/* Main Message */}
                    <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 backdrop-blur-sm mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-violet-400 bg-clip-text text-transparent mb-4">
                            🔬 Health Insights Dashboard
                        </h1>

                        <div className="space-y-4 mb-6">
                            <h2 className="text-2xl font-bold text-white">No Prediction Data Available</h2>
                            <p className="text-lg text-gray-300 leading-relaxed">
                                To access detailed health insights and AI explainability analysis,
                                you need to complete a voice analysis first.
                            </p>
                        </div>

                        {/* Steps to follow */}
                        <div className="bg-slate-700/30 rounded-xl p-6 mb-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <span className="text-xl">📋</span>
                                How to Get Started:
                            </h3>
                            <div className="grid md:grid-cols-3 gap-4 text-sm">
                                <div className="bg-slate-600/30 rounded-lg p-4 text-center">
                                    <div className="text-3xl mb-2">🎙️</div>
                                    <h4 className="font-semibold text-white mb-1">1. Record Voice</h4>
                                    <p className="text-gray-300">Record or upload your voice sample</p>
                                </div>
                                <div className="bg-slate-600/30 rounded-lg p-4 text-center">
                                    <div className="text-3xl mb-2">🔬</div>
                                    <h4 className="font-semibold text-white mb-1">2. AI Analysis</h4>
                                    <p className="text-gray-300">Get AI-powered health assessment</p>
                                </div>
                                <div className="bg-slate-600/30 rounded-lg p-4 text-center">
                                    <div className="text-3xl mb-2">📊</div>
                                    <h4 className="font-semibold text-white mb-1">3. View Insights</h4>
                                    <p className="text-gray-300">Explore detailed analysis and tips</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate('/recorder')}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-xl shadow-lg cursor-pointer transform hover:scale-105 active:scale-95 flex items-center gap-3 justify-center"
                            >
                                <span className="text-xl">🎙️</span>
                                Start Voice Analysis
                                <span className="text-lg">→</span>
                            </button>

                            <button
                                onClick={() => navigate('/results')}
                                className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-xl shadow-lg cursor-pointer transform hover:scale-105 active:scale-95 flex items-center gap-3 justify-center"
                            >
                                <span className="text-xl">📊</span>
                                Check Results Page
                            </button>
                        </div>
                    </div>

                    {/* What you'll get */}
                    <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl p-6 border border-purple-500/30 backdrop-blur-sm">
                        <h3 className="text-lg font-semibold text-white mb-4">🎯 What You'll Get After Analysis:</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div className="space-y-2">
                                <div className="text-2xl">🧠</div>
                                <p className="text-xs text-gray-300">AI Explainability</p>
                            </div>
                            <div className="space-y-2">
                                <div className="text-2xl">📊</div>
                                <p className="text-xs text-gray-300">Voice Visualization</p>
                            </div>
                            <div className="space-y-2">
                                <div className="text-2xl">💡</div>
                                <p className="text-xs text-gray-300">Health Tips</p>
                            </div>
                            <div className="space-y-2">
                                <div className="text-2xl">📋</div>
                                <p className="text-xs text-gray-300">Clinical Notes</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-all duration-300 hover:bg-slate-800/50 rounded-lg border border-transparent hover:border-slate-600/50"
                        >
                            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
                            <span>Back to Home</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Main insights page when prediction data exists
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-violet-400 bg-clip-text text-transparent mb-4">
                        🔬 Health Insights Dashboard
                    </h1>
                    <p className="text-xl text-gray-300 mb-2">
                        Comprehensive analysis of your voice patterns and health indicators
                    </p>

                    {/* Prediction Status Badge */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-green-500/20 border border-green-500/50 rounded-full px-4 py-2 flex items-center gap-2">
                            <span className="text-green-400 text-lg">✅</span>
                            <span className="text-green-300 font-semibold">Analysis Complete</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-300">
                                {prediction.status || (prediction.prediction === 1 ? 'Risk Detected' : 'Healthy Pattern')}
                            </span>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === tab.id
                                    ? 'bg-purple-600 text-white shadow-lg scale-105'
                                    : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 hover:text-white'
                                    } border border-slate-600/50 hover:border-slate-500/70`}
                            >
                                <span className="text-lg">{tab.icon}</span>
                                <div className="hidden sm:block">
                                    <div className="font-semibold">{tab.label}</div>
                                    <div className="text-xs opacity-75">{tab.description}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="min-h-[600px]">
                    {activeTab === 'explainability' && (
                        <ExplainabilityInsights analysisData={voiceAnalysisData} />
                    )}

                    {activeTab === 'voice-analysis' && (
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold text-white mb-2">Voice Pattern Analysis</h3>
                                <p className="text-gray-300">Detailed visualization of your voice characteristics</p>
                            </div>

                            {prediction.audioFile ? (
                                <VoiceAnalysisVisualization
                                    audioFile={prediction.audioFile}
                                    onAnalysisComplete={handleVoiceAnalysisComplete}
                                />
                            ) : (
                                <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 backdrop-blur-sm text-center">
                                    <div className="text-6xl mb-4">🎙️</div>
                                    <h3 className="text-xl font-bold text-white mb-2">Audio File Not Available</h3>
                                    <p className="text-gray-300 mb-6">The original audio file is no longer available for visualization</p>
                                    <button
                                        onClick={() => navigate('/recorder')}
                                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
                                    >
                                        Record New Sample
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'health-tips' && (
                        <HealthTips predictionResult={prediction} />
                    )}

                    {activeTab === 'clinical-notes' && renderClinicalNotes()}
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-12">
                    <button
                        onClick={() => navigate('/results')}
                        className="group flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-all duration-300 hover:bg-slate-800/50 rounded-lg border border-transparent hover:border-slate-600/50"
                    >
                        <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
                        <span>Back to Results</span>
                    </button>

                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/recorder')}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300"
                        >
                            New Analysis
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300"
                        >
                            Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InsightsPage;