export const FEATURE_EXPLANATIONS = {
    jitter: {
        name: 'Jitter',
        description: 'Frequency variation in voice. Higher values may indicate vocal instability.',
        unit: '%',
        normal_range: '0.0 - 1.0',
    },
    shimmer: {
        name: 'Shimmer',
        description: 'Amplitude variation in voice. Elevated levels suggest voice tremor.',
        unit: '%',
        normal_range: '0.0 - 3.5',
    },
    hnr: {
        name: 'HNR (Harmonics-to-Noise Ratio)',
        description: 'Lower values may indicate hoarseness or voice quality issues.',
        unit: 'dB',
        normal_range: '20.0 - 33.0',
    },
    ppq5: {
        name: 'PPQ5 (Pitch Perturbation Quotient)',
        description: 'Measures pitch stability over 5 cycles.',
        unit: '%',
        normal_range: '0.0 - 0.5',
    },
    apq3: {
        name: 'APQ3 (Amplitude Perturbation Quotient)',
        description: 'Measures amplitude variation over 3 cycles.',
        unit: '%',
        normal_range: '0.0 - 0.4',
    },
    nhr: {
        name: 'NHR (Noise-to-Harmonics Ratio)',
        description: 'Higher values suggest increased noise in voice signal.',
        unit: 'ratio',
        normal_range: '0.0 - 0.025',
    },
    mfcc: {
        name: 'MFCC Coefficients',
        description: 'Mel-Frequency Cepstral Coefficients representing voice characteristics.',
        unit: 'coefficient',
        normal_range: '-10 to 10',
    },
};

export const RISK_LEVELS = {
    LOW: {
        label: 'Healthy',
        color: '#10b981',
        bgColor: '#dcfce7',
        borderColor: '#86efac',
        icon: '🟢',
        description: 'Low risk of Parkinson\'s disease.',
    },
    MEDIUM: {
        label: 'Mild Risk',
        color: '#f59e0b',
        bgColor: '#fef3c7',
        borderColor: '#fcd34d',
        icon: '🟡',
        description: 'Mild risk detected. Consult a healthcare professional.',
    },
    HIGH: {
        label: 'High Risk',
        color: '#ef4444',
        bgColor: '#fee2e2',
        borderColor: '#fca5a5',
        icon: '🔴',
        description: 'High risk detected. Please consult a neurologist immediately.',
    },
};

export const RECORDING_CONFIG = {
    DURATION_SECONDS: 10,
    SAMPLE_RATE: 44100,
    CHANNELS: 1,
    BIT_DEPTH: 16,
};

export const API_ENDPOINTS = {
    PREDICT: '/predict',
    HEALTH_CHECK: '/health',
    FEATURES: '/features',
};

export const STORAGE_KEYS = {
    HISTORY: 'parkinson_predictions_history',
    SETTINGS: 'parkinson_app_settings',
    LANGUAGE: 'language',
};

export const CHART_COLORS = {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    light: '#f3f4f6',
    dark: '#1f2937',
};

export const ANIMATION_DURATION = {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
};

export const HEALTH_TIPS = [
    {
        title: 'Voice Exercises',
        tips: [
            'Humming - Sustain a "mmm" sound for 30 seconds',
            'Deep breathing - Slow, controlled breathing exercises',
            'Vowel sustaining - Hold "aaa", "eee", "ooo" sounds for 5 seconds each',
            'Lip trills - Create "motorboat" sound with lips',
        ],
    },
    {
        title: 'Daily Habits',
        tips: [
            'Stay hydrated throughout the day',
            'Avoid shouting or straining your voice',
            'Take regular voice rest breaks',
            'Practice good posture while speaking',
        ],
    },
];

export const NEUROLOGISTS_NEARBY = [
    {
        name: 'City Neurology Center',
        distance: '2.5 km',
        rating: 4.8,
        phone: '+91-XXXX-XXXX',
    },
    {
        name: 'Advanced Neuro Care',
        distance: '3.2 km',
        rating: 4.6,
        phone: '+91-XXXX-XXXX',
    },
];