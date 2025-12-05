import { RateLimitState } from '../types';

// Security configuration
export const SECURITY_CONFIG = {
  MAX_QUERY_LENGTH: 1000,
  RATE_LIMIT: {
    MAX_REQUESTS: 20,
    WINDOW_MS: 60000, // 1 minute
  },
  DEBOUNCE_MS: 300,
} as const;

// Rate limiter for client-side protection (not for security, just UX)
class RateLimiter {
  private state: RateLimitState;

  constructor(_maxRequests: number, windowMs: number) {
    this.state = {
      count: 0,
      resetTime: Date.now() + windowMs,
      windowMs,
    };
  }

  isAllowed(): boolean {
    const now = Date.now();
    
    // Reset window if expired
    if (now > this.state.resetTime) {
      this.state.count = 0;
      this.state.resetTime = now + this.state.windowMs;
    }

    return this.state.count < SECURITY_CONFIG.RATE_LIMIT.MAX_REQUESTS;
  }

  increment(): boolean {
    if (this.isAllowed()) {
      this.state.count++;
      return true;
    }
    return false;
  }

  getResetTime(): number {
    return Math.max(0, this.state.resetTime - Date.now());
  }
}

// Global rate limiter instance
export const rateLimiter = new RateLimiter(
  SECURITY_CONFIG.RATE_LIMIT.MAX_REQUESTS,
  SECURITY_CONFIG.RATE_LIMIT.WINDOW_MS
);

// Validate query length (client-side only - server must validate too)
export function validateQueryLength(query: string): { valid: boolean; error?: string } {
  if (query.length > SECURITY_CONFIG.MAX_QUERY_LENGTH) {
    return {
      valid: false,
      error: `Query too long. Maximum ${SECURITY_CONFIG.MAX_QUERY_LENGTH} characters allowed.`,
    };
  }
  return { valid: true };
}

// Build secure headers for API requests
export function buildSecureHeaders(): Record<string, string> {
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    // Add CSRF token in production: 'X-CSRF-Token': getCsrfToken()
  };
}

// Simple debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Check if rate limit exceeded
export function checkRateLimit(): { allowed: boolean; resetTime?: number } {
  if (rateLimiter.isAllowed()) {
    rateLimiter.increment();
    return { allowed: true };
  }
  
  return {
    allowed: false,
    resetTime: rateLimiter.getResetTime(),
  };
}

// Generate session ID for tracking (client-side only)
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Basic input validation patterns
export const VALIDATION_PATTERNS = {
  // Allow only safe characters for queries
  SAFE_QUERY: /^[a-zA-Z0-9\s\.,!?'"()-]+$/,
  
  // Basic email validation
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// Validate input against patterns
export function validateInput(input: string, pattern: RegExp): boolean {
  return pattern.test(input);
}