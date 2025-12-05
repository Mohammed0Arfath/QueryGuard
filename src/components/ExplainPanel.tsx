import React, { useState } from 'react';
import { ExplainPanelProps } from '../types';
import { sanitizeHtml, escapeHtml } from '../lib/sanitize';

// Helper to format response text with markdown-style rendering
const formatResponse = (text: string): string => {
  if (!text) return '';
  
  // Convert markdown-style formatting to HTML
  let formatted = text
    // Headers
    .replace(/^### (.*?)$/gm, '<h3 class="text-lg font-bold text-cyber-cyan mt-4 mb-2">$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2 class="text-xl font-bold text-cyber-cyan mt-5 mb-3">$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-bold text-cyber-cyan mt-6 mb-4">$1</h1>')
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-cyber-teal">$1</strong>')
    // Italic text
    .replace(/\*(.*?)\*/g, '<em class="italic text-cyber-light">$1</em>')
    // Bullet points
    .replace(/^\s*[•\*-]\s+(.*)$/gm, '<li class="ml-4 mb-1 text-white">$1</li>')
    // Numbered lists
    .replace(/^\s*(\d+)\.\s+(.*)$/gm, '<li class="ml-4 mb-1 text-white" value="$1">$2</li>')
    // Line breaks
    .replace(/\n\n/g, '</p><p class="mb-3 text-white leading-relaxed">')
    .replace(/\n/g, '<br/>');
  
  // Wrap lists in ul/ol tags
  formatted = formatted.replace(/(<li[^>]*>.*?<\/li>)+/gs, (match) => {
    if (match.includes('value=')) {
      return `<ol class="list-decimal space-y-1 my-3">${match}</ol>`;
    }
    return `<ul class="list-disc space-y-1 my-3">${match}</ul>`;
  });
  
  // Wrap in paragraph if not already
  if (!formatted.startsWith('<')) {
    formatted = `<p class="mb-3 text-white leading-relaxed">${formatted}</p>`;
  }
  
  return formatted;
};

const ExplainPanel: React.FC<ExplainPanelProps> = ({ response, onShowRawContent }) => {
  const [showRawHtml, setShowRawHtml] = useState(false);
  const [showEscalationModal, setShowEscalationModal] = useState(false);
  const [escalationReason, setEscalationReason] = useState('');

  if (!response) {
    return null;
  }

  const { decision, classifier_prob, rule_matches, llm_response, explanation } = response;
  const isBlocked = decision === 'blocked';

  const handleShowRaw = (show: boolean) => {
    setShowRawHtml(show);
    onShowRawContent?.(show);
  };

  const handleEscalation = () => {
    // Mock escalation - in production, call API
    console.log('Escalation request:', escalationReason);
    alert('Escalation request submitted. ID: escalation_' + Date.now());
    setShowEscalationModal(false);
    setEscalationReason('');
  };

  return (
    <div className="space-y-4">
      {/* Decision Card */}
      <div 
        className={`
          backdrop-blur-sm border rounded-lg p-6
          ${isBlocked 
            ? 'bg-red-500/10 border-red-500/50' 
            : 'bg-green-500/10 border-green-500/50'
          }
        `}
        role="alert"
        aria-live="polite"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center
              ${isBlocked ? 'bg-red-500/20' : 'bg-green-500/20'}
            `}>
              {isBlocked ? (
                <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div>
              <h3 className={`text-lg font-bold ${isBlocked ? 'text-red-300' : 'text-green-300'}`}>
                Query {decision.toUpperCase()}
              </h3>
              <p className="text-sm text-cyber-light">
                Confidence: {(classifier_prob * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          {isBlocked && (
            <button
              onClick={() => setShowEscalationModal(true)}
              className="px-4 py-2 bg-cyber-magenta/20 hover:bg-cyber-magenta/30 border border-cyber-magenta/50 rounded-lg text-sm text-cyber-magenta transition-colors focus-outline"
            >
              Request Review
            </button>
          )}
        </div>

        {explanation && (
          <p className="text-white mb-4">{explanation}</p>
        )}

        {isBlocked && (
          <div className="bg-cyber-darker/50 rounded-lg p-4 border border-red-500/30">
            <p className="text-sm text-red-300 mb-2">
              This query has been blocked for your safety. If you believe this is incorrect, please request a human review.
            </p>
          </div>
        )}
      </div>

      {/* LLM Response (if allowed) */}
      {!isBlocked && llm_response && (
        <div className="bg-gradient-to-br from-cyber-gray/30 to-cyber-gray/10 backdrop-blur-sm border border-cyber-teal/40 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-cyber-teal/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-cyber-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-cyber-teal">Response</h4>
            </div>
            <label className="flex items-center space-x-2 text-sm text-cyber-light hover:text-white transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={showRawHtml}
                onChange={(e) => handleShowRaw(e.target.checked)}
                className="w-4 h-4 text-cyber-teal bg-cyber-darker border border-cyber-gray rounded focus:ring-cyber-teal focus:ring-2"
              />
              <span>Show raw HTML</span>
            </label>
          </div>
          
          <div className="bg-cyber-darker/30 rounded-lg p-5 border border-cyber-teal/20">
            {showRawHtml ? (
              <pre className="bg-cyber-darker/80 p-4 rounded-lg text-xs overflow-x-auto border border-cyber-gray/30">
                <code className="text-cyber-light font-mono">{escapeHtml(llm_response)}</code>
              </pre>
            ) : (
              <div 
                className="prose prose-invert prose-cyan max-w-none text-sm"
                dangerouslySetInnerHTML={{ 
                  __html: sanitizeHtml(formatResponse(llm_response), { allowBasicFormatting: true }) 
                }}
                style={{
                  lineHeight: '1.8',
                  fontSize: '0.95rem'
                }}
              />
            )}
          </div>
          
          {/* Disclaimer */}
          <div className="mt-4 flex items-start space-x-2 text-xs text-cyber-light/70 italic">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p>AI-generated response. Always consult healthcare professionals for medical advice.</p>
          </div>
        </div>
      )}

      {/* Explainability Panel */}
      <div className="bg-cyber-gray/20 backdrop-blur-sm border border-cyber-purple/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-cyber-purple mb-4">
          Explainability & Provenance
        </h4>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-cyber-light block mb-2">
              Classifier Score
            </label>
            <div className="flex items-center space-x-3">
              <div className="flex-1 h-3 bg-cyber-darker rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    isBlocked ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-green-500 to-green-600'
                  }`}
                  style={{ width: `${classifier_prob * 100}%` }}
                  role="progressbar"
                  aria-valuenow={classifier_prob * 100}
                  aria-valuemin={0}
                  aria-valuemax={100}
                ></div>
              </div>
              <span className="text-sm font-mono text-white w-12">
                {(classifier_prob * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-cyber-light block mb-2">
              Matched Rules ({rule_matches.length})
            </label>
            <div className="space-y-2">
              {rule_matches.length > 0 ? (
                rule_matches.map((rule, index) => (
                  <div 
                    key={index}
                    className="flex items-center space-x-2 bg-cyber-darker/50 px-3 py-2 rounded-lg"
                  >
                    <span className="text-xs font-mono text-cyber-teal">•</span>
                    <span className="text-sm text-white font-mono">{rule}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-cyber-light italic">No specific rules matched</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Escalation Modal */}
      {showEscalationModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-cyber-gray border border-cyber-magenta rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-cyber-magenta mb-4">
              Request Human Review
            </h3>
            <p className="text-sm text-cyber-light mb-4">
              Please provide a reason for requesting human review of this blocked query.
            </p>
            <textarea
              value={escalationReason}
              onChange={(e) => setEscalationReason(e.target.value)}
              placeholder="Explain why you believe this query should be allowed..."
              className="w-full h-24 bg-cyber-darker border border-cyber-gray focus:border-cyber-magenta rounded-lg px-4 py-3 text-white placeholder-cyber-light focus-outline resize-none mb-4"
              maxLength={500}
            />
            <div className="flex space-x-3">
              <button
                onClick={handleEscalation}
                disabled={!escalationReason.trim()}
                className="flex-1 py-2 px-4 bg-cyber-magenta hover:bg-cyber-magenta/80 rounded-lg text-white font-medium transition-colors focus-outline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit
              </button>
              <button
                onClick={() => setShowEscalationModal(false)}
                className="flex-1 py-2 px-4 bg-cyber-darker hover:bg-cyber-gray border border-cyber-gray rounded-lg text-white font-medium transition-colors focus-outline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExplainPanel;