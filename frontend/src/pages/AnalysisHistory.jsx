import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

const AnalysisHistory = () => {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

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
    if (window.confirm('Are you sure you want to delete this analysis?')) {
      try {
        await fetch(`http://localhost:5000/history/${id}`, {
          method: 'DELETE'
        });
        fetchHistory();
        fetchStats();
      } catch (error) {
        console.error('Error deleting analysis:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    return status === "Healthy" ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-green-600">Analysis History</h1>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Analyses</h3>
          <p className="text-2xl font-bold text-blue-600">
            {stats.overall_stats?.total_analyses || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Healthy Results</h3>
          <p className="text-2xl font-bold text-green-600">
            {stats.overall_stats?.healthy_count || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Parkinson's Detected</h3>
          <p className="text-2xl font-bold text-red-600">
            {stats.overall_stats?.parkinsons_count || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Recent (30 days)</h3>
          <p className="text-2xl font-bold text-purple-600">
            {stats.overall_stats?.recent_analyses || 0}
          </p>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Analysis Records</h2>
        </div>
        
        {history.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No analysis history found. Start by recording your voice!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Result
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confidence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{record.filename}</div>
                        <div className="text-gray-500">
                          {(record.file_size / 1024).toFixed(1)} KB
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`font-medium ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.confidence}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div>{new Date(record.timestamp).toLocaleDateString()}</div>
                        <div className="text-xs">
                          {formatDistanceToNow(new Date(record.timestamp), { addSuffix: true })}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.analysis_duration?.toFixed(2)}s
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => deleteAnalysis(record.id)}
                        className="text-red-600 hover:text-red-900 mr-2"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => window.open(`/analysis/${record.id}`, '_blank')}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing page {pagination.page} of {pagination.pages} 
              ({pagination.total} total results)
            </div>
            <div className="flex space-x-2">
              <button
                disabled={!pagination.has_prev}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                disabled={!pagination.has_next}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed">
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisHistory;