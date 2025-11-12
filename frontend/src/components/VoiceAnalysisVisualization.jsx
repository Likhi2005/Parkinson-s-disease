import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    BarChart, Bar, ResponsiveContainer, ReferenceLine, Area, AreaChart,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { AudioAnalyzer } from '../utils/audioAnalysis';

const VoiceAnalysisVisualization = ({ audioFile, analysisResults, onAnalysisComplete }) => {
    const [visualizationData, setVisualizationData] = useState(null);
    const [activeTab, setActiveTab] = useState('waveform');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analyzer] = useState(() => new AudioAnalyzer());

    useEffect(() => {
        if (audioFile) {
            analyzeAudio();
        }
    }, [audioFile]);

    const analyzeAudio = async () => {
        if (!audioFile) return;

        setIsAnalyzing(true);
        try {
            console.log('Starting voice analysis visualization...');

            // Convert audio file to buffer and decode
            const arrayBuffer = await analyzer.audioFileToBuffer(audioFile);
            const audioData = await analyzer.decodeAudioBuffer(arrayBuffer);

            // Extract visualizations
            const waveform = analyzer.extractWaveform(audioData.data);
            const spectrogram = analyzer.computeSpectrogram(audioData.data);
            const features = analyzer.extractAcousticFeatures(audioData.data);
            const comparison = analyzer.compareWithBaseline(features);

            const vizData = {
                waveform,
                spectrogram,
                features,
                comparison,
                audioInfo: {
                    duration: audioData.duration,
                    sampleRate: audioData.sampleRate,
                    samples: audioData.data.length
                }
            };

            setVisualizationData(vizData);

            // Pass analysis results back to parent
            if (onAnalysisComplete) {
                onAnalysisComplete(vizData);
            }

            console.log('Voice analysis complete:', vizData);

        } catch (error) {
            console.error('Error analyzing audio:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (isAnalyzing) {
        return (
            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 backdrop-blur-sm text-center">
                <div className="animate-spin text-6xl mb-4">🧠</div>
                <h3 className="text-xl font-bold text-white mb-2">Analyzing Voice Patterns</h3>
                <p className="text-gray-300">Extracting acoustic features and comparing with baselines...</p>
                <div className="mt-4">
                    <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full animate-pulse w-3/4"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!visualizationData) {
        return (
            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 backdrop-blur-sm text-center">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-white mb-2">Voice Analysis Ready</h3>
                <p className="text-gray-300">Record or upload audio to see detailed voice analysis</p>
            </div>
        );
    }

    const tabs = [
        { id: 'waveform', label: 'Waveform', icon: '〰️' },
        { id: 'spectrogram', label: 'Spectrogram', icon: '🌈' },
        { id: 'features', label: 'Voice Features', icon: '📈' },
        { id: 'comparison', label: 'Health Comparison', icon: '🔍' }
    ];

    const renderWaveform = () => {
        const data = visualizationData.waveform.timeAxis.map((time, i) => ({
            time: time.toFixed(3),
            amplitude: visualizationData.waveform.data[i]
        }));

        return (
            <div className="space-y-6">
                <div className="text-center mb-4">
                    <h4 className="text-lg font-bold text-white mb-2">Voice Waveform Analysis</h4>
                    <p className="text-gray-300 text-sm">Time domain representation of your voice signal</p>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-4">
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis
                                dataKey="time"
                                stroke="#9CA3AF"
                                label={{ value: 'Time (seconds)', position: 'insideBottom', offset: -10 }}
                            />
                            <YAxis
                                stroke="#9CA3AF"
                                label={{ value: 'Amplitude', angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2937',
                                    border: '1px solid #374151',
                                    borderRadius: '8px',
                                    color: '#F9FAFB'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="amplitude"
                                stroke="#8B5CF6"
                                fill="url(#waveformGradient)"
                                strokeWidth={2}
                            />
                            <defs>
                                <linearGradient id="waveformGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="bg-slate-700/30 rounded-lg p-4 text-center">
                        <p className="text-gray-400 text-sm">Duration</p>
                        <p className="text-white font-bold text-lg">{visualizationData.audioInfo.duration.toFixed(2)}s</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-4 text-center">
                        <p className="text-gray-400 text-sm">Sample Rate</p>
                        <p className="text-white font-bold text-lg">{visualizationData.audioInfo.sampleRate} Hz</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-4 text-center">
                        <p className="text-gray-400 text-sm">Samples</p>
                        <p className="text-white font-bold text-lg">{visualizationData.audioInfo.samples.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        );
    };

    const renderSpectrogram = () => {
        // Convert spectrogram data for visualization
        const spectrogramData = [];
        const maxTime = Math.min(visualizationData.spectrogram.timeAxis.length, 50); // Limit for performance

        for (let t = 0; t < maxTime; t++) {
            const timePoint = {
                time: visualizationData.spectrogram.timeAxis[t].toFixed(2)
            };

            visualizationData.spectrogram.frequencies.slice(0, 20).forEach((freq, i) => {
                timePoint[`freq_${i}`] = visualizationData.spectrogram.data[t] ?
                    visualizationData.spectrogram.data[t][i] || 0 : 0;
            });

            spectrogramData.push(timePoint);
        }

        return (
            <div className="space-y-6">
                <div className="text-center mb-4">
                    <h4 className="text-lg font-bold text-white mb-2">Frequency Spectrum Analysis</h4>
                    <p className="text-gray-300 text-sm">Frequency domain representation showing voice harmonics</p>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-4">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={spectrogramData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis
                                dataKey="time"
                                stroke="#9CA3AF"
                                label={{ value: 'Time (seconds)', position: 'insideBottom', offset: -10 }}
                            />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2937',
                                    border: '1px solid #374151',
                                    borderRadius: '8px',
                                    color: '#F9FAFB'
                                }}
                            />
                            <Line type="monotone" dataKey="freq_0" stroke="#EF4444" strokeWidth={2} dot={false} name="Low Freq" />
                            <Line type="monotone" dataKey="freq_5" stroke="#F59E0B" strokeWidth={2} dot={false} name="Mid Freq" />
                            <Line type="monotone" dataKey="freq_10" stroke="#10B981" strokeWidth={2} dot={false} name="High Freq" />
                            <Line type="monotone" dataKey="freq_15" stroke="#8B5CF6" strokeWidth={2} dot={false} name="Very High" />
                            <Legend />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    };

    const renderFeatures = () => {
        const features = visualizationData.features;
        const featureData = [
            { name: 'Fundamental Frequency (F0)', value: features.f0.toFixed(2), unit: 'Hz', description: 'Average pitch of your voice' },
            { name: 'Jitter', value: (features.jitter * 100).toFixed(3), unit: '%', description: 'Pitch variation measure' },
            { name: 'Shimmer', value: (features.shimmer * 100).toFixed(3), unit: '%', description: 'Amplitude variation measure' },
            { name: 'Harmonic-to-Noise Ratio', value: features.hnr.toFixed(2), unit: 'dB', description: 'Voice quality indicator' }
        ];

        const mfccData = features.mfcc.map((coeff, i) => ({
            coefficient: `MFCC ${i + 1}`,
            value: coeff
        }));

        return (
            <div className="space-y-6">
                <div className="text-center mb-4">
                    <h4 className="text-lg font-bold text-white mb-2">Extracted Voice Features</h4>
                    <p className="text-gray-300 text-sm">Key acoustic parameters used for analysis</p>
                </div>

                {/* Scalar Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {featureData.map((feature, i) => (
                        <div key={i} className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-xl p-6 border border-slate-600/50">
                            <div className="flex items-center justify-between mb-3">
                                <h5 className="font-semibold text-white text-sm">{feature.name}</h5>
                                <span className="text-2xl">
                                    {i === 0 ? '🎵' : i === 1 ? '📊' : i === 2 ? '🌊' : '🔊'}
                                </span>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-purple-300 mb-1">
                                    {feature.value}
                                    <span className="text-sm text-gray-400 ml-1">{feature.unit}</span>
                                </p>
                                <p className="text-xs text-gray-400">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* MFCC Coefficients */}
                <div className="bg-slate-900/50 rounded-xl p-4">
                    <h5 className="font-semibold text-white mb-4 text-center">MFCC Coefficients (Cepstral Features)</h5>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={mfccData.slice(0, 13)}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis
                                dataKey="coefficient"
                                stroke="#9CA3AF"
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2937',
                                    border: '1px solid #374151',
                                    borderRadius: '8px',
                                    color: '#F9FAFB'
                                }}
                            />
                            <Bar
                                dataKey="value"
                                fill="url(#mfccGradient)"
                                radius={[4, 4, 0, 0]}
                            />
                            <defs>
                                <linearGradient id="mfccGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    };

    const renderComparison = () => {
        const comparison = visualizationData.comparison;

        // Prepare data for radar chart
        const radarData = [
            {
                feature: 'F0',
                userValue: Math.min(comparison.f0.userValue / 200 * 100, 100),
                baseline: comparison.f0.baselineValue / 200 * 100,
                fullMark: 100
            },
            {
                feature: 'Jitter',
                userValue: Math.min((1 - comparison.jitter.userValue) * 100, 100),
                baseline: (1 - comparison.jitter.baselineValue) * 100,
                fullMark: 100
            },
            {
                feature: 'Shimmer',
                userValue: Math.min((1 - comparison.shimmer.userValue) * 100, 100),
                baseline: (1 - comparison.shimmer.baselineValue) * 100,
                fullMark: 100
            },
            {
                feature: 'HNR',
                userValue: Math.min(comparison.hnr.userValue / 25 * 100, 100),
                baseline: comparison.hnr.baselineValue / 25 * 100,
                fullMark: 100
            }
        ];

        return (
            <div className="space-y-6">
                <div className="text-center mb-6">
                    <h4 className="text-lg font-bold text-white mb-2">Health Baseline Comparison</h4>
                    <p className="text-gray-300 text-sm">How your voice compares to healthy voice patterns</p>
                </div>

                {/* Radar Chart */}
                <div className="bg-slate-900/50 rounded-xl p-6">
                    <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={radarData}>
                            <PolarGrid stroke="#374151" />
                            <PolarAngleAxis dataKey="feature" stroke="#9CA3AF" />
                            <PolarRadiusAxis
                                angle={0}
                                domain={[0, 100]}
                                stroke="#9CA3AF"
                                fontSize={12}
                            />
                            <Radar
                                name="Your Voice"
                                dataKey="userValue"
                                stroke="#8B5CF6"
                                fill="#8B5CF6"
                                fillOpacity={0.3}
                                strokeWidth={2}
                            />
                            <Radar
                                name="Healthy Baseline"
                                dataKey="baseline"
                                stroke="#10B981"
                                fill="#10B981"
                                fillOpacity={0.1}
                                strokeWidth={2}
                                strokeDasharray="5 5"
                            />
                            <Legend />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                {/* Detailed Comparison */}
                <div className="grid gap-4">
                    {Object.entries(comparison).filter(([key]) => key !== 'mfcc').map(([featureName, data]) => (
                        <div key={featureName} className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-xl p-6 border border-slate-600/50">
                            <div className="flex items-center justify-between mb-4">
                                <h5 className="font-semibold text-white capitalize">{featureName}</h5>
                                <div
                                    className="px-3 py-1 rounded-full text-xs font-bold"
                                    style={{
                                        backgroundColor: `${data.riskLevel.color}20`,
                                        color: data.riskLevel.color,
                                        border: `1px solid ${data.riskLevel.color}40`
                                    }}
                                >
                                    {data.riskLevel.level}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-gray-400 text-xs mb-1">Your Value</p>
                                    <p className="text-white font-bold">{data.userValue.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs mb-1">Healthy Average</p>
                                    <p className="text-green-300 font-bold">{data.baselineValue.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs mb-1">Z-Score</p>
                                    <p className={`font-bold ${Math.abs(data.zScore) > 2 ? 'text-red-300' : 'text-yellow-300'}`}>
                                        {data.zScore.toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="w-full bg-slate-700 rounded-full h-2">
                                    <div
                                        className="h-2 rounded-full transition-all duration-1000"
                                        style={{
                                            width: `${Math.min(data.deviation * 25, 100)}%`,
                                            backgroundColor: data.riskLevel.color
                                        }}
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-2">{data.riskLevel.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm">
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                    <span className="text-3xl">🔬</span>
                    Visual Voice Analysis
                </h3>
                <p className="text-gray-300">Advanced acoustic analysis and health pattern comparison</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-6">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 cursor-pointer ${activeTab === tab.id
                                ? 'bg-purple-600 text-white shadow-lg'
                                : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50 hover:text-white'
                            }`}
                    >
                        <span className="text-lg">{tab.icon}</span>
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === 'waveform' && renderWaveform()}
                {activeTab === 'spectrogram' && renderSpectrogram()}
                {activeTab === 'features' && renderFeatures()}
                {activeTab === 'comparison' && renderComparison()}
            </div>
        </div>
    );
};

export default VoiceAnalysisVisualization;