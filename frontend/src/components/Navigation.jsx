import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const Navigation = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Navigation items with enhanced styling
    const navItems = [
        {
            path: '/',
            label: 'Home',
            icon: '🏠',
            color: 'blue',
            description: 'Welcome page'
        },
        {
            path: '/recorder',
            label: 'Voice Analysis',
            icon: '🎙️',
            color: 'purple',
            description: 'Record your voice'
        },
        {
            path: '/results',
            label: 'Results',
            icon: '📊',
            color: 'pink',
            description: 'View analysis results'
        },
        {
            path: '/insights',
            label: 'Insights',
            icon: '🔬',
            color: 'violet',
            description: 'Deep insights & tips'
        }
    ];

    const getActiveClasses = (path, color) => {
        const isActive = location.pathname === path;

        if (isActive) {
            const colorClasses = {
                blue: 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-300 border-blue-500/50 shadow-lg shadow-blue-500/20',
                purple: 'bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 border-purple-500/50 shadow-lg shadow-purple-500/20',
                pink: 'bg-gradient-to-r from-pink-500/20 to-pink-600/20 text-pink-300 border-pink-500/50 shadow-lg shadow-pink-500/20',
                violet: 'bg-gradient-to-r from-violet-500/20 to-violet-600/20 text-violet-300 border-violet-500/50 shadow-lg shadow-violet-500/20'
            };
            return colorClasses[color] + ' border scale-105';
        }

        return 'text-gray-300 hover:text-white border-transparent hover:border-gray-600/30';
    };

    const getHoverClasses = (color) => {
        const hoverClasses = {
            blue: 'hover:bg-blue-500/10 hover:text-blue-300 hover:border-blue-500/30',
            purple: 'hover:bg-purple-500/10 hover:text-purple-300 hover:border-purple-500/30',
            pink: 'hover:bg-pink-500/10 hover:text-pink-300 hover:border-pink-500/30',
            violet: 'hover:bg-violet-500/10 hover:text-violet-300 hover:border-violet-500/30'
        };
        return hoverClasses[color];
    };

    return (
        <nav className="sticky top-0 z-50 bg-gradient-to-r from-slate-900/95 via-purple-950/95 to-slate-900/95 backdrop-blur-xl border-b border-purple-500/20 shadow-2xl shadow-purple-500/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-18">
                    {/* Enhanced Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-3 group flex-shrink-0 hover:opacity-90 transition-all duration-300 py-2"
                    >
                        <div className="relative">
                            <div className="text-3xl animate-pulse group-hover:animate-bounce transition-all duration-300">🧠</div>
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                        </div>
                        <div className="hidden sm:flex flex-col">
                            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-violet-400 bg-clip-text text-transparent leading-none">
                                Parkinson's AI
                            </span>
                            <span className="text-xs text-gray-400 leading-none mt-1">
                                Voice Health Analysis
                            </span>
                        </div>
                        <span className="sm:hidden text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            P-AI
                        </span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center gap-2">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`
                                        relative px-4 py-3 rounded-xl font-medium transition-all duration-300 
                                        border backdrop-blur-sm flex items-center gap-2 group
                                        ${getActiveClasses(item.path, item.color)}
                                        ${!isActive ? getHoverClasses(item.color) : ''}
                                    `}
                                >
                                    <span className={`text-lg transition-transform duration-300 ${isActive ? 'animate-pulse' : 'group-hover:scale-110'}`}>
                                        {item.icon}
                                    </span>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold leading-none">
                                            {item.label}
                                        </span>
                                        <span className="text-xs opacity-75 leading-none mt-1">
                                            {item.description}
                                        </span>
                                    </div>

                                    {/* Active indicator */}
                                    {isActive && (
                                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse shadow-lg"></div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Medium screens navigation (simplified) */}
                    <div className="hidden md:flex lg:hidden items-center gap-1">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`
                                        relative px-3 py-2 rounded-lg font-medium transition-all duration-300 
                                        flex items-center gap-2 border backdrop-blur-sm
                                        ${getActiveClasses(item.path, item.color)}
                                        ${!isActive ? getHoverClasses(item.color) : ''}
                                    `}
                                >
                                    <span className={`text-lg ${isActive ? 'animate-pulse' : ''}`}>
                                        {item.icon}
                                    </span>
                                    <span className="text-sm font-semibold">
                                        {item.label}
                                    </span>

                                    {isActive && (
                                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Section - Language Switcher & Mobile Menu Button */}
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:block">
                            <LanguageSwitcher />
                        </div>

                        {/* Enhanced Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden relative inline-flex items-center justify-center p-3 rounded-xl bg-slate-800/50 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400/50 focus:outline-none transition-all duration-300 group"
                        >
                            <svg
                                className={`w-6 h-6 transition-transform duration-300 ${isMenuOpen ? 'rotate-90 scale-110' : 'group-hover:scale-110'}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                            {/* Menu button indicator */}
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-ping opacity-20"></div>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60"></div>
                        </button>
                    </div>
                </div>

                {/* Enhanced Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-2 bg-gradient-to-br from-slate-900/90 to-purple-950/90 backdrop-blur-xl border-t border-purple-500/20 rounded-b-xl mx-4 mb-4 shadow-2xl shadow-purple-500/10">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`
                                            relative block px-4 py-3 rounded-lg font-medium transition-all duration-300 
                                            border backdrop-blur-sm group
                                            ${getActiveClasses(item.path, item.color)}
                                            ${!isActive ? getHoverClasses(item.color) : ''}
                                        `}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xl transition-transform duration-300 ${isActive ? 'animate-pulse' : 'group-hover:scale-110'}`}>
                                                {item.icon}
                                            </span>
                                            <div className="flex flex-col">
                                                <span className="font-semibold leading-none">
                                                    {item.label}
                                                </span>
                                                <span className="text-xs opacity-75 leading-none mt-1">
                                                    {item.description}
                                                </span>
                                            </div>
                                            {isActive && (
                                                <div className="ml-auto">
                                                    <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Mobile active indicator */}
                                        {isActive && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-pink-400 rounded-r-full shadow-lg shadow-purple-500/50"></div>
                                        )}
                                    </Link>
                                );
                            })}

                            {/* Mobile Language Switcher */}
                            <div className="px-4 py-3 border-t border-purple-500/20 mt-3 pt-3">
                                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                                    <span className="text-lg">🌐</span>
                                    <span>Language Settings</span>
                                </div>
                                <LanguageSwitcher />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Enhanced floating navigation indicator for desktop */}
            <div className="hidden lg:block">
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
            </div>
        </nav>
    );
};

export default Navigation;