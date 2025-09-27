/**
 * Environment detection utilities
 * Automatically detects if running locally or in production
 */

// Check if running in development mode
export const isDevelopment = () => {
  return import.meta.env.DEV || 
         window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1';
};

// Check if running in production mode
export const isProduction = () => {
  return import.meta.env.PROD || !isDevelopment();
};

// Get the current environment
export const getEnvironment = () => {
  if (isDevelopment()) {
    return 'development';
  } else if (isProduction()) {
    return 'production';
  }
  return 'unknown';
};

// Get API base URL based on environment
export const getApiBaseUrl = () => {
  // If environment variable is set, use it (highest priority)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Auto-detect based on current location
  if (isDevelopment()) {
    return 'http://localhost:8000/api/v1';
  } else {
    // For production, use the same domain but different port/subdomain
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    
    // If deployed on Vercel/Netlify, assume backend is on Render
    if (hostname.includes('vercel.app') || hostname.includes('netlify.app')) {
      return 'https://web-wizard-hackathon-1.onrender.com/api/v1';
    }
    
    // For other deployments, you might want to use a subdomain or different port
    return `${protocol}//api.${hostname}/api/v1`;
  }
};

// Get frontend URL for CORS configuration
export const getFrontendUrl = () => {
  if (isDevelopment()) {
    return `http://localhost:${window.location.port || '5173'}`;
  } else {
    return `${window.location.protocol}//${window.location.host}`;
  }
};

// Log environment information (useful for debugging)
export const logEnvironmentInfo = () => {
  console.log('Environment Info:', {
    environment: getEnvironment(),
    isDevelopment: isDevelopment(),
    isProduction: isProduction(),
    apiBaseUrl: getApiBaseUrl(),
    frontendUrl: getFrontendUrl(),
    hostname: window.location.hostname,
    port: window.location.port,
    protocol: window.location.protocol
  });
};

// Export default configuration
export default {
  isDevelopment,
  isProduction,
  getEnvironment,
  getApiBaseUrl,
  getFrontendUrl,
  logEnvironmentInfo
};
