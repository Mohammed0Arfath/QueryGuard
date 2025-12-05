import React, { useState, useCallback } from 'react';
import { QueryFormProps } from '../types';
import { validateQueryLength, checkRateLimit, debounce } from '../utils/security';

const QueryForm: React.FC<QueryFormProps> = ({ onSubmit, isLoading, error }) => {
  const [query, setQuery] = useState('');
  const [privacyNoise, setPrivacyNoise] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Debounced validation
  const debouncedValidation = useCallback(
    debounce((value: string) => {
      const validation = validateQueryLength(value);
      setValidationError(validation.valid ? null : validation.error || null);
    }, 300),
    []
  );

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedValidation(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setValidationError('Please enter a query');
      return;
    }

    // Client-side validation
    const validation = validateQueryLength(query);
    if (!validation.valid) {
      setValidationError(validation.error || 'Invalid query');
      return;
    }

    // Check rate limit
    const rateLimitCheck = checkRateLimit();
    if (!rateLimitCheck.allowed) {
      setValidationError(
        `Rate limit exceeded. Please wait ${Math.ceil((rateLimitCheck.resetTime || 0) / 1000)} seconds.`
      );
      return;
    }

    setValidationError(null);
    await onSubmit(query, { privacyNoise });
  };

  return (
    <div className="relative futuristic-card bg-cyber-gray/30 backdrop-blur-sm border-2 border-cyber-teal/40 rounded-xl p-8 hover:border-cyber-teal/60 transition-all shadow-[0_0_30px_rgba(20,184,166,0.1)]">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label 
            htmlFor="medical-query" 
            className="block text-lg font-semibold text-cyber-teal mb-3 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            Medical Query
          </label>
          <textarea
            id="medical-query"
            value={query}
            onChange={handleQueryChange}
            placeholder="Enter your medical question here...&#10;&#10;Examples:&#10;• What are the symptoms of diabetes?&#10;• How is hypertension treated?&#10;• Side effects of aspirin"
            className="w-full h-36 bg-cyber-darker/80 border-2 border-cyber-gray focus:border-cyber-teal rounded-xl px-5 py-4 text-white text-base placeholder-cyber-light focus-outline resize-none transition-all hover:border-cyber-gray/70 shadow-inner"
            disabled={isLoading}
            maxLength={1000}
            aria-describedby={validationError ? "query-error" : "query-help"}
          />
          <div className="flex justify-between items-center mt-3">
            <p id="query-help" className="text-sm text-cyber-light">
              Max 1000 characters. Content is sanitized and logged.
            </p>
            <span className={`text-sm font-semibold ${query.length > 900 ? 'text-cyber-magenta' : 'text-cyber-light'}`}>
              {query.length}/1000
            </span>
          </div>
        </div>

        {/* Privacy noise toggle */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="privacy-noise"
            checked={privacyNoise}
            onChange={(e) => setPrivacyNoise(e.target.checked)}
            className="w-4 h-4 text-cyber-teal bg-cyber-darker border border-cyber-gray rounded focus:ring-cyber-teal focus:ring-2"
            disabled={isLoading}
          />
          <label htmlFor="privacy-noise" className="text-sm text-cyber-light">
            Enable privacy noise (experimental)
          </label>
          <div className="group relative">
            <svg 
              className="w-4 h-4 text-cyber-light hover:text-cyber-teal cursor-help" 
              fill="currentColor" 
              viewBox="0 0 20 20"
              aria-label="Privacy noise information"
            >
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-cyber-darker border border-cyber-teal/50 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
              Adds differential privacy to your query
            </div>
          </div>
        </div>

        {/* Error display */}
        {(validationError || error) && (
          <div 
            id="query-error" 
            className="p-4 bg-red-500/20 border-2 border-red-500/50 rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.2)]"
            role="alert"
            aria-live="polite"
          >
            <p className="text-base text-red-300 font-semibold flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {validationError || error}
            </p>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading || !!validationError || !query.trim()}
          className={`
            w-full py-4 px-8 rounded-xl text-lg font-bold transition-all duration-300 focus-outline
            ${isLoading || !!validationError || !query.trim()
              ? 'bg-cyber-gray text-cyber-light cursor-not-allowed opacity-60' 
              : 'bg-gradient-to-r from-cyber-teal via-cyber-blue to-cyber-purple text-white hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] hover:scale-[1.02] active:scale-[0.98]'
            }
          `}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-3">
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing Query...</span>
            </div>
          ) : (
            <span className="flex items-center justify-center">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Analyze Query
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

export default QueryForm;