// Install dompurify: npm install dompurify @types/dompurify
// Or use the fallback sanitizer below for basic protection

let DOMPurify: any = null;

// Try to import DOMPurify, fall back to basic sanitizer
try {
  // @ts-ignore - conditional import
  DOMPurify = require('dompurify');
} catch (e) {
  console.warn('DOMPurify not available, using fallback sanitizer');
}

// Fallback sanitizer - basic protection only
function fallbackSanitize(dirty: string): string {
  return dirty
    // Remove script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove on* event handlers
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son\w+\s*=\s*'[^']*'/gi, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove data: protocol for safety (except images)
    .replace(/data:(?!image\/)/gi, '')
    // Remove dangerous tags
    .replace(/<(?:object|embed|iframe|form|input|button)[^>]*>/gi, '')
    // Basic XSS protection
    .replace(/&lt;script/gi, '')
    .replace(/&lt;\/script/gi, '');
}

// Main sanitize function
export function sanitizeHtml(dirty: string, options?: {
  allowBasicFormatting?: boolean;
  stripAll?: boolean;
}): string {
  const { allowBasicFormatting = false, stripAll = false } = options || {};

  if (stripAll) {
    // Strip all HTML tags
    return dirty.replace(/<[^>]*>/g, '');
  }

  if (DOMPurify && DOMPurify.sanitize) {
    // Use DOMPurify if available
    const config = allowBasicFormatting ? {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'b', 'i'],
      ALLOWED_ATTR: [],
    } : {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    };
    
    return DOMPurify.sanitize(dirty, config);
  }

  // Use fallback sanitizer
  let sanitized = fallbackSanitize(dirty);
  
  if (!allowBasicFormatting) {
    // Strip all remaining tags if basic formatting not allowed
    sanitized = sanitized.replace(/<[^>]*>/g, '');
  }

  return sanitized;
}

// Sanitize text content only (no HTML)
export function sanitizeText(text: string): string {
  return sanitizeHtml(text, { stripAll: true })
    .trim()
    .slice(0, 2000); // Limit length
}

// Sanitize query input specifically
export function sanitizeQuery(query: string): string {
  return query
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript protocol
    .replace(/data:/gi, '') // Remove data protocol
    .replace(/\0/g, '') // Remove null bytes
    .slice(0, 1000); // Limit to max query length
}

// Validate and sanitize file names
export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace unsafe chars with underscore
    .replace(/^\.+/, '') // Remove leading dots
    .slice(0, 100); // Limit length
}

// Safe JSON parsing with error handling
export function safeJsonParse<T>(json: string, defaultValue: T): T {
  try {
    const parsed = JSON.parse(json);
    return parsed;
  } catch (e) {
    console.warn('JSON parse error:', e);
    return defaultValue;
  }
}

// Escape HTML entities for display
export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Check if string contains potentially dangerous content
export function isDangerous(input: string): boolean {
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /data:text\/html/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
  ];

  return dangerousPatterns.some(pattern => pattern.test(input));
}