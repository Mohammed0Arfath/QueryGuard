import React, { useState, useEffect } from 'react';
import AdminPanel from '../components/AdminPanel';
import { LogEntry } from '../types';
import { fetchLogs } from '../lib/api';
import { logDB } from '../lib/database';

const Admin: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [logCount, setLogCount] = useState(0);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const fetchedLogs = await fetchLogs(100); // Fetch more for analytics
      setLogs(fetchedLogs);
      
      // Get total count
      const count = await logDB.getLogCount();
      setLogCount(count);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearLogs = async () => {
    if (!confirm('Are you sure you want to clear all logs? This cannot be undone.')) {
      return;
    }
    
    try {
      await logDB.clearAllLogs();
      await loadLogs();
      alert('All logs cleared successfully!');
    } catch (err) {
      console.error('Failed to clear logs:', err);
      alert('Failed to clear logs. Check console for details.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-purple to-cyber-magenta drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            Metrics Dashboard
          </h2>
          <p className="text-cyber-light mt-3 text-lg">
            Real-time analytics and system monitoring • {logCount} total logs
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleClearLogs}
            disabled={isLoading || logCount === 0}
            className="px-5 py-2.5 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 rounded-lg text-red-300 font-semibold text-base transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] focus-outline flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Clear all logs from database"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>Clear Logs</span>
          </button>
          
          <button
            onClick={loadLogs}
            disabled={isLoading}
            className="px-5 py-2.5 bg-cyber-purple hover:bg-cyber-purple/80 rounded-lg text-white font-semibold text-base transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] focus-outline flex items-center space-x-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Loading...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                <span>Refresh</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Admin Panel */}
      {isLoading && logs.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-cyber-purple border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-cyber-light">Loading analytics...</p>
          </div>
        </div>
      ) : (
        <AdminPanel logs={logs} />
      )}

      {/* System Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-cyber-gray/20 backdrop-blur-sm border border-cyber-teal/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-cyber-teal mb-4">System Configuration</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-cyber-light">Environment:</span>
              <span className="text-white font-mono">
                {import.meta.env.MODE || 'production'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyber-light">API Endpoint:</span>
              <span className="text-white font-mono text-xs">
                {import.meta.env.REACT_APP_API_BASE || 'localhost:8000'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyber-light">Max Query Length:</span>
              <span className="text-white font-mono">1000 chars</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyber-light">Rate Limit:</span>
              <span className="text-white font-mono">20 req/min</span>
            </div>
          </div>
        </div>

        <div className="bg-cyber-gray/20 backdrop-blur-sm border border-cyber-magenta/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-cyber-magenta mb-4">Security Features</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start space-x-2">
              <svg className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-cyber-light">Client-side input sanitization</span>
            </div>
            <div className="flex items-start space-x-2">
              <svg className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-cyber-light">Rate limiting & debouncing</span>
            </div>
            <div className="flex items-start space-x-2">
              <svg className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-cyber-light">Content Security Policy</span>
            </div>
            <div className="flex items-start space-x-2">
              <svg className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-cyber-light">No embedded secrets</span>
            </div>
            <div className="flex items-start space-x-2">
              <svg className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-cyber-light">HTML content escaping</span>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Notice */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-6 h-6 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-yellow-300 font-semibold mb-1">Security Reminder</h4>
            <p className="text-yellow-200/80 text-sm">
              This admin panel is read-only. All security policies must be enforced server-side. 
              Never trust client-side validation or rely on frontend security mechanisms alone. 
              Implement proper authentication, authorization, and server-side rate limiting in production.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;