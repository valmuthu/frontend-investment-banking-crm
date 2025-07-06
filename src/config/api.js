// Simple API configuration
const API_BASE_URL = 'http://localhost:5000';

export const API_ENDPOINTS = {
  AUTH: {
    TEST: `${API_BASE_URL}/api/v1/auth/test`,
    SIGNUP: `${API_BASE_URL}/api/v1/auth/signup`,
    LOGIN: `${API_BASE_URL}/api/v1/auth/login`,
    VERIFY: `${API_BASE_URL}/api/v1/auth/verify`,
  },
  HEALTH: `${API_BASE_URL}/health`,
  TEST: `${API_BASE_URL}/test`
};

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

export const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getHeaders = (includeAuth = true) => ({
  ...DEFAULT_HEADERS,
  ...(includeAuth ? getAuthHeader() : {})
});

// Debug function
export const debugApiConfig = () => {
  console.log('🔧 API Configuration:', {
    BASE_URL: API_BASE_URL,
    endpoints: Object.keys(API_ENDPOINTS)
  });
};
