import React, { useState, useEffect } from 'react';
import QueryForm from '../components/QueryForm';
import ExplainPanel from '../components/ExplainPanel';
import LogsTable from '../components/LogsTable';
import { QueryResponse, LogEntry } from '../types';
import { analyzeQuery, fetchLogs } from '../lib/api';
import { sanitizeFileName } from '../lib/sanitize';

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentResponse, setCurrentResponse] = useState<QueryResponse | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [totalBlocked, setTotalBlocked] = useState(0);
  const [totalAllowed, setTotalAllowed] = useState(0);

  // Fetch logs on mount
  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const fetchedLogs = await fetchLogs(20);
      setLogs(fetchedLogs);
      
      // Calculate stats
      const blocked = fetchedLogs.filter(log => log.decision === 'blocked').length;
      const allowed = fetchedLogs.filter(log => log.decision === 'allowed').length;
      setTotalBlocked(blocked);
      setTotalAllowed(allowed);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    }
  };

  const handleQuerySubmit = async (query: string, options?: { privacyNoise?: boolean }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await analyzeQuery(query, options);
      setCurrentResponse(response);
      
      // Refresh logs after query
      await loadLogs();
    } catch (err: any) {
      setError(err.message || 'Failed to analyze query. Please try again.');
      setCurrentResponse(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCsv = () => {
    if (logs.length === 0) {
      alert('No logs to export');
      return;
    }

    // Generate CSV content
    const headers = ['Timestamp', 'Query', 'Decision', 'Confidence', 'Rules'];
    const rows = logs.map(log => [
      log.timestamp,
      `"${log.query.replace(/"/g, '""')}"`, // Escape quotes
      log.decision,
      log.classifier_prob.toFixed(4),
      `"${log.rule_matches.join(', ')}"`,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', sanitizeFileName(`medical_query_logs_${Date.now()}.csv`));
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Check if Gemini API key is configured
  const geminiApiKey = import.meta.env.REACT_APP_GEMINI_API_KEY || '';
  const isGeminiConfigured = geminiApiKey && geminiApiKey !== 'your_gemini_api_key_here';

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* API Configuration Banner */}
      {!isGeminiConfigured && (
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-cyber-purple/20 to-cyber-magenta/20 border border-cyber-purple/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-cyber-purple flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-1">📡 Mock Mode Active</h3>
              <p className="text-gray-300 text-sm mb-2">
                You're seeing simulated responses. For real AI-powered analysis, configure your Gemini API key.
              </p>
              <div className="flex flex-wrap gap-2">
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs bg-cyber-purple hover:bg-cyber-purple/80 text-white px-3 py-1 rounded transition-colors"
                >
                  Get Free API Key →
                </a>
                <a 
                  href="/GEMINI_SETUP.md" 
                  target="_blank"
                  className="text-xs bg-cyber-teal/20 hover:bg-cyber-teal/30 text-cyber-teal px-3 py-1 rounded border border-cyber-teal/50 transition-colors"
                >
                  Setup Guide
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-teal to-cyber-blue rounded-xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative bg-cyber-gray/40 backdrop-blur-sm border-2 border-cyber-teal/50 rounded-xl p-6 text-center hover:border-cyber-teal transition-all hover:shadow-[0_0_25px_rgba(20,184,166,0.3)]">
            <p className="text-base text-cyber-light mb-2 font-semibold">Total Queries</p>
            <p className="text-4xl font-bold text-cyber-teal neon-text">{logs.length}</p>
          </div>
        </div>
        
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative bg-cyber-gray/40 backdrop-blur-sm border-2 border-red-500/50 rounded-xl p-6 text-center hover:border-red-500 transition-all hover:shadow-[0_0_25px_rgba(239,68,68,0.3)]">
            <p className="text-base text-cyber-light mb-2 font-semibold">Threats Blocked</p>
            <p className="text-4xl font-bold text-red-400 neon-text">{totalBlocked}</p>
          </div>
        </div>
        
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative bg-cyber-gray/40 backdrop-blur-sm border-2 border-green-500/50 rounded-xl p-6 text-center hover:border-green-500 transition-all hover:shadow-[0_0_25px_rgba(34,197,94,0.3)]">
            <p className="text-base text-cyber-light mb-2 font-semibold">Safe Queries</p>
            <p className="text-4xl font-bold text-green-400 neon-text">{totalAllowed}</p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center space-y-5 mb-10">
        <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-teal via-cyber-purple to-cyber-magenta drop-shadow-[0_0_20px_rgba(0,229,196,0.5)] tracking-tight">
          Secure Medical Query Analysis
        </h2>
        <p className="text-cyber-light max-w-2xl mx-auto text-lg leading-relaxed">
          Submit your medical queries for secure processing. Our AI firewall ensures safety, 
          compliance, and privacy protection for all medical information requests.
        </p>
      </div>

      {/* Query Form */}
      <div className="max-w-4xl mx-auto">
        <QueryForm 
          onSubmit={handleQuerySubmit}
          isLoading={isLoading}
          error={error}
        />
      </div>

      {/* Response Panel */}
      {currentResponse && (
        <div className="max-w-4xl mx-auto" role="region" aria-label="Query results">
          <ExplainPanel response={currentResponse} />
        </div>
      )}

      {/* Logs Section */}
      <div className="max-w-6xl mx-auto">
        <LogsTable logs={logs} onExportCsv={handleExportCsv} />
      </div>

      {/* Info Cards */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-cyber-gray/20 backdrop-blur-sm border border-cyber-teal/30 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-2">
            <svg className="w-6 h-6 text-cyber-teal" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <h4 className="font-semibold text-cyber-teal">Secure</h4>
          </div>
          <p className="text-sm text-cyber-light">
            End-to-end encryption with client-side input sanitization and server-side validation
          </p>
        </div>

        <div className="bg-cyber-gray/20 backdrop-blur-sm border border-cyber-magenta/30 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-2">
            <svg className="w-6 h-6 text-cyber-magenta" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            <h4 className="font-semibold text-cyber-magenta">Compliant</h4>
          </div>
          <p className="text-sm text-cyber-light">
            HIPAA-ready architecture with audit logging and access controls
          </p>
        </div>

        <div className="bg-cyber-gray/20 backdrop-blur-sm border border-cyber-purple/30 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-2">
            <svg className="w-6 h-6 text-cyber-purple" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            <h4 className="font-semibold text-cyber-purple">Transparent</h4>
          </div>
          <p className="text-sm text-cyber-light">
            Full explainability with rule matching and confidence scores
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;