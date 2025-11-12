import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useLanguage } from '../hooks/useLanguage';
import { usePrediction } from '../hooks/usePrediction';
import { useNavigate } from 'react-router-dom';

const AnalysisHistory = () => {
  const { translate } = useLanguage();
  const { setPredictionData } = usePrediction();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchHistory();
    fetchStats();
  }, [currentPage]);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`http://localhost:5000/history?page=${currentPage}&per_page=10`);
      const data = await response.json();
      setHistory(data.history);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/history/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const deleteAnalysis = async (id) => {
    if (window.confirm(translate('history.deleteConfirm') || 'Are you sure you want to delete this analysis?')) {
      try {
        await fetch(`http://localhost:5000/history/${id}`, {
          method: 'DELETE'
        });
        fetchHistory();
        fetchStats();

        // Show success message
        alert(translate('history.deleteSuccess') || 'Analysis deleted successfully');
      } catch (error) {
        console.error('Error deleting analysis:', error);
        alert('Error deleting analysis. Please try again.');
      }
    }
  };

  const viewDetails = (record) => {
    console.log('Selected record:', record); // Debug log
    setSelectedRecord(record);
    setShowDetailsModal(true);
  };

  const navigateToResults = (record) => {
    // Helper function to safely parse features
    const parseFeatures = (features) => {
      if (!features) return {};

      // If it's already an object, return it
      if (typeof features === 'object') {
        return features;
      }

      // If it's a string, try to parse it
      if (typeof features === 'string') {
        try {
          return JSON.parse(features);
        } catch (error) {
          console.error('Error parsing features:', error);
          return {};
        }
      }

      return {};
    };

    // Convert the record to the format expected by ResultsPage
    const predictionData = {
      id: record.id,
      prediction: record.prediction,
      probability: record.probability,
      status: record.status,
      confidence: record.confidence,
      features: parseFeatures(record.features),
      analysis_duration: record.analysis_duration,
      timestamp: record.timestamp,
      filename: record.filename
    };

    setPredictionData(predictionData);
    navigate('/results');
  };

  const getStatusColor = (status) => {
    return status === "Healthy" ? 'text-green-400' : 'text-red-400';
  };

  const getStatusBgColor = (status) => {
    return status === "Healthy"
      ? 'bg-green-500/10 border-green-500/30'
      : 'bg-red-500/10 border-red-500/30';
  };

  // Helper function to safely display features
  const displayFeatures = (features) => {
    if (!features) return 'No features data available';

    try {
      // If it's already an object, stringify it
      if (typeof features === 'object') {
        return JSON.stringify(features, null, 2);
      }

      // If it's a string, try to parse and re-stringify for formatting
      if (typeof features === 'string') {
        const parsed = JSON.parse(features);
        return JSON.stringify(parsed, null, 2);
      }
    } catch (error) {
      console.error('Error displaying features:', error);
      return 'Error displaying features data';
    }

    return String(features);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-400 border-t-transparent"></div>
          <p className="text-gray-300">{translate('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 pb-8">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
              {translate('history.title')}
            </span>
          </h1>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 hover:border-purple-400/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📊</span>
              <h3 className="text-lg font-semibold text-gray-300">
                {translate('history.totalAnalyses')}
              </h3>
            </div>
            <p className="text-3xl font-bold text-blue-400">
              {stats.overall_stats?.total_analyses || 0}
            </p>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 hover:border-green-400/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">✅</span>
              <h3 className="text-lg font-semibold text-gray-300">
                {translate('history.healthyResults')}
              </h3>
            </div>
            <p className="text-3xl font-bold text-green-400">
              {stats.overall_stats?.healthy_count || 0}
            </p>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 hover:border-red-400/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">⚠️</span>
              <h3 className="text-lg font-semibold text-gray-300">
                {translate('history.parkinsonsDetected')}
              </h3>
            </div>
            <p className="text-3xl font-bold text-red-400">
              {stats.overall_stats?.parkinsons_count || 0}
            </p>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 hover:border-purple-400/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📅</span>
              <h3 className="text-lg font-semibold text-gray-300">
                {translate('history.recentAnalyses')}
              </h3>
            </div>
            <p className="text-3xl font-bold text-purple-400">
              {stats.overall_stats?.recent_analyses || 0}
            </p>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-600/50 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-600/50">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="text-2xl">📋</span>
              Analysis Records
            </h2>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎤</div>
              <p className="text-gray-400 text-lg mb-4">
                {translate('history.noHistory')}
              </p>
              <button
                onClick={() => navigate('/recorder')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105"
              >
                {translate('recorder.startRecording')}
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-600/50">
                <thead className="bg-slate-700/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      {translate('history.fileName')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      {translate('history.result')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Confidence
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      {translate('history.date')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      {translate('history.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-slate-800/10 divide-y divide-slate-600/30">
                  {history.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-700/20 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <div>
                          <div className="font-medium text-white">{record.filename}</div>
                          <div className="text-gray-400 text-xs">
                            {record.file_size ? (record.file_size / 1024).toFixed(1) + ' KB' : 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBgColor(record.status)}`}>
                          <span className={`w-2 h-2 rounded-full mr-2 ${record.status === 'Healthy' ? 'bg-green-400' : 'bg-red-400'}`}></span>
                          <span className={getStatusColor(record.status)}>
                            {record.status}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <div className="flex items-center">
                          <div className="w-16 bg-slate-600 rounded-full h-2 mr-3">
                            <div
                              className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full"
                              style={{ width: `${parseFloat(record.confidence || 0)}%` }}
                            ></div>
                          </div>
                          <span className="font-medium">{record.confidence || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        <div>
                          <div className="text-gray-300">{new Date(record.timestamp).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(record.timestamp), { addSuffix: true })}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-600/30 text-xs">
                          ⏱️ {record.analysis_duration ? record.analysis_duration.toFixed(2) + 's' : 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewDetails(record)}
                            className="inline-flex items-center px-3 py-1 border border-blue-400/50 text-blue-400 rounded-md hover:bg-blue-400/10 transition-colors duration-200 text-xs"
                          >
                            <span className="mr-1">👁️</span>
                            {translate('history.viewDetails')}
                          </button>
                          <button
                            onClick={() => navigateToResults(record)}
                            className="inline-flex items-center px-3 py-1 border border-purple-400/50 text-purple-400 rounded-md hover:bg-purple-400/10 transition-colors duration-200 text-xs"
                          >
                            <span className="mr-1">📊</span>
                            Results
                          </button>
                          <button
                            onClick={() => deleteAnalysis(record.id)}
                            className="inline-flex items-center px-3 py-1 border border-red-400/50 text-red-400 rounded-md hover:bg-red-400/10 transition-colors duration-200 text-xs"
                          >
                            <span className="mr-1">🗑️</span>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="px-6 py-4 flex items-center justify-between border-t border-slate-600/50">
              <div className="text-sm text-gray-400">
                Showing {translate('history.page')} {pagination.page} {translate('history.of')} {pagination.pages}
                ({pagination.total} {translate('history.totalResults')})
              </div>
              <div className="flex space-x-2">
                <button
                  disabled={!pagination.has_prev}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="px-4 py-2 border border-slate-600/50 rounded-lg text-gray-300 hover:bg-slate-700/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {translate('common.previous')}
                </button>
                <button
                  disabled={!pagination.has_next}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="px-4 py-2 border border-slate-600/50 rounded-lg text-gray-300 hover:bg-slate-700/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {translate('common.next')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedRecord && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-600 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Analysis Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm">File Name</label>
                    <p className="text-white font-medium">{selectedRecord.filename || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">File Size</label>
                    <p className="text-white">
                      {selectedRecord.file_size ? (selectedRecord.file_size / 1024).toFixed(1) + ' KB' : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Prediction</label>
                    <p className={`font-medium ${getStatusColor(selectedRecord.status)}`}>
                      {selectedRecord.status || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Confidence</label>
                    <p className="text-white">{selectedRecord.confidence || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Analysis Duration</label>
                    <p className="text-white">
                      {selectedRecord.analysis_duration ? selectedRecord.analysis_duration.toFixed(2) + 's' : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Date</label>
                    <p className="text-white">{new Date(selectedRecord.timestamp).toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-sm block mb-2">Voice Features</label>
                  <div className="bg-slate-700/30 rounded-lg p-4 max-h-40 overflow-y-auto">
                    <pre className="text-gray-300 text-xs whitespace-pre-wrap">
                      {displayFeatures(selectedRecord.features)}
                    </pre>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => {
                      navigateToResults(selectedRecord);
                      setShowDetailsModal(false);
                    }}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
                  >
                    View Full Results
                  </button>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-6 py-3 border border-slate-600 text-gray-300 rounded-xl hover:bg-slate-700/30 transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisHistory;