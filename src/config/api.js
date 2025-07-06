// src/config/api.js
const API_CONFIG = {
  // Replace with your actual Heroku app URL
  BASE_URL: process.env.REACT_APP_API_URL || 'https://vm-investment-crm.herokuapp.com',
  API_VERSION: '/api/v1',
  TIMEOUT: 30000, // 30 seconds
};

// Full API base URL
export const API_BASE_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}`;

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    SIGNUP: `${API_BASE_URL}/auth/signup`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
    VERIFY: `${API_BASE_URL}/auth/verify`,
    CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  },
  
  // Users
  USERS: {
    PROFILE: `${API_BASE_URL}/users/profile`,
  },
  
  // Contacts
  CONTACTS: {
    BASE: `${API_BASE_URL}/contacts`,
    STATS: `${API_BASE_URL}/contacts/stats`,
    BULK: `${API_BASE_URL}/contacts/bulk`,
    EXPORT: `${API_BASE_URL}/contacts/export/csv`,
    IMPORT: `${API_BASE_URL}/contacts/import`,
    BY_ID: (id) => `${API_BASE_URL}/contacts/${id}`,
    INTERACTIONS: (id) => `${API_BASE_URL}/contacts/${id}/interactions`,
    INTERACTION_BY_ID: (contactId, interactionId) => 
      `${API_BASE_URL}/contacts/${contactId}/interactions/${interactionId}`,
    RESTORE: (id) => `${API_BASE_URL}/contacts/${id}/restore`,
  },
  
  // Interviews
  INTERVIEWS: {
    BASE: `${API_BASE_URL}/interviews`,
    BY_ID: (id) => `${API_BASE_URL}/interviews/${id}`,
    ROUNDS: (id) => `${API_BASE_URL}/interviews/${id}/rounds`,
    ROUND_BY_ID: (interviewId, roundId) => 
      `${API_BASE_URL}/interviews/${interviewId}/rounds/${roundId}`,
  },
  
  // Documents
  DOCUMENTS: {
    BASE: `${API_BASE_URL}/documents`,
    BY_ID: (id) => `${API_BASE_URL}/documents/${id}`,
  },
  
  // Dashboard
  DASHBOARD: {
    STATS: `${API_BASE_URL}/dashboard/stats`,
  },
  
  // Analytics
  ANALYTICS: {
    TRACK: `${API_BASE_URL}/analytics/track`,
  },
  
  // Search
  SEARCH: {
    GLOBAL: `${API_BASE_URL}/search`,
  },
  
  // Tasks
  TASKS: {
    BASE: `${API_BASE_URL}/tasks`,
    BY_ID: (id) => `${API_BASE_URL}/tasks/${id}`,
  },
  
  // Goals
  GOALS: {
    BASE: `${API_BASE_URL}/goals`,
    BY_ID: (id) => `${API_BASE_URL}/goals/${id}`,
  },
  
  // Health Check
  HEALTH: `${API_CONFIG.BASE_URL}/health`,
};

// HTTP methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

// Default headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Auth header helper
export const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Complete headers with auth
export const getHeaders = (includeAuth = true) => ({
  ...DEFAULT_HEADERS,
  ...(includeAuth ? getAuthHeader() : {}),
});

export default API_CONFIG;
