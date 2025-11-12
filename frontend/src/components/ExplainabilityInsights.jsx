import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { usePrediction } from '../hooks/usePrediction';

const ExplainabilityInsights = ({ analysisData }) => {
    // Try to get prediction data from context, fallback to props
    let predictionData = null;
    try {
        const { predictionData: contextData } = usePrediction();
        predictionData = contextData;
    } catch (error) {
        console.log('Context not available, using props data');
    }

    // Use analysis data from voice visualization or mock data if not available
    const getFeatureImportanceData = () => {
        if (predictionData?.featureImportance) {
            return predictionData.featureImportance;
        }

        if (analysisData?.features) {
            const features = analysisData.features;
            return [
                {
                    feature: 'Jitter',
                    importance: Math.min(features.jitter * 1000, 1), // Normalize to 0-1
                    value: features.jitter,
                    description: 'Voice pitch variation - measures vocal stability',
                    impact: features.jitter > 0.01 ? 'High Risk' : 'Normal',
                    color: features.jitter > 0.01 ? '#ef4444' : '#10b981'
                },
                {
                    feature: 'Shimmer',
                    importance: Math.min(features.shimmer * 100, 1),
                    value: features.shimmer,
                    description: 'Voice amplitude variation - measures vocal control',
                    impact: features.shimmer > 0.05 ? 'High Risk' : 'Normal',
                    color: features.shimmer > 0.05 ? '#ef4444' : '#10b981'
                },
                {
                    feature: 'HNR',
                    importance: Math.max(0, (25 - features.hnr) / 25), // Inverse importance
                    value: features.hnr,
                    description: 'Harmonic-to-Noise Ratio - measures voice quality',
                    impact: features.hnr < 15 ? 'High Risk' : 'Normal',
                    color: features.hnr < 15 ? '#ef4444' : '#10b981'
                },
                {
                    feature: 'F0 (Pitch)',
                    importance: Math.abs(features.f0 - 150) / 300, // Distance from normal
                    value: features.f0,
                    description: 'Fundamental frequency - average voice pitch',
                    impact: features.f0 < 100 || features.f0 > 200 ? 'Moderate Risk' : 'Normal',
                    color: features.f0 < 100 || features.f0 > 200 ? '#f59e0b' : '#10b981'
                },
                {
                    feature: 'MFCC Variation',
                    importance: analysisData.comparison ?
                        analysisData.comparison.mfcc.reduce((sum, m) => sum + m.deviation, 0) / analysisData.comparison.mfcc.length / 5 : 0.3,
                    value: analysisData.comparison ?
                        analysisData.comparison.mfcc.reduce((sum, m) => sum + m.deviation, 0) / analysisData.comparison.mfcc.length : 1.5,
                    description: 'Cepstral coefficient patterns - voice spectral characteristics',
                    impact: 'Analyzed',
                    color: '#8b5cf6'
                }
            ].sort((a, b) => b.importance - a.importance);
        }

        // Fallback mock data
        return [
            {
                feature: 'Jitter',
                importance: 0.85,
                value: 0.012,
                description: 'Voice pitch variation - measures vocal stability',
                impact: 'High Risk',
                color: '#ef4444'
            },
            {
                feature: 'Shimmer',
                importance: 0.72,
                value: 0.045,
                description: 'Voice amplitude variation - measures vocal control',
                impact: 'Moderate Risk',
                color: '#f59e0b'
            },
            {
                feature: 'HNR',
                importance: 0.68,
                value: 12.5,
                description: 'Harmonic-to-Noise Ratio - measures voice quality',
                impact: 'High Risk',
                color: '#ef4444'
            },
            {
                feature: 'F0 (Pitch)',
                importance: 0.45,
                value: 145,
                description: 'Fundamental frequency - average voice pitch',
                impact: 'Normal',
                color: '#10b981'
            },
            {
                feature: 'MFCC Patterns',
                importance: 0.38,
                value: 2.1,
                description: 'Cepstral coefficient patterns - voice spectral characteristics',
                impact: 'Analyzed',
                color: '#8b5cf6'
            }
        ];
    };

    const featureData = getFeatureImportanceData();

    // Prepare data for pie chart (risk distribution)
    const riskDistribution = featureData.reduce((acc, feature) => {
        const riskLevel = feature.impact;
        acc[riskLevel] = (acc[riskLevel] || 0) + feature.importance;
        return acc;
    }, {});

    const pieData = Object.entries(riskDistribution).map(([risk, value]) => ({
        name: risk,
        value: value,
        color: risk.includes('High') ? '#ef4444' :
            risk.includes('Moderate') ? '#f59e0b' :
                risk.includes('Normal') ? '#10b981' : '#8b5cf6'
    }));

    // Decision pathway data
    const decisionPath = [
        { step: 'Audio Input', confidence: 100, description: 'Voice recording processed' },
        { step: 'Feature Extraction', confidence: 95, description: 'Acoustic features identified' },
        { step: 'Pattern Analysis', confidence: 87, description: 'Voice patterns compared to database' },
        { step: 'Risk Assessment', confidence: 82, description: 'Parkinson\'s indicators evaluated' },
        { step: 'Final Prediction', confidence: 78, description: 'Overall health assessment' }
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                    <span className="text-4xl">🧠</span>
                    AI Explainability Insights
                </h2>
                <p className="text-gray-300 text-lg">
                    Understand how our AI analyzes your voice for Parkinson's risk assessment
                </p>
            </div>

            {/* Feature Importance Chart */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    Feature Importance Analysis
                </h3>
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Bar Chart */}
                    <div className="lg:col-span-2">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={featureData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis
                                    dataKey="feature"
                                    stroke="#9CA3AF"
                                    angle={-45}
                                    textAnchor="end"
                                    height={100}
                                />
                                <YAxis
                                    stroke="#9CA3AF"
                                    label={{ value: 'Importance Score', angle: -90, position: 'insideLeft' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1F2937',
                                        border: '1px solid #374151',
                                        borderRadius: '8px',
                                        color: '#F9FAFB'
                                    }}
                                    formatter={(value, name) => [
                                        `${(value * 100).toFixed(1)}%`,
                                        'Importance'
                                    ]}
                                />
                                <Bar dataKey="importance" radius={[4, 4, 0, 0]}>
                                    {featureData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Risk Distribution Pie */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4 text-center">Risk Distribution</h4>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    fontSize={12}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Feature Descriptions */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="text-2xl">🔍</span>
                    Feature Analysis Breakdown
                </h3>
                <div className="grid gap-4">
                    {featureData.map((feature, index) => (
                        <div key={index} className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/50">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-white">{feature.feature}</h4>
                                <div className="flex items-center gap-3">
                                    <span
                                        className="px-3 py-1 rounded-full text-xs font-bold"
                                        style={{
                                            backgroundColor: `${feature.color}20`,
                                            color: feature.color,
                                            border: `1px solid ${feature.color}40`
                                        }}
                                    >
                                        {feature.impact}
                                    </span>
                                    <span className="text-purple-300 font-bold text-lg">
                                        {(feature.importance * 100).toFixed(1)}%
                                    </span>
                                </div>
                            </div>

                            <p className="text-gray-300 mb-4">{feature.description}</p>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-400 text-sm">Your Value:</p>
                                    <p className="text-white font-bold text-lg">{feature.value.toFixed(3)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Importance Weight:</p>
                                    <div className="w-full bg-slate-600 rounded-full h-2 mt-1">
                                        <div
                                            className="h-2 rounded-full transition-all duration-1000"
                                            style={{
                                                width: `${feature.importance * 100}%`,
                                                backgroundColor: feature.color
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* AI Decision Process */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="text-2xl">🎯</span>
                    AI Decision Process
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={decisionPath}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="step"
                            stroke="#9CA3AF"
                            angle={-45}
                            textAnchor="end"
                            height={100}
                        />
                        <YAxis
                            stroke="#9CA3AF"
                            domain={[0, 100]}
                            label={{ value: 'Confidence %', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1F2937',
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: '#F9FAFB'
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="confidence"
                            stroke="#8B5CF6"
                            strokeWidth={3}
                            dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Key Insights */}
            <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl p-6 border border-purple-500/30 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="text-2xl">💡</span>
                    Key AI Insights
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-purple-300">Why This Prediction?</h4>
                        <ul className="space-y-2 text-gray-300">
                            {featureData.slice(0, 3).map((feature, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <span className="text-purple-400 mt-1">•</span>
                                    <span>
                                        <strong className="text-white">{feature.feature}</strong> shows{' '}
                                        <span style={{ color: feature.color }}>
                                            {feature.impact.toLowerCase()}
                                        </span>{' '}
                                        patterns with {(feature.importance * 100).toFixed(0)}% contribution
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-purple-300">Clinical Relevance</h4>
                        <ul className="space-y-2 text-gray-300">
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400 mt-1">•</span>
                                <span>Voice biomarkers correlate with motor function changes</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400 mt-1">•</span>
                                <span>Early detection possible through vocal pattern analysis</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400 mt-1">•</span>
                                <span>Non-invasive screening method for neurological assessment</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExplainabilityInsights;