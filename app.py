import warnings
warnings.filterwarnings("ignore", category=UserWarning, module="sklearn")
warnings.filterwarnings("ignore", category=DeprecationWarning, module="paramiko")
warnings.filterwarnings("ignore", category=DeprecationWarning, module="cryptography")

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import uuid
import numpy as np
import pandas as pd
import librosa
import joblib
from werkzeug.utils import secure_filename
from utils.feature_extraction import extract_features_from_file
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # enable CORS for frontend communication

# Configuration
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
ALLOWED_EXTENSIONS = {'.wav', '.mp3', '.ogg', '.webm', '.flac', '.m4a'}

# Load the model
MODEL_PATH = "models/best_parkinsons_pipeline.pkl"
model = None
try:
    model = joblib.load(MODEL_PATH)
    logger.info("Model loaded successfully")
except Exception as e:
    model_load_error = str(e)
    model = None
    logger.error(f"Model loading failed: {e}")
else:
    model_load_error = None

def _allowed_file(filename):
    ext = os.path.splitext(filename)[1].lower()
    return ext in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return jsonify({
        "status": "active",
        "message": "Parkinson's Disease Detection API",
        "model_loaded": model is not None,
        "allowed_formats": list(ALLOWED_EXTENSIONS)
    })

@app.route('/health')
def health():
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    logger.info("Prediction request received")
    
    if model is None:
        logger.error("Model not loaded")
        return jsonify({
            "error": "Model not loaded", 
            "detail": model_load_error if model_load_error else "Model failed to load"
        }), 500

    try:
        # Validate file upload
        if 'audio' not in request.files:
            logger.error("No audio file in request")
            return jsonify({"error": "No audio file provided"}), 400

        file = request.files['audio']
        if not file or not file.filename:
            logger.error("Invalid file uploaded")
            return jsonify({"error": "Invalid file"}), 400

        logger.info(f"Request received with file: {file.filename}")
        
        # Secure filename and check extension
        filename = secure_filename(file.filename)
        if not _allowed_file(filename):
            logger.error(f"Invalid file type: {filename}")
            return jsonify({
                "error": "Invalid file type",
                "detail": f"Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
            }), 400

        # Save file with unique ID
        file_id = str(uuid.uuid4())[:8]
        file_path = os.path.join(UPLOAD_FOLDER, f"{file_id}_{filename}")
        file.save(file_path)
        logger.info(f"File saved successfully at: {file_path}")

        try:
            # Check if feature_columns.csv exists
            if not os.path.exists('feature_columns.csv'):
                logger.error("feature_columns.csv not found")
                return jsonify({
                    "error": "Configuration error",
                    "detail": "feature_columns.csv file not found"
                }), 500

            # Extract features
            logger.info("Starting feature extraction...")
            features = extract_features_from_file(file_path)
            logger.info("Features extracted successfully")
            
            # Read feature columns and create DataFrame
            feature_cols = pd.read_csv('feature_columns.csv')
            df_features = pd.DataFrame([features])
            
            # Ensure columns match model's expectations
            expected_cols = feature_cols['columns'].tolist()
            missing_cols = set(expected_cols) - set(df_features.columns)
            extra_cols = set(df_features.columns) - set(expected_cols)
            
            logger.info(f"Expected columns: {len(expected_cols)}, Got columns: {len(df_features.columns)}")
            
            if missing_cols:
                logger.error(f"Missing columns: {missing_cols}")
                return jsonify({
                    "error": "Missing features",
                    "detail": f"Missing columns: {', '.join(missing_cols)}"
                }), 500
                
            # Reorder columns to match training data
            df_features = df_features[expected_cols]
            
            # Make prediction
            logger.info("Making prediction...")
            prediction = model.predict(df_features)
            probability = None
            if hasattr(model, 'predict_proba'):
                probability = float(model.predict_proba(df_features)[0, 1])
            
            result = {
                "prediction": int(prediction[0]),
                "probability": probability,
                "status": "Parkinson's Disease Detected" if prediction[0] == 1 else "Healthy",
                "confidence": f"{probability*100:.1f}%" if probability is not None else "N/A",
                "features": {k: float(v) for k, v in features.items()}
            }
            
            logger.info("Analysis completed successfully")
            return jsonify(result)

        except Exception as e:
            logger.error(f"Prediction error: {str(e)}")
            return jsonify({
                "error": "Analysis failed",
                "detail": str(e)
            }), 500
        finally:
            # Cleanup: remove uploaded file
            try:
                if os.path.exists(file_path):
                    os.remove(file_path)
                    logger.info("Temporary file cleaned up")
            except Exception as e:
                logger.error(f"Cleanup error: {str(e)}")

    except Exception as e:
        logger.error(f"Request processing error: {str(e)}")
        return jsonify({
            "error": "Request processing failed",
            "detail": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000, use_reloader=False)