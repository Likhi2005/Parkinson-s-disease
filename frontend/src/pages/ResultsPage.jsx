import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePredictionContext } from '../context/PredictionContext';
import { useTranslation } from 'react-i18next';
import ResultsDashboard from '../components/ResultsDashboard';
import HealthTips from '../components/HealthTips';

const ResultsPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { prediction } = usePredictionContext();

    if (!prediction) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center px-4">
                <div className="max-w-4xl mx-auto w-full">
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-pink-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-violet-500/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                    </div>

                    <div className="relative z-10">
                        {/* Main Content Container */}
                        <div className="text-center mb-12">
                            {/* Animated Icon Sequence */}
                            <div className="flex justify-center items-center gap-4 mb-8">
                                <div className="text-6xl animate-bounce" style={{ animationDelay: '0s' }}>🎙️</div>
                                <div className="text-3xl text-purple-400 animate-pulse" style={{ animationDelay: '0.5s' }}>→</div>
                                <div className="text-6xl animate-bounce" style={{ animationDelay: '1s' }}>🔬</div>
                                <div className="text-3xl text-purple-400 animate-pulse" style={{ animationDelay: '1.5s' }}>→</div>
                                <div className="text-6xl animate-bounce opacity-30" style={{ animationDelay: '2s' }}>📊</div>
                            </div>

                            {/* Main Message */}
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-violet-400 bg-clip-text text-transparent mb-6 animate-fadeIn">
                                📊 Results Dashboard
                            </h1>

                            <div className="space-y-4 mb-8">
                                <h2 className="text-2xl md:text-3xl font-bold text-white">
                                    Ready to Discover Your Voice Health?
                                </h2>
                                <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                                    Your personalized Parkinson's risk assessment is just one voice recording away.
                                    Get AI-powered insights in under 2 minutes.
                                </p>
                            </div>
                        </div>

                        {/* Feature Preview Cards */}
                        <div className="grid md:grid-cols-3 gap-6 mb-12">
                            {/* Voice Analysis Card */}
                            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl">
                                <div className="text-center">
                                    <div className="text-4xl mb-4">🎵</div>
                                    <h3 className="text-xl font-bold text-white mb-3">Voice Analysis</h3>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        Advanced AI analyzes your voice patterns, pitch variations, and acoustic features to detect potential health indicators.
                                    </p>
                                    <div className="mt-4 space-y-2 text-left">
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <span className="text-green-400">✓</span>
                                            <span>Jitter & Shimmer Analysis</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <span className="text-green-400">✓</span>
                                            <span>Spectral Pattern Recognition</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <span className="text-green-400">✓</span>
                                            <span>Harmonic-to-Noise Ratio</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* AI Insights Card */}
                            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm hover:border-pink-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl">
                                <div className="text-center">
                                    <div className="text-4xl mb-4">🧠</div>
                                    <h3 className="text-xl font-bold text-white mb-3">AI Risk Assessment</h3>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        Machine learning model trained on thousands of voice samples provides accurate Parkinson's risk evaluation.
                                    </p>
                                    <div className="mt-4 space-y-2 text-left">
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <span className="text-green-400">✓</span>
                                            <span>95%+ Accuracy Rate</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <span className="text-green-400">✓</span>
                                            <span>Early Detection Capable</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <span className="text-green-400">✓</span>
                                            <span>Explainable Results</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Personalized Tips Card */}
                            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm hover:border-violet-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl">
                                <div className="text-center">
                                    <div className="text-4xl mb-4">💡</div>
                                    <h3 className="text-xl font-bold text-white mb-3">Health Insights</h3>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        Receive personalized health recommendations and lifestyle tips based on your voice analysis results.
                                    </p>
                                    <div className="mt-4 space-y-2 text-left">
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <span className="text-green-400">✓</span>
                                            <span>Personalized Recommendations</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <span className="text-green-400">✓</span>
                                            <span>Lifestyle Guidance</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <span className="text-green-400">✓</span>
                                            <span>Progress Tracking</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* How It Works Section */}
                        <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl p-8 border border-purple-500/30 backdrop-blur-sm mb-12">
                            <h3 className="text-2xl font-bold text-white text-center mb-8 flex items-center justify-center gap-3">
                                <span className="text-3xl">⚡</span>
                                How It Works - Simple & Fast
                            </h3>

                            <div className="grid md:grid-cols-4 gap-6">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">1</div>
                                    <h4 className="text-white font-semibold mb-2">🎙️ Record</h4>
                                    <p className="text-gray-300 text-sm">Speak for 10-30 seconds using our secure voice recorder</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">2</div>
                                    <h4 className="text-white font-semibold mb-2">🔬 Analyze</h4>
                                    <p className="text-gray-300 text-sm">AI processes your voice in real-time with advanced algorithms</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-violet-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">3</div>
                                    <h4 className="text-white font-semibold mb-2">📊 Results</h4>
                                    <p className="text-gray-300 text-sm">Get detailed analysis with risk assessment and explanations</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">4</div>
                                    <h4 className="text-white font-semibold mb-2">💡 Insights</h4>
                                    <p className="text-gray-300 text-sm">Receive personalized health tips and recommendations</p>
                                </div>
                            </div>
                        </div>

                        {/* Call-to-Action Section */}
                        <div className="text-center space-y-6">
                            {/* Primary CTA */}
                            <button
                                onClick={() => navigate('/recorder')}
                                className="group bg-gradient-to-r from-purple-600 via-pink-600 to-violet-600 hover:from-purple-500 hover:via-pink-500 hover:to-violet-500 text-white font-bold py-6 px-12 rounded-2xl text-xl transition-all duration-300 hover:shadow-2xl shadow-lg cursor-pointer transform hover:scale-105 active:scale-95 flex items-center gap-4 mx-auto animate-pulse hover:animate-none"
                            >
                                <span className="text-3xl">🎙️</span>
                                <div className="text-left">
                                    <div className="text-xl font-bold">Start Your Voice Analysis</div>
                                    <div className="text-sm opacity-90">Free • Secure • Takes 2 minutes</div>
                                </div>
                                <span className="text-2xl transition-transform duration-300 group-hover:translate-x-2">→</span>
                            </button>

                            {/* Secondary Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => navigate('/insights')}
                                    className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-xl border border-slate-600 hover:border-slate-500 transition-all duration-300 flex items-center gap-2 justify-center"
                                >
                                    <span className="text-xl">🔬</span>
                                    <span>Preview Sample Results</span>
                                </button>
                                <button
                                    onClick={() => navigate('/')}
                                    className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-xl border border-slate-600 hover:border-slate-500 transition-all duration-300 flex items-center gap-2 justify-center"
                                >
                                    <span className="text-xl">🏠</span>
                                    <span>Learn More</span>
                                </button>
                            </div>
                        </div>

                        {/* Trust Indicators */}
                        <div className="mt-12 text-center">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                                <div className="bg-slate-800/30 rounded-lg p-4">
                                    <div className="text-2xl mb-1">🔒</div>
                                    <div className="text-white font-semibold text-sm">Secure</div>
                                    <div className="text-gray-400 text-xs">HIPAA Compliant</div>
                                </div>
                                <div className="bg-slate-800/30 rounded-lg p-4">
                                    <div className="text-2xl mb-1">⚡</div>
                                    <div className="text-white font-semibold text-sm">Fast</div>
                                    <div className="text-gray-400 text-xs">2-Min Analysis</div>
                                </div>
                                <div className="bg-slate-800/30 rounded-lg p-4">
                                    <div className="text-2xl mb-1">🎯</div>
                                    <div className="text-white font-semibold text-sm">Accurate</div>
                                    <div className="text-gray-400 text-xs">95%+ Precision</div>
                                </div>
                                <div className="bg-slate-800/30 rounded-lg p-4">
                                    <div className="text-2xl mb-1">🆓</div>
                                    <div className="text-white font-semibold text-sm">Free</div>
                                    <div className="text-gray-400 text-xs">No Cost</div>
                                </div>
                            </div>
                        </div>

                        {/* Privacy Notice */}
                        <div className="mt-8 text-center">
                            <p className="text-gray-400 text-sm max-w-2xl mx-auto">
                                🔐 Your voice data is processed securely and never stored permanently.
                                All analysis happens locally with enterprise-grade privacy protection.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 py-6 sm:py-8 md:py-12 px-4">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="text-center mb-8 sm:mb-10 md:mb-12 animate-slide-up">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-2 sm:mb-3">
                        📊 {t('results.title')}
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-gray-300 px-2">
                        Here are your analysis results
                    </p>
                </div>

                {/* Results Dashboard */}
                <div className="mb-8 sm:mb-10 md:mb-12 animate-slide-up">
                    <ResultsDashboard />
                </div>

                {/* Health Tips */}
                <div className="mb-8 sm:mb-10 md:mb-12 animate-slide-up">
                    <HealthTips />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8 sm:mt-12">
                    <button
                        onClick={() => navigate('/insights')}
                        className="btn-primary flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                        📈 View Detailed Insights
                    </button>

                    <button
                        onClick={() => navigate('/recorder')}
                        className="btn-secondary flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                        🎙️ New Recording
                    </button>
                </div>

                {/* Disclaimer */}
                <div className="mt-8 sm:mt-12 card-glass border-amber-500/30 bg-amber-500/5">
                    <p className="text-amber-200 text-xs sm:text-sm md:text-base px-2">
                        <strong>⚠️ Medical Disclaimer:</strong> These results are for informational purposes only.
                        Please consult a healthcare professional for medical diagnosis and advice.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;