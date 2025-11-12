import React, { createContext, useContext, useState } from 'react';

export const PredictionContext = createContext();

export const PredictionProvider = ({ children }) => {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const makePrediction = async (audioFile, directResult = null) => {
        console.log('PredictionContext makePrediction called with:', { audioFile, directResult });

        // If we have a direct result, just update the state
        if (directResult) {
            console.log('Setting direct result:', directResult);
            setPrediction(directResult);
            setLoading(false);
            setError(null);
            return directResult;
        }

        // Otherwise, process the audio file
        if (!audioFile) {
            throw new Error('No audio file provided');
        }

        setLoading(true);
        setError(null);

        try {
            console.log('Processing audio file:', audioFile.name);

            const formData = new FormData();
            formData.append('audio', audioFile);

            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Network error' }));
                throw new Error(errorData.detail || errorData.error || `HTTP ${response.status}`);
            }

            const result = await response.json();
            console.log('PredictionContext received result:', result);

            // Transform result to include risk_score
            const transformedResult = {
                ...result,
                risk_score: result.probability || 0.5,
                confidence: result.confidence || `${((result.probability || 0.5) * 100).toFixed(1)}%`
            };

            console.log('PredictionContext setting transformed result:', transformedResult);
            setPrediction(transformedResult);
            setLoading(false);

            return transformedResult;
        } catch (error) {
            console.error('PredictionContext error:', error);
            setError(error.message);
            setLoading(false);
            throw error;
        }
    };

    const clearPrediction = () => {
        setPrediction(null);
        setError(null);
    };

    const value = {
        prediction,
        setPrediction, // Export setPrediction
        loading,
        error,
        makePrediction,
        clearPrediction
    };

    return (
        <PredictionContext.Provider value={value}>
            {children}
        </PredictionContext.Provider>
    );
};

export const usePredictionContext = () => {
    const context = useContext(PredictionContext);
    if (!context) {
        throw new Error('usePredictionContext must be used within a PredictionProvider');
    }
    return context;
};