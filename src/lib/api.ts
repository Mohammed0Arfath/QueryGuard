import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { QueryResponse, LogEntry, QueryOptions, ApiError } from '../types';
import { buildSecureHeaders } from '../utils/security';
import { sanitizeQuery } from './sanitize';
import { getEnv } from '../utils/env';
import { logDB, getSessionId, getUserId, StoredLogEntry } from './database';

// Example backend API responses for reference:
/*
POST /api/query
Request: { "query": "What is diabetes?", "options": { "privacyNoise": false } }
Response: {
  "decision": "allowed",
  "classifier_prob": 0.95,
  "rule_matches": ["medical_info_allowed"],
  "llm_response": "Diabetes is a chronic condition...",
  "explanation": "Query classified as medical information request"
}

GET /api/logs
Response: {
  "logs": [
    {
      "id": "log_123",
      "timestamp": "2024-12-05T10:30:00Z",
      "query": "What is diabetes?",
      "decision": "allowed",
      "classifier_prob": 0.95,
      "rule_matches": ["medical_info_allowed"],
      "user_id": "user_456",
      "session_id": "session_789"
    }
  ]
}
*/

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    // Use environment variable for API base URL
    // Set REACT_APP_API_BASE=http://localhost:8000 for local development
    this.baseURL = getEnv('REACT_APP_API_BASE', 'http://localhost:8000');
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: buildSecureHeaders(),
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const apiError: ApiError = {
          message: error.response?.data?.message || error.message || 'Network error',
          code: error.response?.status || error.code,
          details: error.response?.data,
        };
        
        console.error('API Error:', apiError);
        return Promise.reject(apiError);
      }
    );
  }

  // Analyze a medical query through the firewall
  async analyzeQuery(query: string, options?: QueryOptions): Promise<QueryResponse> {
    // Client-side sanitization (server must validate too!)
    const sanitizedQuery = sanitizeQuery(query);
    
    let response: QueryResponse;
    
    // Use backend API (primary method)
    const requestData = {
      query: sanitizedQuery,
      options: {
        privacyNoise: options?.privacyNoise || false,
        maxRetries: options?.maxRetries || 1,
        user_id: getUserId(),
        session_id: getSessionId(),
      },
    };

    try {
      console.log('🔵 Attempting backend API call to:', `${this.baseURL}/api/query`);
      console.log('🔵 Request data:', requestData);
      const apiResponse: AxiosResponse<QueryResponse> = await this.client.post('/api/query', requestData);
      console.log('✅ Backend API success:', apiResponse.data);
      response = apiResponse.data;
    } catch (error: any) {
      console.error('🔴 Backend API error:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      // Check if Gemini API key is available as fallback
      const geminiApiKey = getEnv('REACT_APP_GEMINI_API_KEY', '');
      console.log('🔄 Checking Gemini fallback. API key configured:', !!geminiApiKey && geminiApiKey !== 'your_gemini_api_key_here');
      
      if (geminiApiKey && geminiApiKey !== 'your_gemini_api_key_here') {
        console.log('🟡 Using Gemini API fallback');
        try {
          response = await this.analyzeWithGemini(sanitizedQuery, options, geminiApiKey);
          console.log('✅ Gemini API fallback success');
        } catch (geminiError) {
          console.error('❌ Gemini API fallback also failed:', geminiError);
          console.warn('🔴 Using mock response as final fallback');
          response = this.getMockResponse(sanitizedQuery);
        }
      } else {
        // Final fallback to mock response
        console.warn('🔴 Using mock response fallback (no API keys available)');
        response = this.getMockResponse(sanitizedQuery);
      }
    }

    // Save to local database
    try {
      await this.saveLogToDatabase(sanitizedQuery, response);
    } catch (error) {
      console.error('Failed to save log to database:', error);
    }

    return response;
  }

  // Save query log to IndexedDB
  private async saveLogToDatabase(query: string, response: QueryResponse): Promise<void> {
    const logEntry: StoredLogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      query,
      decision: response.decision,
      classifier_prob: response.classifier_prob,
      rule_matches: response.rule_matches,
      user_id: getUserId(),
      session_id: getSessionId(),
      llm_response: response.llm_response,
      explanation: response.explanation,
    };

    await logDB.addLog(logEntry);
    console.log('Log saved to database:', logEntry.id);
  }

  // Analyze query using Google Gemini API
  private async analyzeWithGemini(query: string, options: QueryOptions | undefined, apiKey: string): Promise<QueryResponse> {
    try {
      // Construct the firewall analysis prompt
      const systemPrompt = `You are a medical query firewall AI. Analyze the following query for:
1. Medical relevance and appropriateness
2. Potential security risks or malicious intent
3. Privacy concerns
4. Compliance with medical information guidelines

Provide a structured response with:
- decision: "allowed" or "blocked"
- confidence: 0.0 to 1.0
- reasoning: brief explanation
- response: if allowed, provide a helpful medical information response; if blocked, explain why

Query: "${query}"`;

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`;
      
      const response = await axios.post(geminiUrl, {
        contents: [{
          parts: [{
            text: systemPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      });

      const geminiResponse = response.data.candidates[0].content.parts[0].text;
      
      // Parse Gemini response
      const decision = geminiResponse.toLowerCase().includes('blocked') ? 'blocked' : 'allowed';
      const isBlocked = decision === 'blocked';
      
      // Extract confidence if present, otherwise estimate
      let confidence = 0.85;
      const confMatch = geminiResponse.match(/confidence[:\s]+([0-9.]+)/i);
      if (confMatch) {
        confidence = parseFloat(confMatch[1]);
      }

      return {
        decision,
        classifier_prob: confidence,
        rule_matches: isBlocked ? ['ai_safety_filter', 'policy_violation'] : ['medical_query_approved'],
        llm_response: geminiResponse,
        explanation: `AI-powered analysis ${options?.privacyNoise ? 'with privacy noise applied' : ''}`,
      };
    } catch (error: any) {
      console.error('Gemini API error:', error);
      
      // Check for API key issues
      if (error.response?.status === 400 || error.response?.status === 403) {
        throw {
          message: 'Invalid Gemini API key. Please check your REACT_APP_GEMINI_API_KEY in .env file.',
          code: 'INVALID_API_KEY',
        } as ApiError;
      }
      
      throw {
        message: 'Failed to analyze query with Gemini API: ' + (error.message || 'Unknown error'),
        code: error.code,
      } as ApiError;
    }
  }

  // Generate mock response for demo/fallback
  private getMockResponse(query: string): QueryResponse {
    const lowerQuery = query.toLowerCase();
    
    // Simple keyword-based classification
    const maliciousKeywords = ['hack', 'exploit', 'steal', 'breach', 'password', 'crack'];
    const isMalicious = maliciousKeywords.some(kw => lowerQuery.includes(kw));
    
    if (isMalicious) {
      return {
        decision: 'blocked',
        classifier_prob: 0.95,
        rule_matches: ['malicious_intent', 'security_violation'],
        llm_response: '',
        explanation: 'Query blocked due to detected malicious intent or security concerns.',
      };
    }

    return {
      decision: 'allowed',
      classifier_prob: 0.88,
      rule_matches: ['medical_information_query'],
      llm_response: `This is a mock response. Your query "${query}" has been analyzed and approved. To get real AI-powered responses, please set your REACT_APP_GEMINI_API_KEY in the .env file.\n\nGet your free API key at: https://makersuite.google.com/app/apikey`,
      explanation: 'Query classified as legitimate medical information request. Mock response provided (no backend/API key configured).',
    };
  }

  // Fetch query logs from IndexedDB
  async fetchLogs(limit: number = 20): Promise<LogEntry[]> {
    try {
      // Try to fetch from database first
      const storedLogs = await logDB.getAllLogs(limit);
      return storedLogs.map(log => ({
        id: log.id,
        timestamp: log.timestamp,
        query: log.query,
        decision: log.decision,
        classifier_prob: log.classifier_prob,
        rule_matches: log.rule_matches,
        user_id: log.user_id,
        session_id: log.session_id,
      }));
    } catch (error) {
      console.error('Failed to fetch logs from database:', error);
      return [];
    }
  }

  // Submit escalation request (human review)
  async submitEscalation(query: string, reason: string): Promise<{ success: boolean; id: string }> {
    try {
      const response = await this.client.post('/api/escalate', {
        query: sanitizeQuery(query),
        reason: reason.slice(0, 500), // Limit reason length
        timestamp: new Date().toISOString(),
      });
      
      return response.data;
    } catch (error) {
      // Mock escalation for demo
      return {
        success: true,
        id: `escalation_${Date.now()}`,
      };
    }
  }

  // Health check endpoint
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await this.client.get('/api/health');
      return response.data;
    } catch (error) {
      return {
        status: 'offline',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // No longer using mock logs - all data is real and stored in IndexedDB
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export individual functions for easier testing
export const analyzeQuery = (query: string, options?: QueryOptions) => 
  apiClient.analyzeQuery(query, options);

export const fetchLogs = (limit?: number) => 
  apiClient.fetchLogs(limit);

export const submitEscalation = (query: string, reason: string) => 
  apiClient.submitEscalation(query, reason);

export const healthCheck = () => 
  apiClient.healthCheck();