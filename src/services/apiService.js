import { API_ENDPOINTS, getHeaders, HTTP_METHODS } from '../config/api';

class ApiService {
  async request(url, options = {}) {
    const {
      method = HTTP_METHODS.GET,
      data = null,
      headers = {},
      includeAuth = true,
      timeout = 30000,
    } = options;

    console.log(`🔗 API Request: ${method} ${url}`);

    const config = {
      method,
      headers: {
        ...getHeaders(includeAuth),
        ...headers,
      },
    };

    if (data && (method === HTTP_METHODS.POST || method === HTTP_METHODS.PUT)) {
      config.body = JSON.stringify(data);
      console.log('📦 Request data:', data);
    }

    try {
      const response = await fetch(url, config);
      console.log(`📥 Response status: ${response.status}`);

      let responseData;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      console.log(`📊 Response data:`, responseData);

      if (!response.ok) {
        const errorMessage = responseData.message || `HTTP ${response.status}`;
        const error = new Error(errorMessage);
        error.status = response.status;
        error.code = responseData.code || 'HTTP_ERROR';
        throw error;
      }

      return responseData;
    } catch (error) {
      console.error(`❌ Request failed:`, error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        const networkError = new Error('Unable to connect to server. Please check your internet connection.');
        networkError.code = 'NETWORK_ERROR';
        throw networkError;
      }
      
      throw error;
    }
  }

  // HTTP method shortcuts
  async get(url, options = {}) {
    return this.request(url, { ...options, method: HTTP_METHODS.GET });
  }

  async post(url, data, options = {}) {
    return this.request(url, { ...options, method: HTTP_METHODS.POST, data });
  }

  // Health check
  async healthCheck() {
    return this.get(API_ENDPOINTS.HEALTH, { includeAuth: false });
  }

  // Test endpoint
  async testConnection() {
    return this.get(API_ENDPOINTS.TEST, { includeAuth: false });
  }

  // Auth test
  async testAuth() {
    return this.get(API_ENDPOINTS.AUTH.TEST, { includeAuth: false });
  }

  // Authentication methods
  async login(credentials) {
    console.log('🔐 Attempting login for:', credentials.email);
    return this.post(API_ENDPOINTS.AUTH.LOGIN, credentials, { includeAuth: false });
  }

  async signup(userData) {
    console.log('✨ Attempting signup for:', userData.email);
    return this.post(API_ENDPOINTS.AUTH.SIGNUP, userData, { includeAuth: false });
  }

  async verifyToken() {
    return this.get(API_ENDPOINTS.AUTH.VERIFY);
  }
}

const apiService = new ApiService();
export default apiService;
