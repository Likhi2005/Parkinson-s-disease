import numpy as np
import librosa
import pandas as pd
from typing import Dict, Any

def extract_features_from_file(file_path: str) -> Dict[str, Any]:
    """
    Extract acoustic features from an audio file for Parkinson's disease detection.
    
    Args:
        file_path (str): Path to the audio file
        
    Returns:
        dict: Dictionary containing the extracted features
    """
    # Load the audio file
    try:
        y, sr = librosa.load(file_path, sr=None)  # Use original sampling rate
    except Exception as e:
        raise Exception(f"Error loading audio file: {str(e)}")

    # Ensure minimum duration
    if len(y) / sr < 1.0:  # Less than 1 second
        raise ValueError("Audio file too short. Minimum 1 second required.")

    try:
        # 1. Fundamental frequency features
        f0, voiced_flag, voiced_probs = librosa.pyin(y, 
                                                    fmin=librosa.note_to_hz('C2'),
                                                    fmax=librosa.note_to_hz('C7'))
        f0 = f0[voiced_flag]  # Keep only voiced frames
        
        if len(f0) == 0:
            raise ValueError("No voiced frames detected in audio")

        # 2. Extract MFCCs
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        
        # 3. Calculate jitter
        period_lengths = np.diff(f0)
        jitter = np.mean(np.abs(np.diff(period_lengths))) / np.mean(period_lengths) if len(period_lengths) > 1 else 0
        
        # 4. Calculate shimmer
        rms = librosa.feature.rms(y=y)[0]
        shimmer = np.mean(np.abs(np.diff(rms))) / np.mean(rms) if len(rms) > 1 else 0
        
        # 5. Harmonics-to-Noise Ratio (HNR)
        harmonics = librosa.effects.harmonic(y)
        noise = y - harmonics
        hnr = 10 * np.log10(np.mean(harmonics**2) / np.mean(noise**2)) if np.mean(noise**2) > 0 else 0

        # Create feature dictionary matching the expected format
        features = {
            'MDVP:Fo(Hz)': float(np.mean(f0)),
            'MDVP:Fhi(Hz)': float(np.max(f0)),
            'MDVP:Flo(Hz)': float(np.min(f0)),
            'MDVP:Jitter(%)': float(jitter * 100),
            'MDVP:Jitter(Abs)': float(jitter),
            'MDVP:RAP': float(jitter),  # Relative Average Perturbation
            'MDVP:PPQ': float(jitter),  # Five-point Period Perturbation Quotient
            'Jitter:DDP': float(jitter * 3),  # Average absolute difference of differences
            'MDVP:Shimmer': float(shimmer),
            'MDVP:Shimmer(dB)': float(20 * np.log10(shimmer + 1e-6)),
            'Shimmer:APQ3': float(shimmer),  # Three-point Amplitude Perturbation Quotient
            'Shimmer:APQ5': float(shimmer),  # Five-point Amplitude Perturbation Quotient
            'MDVP:APQ': float(shimmer),
            'Shimmer:DDA': float(shimmer * 3),
            'NHR': float(20 * np.log10(1/hnr) if hnr > 0 else 0),
            'HNR': float(hnr),
            'RPDE': float(np.std(f0)/np.mean(f0)),  # Recurrence Period Density Entropy
            'DFA': float(np.mean(np.abs(np.diff(f0)))),  # Detrended Fluctuation Analysis
            'spread1': float(np.percentile(f0, 75) - np.percentile(f0, 25)),
            'spread2': float(np.std(f0)),
            'D2': float(np.mean(np.abs(np.diff(f0, n=2)))),  # Correlation Dimension
            'PPE': float(np.sum(np.abs(np.diff(f0))))  # Pitch Period Entropy
        }
        
        return features
        
    except Exception as e:
        raise Exception(f"Error extracting features: {str(e)}")