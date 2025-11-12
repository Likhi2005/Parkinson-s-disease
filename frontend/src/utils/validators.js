/**
 * Validate audio file
 */
export const validateAudioFile = (file) => {
    const errors = [];

    if (!file) {
        errors.push('No file selected.');
        return { isValid: false, errors };
    }

    // Check file type
    const validTypes = ['audio/wav', 'audio/mpeg', 'audio/mp3'];
    if (!validTypes.includes(file.type)) {
        errors.push(`Invalid file type: ${file.type}. Supported: WAV, MP3`);
    }

    // Check file size (max 20MB)
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
        errors.push(`File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds limit of 20MB.`);
    }

    // Check minimum file size (at least 100KB for 10 seconds)
    const minSize = 100 * 1024;
    if (file.size < minSize) {
        errors.push('File too small. Please record at least 10 seconds.');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

/**
 * Validate recording duration
 */
export const validateRecordingDuration = (seconds, minSeconds = 3, maxSeconds = 30) => {
    const errors = [];

    if (seconds < minSeconds) {
        errors.push(`Recording too short. Minimum ${minSeconds} seconds required.`);
    }

    if (seconds > maxSeconds) {
        errors.push(`Recording too long. Maximum ${maxSeconds} seconds allowed.`);
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

/**
 * Validate prediction result
 */
export const validatePredictionResult = (result) => {
    const errors = [];

    if (!result) {
        errors.push('No prediction result received.');
        return { isValid: false, errors };
    }

    if (typeof result.prediction !== 'number' || ![0, 1].includes(result.prediction)) {
        errors.push('Invalid prediction value.');
    }

    if (typeof result.risk_score !== 'number' || result.risk_score < 0 || result.risk_score > 1) {
        errors.push('Invalid risk score. Must be between 0 and 1.');
    }

    if (!result.status || typeof result.status !== 'string') {
        errors.push('Missing status information.');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

/**
 * Validate feature value
 */
export const validateFeatureValue = (value, featureName) => {
    if (typeof value !== 'number') {
        return { isValid: false, error: `${featureName} must be a number.` };
    }

    if (isNaN(value) || !isFinite(value)) {
        return { isValid: false, error: `${featureName} has invalid value.` };
    }

    return { isValid: true, error: null };
};

/**
 * Validate email format
 */
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
        isValid: emailRegex.test(email),
        error: !emailRegex.test(email) ? 'Invalid email format.' : null,
    };
};

/**
 * Validate phone number (Indian format)
 */
export const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
    return {
        isValid: phoneRegex.test(phone.replace(/[\s-]/g, '')),
        error: !phoneRegex.test(phone.replace(/[\s-]/g, '')) ? 'Invalid phone number.' : null,
    };
};

/**
 * Validate form field (generic)
 */
export const validateFormField = (value, fieldName, rules = {}) => {
    const errors = [];

    // Required check
    if (rules.required && (!value || value.toString().trim() === '')) {
        errors.push(`${fieldName} is required.`);
    }

    // Min length check
    if (rules.minLength && value.length < rules.minLength) {
        errors.push(`${fieldName} must be at least ${rules.minLength} characters.`);
    }

    // Max length check
    if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${fieldName} must not exceed ${rules.maxLength} characters.`);
    }

    // Pattern check
    if (rules.pattern && !rules.pattern.test(value)) {
        errors.push(`${fieldName} format is invalid.`);
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

/**
 * Validate browser microphone support
 */
export const validateMicrophoneSupport = () => {
    const hasMicrophone =
        navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia;

    return {
        isSupported: !!hasMicrophone,
        error: !hasMicrophone ? 'Microphone access is not supported in your browser.' : null,
    };
};

/**
 * Validate localStorage availability
 */
export const validateLocalStorage = () => {
    try {
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        return { isSupported: true, error: null };
    } catch (e) {
        return { isSupported: false, error: 'LocalStorage is not available.' };
    }
};

/**
 * Validate API response
 */
export const validateApiResponse = (response) => {
    const errors = [];

    if (!response) {
        errors.push('No response from server.');
        return { isValid: false, errors };
    }

    if (response.status && response.status >= 400) {
        errors.push(`Server error: ${response.status}`);
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};