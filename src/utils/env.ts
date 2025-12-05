// Environment variable utility for easier testing
// In test environment, process.env is used; in Vite, import.meta.env is used
export const getEnv = (key: string, defaultValue: string = ''): string => {
  // Check if we're in a test environment first
  if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'test') {
    return process.env[key] || defaultValue;
  }
  
  // In production/development with Vite, use import.meta.env
  // This won't be reached during Jest tests
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue;
  }
  
  return defaultValue;
};

export const isDevelopment = (): boolean => {
  return getEnv('MODE') === 'development' || getEnv('NODE_ENV') === 'development';
};

export const isProduction = (): boolean => {
  return getEnv('MODE') === 'production' || getEnv('NODE_ENV') === 'production';
};

export const isTest = (): boolean => {
  return getEnv('NODE_ENV') === 'test';
};