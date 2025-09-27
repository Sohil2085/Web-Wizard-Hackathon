// Simple API test utility to debug connection issues
import { getApiBaseUrl, logEnvironmentInfo } from './environment.js';

export const testApiConnection = async () => {
  console.log('=== API Connection Test ===');
  
  // Log environment info
  logEnvironmentInfo();
  
  // Test the API base URL
  const apiBaseUrl = getApiBaseUrl();
  console.log('API Base URL:', apiBaseUrl);
  
  // Test if we can reach the health endpoint
  try {
    const response = await fetch(`${apiBaseUrl.replace('/api/v1', '')}/health`);
    const data = await response.json();
    console.log('Health check response:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Health check failed:', error);
    return { success: false, error: error.message };
  }
};

// Test user registration endpoint
export const testUserRegistration = async (testData) => {
  console.log('=== User Registration Test ===');
  
  const apiBaseUrl = getApiBaseUrl();
  const userApiUrl = `${apiBaseUrl}/users`;
  
  console.log('User API URL:', userApiUrl);
  
  try {
    const response = await fetch(`${userApiUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    const data = await response.json();
    console.log('Registration response:', { status: response.status, data });
    return { success: response.ok, status: response.status, data };
  } catch (error) {
    console.error('Registration test failed:', error);
    return { success: false, error: error.message };
  }
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testApiConnection = testApiConnection;
  window.testUserRegistration = testUserRegistration;
}
