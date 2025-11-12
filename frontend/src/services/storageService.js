import { useEffect } from 'react';

const STORAGE_KEY = 'parkinsons_predictions';

export const savePrediction = (prediction) => {
    const existingPredictions = getPredictions();
    existingPredictions.push(prediction);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingPredictions));
};

export const getPredictions = () => {
    const predictions = localStorage.getItem(STORAGE_KEY);
    return predictions ? JSON.parse(predictions) : [];
};

export const clearPredictions = () => {
    localStorage.removeItem(STORAGE_KEY);
};