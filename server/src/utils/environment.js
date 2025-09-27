/**
 * Environment detection utilities for backend
 * Automatically detects if running locally or in production
 */

// Check if running in development mode
export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development' || 
         process.env.NODE_ENV === 'dev' ||
         !process.env.NODE_ENV;
};

// Check if running in production mode
export const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

// Get the current environment
export const getEnvironment = () => {
  return process.env.NODE_ENV || 'development';
};

// Get allowed origins for CORS based on environment
export const getAllowedOrigins = () => {
  const origins = [
    "http://localhost:5173",  // Local development (Vite)
    "http://localhost:3000",  // Alternative local port
    "http://127.0.0.1:5173",  // Alternative localhost
    "http://127.0.0.1:3000",  // Alternative localhost
  ];
  
  // Add production frontend URL if set
  if (process.env.FRONTEND_URL) {
    origins.push(process.env.FRONTEND_URL);
  }
  
  // Add common deployment patterns in production
  if (isProduction()) {
    // Add common Vercel patterns
    origins.push('https://web-wizard-hackathon.vercel.app');
    origins.push('https://web-wizard-hackathon-git-main.vercel.app');
    
    // Add common Netlify patterns
    origins.push('https://web-wizard-hackathon.netlify.app');
    origins.push('https://web-wizard-hackathon--main.netlify.app');
    
    // Add common Render patterns
    origins.push('https://web-wizard-hackathon.onrender.com');
  }
  
  return origins.filter(Boolean); // Remove any undefined values
};

// Get database URL based on environment
export const getDatabaseUrl = () => {
  if (isDevelopment()) {
    return process.env.MONGODB_URI || 'mongodb://localhost:27017/internalPracticalDB';
  } else {
    return process.env.MONGODB_URI;
  }
};

// Get port based on environment
export const getPort = () => {
  return process.env.PORT || (isDevelopment() ? 8000 : 10000);
};

// Log environment information (useful for debugging)
export const logEnvironmentInfo = () => {
  console.log('Backend Environment Info:', {
    environment: getEnvironment(),
    isDevelopment: isDevelopment(),
    isProduction: isProduction(),
    port: getPort(),
    allowedOrigins: getAllowedOrigins(),
    hasMongoUri: !!process.env.MONGODB_URI,
    hasFrontendUrl: !!process.env.FRONTEND_URL
  });
};

// Export default configuration
export default {
  isDevelopment,
  isProduction,
  getEnvironment,
  getAllowedOrigins,
  getDatabaseUrl,
  getPort,
  logEnvironmentInfo
};
