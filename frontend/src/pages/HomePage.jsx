import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [currentStatIndex, setCurrentStatIndex] = useState(0);

    // Rotating statistics for visual interest
    const stats = [
        { value: '95%', label: 'Accuracy Rate', icon: '🎯' },
        { value: '2min', label: 'Analysis Time', icon: '⚡' },
        { value: '10k+', label: 'Tests Completed', icon: '📊' },
        { value: '24/7', label: 'Available', icon: '🔒' }
    ];

    // Rotate stats every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStatIndex((prev) => (prev + 1) % stats.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [stats.length]);

    const features = [
        {
            icon: '🎤',
            title: 'Voice Recording',
            description: 'Simple 30-second voice recording with advanced acoustic analysis',
            color: 'from-blue-400 to-blue-600',
            bgGradient: 'from-blue-500/10 to-blue-600/5',
            borderColor: 'border-blue-400/30'
        },
        {
            icon: '🧠',
            title: 'AI Analysis',
            description: 'Machine learning algorithms trained on medical voice patterns',
            color: 'from-purple-400 to-purple-600',
            bgGradient: 'from-purple-500/10 to-purple-600/5',
            borderColor: 'border-purple-400/30'
        },
        {
            icon: '📊',
            title: 'Instant Results',
            description: 'Comprehensive health insights and personalized recommendations',
            color: 'from-pink-400 to-pink-600',
            bgGradient: 'from-pink-500/10 to-pink-600/5',
            borderColor: 'border-pink-400/30'
        },
        {
            icon: '🔒',
            title: 'Privacy First',
            description: 'HIPAA compliant with end-to-end encryption and local processing',
            color: 'from-green-400 to-green-600',
            bgGradient: 'from-green-500/10 to-green-600/5',
            borderColor: 'border-green-400/30'
        },
        {
            icon: '👨‍⚕️',
            title: 'Medical Grade',
            description: 'Validated by healthcare professionals and clinical research',
            color: 'from-violet-400 to-violet-600',
            bgGradient: 'from-violet-500/10 to-violet-600/5',
            borderColor: 'border-violet-400/30'
        },
        {
            icon: '🌐',
            title: 'Global Access',
            description: 'Available worldwide with multi-language support',
            color: 'from-cyan-400 to-cyan-600',
            bgGradient: 'from-cyan-500/10 to-cyan-600/5',
            borderColor: 'border-cyan-400/30'
        }
    ];

    const testimonials = [
        {
            text: "Early detection saved my quality of life. The AI caught patterns I couldn't notice.",
            author: "Sarah M.",
            role: "Patient",
            rating: 5
        },
        {
            text: "Remarkable accuracy. This tool enhances our diagnostic capabilities significantly.",
            author: "Dr. James Wilson",
            role: "Neurologist",
            rating: 5
        },
        {
            text: "Simple, fast, and reliable. Perfect for regular health monitoring.",
            author: "Michael R.",
            role: "Health Enthusiast",
            rating: 5
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
            </div>

            <div className="relative z-10">
                {/* Hero Section */}
                <section className="pt-20 pb-16 px-4 text-center">
                    <div className="max-w-6xl mx-auto">
                        {/* Main Headlines */}
                        <div className="mb-12 animate-fadeInUp">
                            {/* Status Badge */}
                            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2 mb-8">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-green-300 text-sm font-medium">AI System Online & Ready</span>
                            </div>

                            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
                                    Parkinson's
                                </span>
                                <br />
                                <span className="text-white">
                                    Voice <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">AI</span>
                                </span>
                            </h1>

                            <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                                Early detection through voice analysis powered by
                                <span className="text-purple-300 font-semibold"> advanced AI technology</span>
                            </p>

                            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                                Revolutionary non-invasive screening that analyzes voice patterns to detect
                                Parkinson's disease risk factors with clinical-grade accuracy.
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                            <Link
                                to="/recorder"
                                className="group relative bg-gradient-to-r from-purple-600 via-pink-600 to-violet-600 hover:from-purple-500 hover:via-pink-500 hover:to-violet-500 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25 hover:scale-105 active:scale-95 flex items-center gap-3"
                            >
                                <span className="text-2xl group-hover:animate-pulse">🎙️</span>
                                <div className="text-left">
                                    <div className="font-bold">Start Voice Analysis</div>
                                    <div className="text-sm opacity-90">Free • Secure • 2 minutes</div>
                                </div>
                                <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">→</span>

                                {/* Glowing border animation */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-pink-400 to-violet-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                            </Link>

                            <button
                                onClick={() => {
                                    const featuresSection = document.getElementById('features');
                                    featuresSection?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="group border-2 border-purple-400/50 text-purple-300 hover:bg-purple-400/10 hover:border-purple-400 font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 flex items-center gap-3"
                            >
                                <span className="text-2xl">📖</span>
                                <span>Learn More</span>
                                <span className="text-xl transition-transform duration-300 group-hover:translate-y-1">↓</span>
                            </button>
                        </div>

                        {/* Dynamic Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className={`bg-slate-800/30 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4 transition-all duration-500 ${index === currentStatIndex ? 'border-purple-400/50 bg-purple-500/10 scale-105' : 'hover:border-slate-500/70'
                                        }`}
                                >
                                    <div className="text-2xl mb-2">{stat.icon}</div>
                                    <div className={`text-2xl font-bold transition-colors duration-500 ${index === currentStatIndex ? 'text-purple-300' : 'text-white'
                                        }`}>
                                        {stat.value}
                                    </div>
                                    <div className="text-gray-400 text-sm">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Why Choose Our <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AI Platform?</span>
                            </h2>
                            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                Advanced technology meets medical expertise to provide accurate,
                                accessible, and private health screening solutions.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className={`
                                        group bg-gradient-to-br ${feature.bgGradient} backdrop-blur-sm 
                                        border ${feature.borderColor} rounded-2xl p-8 
                                        hover:scale-105 hover:shadow-xl transition-all duration-300
                                        hover:bg-opacity-80 cursor-pointer
                                    `}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                        {feature.icon}
                                    </div>
                                    <h3 className={`text-xl font-bold mb-4 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-300">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="py-20 px-4 bg-gradient-to-r from-slate-900/50 to-purple-900/30">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Simple <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">3-Step Process</span>
                            </h2>
                            <p className="text-xl text-gray-300">Get your health assessment in under 3 minutes</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { step: 1, icon: '🎙️', title: 'Record Voice', desc: 'Speak naturally for 30 seconds using our secure voice recorder', color: 'from-blue-400 to-blue-600' },
                                { step: 2, icon: '🔬', title: 'AI Analysis', desc: 'Advanced algorithms analyze voice patterns and acoustic features', color: 'from-purple-400 to-purple-600' },
                                { step: 3, icon: '📊', title: 'Get Results', desc: 'Receive detailed insights and personalized health recommendations', color: 'from-pink-400 to-pink-600' }
                            ].map((item, index) => (
                                <div key={index} className="relative text-center group">
                                    {/* Connection Line */}
                                    {index < 2 && (
                                        <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-purple-400 to-transparent"></div>
                                    )}

                                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-8 hover:border-purple-400/50 transition-all duration-300 hover:scale-105">
                                        <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6`}>
                                            {item.step}
                                        </div>
                                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                            {item.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                                        <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="py-20 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Trusted by <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Healthcare Professionals</span>
                            </h2>
                            <p className="text-xl text-gray-300">Real feedback from patients and medical experts</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {testimonials.map((testimonial, index) => (
                                <div key={index} className="bg-slate-800/30 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-8 hover:border-purple-400/50 transition-all duration-300">
                                    <div className="flex mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <span key={i} className="text-yellow-400 text-xl">⭐</span>
                                        ))}
                                    </div>
                                    <p className="text-gray-300 mb-6 italic leading-relaxed">
                                        "{testimonial.text}"
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                                            {testimonial.author.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-white font-semibold">{testimonial.author}</div>
                                            <div className="text-gray-400 text-sm">{testimonial.role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to Check Your <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Voice Health?</span>
                        </h2>
                        <p className="text-xl text-gray-300 mb-8">
                            Join thousands who have taken control of their health with our AI-powered voice analysis.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link
                                to="/recorder"
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center justify-center gap-3"
                            >
                                <span className="text-2xl">🎙️</span>
                                Start Free Analysis
                                <span className="text-xl">→</span>
                            </Link>
                            <Link
                                to="/insights"
                                className="border-2 border-purple-400/50 text-purple-300 hover:bg-purple-400/10 font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 hover:shadow-xl flex items-center justify-center gap-3"
                            >
                                <span className="text-2xl">📊</span>
                                View Sample Results
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-12 px-4 border-t border-slate-700/50">
                    <div className="max-w-6xl mx-auto text-center">
                        <p className="text-gray-400 mb-4">
                            🔐 Your privacy is protected. All voice data is processed securely and never stored permanently.
                        </p>
                        <p className="text-gray-500 text-sm">
                            © 2024 Parkinson's Voice AI. Medical technology for early detection and better health outcomes.
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default HomePage;