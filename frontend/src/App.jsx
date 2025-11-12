import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { PredictionProvider } from './context/PredictionContext';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import RecorderPage from './pages/RecorderPage';
import ResultsPage from './pages/ResultsPage';
import AnalysisHistory from './pages/AnalysisHistory';
import InsightsPage from './pages/InsightsPage';
import HealthTips from './components/HealthTips';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <PredictionProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
            <Navigation />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/recorder" element={<RecorderPage />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/history" element={<AnalysisHistory />} />
                <Route path="/insights" element={<InsightsPage />} />
                <Route path="/health-tips" element={<HealthTips />} />
              </Routes>
            </main>
          </div>
        </Router>
      </PredictionProvider>
    </LanguageProvider>
  );
}

export default App;