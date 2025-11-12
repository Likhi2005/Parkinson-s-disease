import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PredictionProvider } from './context/PredictionContext';
import { LanguageProvider } from './context/LanguageContext';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import RecorderPage from './pages/RecorderPage';
import ResultsPage from './pages/ResultsPage';
import InsightsPage from './pages/InsightsPage';

function App() {
  return (
    <LanguageProvider>
      <PredictionProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
            <Navigation />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/recorder" element={<RecorderPage />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/insights" element={<InsightsPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </PredictionProvider>
    </LanguageProvider>
  );
}

export default App;