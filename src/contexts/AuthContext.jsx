import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Return a default auth state if context is not available
    return {
      user: null,
      loading: false,
      login: async () => ({ user: { email: 'demo@example.com', name: 'Demo User' } }),
      logout: async () => {},
      signup: async () => ({ user: { email: 'demo@example.com', name: 'Demo User' } })
    };
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        // Check localStorage for demo purposes
        const savedUser = localStorage.getItem('demoUser');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.warn('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      
      // Demo login - accept any credentials
      const demoUser = {
        id: 1,
        email: credentials.email || 'demo@example.com',
        name: credentials.name || 'Demo User'
      };
      
      // Save to localStorage for demo persistence
      localStorage.setItem('demoUser', JSON.stringify(demoUser));
      setUser(demoUser);
      
      return { user: demoUser };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      
      // Demo signup - accept any data
      const demoUser = {
        id: 1,
        email: userData.email,
        name: userData.name || 'Demo User'
      };
      
      // Save to localStorage for demo persistence
      localStorage.setItem('demoUser', JSON.stringify(demoUser));
      setUser(demoUser);
      
      return { user: demoUser };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Clear demo user
      localStorage.removeItem('demoUser');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    signup
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
