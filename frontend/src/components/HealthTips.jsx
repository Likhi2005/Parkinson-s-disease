import React, { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';

const HealthTips = () => {
    const { translate } = useLanguage();
    const [userStats, setUserStats] = useState(null);
    const [personalizedTips, setPersonalizedTips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserStats();
    }, []);

    const fetchUserStats = async () => {
        try {
            const response = await fetch('http://localhost:5000/history/stats');
            const data = await response.json();
            console.log('User stats:', data); // Debug log
            setUserStats(data);
            generatePersonalizedTips(data);
        } catch (error) {
            console.error('Error fetching user stats:', error);
            setPersonalizedTips(getDefaultTips());
        } finally {
            setLoading(false);
        }
    };

    const generatePersonalizedTips = (stats) => {
        const tips = [];
        const overallStats = stats.overall_stats || {};
        const hasHistory = overallStats.total_analyses > 0;
        const hasConcerns = overallStats.parkinsons_count > 0;
        const isRegularUser = overallStats.total_analyses > 3;

        console.log('Generating tips for:', { hasHistory, hasConcerns, isRegularUser, overallStats }); // Debug log

        if (!hasHistory) {
            tips.push({
                category: 'welcome',
                icon: '👋',
                title: translate('healthTips.welcome.title') || 'Welcome to Voice Health Monitoring',
                tips: [
                    translate('healthTips.welcome.tip1') || 'Take your first voice analysis to get personalized health recommendations',
                    translate('healthTips.welcome.tip2') || 'Regular monitoring can help detect early signs of health changes',
                    translate('healthTips.welcome.tip3') || 'Voice patterns can reveal important insights about neurological health'
                ],
                priority: 'high',
                color: 'from-blue-400 to-blue-600',
                bgColor: 'bg-blue-500/10 border-blue-500/30'
            });
        }

        if (hasConcerns) {
            tips.push({
                category: 'medical',
                icon: '🩺',
                title: translate('healthTips.medical.title') || 'Medical Consultation Recommended',
                tips: [
                    translate('healthTips.medical.tip1') || 'Consult with a neurologist for comprehensive evaluation',
                    translate('healthTips.medical.tip2') || 'Keep a record of your symptoms and voice analysis results',
                    translate('healthTips.medical.tip3') || 'Early intervention can significantly improve treatment outcomes',
                    translate('healthTips.medical.tip4') || 'Consider getting a second opinion from a movement disorder specialist'
                ],
                priority: 'critical',
                color: 'from-red-400 to-red-600',
                bgColor: 'bg-red-500/10 border-red-500/30'
            });

            tips.push({
                category: 'movement',
                icon: '🏃‍♂️',
                title: translate('healthTips.movement.title') || 'Movement & Exercise',
                tips: [
                    translate('healthTips.movement.tip1') || 'Regular aerobic exercise can help maintain motor function',
                    translate('healthTips.movement.tip2') || 'Practice balance exercises daily to prevent falls',
                    translate('healthTips.movement.tip3') || 'Consider joining a Parkinson\'s exercise program',
                    translate('healthTips.movement.tip4') || 'Stretching exercises can help maintain flexibility'
                ],
                priority: 'high',
                color: 'from-orange-400 to-orange-600',
                bgColor: 'bg-orange-500/10 border-orange-500/30'
            });
        }

        if (isRegularUser) {
            tips.push({
                category: 'monitoring',
                icon: '📊',
                title: translate('healthTips.monitoring.title') || 'Regular Monitoring',
                tips: [
                    translate('healthTips.monitoring.tip1') || 'Great job maintaining regular voice analysis!',
                    translate('healthTips.monitoring.tip2') || 'Track trends in your voice patterns over time',
                    translate('healthTips.monitoring.tip3') || 'Share your analysis history with healthcare providers',
                    translate('healthTips.monitoring.tip4') || 'Consider weekly voice checks for optimal monitoring'
                ],
                priority: 'medium',
                color: 'from-blue-400 to-blue-600',
                bgColor: 'bg-blue-500/10 border-blue-500/30'
            });
        }

        // Always include general voice care tips
        tips.push({
            category: 'voiceCare',
            icon: '🎤',
            title: translate('healthTips.voiceCare.title') || 'Voice Care & Hygiene',
            tips: [
                translate('healthTips.voiceCare.tip1') || 'Stay hydrated - drink 8-10 glasses of water daily',
                translate('healthTips.voiceCare.tip2') || 'Avoid smoking and excessive alcohol consumption',
                translate('healthTips.voiceCare.tip3') || 'Practice vocal exercises to maintain voice strength',
                translate('healthTips.voiceCare.tip4') || 'Use a humidifier in dry environments',
                translate('healthTips.voiceCare.tip5') || 'Avoid shouting or straining your voice'
            ],
            priority: 'medium',
            color: 'from-green-400 to-green-600',
            bgColor: 'bg-green-500/10 border-green-500/30'
        });

        tips.push({
            category: 'lifestyle',
            icon: '💪',
            title: translate('healthTips.lifestyle.title') || 'Lifestyle Recommendations',
            tips: [
                translate('healthTips.lifestyle.tip1') || 'Maintain a regular sleep schedule (7-9 hours nightly)',
                translate('healthTips.lifestyle.tip2') || 'Follow a Mediterranean diet rich in antioxidants',
                translate('healthTips.lifestyle.tip3') || 'Manage stress through meditation or yoga',
                translate('healthTips.lifestyle.tip4') || 'Stay socially active and engaged',
                translate('healthTips.lifestyle.tip5') || 'Limit caffeine intake, especially before voice analysis'
            ],
            priority: 'medium',
            color: 'from-purple-400 to-purple-600',
            bgColor: 'bg-purple-500/10 border-purple-500/30'
        });

        // Sort tips by priority
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        tips.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

        console.log('Generated tips:', tips); // Debug log
        setPersonalizedTips(tips);
    };

    const getDefaultTips = () => [
        {
            category: 'general',
            icon: '💡',
            title: 'General Health Tips',
            tips: [
                'Take regular voice analyses to monitor your health',
                'Consult healthcare professionals for medical advice',
                'Maintain a healthy lifestyle with regular exercise',
                'Stay hydrated and avoid smoking'
            ],
            priority: 'medium',
            color: 'from-blue-400 to-blue-600',
            bgColor: 'bg-blue-500/10 border-blue-500/30'
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center pt-8">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-400 border-t-transparent"></div>
                    <p className="text-gray-300">Loading personalized health tips...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-8 pb-8">
            <div className="max-w-6xl mx-auto p-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
                            {translate('healthTips.title') || 'Health Tips for Voice Care'}
                        </span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        {translate('healthTips.subtitle') || 'Personalized recommendations based on your voice analysis history'}
                    </p>
                </div>

                {/* User Stats Summary */}
                {userStats?.overall_stats && (
                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-6 mb-8">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <span className="text-2xl">📈</span>
                            Your Health Journey
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-400">
                                    {userStats.overall_stats.total_analyses || 0}
                                </div>
                                <div className="text-gray-300">Total Analyses</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-400">
                                    {userStats.overall_stats.healthy_count || 0}
                                </div>
                                <div className="text-gray-300">Healthy Results</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-purple-400">
                                    {userStats.overall_stats.recent_analyses || 0}
                                </div>
                                <div className="text-gray-300">Recent (30 days)</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Personalized Tips */}
                <div className="space-y-6">
                    {personalizedTips.map((tipCategory, index) => (
                        <div
                            key={index}
                            className={`bg-slate-800/30 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-6 hover:border-purple-400/50 transition-all duration-300 ${tipCategory.priority === 'critical' ? 'ring-2 ring-red-400/20' : ''
                                }`}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-3xl">{tipCategory.icon}</span>
                                <h3 className={`text-xl font-bold bg-gradient-to-r ${tipCategory.color || 'from-purple-400 to-pink-400'} bg-clip-text text-transparent`}>
                                    {tipCategory.title}
                                </h3>
                                {tipCategory.priority === 'critical' && (
                                    <span className="px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-red-400 text-xs font-medium">
                                        Priority
                                    </span>
                                )}
                            </div>

                            <ul className="space-y-3">
                                {tipCategory.tips.map((tip, tipIndex) => (
                                    <li key={tipIndex} className="flex items-start gap-3 text-gray-300">
                                        <span className="text-green-400 mt-1 flex-shrink-0">•</span>
                                        <span className="leading-relaxed">{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Emergency Notice */}
                <div className="mt-8 bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">🚨</span>
                        <h3 className="text-lg font-semibold text-red-400">Important Medical Disclaimer</h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                        This tool is designed for screening purposes only and should not replace professional medical diagnosis.
                        If you have concerning symptoms or our analysis suggests potential health issues, please consult with
                        qualified healthcare professionals immediately. In case of medical emergency, contact your local emergency services.
                    </p>
                </div>

                {/* Resources */}
                <div className="mt-8 bg-slate-800/30 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <span className="text-2xl">📚</span>
                        Additional Resources
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-semibold text-purple-400 mb-2">Parkinson's Organizations</h4>
                            <ul className="text-gray-300 space-y-1 text-sm">
                                <li>• Parkinson's Foundation</li>
                                <li>• Michael J. Fox Foundation</li>
                                <li>• International Parkinson and Movement Disorder Society</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-purple-400 mb-2">Voice & Speech Therapy</h4>
                            <ul className="text-gray-300 space-y-1 text-sm">
                                <li>• LSVT (Lee Silverman Voice Treatment)</li>
                                <li>• Speech Language Pathologists</li>
                                <li>• Voice therapy programs</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="mt-8 text-center">
                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6">
                        <h3 className="text-xl font-semibold text-white mb-3">
                            Ready for Your Next Voice Analysis?
                        </h3>
                        <p className="text-gray-300 mb-4">
                            Regular monitoring helps track changes in your voice patterns over time.
                        </p>
                        <button
                            onClick={() => window.location.href = '/recorder'}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105"
                        >
                            Start New Analysis
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthTips;