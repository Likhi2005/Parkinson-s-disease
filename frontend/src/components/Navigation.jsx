import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import LanguageSwitcher from './LanguageSwitcher';

const Navigation = () => {
    const { translate } = useLanguage();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { path: '/', key: 'navigation.home', icon: '🏠' },
        { path: '/recorder', key: 'navigation.recorder', icon: '🎤' },
        { path: '/results', key: 'navigation.results', icon: '📊' },
        { path: '/history', key: 'navigation.history', icon: '📋' },
        { path: '/insights', key: 'navigation.insights', icon: '💡' },
        { path: '/health-tips', key: 'navigation.healthTips', icon: '💊' }
    ];

    return (
        <>
            {/* Fixed Navigation with backdrop blur */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-white font-bold">
                                    🧠
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Parkinson's AI
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation Links */}
                        <div className="hidden md:flex items-center space-x-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${location.pathname === item.path
                                            ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                                            : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
                                        }`}
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    <span>{translate(item.key)}</span>
                                </Link>
                            ))}
                        </div>

                        {/* Right side - Language Switcher & Mobile Menu */}
                        <div className="flex items-center space-x-4">
                            <LanguageSwitcher />

                            {/* Mobile menu button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {isMobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-slate-900/95 backdrop-blur-lg border-t border-slate-700/50">
                        <div className="px-4 py-4 space-y-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${location.pathname === item.path
                                            ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                                            : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
                                        }`}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <span>{translate(item.key)}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            {/* Spacer to prevent content from going under fixed navbar */}
            <div className="h-16"></div>
        </>
    );
};

export default Navigation;