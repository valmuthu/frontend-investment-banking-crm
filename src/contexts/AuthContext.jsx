// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        console.log('🔍 Found existing token, verifying...');
        
        try {
          // Verify the token with the backend
          const response = await apiService.verifyToken();
          console.log('✅ Token verified, user logged in:', response);
          
          setUser(response.user);
        } catch (error) {
          console.log('❌ Token verification failed:', error.message);
          // Clear invalid token
          localStorage.removeItem('authToken');
          setUser(null);
        }
      } else {
        console.log('ℹ️ No token found, user not logged in');
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      // Clear any corrupted auth state
      localStorage.removeItem('authToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔐 Attempting login for:', credentials.email);
      
      const response = await apiService.login(credentials);
      console.log('✅ Login successful:', response);
      
      // Store the token
      if (response.accessToken) {
        localStorage.setItem('authToken', response.accessToken);
        console.log('💾 Token stored successfully');
      }
      
      // Set user state
      setUser(response.user);
      
      return { success: true, user: response.user };
    } catch (error) {
      console.error('❌ Login failed:', error);
      
      const errorMessage = error.message || 'Login failed. Please try again.';
      setError(errorMessage);
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📝 Attempting signup for:', userData.email);
      
      const response = await apiService.signup(userData);
      console.log('✅ Signup successful:', response);
      
      // Store the token
      if (response.accessToken) {
        localStorage.setItem('authToken', response.accessToken);
        console.log('💾 Token stored successfully');
      }
      
      // Set user state
      setUser(response.user);
      
      return { success: true, user: response.user };
    } catch (error) {
      console.error('❌ Signup failed:', error);
      
      const errorMessage = error.message || 'Signup failed. Please try again.';
      setError(errorMessage);
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      console.log('🚪 Logging out...');
      
      // Try to logout from the server
      try {
        await apiService.logout();
        console.log('✅ Server logout successful');
      } catch (error) {
        console.warn('⚠️ Server logout failed (continuing with local logout):', error.message);
      }
      
      // Clear local state regardless
      localStorage.removeItem('authToken');
      setUser(null);
      setError(null);
      
      console.log('✅ Logout completed');
    } catch (error) {
      console.error('❌ Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📝 Updating profile...');
      
      const response = await apiService.updateUserProfile(profileData);
      console.log('✅ Profile updated:', response);
      
      // Update user state with new profile data
      setUser(prevUser => ({
        ...prevUser,
        ...response.user
      }));
      
      return { success: true, user: response.user };
    } catch (error) {
      console.error('❌ Profile update failed:', error);
      
      const errorMessage = error.message || 'Failed to update profile. Please try again.';
      setError(errorMessage);
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔒 Changing password...');
      
      const response = await apiService.changePassword(passwordData);
      console.log('✅ Password changed successfully');
      
      return { success: true, message: response.message };
    } catch (error) {
      console.error('❌ Password change failed:', error);
      
      const errorMessage = error.message || 'Failed to change password. Please try again.';
      setError(errorMessage);
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      console.log('🔍 Testing API connection...');
      
      const response = await apiService.healthCheck();
      console.log('✅ API connection successful:', response);
      
      return { success: true, message: 'Connected to server' };
    } catch (error) {
      console.error('❌ API connection failed:', error);
      
      return { 
        success: false, 
        message: 'Unable to connect to server',
        error: error.message 
      };
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    signup,
    updateProfile,
    changePassword,
    testConnection,
    clearError,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
