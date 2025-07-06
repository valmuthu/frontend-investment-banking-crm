// src/config/api.js
const getBaseURL = () => {
  // Check if we're in development mode
  if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
    return 'http://localhost:5000';
  }
  // Use environment variable or fallback to Heroku URL
  return process.env.REACT_APP_API_URL || 'https://vm-investment-crm.herokuapp.com';
};

export const API_CONFIG = {
  BASE_URL: getBaseURL(),
  API_VERSION: '/api/v1',
  TIMEOUT: 30000,
};

export const API_BASE_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}`;

export const API_ENDPOINTS = {
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
  USERS: {
    PROFILE: `${API_BASE_URL}/users/profile`,
  },
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
  INTERVIEWS: {
    BASE: `${API_BASE_URL}/interviews`,
    BY_ID: (id) => `${API_BASE_URL}/interviews/${id}`,
    ROUNDS: (id) => `${API_BASE_URL}/interviews/${id}/rounds`,
    ROUND_BY_ID: (interviewId, roundId) =>
      `${API_BASE_URL}/interviews/${interviewId}/rounds/${roundId}`,
  },
  DOCUMENTS: {
    BASE: `${API_BASE_URL}/documents`,
    BY_ID: (id) => `${API_BASE_URL}/documents/${id}`,
  },
  DASHBOARD: {
    STATS: `${API_BASE_URL}/dashboard/stats`,
  },
  ANALYTICS: {
    TRACK: `${API_BASE_URL}/analytics/track`,
  },
  SEARCH: {
    GLOBAL: `${API_BASE_URL}/search`,
  },
  TASKS: {
    BASE: `${API_BASE_URL}/tasks`,
    BY_ID: (id) => `${API_BASE_URL}/tasks/${id}`,
  },
  GOALS: {
    BASE: `${API_BASE_URL}/goals`,
    BY_ID: (id) => `${API_BASE_URL}/goals/${id}`,
  },
  HEALTH: `${API_CONFIG.BASE_URL}/health`,
};

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getHeaders = (includeAuth = true) => ({
  ...DEFAULT_HEADERS,
  ...(includeAuth ? getAuthHeader() : {}),
});
