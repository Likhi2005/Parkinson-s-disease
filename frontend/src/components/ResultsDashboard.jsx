import React, { useContext, useState, useEffect } from 'react';
import { PredictionContext } from '../context/PredictionContext';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { downloadUtils } from '../utils/downloadUtils';

const ResultsDashboard = () => {
    const { prediction } = useContext(PredictionContext);
    const [animateIn, setAnimateIn] = useState(false);
    const [showFeatures, setShowFeatures] = useState(false);
    const [showDownloadMenu, setShowDownloadMenu] = useState(false);

    useEffect(() => {
        // Trigger animation on mount
        const timer = setTimeout(() => setAnimateIn(true), 100);
        return () => clearTimeout(timer);
    }, []);

    console.log('ResultsDashboard rendering with prediction:', prediction);

    if (!prediction) {
        return (
            <div className="results-dashboard min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
                <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 backdrop-blur-sm text-center max-w-md shadow-2xl animate-pulse">
                    <div className="text-6xl mb-6 animate-bounce">🎙️</div>
                    <h2 className="text-2xl font-bold text-white mb-4">No Analysis Yet</h2>
                    <p className="text-gray-300 mb-6 leading-relaxed">Record your voice and run the analysis to see detailed results here.</p>
                    <button
                        onClick={() => window.location.href = '/recorder'}
                        className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 hover:shadow-xl shadow-lg shadow-violet-500/30 cursor-pointer transform hover:scale-105 active:scale-95"
                    >
                        🎤 Start Analysis
                    </button>
                </div>
            </div>
        );
    }

    const riskScoreRaw = prediction.risk_score ?? prediction.probability ?? null;
    const riskScore = riskScoreRaw !== null ? Number(riskScoreRaw) * 100 : null;
    const status = prediction.status ?? (prediction.prediction === 1 ? 'Parkinson\'s Risk Detected' : 'Healthy Voice Pattern');
    const confidence = prediction.confidence || (riskScore !== null ? `${riskScore.toFixed(1)}%` : 'N/A');

    // Enhanced color scheme
    const isHighRisk = prediction.prediction === 1;
    const color = isHighRisk ? '#ef4444' : '#10b981';
    const bgGradient = isHighRisk ? 'from-red-500/20 via-red-600/10 to-red-700/20' : 'from-green-500/20 via-emerald-600/10 to-green-700/20';
    const borderColor = isHighRisk ? 'border-red-500/50' : 'border-green-500/50';

    // Risk level interpretation
    const getRiskLevel = () => {
        if (riskScore === null) return { level: 'Unknown', description: 'Unable to determine risk level', color: 'text-gray-400' };
        if (riskScore >= 80) return { level: 'Very High', description: 'Strong indicators present', color: 'text-red-400' };
        if (riskScore >= 60) return { level: 'High', description: 'Notable indicators detected', color: 'text-orange-400' };
        if (riskScore >= 40) return { level: 'Moderate', description: 'Some indicators present', color: 'text-yellow-400' };
        if (riskScore >= 20) return { level: 'Low', description: 'Few indicators detected', color: 'text-green-400' };
        return { level: 'Very Low', description: 'Healthy voice patterns', color: 'text-emerald-400' };
    };

    const riskLevel = getRiskLevel();

    // Feature importance
    const topFeatures = prediction.features ? Object.entries(prediction.features)
        .sort(([, a], [, b]) => Math.abs(b) - Math.abs(a))
        .slice(0, 5) : [];

    // Download functions
    const downloadAsPDF = () => {
        downloadUtils.downloadAsPDF(prediction, riskScore, status, confidence, riskLevel);
        setShowDownloadMenu(false);
    };

    const downloadAsCSV = () => {
        downloadUtils.downloadAsCSV(prediction, riskScore, status, confidence, riskLevel);
        setShowDownloadMenu(false);
    };

    const downloadAsJSON = () => {
        downloadUtils.downloadAsJSON(prediction, riskScore, status, confidence, riskLevel);
        setShowDownloadMenu(false);
    };

    const downloadAsTXT = () => {
        downloadUtils.downloadAsTXT(prediction, riskScore, status, confidence, riskLevel);
        setShowDownloadMenu(false);
    };

    const downloadAsXML = () => {
        downloadUtils.downloadAsXML(prediction, riskScore, status, confidence, riskLevel);
        setShowDownloadMenu(false);
    };

    return (
        <div className="results-dashboard min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className={`text-center mb-12 transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="inline-flex items-center gap-3 mb-4">
                        <span className="text-4xl animate-pulse">🧠</span>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
                            Analysis Complete
                        </h1>
                    </div>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
                        Your voice has been analyzed using advanced AI algorithms. Here are your detailed results.
                    </p>
                </div>

                {/* Main Results Grid */}
                <div className="grid lg:grid-cols-3 gap-8 mb-8">
                    {/* Primary Result Card */}
                    <div className={`lg:col-span-2 bg-gradient-to-br ${bgGradient} rounded-2xl p-8 border ${borderColor} backdrop-blur-sm shadow-2xl transition-all duration-1000 hover:scale-[1.02] ${animateIn ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            {/* Circular Progress */}
                            <div className="flex-shrink-0">
                                <div className="w-48 h-48 relative">
                                    <CircularProgressbar
                                        value={riskScore ?? 0}
                                        text=""
                                        styles={buildStyles({
                                            pathColor: color,
                                            trailColor: '#374151',
                                            strokeLinecap: 'round',
                                            pathTransitionDuration: 2,
                                        })}
                                        strokeWidth={6}
                                    />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <div className={`text-4xl font-bold mb-1`} style={{ color }}>
                                            {riskScore !== null ? `${riskScore.toFixed(0)}%` : 'N/A'}
                                        </div>
                                        <div className={`text-sm font-medium ${riskLevel.color}`}>
                                            {riskLevel.level} Risk
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Result Details */}
                            <div className="flex-1 text-center md:text-left">
                                <h2 className={`text-3xl md:text-4xl font-bold mb-3 ${isHighRisk ? 'text-red-300' : 'text-green-300'}`}>
                                    {status}
                                </h2>

                                <p className={`text-lg mb-4 ${riskLevel.color}`}>
                                    {riskLevel.description}
                                </p>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-center md:justify-start gap-3">
                                        <span className="text-gray-400">Confidence Level:</span>
                                        <span className="font-bold text-white text-lg">{confidence}</span>
                                    </div>

                                    <div className="flex items-center justify-center md:justify-start gap-3">
                                        <span className="text-gray-400">Analysis Date:</span>
                                        <span className="text-white">{new Date().toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {/* Confidence Bar */}
                                <div className="mt-6">
                                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                                        <span>Low Confidence</span>
                                        <span>High Confidence</span>
                                    </div>
                                    <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                                        <div
                                            className={`h-3 rounded-full transition-all duration-2000 ease-out ${isHighRisk
                                                ? 'bg-gradient-to-r from-red-600 via-red-500 to-red-400'
                                                : 'bg-gradient-to-r from-green-600 via-green-500 to-green-400'
                                                } shadow-lg`}
                                            style={{ width: `${riskScore || 0}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Card */}
                    <div className={`bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm shadow-xl transition-all duration-1000 hover:bg-slate-800/70 ${animateIn ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="text-2xl">📊</span>
                            Quick Stats
                        </h3>

                        <div className="space-y-6">
                            <div className="bg-slate-700/30 rounded-xl p-4 transition-all duration-300 hover:bg-slate-700/50">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-300 text-sm">Prediction</span>
                                    <span className={`text-2xl ${isHighRisk ? '⚠️' : '✅'}`} />
                                </div>
                                <p className={`font-bold text-lg ${isHighRisk ? 'text-red-300' : 'text-green-300'}`}>
                                    {prediction.prediction === 1 ? 'Positive Detection' : 'Negative Detection'}
                                </p>
                            </div>

                            <div className="bg-slate-700/30 rounded-xl p-4 transition-all duration-300 hover:bg-slate-700/50">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-300 text-sm">Risk Category</span>
                                    <span className="text-xl">🎯</span>
                                </div>
                                <p className={`font-bold text-lg ${riskLevel.color}`}>
                                    {riskLevel.level}
                                </p>
                            </div>

                            {prediction.features && (
                                <div className="bg-slate-700/30 rounded-xl p-4 transition-all duration-300 hover:bg-slate-700/50">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-gray-300 text-sm">Features Analyzed</span>
                                        <span className="text-xl">🔍</span>
                                    </div>
                                    <p className="font-bold text-lg text-blue-300">
                                        {Object.keys(prediction.features).length} Voice Metrics
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Feature Analysis Section */}
                {prediction.features && (
                    <div className={`bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 backdrop-blur-sm shadow-xl mb-8 transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                <span className="text-3xl">🔬</span>
                                Detailed Voice Analysis
                            </h3>
                            <button
                                onClick={() => setShowFeatures(!showFeatures)}
                                className="bg-slate-700/50 hover:bg-slate-600/50 text-white px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer hover:scale-105"
                            >
                                {showFeatures ? 'Hide Details' : 'Show Details'}
                            </button>
                        </div>

                        {showFeatures && (
                            <div className="grid md:grid-cols-2 gap-6 animate-fadeIn">
                                {/* Top Contributing Features */}
                                <div>
                                    <h4 className="text-lg font-semibold text-purple-300 mb-4">Top Contributing Features</h4>
                                    <div className="space-y-3">
                                        {topFeatures.map(([feature, value], index) => (
                                            <div key={feature} className="bg-slate-700/30 rounded-lg p-3 transition-all duration-300 hover:bg-slate-700/50">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-gray-200 text-sm font-medium">{feature}</span>
                                                    <span className="text-white font-bold">#{index + 1}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 bg-slate-600 rounded-full h-2">
                                                        <div
                                                            className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                                                            style={{ width: `${Math.min(Math.abs(value) * 10, 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-gray-300 min-w-[70px] font-mono">
                                                        {typeof value === 'number' ? value.toFixed(3) : value}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* All Features Table */}
                                    <div className="mt-6">
                                        <h5 className="text-md font-semibold text-cyan-300 mb-3">All Voice Features</h5>
                                        <div className="max-h-60 overflow-y-auto bg-slate-900/50 rounded-lg border border-slate-600/50">
                                            <table className="w-full text-sm">
                                                <thead className="sticky top-0 bg-slate-800/90">
                                                    <tr>
                                                        <th className="text-left p-3 text-gray-200 border-b border-slate-600/50">Feature</th>
                                                        <th className="text-right p-3 text-gray-200 border-b border-slate-600/50">Value</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Object.entries(prediction.features).map(([feature, value], index) => (
                                                        <tr key={feature} className={`${index % 2 === 0 ? 'bg-slate-800/30' : 'bg-slate-700/20'} hover:bg-slate-600/30 transition-colors duration-200`}>
                                                            <td className="p-3 text-gray-200 font-medium">{feature}</td>
                                                            <td className="p-3 text-gray-100 font-mono text-right">
                                                                {typeof value === 'number' ? value.toFixed(4) : value}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* Feature Categories and Health Tips */}
                                <div>
                                    <h4 className="text-lg font-semibold text-blue-300 mb-4">Analysis Categories</h4>
                                    <div className="space-y-3 mb-6">
                                        <div className="bg-slate-700/30 rounded-lg p-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-2xl">🎵</span>
                                                <span className="text-white font-medium">Frequency Analysis</span>
                                            </div>
                                            <p className="text-gray-300 text-sm">Fundamental frequency variations and harmonics</p>
                                        </div>

                                        <div className="bg-slate-700/30 rounded-lg p-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-2xl">🌊</span>
                                                <span className="text-white font-medium">Voice Perturbations</span>
                                            </div>
                                            <p className="text-gray-300 text-sm">Jitter and shimmer measurements</p>
                                        </div>

                                        <div className="bg-slate-700/30 rounded-lg p-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-2xl">📈</span>
                                                <span className="text-white font-medium">Harmonic Ratios</span>
                                            </div>
                                            <p className="text-gray-300 text-sm">Noise-to-harmonics ratio analysis</p>
                                        </div>
                                    </div>

                                    {/* Enhanced Health Tips */}
                                    <div className="mt-6">
                                        <div className="bg-gradient-to-br from-emerald-900/40 to-blue-900/40 rounded-xl p-6 border-2 border-emerald-500/30 shadow-lg backdrop-blur-sm">
                                            <div className="flex items-center gap-3 mb-5">
                                                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-400 rounded-full flex items-center justify-center shadow-lg">
                                                    <span className="text-xl">💚</span>
                                                </div>
                                                <h5 className="text-xl font-bold text-white">
                                                    Health & Voice Care Tips
                                                </h5>
                                            </div>

                                            <div className="space-y-5">
                                                {/* Medical Warning */}
                                                <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4 shadow-md">
                                                    <div className="flex items-start gap-3">
                                                        <span className="text-2xl mt-1">⚠️</span>
                                                        <div>
                                                            <p className="text-yellow-200 font-semibold text-base">Important Medical Notice</p>
                                                            <p className="text-yellow-100 text-sm mt-1">
                                                                This tool is NOT a medical diagnosis. Please consult a neurologist or healthcare professional for proper medical evaluation.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Voice Exercises */}
                                                <div className="bg-emerald-900/30 border border-emerald-500/40 rounded-lg p-5 shadow-md">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                                            <span className="text-lg">✅</span>
                                                        </div>
                                                        <p className="text-emerald-200 font-bold text-lg">Recommended Voice Exercises</p>
                                                    </div>

                                                    <div className="grid gap-3">
                                                        <div className="bg-emerald-800/20 rounded-lg p-3 border border-emerald-500/20">
                                                            <div className="flex items-start gap-3">
                                                                <span className="text-emerald-300 font-bold text-sm">🎵</span>
                                                                <div>
                                                                    <p className="text-emerald-100 font-semibold">Humming Exercise</p>
                                                                    <p className="text-emerald-200/80 text-sm">Sustain a gentle 'mmm' sound for 30 seconds, 3 times daily</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="bg-emerald-800/20 rounded-lg p-3 border border-emerald-500/20">
                                                            <div className="flex items-start gap-3">
                                                                <span className="text-emerald-300 font-bold text-sm">🫁</span>
                                                                <div>
                                                                    <p className="text-emerald-100 font-semibold">Deep Breathing</p>
                                                                    <p className="text-emerald-200/80 text-sm">Slow, controlled breathing exercises for 5-10 minutes</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="bg-emerald-800/20 rounded-lg p-3 border border-emerald-500/20">
                                                            <div className="flex items-start gap-3">
                                                                <span className="text-emerald-300 font-bold text-sm">🔤</span>
                                                                <div>
                                                                    <p className="text-emerald-100 font-semibold">Vowel Sustaining</p>
                                                                    <p className="text-emerald-200/80 text-sm">Hold 'aaa', 'eee', 'ooo' sounds for 5 seconds each</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="bg-emerald-800/20 rounded-lg p-3 border border-emerald-500/20">
                                                            <div className="flex items-start gap-3">
                                                                <span className="text-emerald-300 font-bold text-sm">🚤</span>
                                                                <div>
                                                                    <p className="text-emerald-100 font-semibold">Lip Trills</p>
                                                                    <p className="text-emerald-200/80 text-sm">Create 'motorboat' sound with lips for vocal cord relaxation</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* General Health Tips */}
                                                <div className="bg-blue-900/30 border border-blue-500/40 rounded-lg p-5 shadow-md">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                                                            <span className="text-lg">💡</span>
                                                        </div>
                                                        <p className="text-blue-200 font-bold text-lg">Daily Voice Care Tips</p>
                                                    </div>

                                                    <div className="grid gap-3">
                                                        <div className="flex items-center gap-3 p-3 bg-blue-800/20 rounded-lg border border-blue-500/20">
                                                            <span className="text-blue-300 text-lg">💧</span>
                                                            <p className="text-blue-100 text-sm">
                                                                <span className="font-semibold">Stay Hydrated:</span> Drink 8-10 glasses of water daily for vocal cord health
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center gap-3 p-3 bg-blue-800/20 rounded-lg border border-blue-500/20">
                                                            <span className="text-blue-300 text-lg">🔇</span>
                                                            <p className="text-blue-100 text-sm">
                                                                <span className="font-semibold">Avoid Strain:</span> Don't shout or whisper excessively
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center gap-3 p-3 bg-blue-800/20 rounded-lg border border-blue-500/20">
                                                            <span className="text-blue-300 text-lg">😴</span>
                                                            <p className="text-blue-100 text-sm">
                                                                <span className="font-semibold">Voice Rest:</span> Take regular breaks from talking throughout the day
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center gap-3 p-3 bg-blue-800/20 rounded-lg border border-blue-500/20">
                                                            <span className="text-blue-300 text-lg">🧍‍♂️</span>
                                                            <p className="text-blue-100 text-sm">
                                                                <span className="font-semibold">Good Posture:</span> Maintain upright posture while speaking
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Privacy & Disclaimer */}
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div className="bg-purple-900/30 border border-purple-500/40 rounded-lg p-4 shadow-md">
                                                        <div className="flex items-start gap-3">
                                                            <span className="text-purple-300 text-xl">🔒</span>
                                                            <div>
                                                                <p className="text-purple-100 font-semibold text-sm">Privacy Protected</p>
                                                                <p className="text-purple-200/80 text-xs mt-1">
                                                                    Your voice recordings are processed locally and never stored on our servers
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-orange-900/30 border border-orange-500/40 rounded-lg p-4 shadow-md">
                                                        <div className="flex items-start gap-3">
                                                            <span className="text-orange-300 text-xl">📚</span>
                                                            <div>
                                                                <p className="text-orange-100 font-semibold text-sm">Educational Purpose</p>
                                                                <p className="text-orange-200/80 text-xs mt-1">
                                                                    This AI tool is designed for educational and screening purposes only
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Recommendations Section */}
                <div className={`bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-8 border border-blue-500/30 backdrop-blur-sm shadow-xl mb-8 transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="text-3xl">💡</span>
                        Recommendations
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-blue-300">Next Steps</h4>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-3 bg-slate-700/20 rounded-lg">
                                    <span className="text-xl mt-1">👨‍⚕️</span>
                                    <div>
                                        <p className="text-white font-medium">Consult Healthcare Provider</p>
                                        <p className="text-gray-300 text-sm">Discuss results with a medical professional for proper evaluation</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 bg-slate-700/20 rounded-lg">
                                    <span className="text-xl mt-1">📊</span>
                                    <div>
                                        <p className="text-white font-medium">Regular Monitoring</p>
                                        <p className="text-gray-300 text-sm">Consider periodic voice analysis to track changes over time</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-purple-300">Important Notes</h4>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-3 bg-slate-700/20 rounded-lg">
                                    <span className="text-xl mt-1">⚠️</span>
                                    <div>
                                        <p className="text-white font-medium">Screening Tool Only</p>
                                        <p className="text-gray-300 text-sm">This is not a medical diagnosis - clinical evaluation required</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 bg-slate-700/20 rounded-lg">
                                    <span className="text-xl mt-1">🔒</span>
                                    <div>
                                        <p className="text-white font-medium">Privacy Protected</p>
                                        <p className="text-gray-300 text-sm">Your voice data is processed locally and not stored</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className={`flex flex-wrap justify-center gap-4 transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <button
                        onClick={() => window.location.href = '/recorder'}
                        className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-xl shadow-lg shadow-violet-500/30 cursor-pointer transform hover:scale-105 active:scale-95 flex items-center gap-3"
                    >
                        <span className="text-xl">🎤</span>
                        New Analysis
                    </button>

                    {/* Download Button with Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                            className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-xl shadow-lg cursor-pointer transform hover:scale-105 active:scale-95 flex items-center gap-3"
                        >
                            <span className="text-xl">📥</span>
                            Download Report
                            <span className={`transition-transform duration-300 ${showDownloadMenu ? 'rotate-180' : ''}`}>▼</span>
                        </button>

                        {showDownloadMenu && (
                            <div className="absolute top-full left-0 mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl z-50 overflow-hidden animate-fadeIn">
                                <button
                                    onClick={downloadAsPDF}
                                    className="w-full px-6 py-3 text-left text-white hover:bg-slate-700 transition-colors duration-200 flex items-center gap-3 cursor-pointer"
                                >
                                    <span className="text-red-400">📄</span>
                                    <div>
                                        <div className="font-medium">PDF Report</div>
                                        <div className="text-xs text-gray-400">Professional format with charts</div>
                                    </div>
                                </button>

                                <button
                                    onClick={downloadAsCSV}
                                    className="w-full px-6 py-3 text-left text-white hover:bg-slate-700 transition-colors duration-200 flex items-center gap-3 cursor-pointer border-t border-slate-600"
                                >
                                    <span className="text-green-400">📊</span>
                                    <div>
                                        <div className="font-medium">CSV Data</div>
                                        <div className="text-xs text-gray-400">Spreadsheet compatible format</div>
                                    </div>
                                </button>

                                <button
                                    onClick={downloadAsJSON}
                                    className="w-full px-6 py-3 text-left text-white hover:bg-slate-700 transition-colors duration-200 flex items-center gap-3 cursor-pointer border-t border-slate-600"
                                >
                                    <span className="text-blue-400">🔧</span>
                                    <div>
                                        <div className="font-medium">JSON Data</div>
                                        <div className="text-xs text-gray-400">Developer friendly structured data</div>
                                    </div>
                                </button>

                                <button
                                    onClick={downloadAsTXT}
                                    className="w-full px-6 py-3 text-left text-white hover:bg-slate-700 transition-colors duration-200 flex items-center gap-3 cursor-pointer border-t border-slate-600"
                                >
                                    <span className="text-gray-400">📝</span>
                                    <div>
                                        <div className="font-medium">Text Report</div>
                                        <div className="text-xs text-gray-400">Simple formatted text</div>
                                    </div>
                                </button>

                                <button
                                    onClick={downloadAsXML}
                                    className="w-full px-6 py-3 text-left text-white hover:bg-slate-700 transition-colors duration-200 flex items-center gap-3 cursor-pointer border-t border-slate-600"
                                >
                                    <span className="text-purple-400">🗂️</span>
                                    <div>
                                        <div className="font-medium">XML Data</div>
                                        <div className="text-xs text-gray-400">Structured markup format</div>
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => window.location.href = '/'}
                        className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-xl shadow-lg cursor-pointer transform hover:scale-105 active:scale-95 flex items-center gap-3"
                    >
                        <span className="text-xl">🏠</span>
                        Home
                    </button>
                </div>

                {/* Debug Info (development only) */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-12 bg-slate-900/70 rounded-xl p-6 border border-slate-600/50">
                        <details>
                            <summary className="text-gray-200 cursor-pointer font-semibold mb-4 hover:text-white transition-colors duration-200">🐛 Debug Info (Development Only)</summary>
                            <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-600/50 mt-4">
                                <pre className="text-sm text-gray-200 overflow-auto font-mono leading-relaxed">
                                    {JSON.stringify(prediction, null, 2)}
                                </pre>
                            </div>
                        </details>
                    </div>
                )}
            </div>

            {/* Click outside to close download menu */}
            {showDownloadMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDownloadMenu(false)}
                />
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out;
                }
            `}</style>
        </div>
    );
};

export default ResultsDashboard;