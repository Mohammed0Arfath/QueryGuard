import React from 'react';
import { LogsTableProps } from '../types';

const LogsTable: React.FC<LogsTableProps> = ({ logs, onExportCsv }) => {
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
    <div className="bg-cyber-gray/20 backdrop-blur-sm border border-cyber-teal/30 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-cyber-teal">Recent Activity</h3>
        <button
          onClick={onExportCsv}
          className="px-4 py-2 bg-cyber-darker hover:bg-cyber-gray border border-cyber-teal/50 rounded-lg text-sm text-cyber-teal transition-colors focus-outline flex items-center space-x-2"
          aria-label="Export logs to CSV"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          <span>Export CSV</span>
        </button>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-cyber-light/50 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm6 6H7v2h6v-2z" clipRule="evenodd" />
          </svg>
          <p className="text-cyber-light text-lg mb-2">No query logs yet</p>
          <p className="text-cyber-light/70 text-sm">Submit a query above to see your activity history here</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cyber-gray">
                <th className="text-left py-3 px-2 text-cyber-light font-medium">Time</th>
                <th className="text-left py-3 px-2 text-cyber-light font-medium">Query</th>
                <th className="text-center py-3 px-2 text-cyber-light font-medium">Decision</th>
                <th className="text-center py-3 px-2 text-cyber-light font-medium">Confidence</th>
                <th className="text-left py-3 px-2 text-cyber-light font-medium">Rules</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr 
                  key={log.id}
                  className={`
                    border-b border-cyber-gray/30 hover:bg-cyber-gray/20 transition-colors
                    ${index === 0 ? 'bg-cyber-gray/10' : ''}
                  `}
                >
                  <td className="py-3 px-2 text-cyber-light font-mono text-xs whitespace-nowrap">
                    {formatTimestamp(log.timestamp)}
                  </td>
                  <td className="py-3 px-2 text-white">
                    <span className="block max-w-xs" title={log.query}>
                      {truncateText(log.query)}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className={`
                      inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                      ${log.decision === 'allowed' 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/50' 
                        : 'bg-red-500/20 text-red-300 border border-red-500/50'
                      }
                    `}>
                      {log.decision === 'allowed' ? (
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {log.decision}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className="font-mono text-white">
                      {(log.classifier_prob * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex flex-wrap gap-1">
                      {log.rule_matches.slice(0, 2).map((rule, ruleIndex) => (
                        <span 
                          key={ruleIndex}
                          className="text-xs font-mono bg-cyber-darker px-2 py-1 rounded text-cyber-teal"
                          title={rule}
                        >
                          {truncateText(rule, 20)}
                        </span>
                      ))}
                      {log.rule_matches.length > 2 && (
                        <span className="text-xs text-cyber-light">
                          +{log.rule_matches.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {logs.length > 0 && (
        <div className="mt-4 text-xs text-cyber-light text-right">
          Showing {logs.length} {logs.length === 1 ? 'entry' : 'entries'}
        </div>
      )}
    </div>
  );
};

export default LogsTable;