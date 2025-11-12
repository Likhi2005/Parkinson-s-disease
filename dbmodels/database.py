from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class AnalysisHistory(db.Model):
    __tablename__ = 'analysis_history'
    
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    file_size = db.Column(db.Integer)
    prediction = db.Column(db.Integer, nullable=False)  # 0 or 1
    probability = db.Column(db.Float)
    confidence = db.Column(db.String(10))
    status = db.Column(db.String(50), nullable=False)
    features = db.Column(db.Text)  # JSON string of features
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    analysis_duration = db.Column(db.Float)  # Time taken for analysis
    
    def __repr__(self):
        return f'<AnalysisHistory {self.id}: {self.filename}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'filename': self.filename,
            'file_size': self.file_size,
            'prediction': self.prediction,
            'probability': self.probability,
            'confidence': self.confidence,
            'status': self.status,
            'features': json.loads(self.features) if self.features else {},
            'timestamp': self.timestamp.isoformat(),
            'analysis_duration': self.analysis_duration
        }
    
    def set_features(self, features_dict):
        self.features = json.dumps(features_dict)
    
    def get_features(self):
        return json.loads(self.features) if self.features else {}

class UserSession(db.Model):
    __tablename__ = 'user_sessions'
    
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(100), unique=True, nullable=False)
    total_analyses = db.Column(db.Integer, default=0)
    healthy_count = db.Column(db.Integer, default=0)
    parkinsons_count = db.Column(db.Integer, default=0)
    first_analysis = db.Column(db.DateTime, default=datetime.utcnow)
    last_analysis = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'session_id': self.session_id,
            'total_analyses': self.total_analyses,
            'healthy_count': self.healthy_count,
            'parkinsons_count': self.parkinsons_count,
            'first_analysis': self.first_analysis.isoformat() if self.first_analysis else None,
            'last_analysis': self.last_analysis.isoformat() if self.last_analysis else None
        }