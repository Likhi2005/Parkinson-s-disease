/**
 * Format timestamp to readable date-time
 */
export const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

/**
 * Format date for history display
 */
export const formatDateShort = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
};

/**
 * Format time duration in MM:SS format
 */
export const formatTime = (seconds) => {
    if (!seconds) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format risk score as percentage
 */
export const formatRiskScore = (score) => {
    if (typeof score !== 'number') return '0.0%';
    return `${(score * 100).toFixed(1)}%`;
};

/**
 * Format acoustic feature value
 */
export const formatFeatureValue = (value, featureName) => {
    if (typeof value !== 'number') return 'N/A';

    const decimalPlaces = {
        jitter: 4,
        shimmer: 4,
        hnr: 2,
        ppq5: 4,
        apq3: 4,
        nhr: 5,
        mfcc: 2,
    };

    const places = decimalPlaces[featureName] || 2;
    return value.toFixed(places);
};

/**
 * Get risk level text based on score
 */
export const getRiskLevelText = (score) => {
    if (score < 0.5) return 'Low Risk';
    if (score < 0.7) return 'Medium Risk';
    return 'High Risk';
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Format confidence percentage
 */
export const formatConfidence = (confidence) => {
    if (typeof confidence !== 'number') return '0.0%';
    return `${(confidence * 100).toFixed(1)}%`;
};

/**
 * Format feature comparison for display
 */
export const formatFeatureComparison = (userValue, healthyValue) => {
    const diff = userValue - healthyValue;
    const diffPercent = ((diff / healthyValue) * 100).toFixed(1);
    const status = diff > 0 ? '↑ Higher' : diff < 0 ? '↓ Lower' : '= Equal';
    return {
        difference: diff.toFixed(4),
        percentChange: diffPercent,
        status,
    };
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text, length = 50) => {
    if (!text || text.length <= length) return text;
    return text.substring(0, length) + '...';
};

/**
 * Format model explanation
 */
export const formatModelExplanation = (features) => {
    if (!features || features.length === 0) return 'No features analyzed.';
    const topFeatures = features.slice(0, 3).map(f => f.name).join(', ');
    return `Our model identified ${topFeatures} as key indicators.`;
};

/**
 * Parse and format API error
 */
export const formatApiError = (error) => {
    if (error.response?.data?.error) {
        return error.response.data.error;
    }
    if (error.message) {
        return error.message;
    }
    return 'An unexpected error occurred. Please try again.';
};

/**
 * Format JSON for display
 */
export const formatJSON = (obj, indent = 2) => {
    return JSON.stringify(obj, null, indent);
};