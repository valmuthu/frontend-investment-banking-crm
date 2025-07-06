// src/services/apiService.js
import { 
  API_CONFIG, 
  getHeaders, 
  HTTP_METHODS,
  API_ENDPOINTS 
} from '../config/api';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  // Generic HTTP request method
  async request(url, options = {}) {
    const {
      method = HTTP_METHODS.GET,
      data = null,
      headers = {},
      includeAuth = true,
      timeout = this.timeout,
    } = options;

    const config = {
      method,
      headers: {
        ...getHeaders(includeAuth),
        ...headers,
      },
    };

    // Add body for POST/PUT/PATCH requests
    if (data && (method === HTTP_METHODS.POST || method === HTTP_METHODS.PUT || method === HTTP_METHODS.PATCH)) {
      config.body = JSON.stringify(data);
    }

    // Create AbortController for timeout
    const controller = new AbortController();
    config.signal = controller.signal;

    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      // Handle different response types
      const contentType = response.headers.get('content-type');
      let responseData;

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (!response.ok) {
        throw new ApiError(
          responseData.message || `HTTP ${response.status}`,
          response.status,
          responseData.code || 'HTTP_ERROR',
          responseData
        );
      }

      return responseData;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408, 'TIMEOUT_ERROR');
      }
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(
        error.message || 'Network error',
        0,
        'NETWORK_ERROR'
      );
    }
  }

  // HTTP method shortcuts
  async get(url, options = {}) {
    return this.request(url, { ...options, method: HTTP_METHODS.GET });
  }

  async post(url, data, options = {}) {
    return this.request(url, { ...options, method: HTTP_METHODS.POST, data });
  }

  async put(url, data, options = {}) {
    return this.request(url, { ...options, method: HTTP_METHODS.PUT, data });
  }

  async patch(url, data, options = {}) {
    return this.request(url, { ...options, method: HTTP_METHODS.PATCH, data });
  }

  async delete(url, options = {}) {
    return this.request(url, { ...options, method: HTTP_METHODS.DELETE });
  }

  // Authentication methods
  async login(credentials) {
    return this.post(API_ENDPOINTS.AUTH.LOGIN, credentials, { includeAuth: false });
  }

  async signup(userData) {
    return this.post(API_ENDPOINTS.AUTH.SIGNUP, userData, { includeAuth: false });
  }

  async logout() {
    return this.post(API_ENDPOINTS.AUTH.LOGOUT);
  }

  async refreshToken() {
    return this.post(API_ENDPOINTS.AUTH.REFRESH);
  }

  async verifyToken() {
    return this.get(API_ENDPOINTS.AUTH.VERIFY);
  }

  async changePassword(passwordData) {
    return this.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, passwordData);
  }

  async forgotPassword(email) {
    return this.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }, { includeAuth: false });
  }

  async resetPassword(token, newPassword) {
    return this.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, newPassword }, { includeAuth: false });
  }

  // User methods
  async getUserProfile() {
    return this.get(API_ENDPOINTS.USERS.PROFILE);
  }

  async updateUserProfile(profileData) {
    return this.put(API_ENDPOINTS.USERS.PROFILE, profileData);
  }

  // Contact methods
  async getContacts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_ENDPOINTS.CONTACTS.BASE}?${query}` : API_ENDPOINTS.CONTACTS.BASE;
    return this.get(url);
  }

  async getContactStats() {
    return this.get(API_ENDPOINTS.CONTACTS.STATS);
  }

  async createContact(contactData) {
    return this.post(API_ENDPOINTS.CONTACTS.BASE, contactData);
  }

  async getContact(id) {
    return this.get(API_ENDPOINTS.CONTACTS.BY_ID(id));
  }

  async updateContact(id, contactData) {
    return this.put(API_ENDPOINTS.CONTACTS.BY_ID(id), contactData);
  }

  async deleteContact(id) {
    return this.delete(API_ENDPOINTS.CONTACTS.BY_ID(id));
  }

  async restoreContact(id) {
    return this.patch(API_ENDPOINTS.CONTACTS.RESTORE(id));
  }

  async addInteraction(contactId, interactionData) {
    return this.post(API_ENDPOINTS.CONTACTS.INTERACTIONS(contactId), interactionData);
  }

  async updateInteraction(contactId, interactionId, interactionData) {
    return this.put(API_ENDPOINTS.CONTACTS.INTERACTION_BY_ID(contactId, interactionId), interactionData);
  }

  async deleteInteraction(contactId, interactionId) {
    return this.delete(API_ENDPOINTS.CONTACTS.INTERACTION_BY_ID(contactId, interactionId));
  }

  async bulkContactOperation(operation, contactIds, updateData = null) {
    return this.post(API_ENDPOINTS.CONTACTS.BULK, { operation, contactIds, updateData });
  }

  async exportContacts(format = 'csv') {
    const url = `${API_ENDPOINTS.CONTACTS.EXPORT}?format=${format}`;
    return this.get(url);
  }

  async importContacts(contacts, skipDuplicates = true) {
    return this.post(API_ENDPOINTS.CONTACTS.IMPORT, { contacts, skipDuplicates });
  }

  // Interview methods
  async getInterviews(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_ENDPOINTS.INTERVIEWS.BASE}?${query}` : API_ENDPOINTS.INTERVIEWS.BASE;
    return this.get(url);
  }

  async createInterview(interviewData) {
    return this.post(API_ENDPOINTS.INTERVIEWS.BASE, interviewData);
  }

  async getInterview(id) {
    return this.get(API_ENDPOINTS.INTERVIEWS.BY_ID(id));
  }

  async updateInterview(id, interviewData) {
    return this.put(API_ENDPOINTS.INTERVIEWS.BY_ID(id), interviewData);
  }

  async deleteInterview(id) {
    return this.delete(API_ENDPOINTS.INTERVIEWS.BY_ID(id));
  }

  async addInterviewRound(interviewId, roundData) {
    return this.post(API_ENDPOINTS.INTERVIEWS.ROUNDS(interviewId), roundData);
  }

  async updateInterviewRound(interviewId, roundId, roundData) {
    return this.put(API_ENDPOINTS.INTERVIEWS.ROUND_BY_ID(interviewId, roundId), roundData);
  }

  async deleteInterviewRound(interviewId, roundId) {
    return this.delete(API_ENDPOINTS.INTERVIEWS.ROUND_BY_ID(interviewId, roundId));
  }

  // Document methods
  async getDocuments(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_ENDPOINTS.DOCUMENTS.BASE}?${query}` : API_ENDPOINTS.DOCUMENTS.BASE;
    return this.get(url);
  }

  async createDocument(documentData) {
    return this.post(API_ENDPOINTS.DOCUMENTS.BASE, documentData);
  }

  async getDocument(id) {
    return this.get(API_ENDPOINTS.DOCUMENTS.BY_ID(id));
  }

  async updateDocument(id, documentData) {
    return this.put(API_ENDPOINTS.DOCUMENTS.BY_ID(id), documentData);
  }

  async deleteDocument(id) {
    return this.delete(API_ENDPOINTS.DOCUMENTS.BY_ID(id));
  }

  // Dashboard methods
  async getDashboardStats() {
    return this.get(API_ENDPOINTS.DASHBOARD.STATS);
  }

  // Analytics methods
  async trackAnalytics(action, date = null) {
    return this.post(API_ENDPOINTS.ANALYTICS.TRACK, { action, date });
  }

  // Search methods
  async globalSearch(query, limit = 20) {
    const params = new URLSearchParams({ q: query, limit }).toString();
    return this.get(`${API_ENDPOINTS.SEARCH.GLOBAL}?${params}`);
  }

  // Tasks methods
  async getTasks(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_ENDPOINTS.TASKS.BASE}?${query}` : API_ENDPOINTS.TASKS.BASE;
    return this.get(url);
  }

  async createTask(taskData) {
    return this.post(API_ENDPOINTS.TASKS.BASE, taskData);
  }

  async getTask(id) {
    return this.get(API_ENDPOINTS.TASKS.BY_ID(id));
  }

  async updateTask(id, taskData) {
    return this.put(API_ENDPOINTS.TASKS.BY_ID(id), taskData);
  }

  async deleteTask(id) {
    return this.delete(API_ENDPOINTS.TASKS.BY_ID(id));
  }

  // Goals methods
  async getGoals(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_ENDPOINTS.GOALS.BASE}?${query}` : API_ENDPOINTS.GOALS.BASE;
    return this.get(url);
  }

  async createGoal(goalData) {
    return this.post(API_ENDPOINTS.GOALS.BASE, goalData);
  }

  async getGoal(id) {
    return this.get(API_ENDPOINTS.GOALS.BY_ID(id));
  }

  async updateGoal(id, goalData) {
    return this.put(API_ENDPOINTS.GOALS.BY_ID(id), goalData);
  }

  async deleteGoal(id) {
    return this.delete(API_ENDPOINTS.GOALS.BY_ID(id));
  }

  // Health check
  async healthCheck() {
    return this.get(API_ENDPOINTS.HEALTH, { includeAuth: false });
  }
}

// Custom API Error class
export class ApiError extends Error {
  constructor(message, status = 0, code = 'UNKNOWN_ERROR', data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
