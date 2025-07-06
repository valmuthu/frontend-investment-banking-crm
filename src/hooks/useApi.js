// src/hooks/useApi.js
import { useState, useCallback } from 'react';
import apiService from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { logout } = useAuth();

  const executeRequest = useCallback(async (apiCall) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiCall();
      return { success: true, data: result };
    } catch (err) {
      console.error('API request failed:', err);
      
      // If it's an authentication error, logout the user
      if (err.status === 401) {
        logout();
      }
      
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [logout]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    executeRequest,
    clearError
  };
};
