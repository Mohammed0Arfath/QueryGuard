import axios from 'axios';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent';

// Analyze query using Gemini API
export async function analyzeWithGemini(query, apiKey) {
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }

  try {
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

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${apiKey}`,
      {
        contents: [{
          parts: [{
            text: systemPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    // Check if response is valid
    if (!response.data || !response.data.candidates || response.data.candidates.length === 0) {
      throw new Error('Invalid response from Gemini API');
    }

    const candidate = response.data.candidates[0];
    
    // Check if response has parts (content)
    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      console.warn('Gemini response incomplete (finishReason:', candidate.finishReason, ')');
      throw new Error('Incomplete response from Gemini API');
    }

    const geminiResponse = candidate.content.parts[0].text;
    
    // Parse Gemini response
    const decision = geminiResponse.toLowerCase().includes('blocked') ? 'blocked' : 'allowed';
    const isBlocked = decision === 'blocked';
    
    // Extract confidence if present
    let confidence = 0.85;
    const confMatch = geminiResponse.match(/confidence[:\s]+([0-9.]+)/i);
    if (confMatch) {
      confidence = parseFloat(confMatch[1]);
      if (confidence > 1) confidence = confidence / 100; // Handle percentage format
    }

    return {
      decision,
      classifier_prob: confidence,
      rule_matches: isBlocked 
        ? ['ai_safety_filter', 'policy_violation'] 
        : ['medical_query_approved', 'ai_analysis_passed'],
      llm_response: geminiResponse,
      explanation: `AI-powered analysis completed. Query ${decision}.`,
    };
  } catch (error) {
    console.error('Gemini API error:', error.response?.status, error.message);
    
    if (error.response?.status === 400 || error.response?.status === 403) {
      throw new Error('Invalid Gemini API key');
    }
    
    throw new Error(`Gemini API error: ${error.message}`);
  }
}

// Fallback analysis for when Gemini is unavailable
export function analyzeFallback(query) {
  const lowerQuery = query.toLowerCase();
  
  // Simple keyword-based classification
  const maliciousKeywords = [
    'hack', 'exploit', 'steal', 'breach', 'password', 'crack',
    'bypass', 'injection', 'malware', 'phishing', 'vulnerability'
  ];
  
  const medicalKeywords = [
    'symptom', 'treatment', 'disease', 'medication', 'diagnosis',
    'therapy', 'condition', 'patient', 'clinical', 'medical'
  ];
  
  const hasMalicious = maliciousKeywords.some(kw => lowerQuery.includes(kw));
  const hasMedical = medicalKeywords.some(kw => lowerQuery.includes(kw));
  
  if (hasMalicious) {
    return {
      decision: 'blocked',
      classifier_prob: 0.95,
      rule_matches: ['malicious_intent', 'security_violation', 'keyword_filter'],
      llm_response: '',
      explanation: 'Query blocked due to detected malicious keywords or security concerns.',
    };
  }

  if (hasMedical) {
    return {
      decision: 'allowed',
      classifier_prob: 0.82,
      rule_matches: ['medical_information_query', 'keyword_approved'],
      llm_response: `Your medical query has been analyzed and approved. This is a fallback response as the AI service is unavailable. Your query: "${query}"`,
      explanation: 'Query classified as legitimate medical information request based on keyword analysis.',
    };
  }

  // Default to allowed with lower confidence
  return {
    decision: 'allowed',
    classifier_prob: 0.70,
    rule_matches: ['general_query', 'default_allow'],
    llm_response: `Query processed. This is a fallback response. Your query: "${query}"`,
    explanation: 'Query allowed with moderate confidence. No malicious indicators detected.',
  };
}

// Sanitize query text
export function sanitizeQuery(query) {
  if (typeof query !== 'string') {
    return '';
  }
  
  // Remove potentially dangerous characters
  return query
    .trim()
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/[<>]/g, '')
    .slice(0, 1000); // Max 1000 characters
}

// Validate query
export function validateQuery(query) {
  const errors = [];
  
  if (!query || typeof query !== 'string') {
    errors.push('Query must be a non-empty string');
  }
  
  if (query.length === 0) {
    errors.push('Query cannot be empty');
  }
  
  if (query.length > 1000) {
    errors.push('Query exceeds maximum length of 1000 characters');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
