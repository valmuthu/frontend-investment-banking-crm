// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
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

  // Check if user is already logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      console.log('🔍 Checking auth status...');
      const response = await apiService.verifyToken();
      console.log('✅ Auth check successful:', response);
      setUser(response.user);
    } catch (error) {
      console.error('❌ Token verification failed:', error);
      localStorage.removeItem('authToken');
      setError('Session expired. Please log in again.');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔐 Attempting login...');
      const response = await apiService.login(credentials);
      console.log('✅ Login successful:', response);
      
      const { accessToken, user: userData } = response;
      
      localStorage.setItem('authToken', accessToken);
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('❌ Login failed:', error);
      let errorMessage = 'Login failed. Please try again.';
      
      // Handle specific error codes
      if (error.code === 'INVALID_CREDENTIALS') {
        errorMessage = 'Invalid email or password.';
      } else if (error.code === 'MISSING_CREDENTIALS') {
        errorMessage = 'Please enter both email and password.';
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
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
      
      console.log('✨ Attempting signup...');
      const response = await apiService.signup(userData);
      console.log('✅ Signup successful:', response);
      
      const { accessToken, user: newUser } = response;
      
      localStorage.setItem('authToken', accessToken);
      setUser(newUser);
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('❌ Signup failed:', error);
      let errorMessage = 'Signup failed. Please try again.';
      
      // Handle specific error codes
      if (error.code === 'USER_EXISTS') {
        errorMessage = 'An account with this email already exists.';
      } else if (error.code === 'WEAK_PASSWORD') {
        errorMessage = 'Password must be at least 6 characters long.';
      } else if (error.code === 'INVALID_EMAIL') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('👋 Logging out...');
      await apiService.logout();
    } catch (error) {
      console.error('❌ Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
      setError(null);
      console.log('✅ Logout completed');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.updateUserProfile(profileData);
      setUser(response.user);
      
      return { success: true, user: response.user };
    } catch (error) {
      const errorMessage = error.message || 'Profile update failed.';
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
      
      await apiService.changePassword(passwordData);
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.message || 'Password change failed.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Test API connectivity
  const testConnection = async () => {
    try {
      console.log('🧪 Testing API connection...');
      const response = await apiService.healthCheck();
      console.log('✅ API connection test successful:', response);
      return { success: true, data: response };
    } catch (error) {
      console.error('❌ API connection test failed:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    updateProfile,
    changePassword,
    clearError,
    testConnection,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
