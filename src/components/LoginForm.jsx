// src/components/LoginForm.jsx
import { useState, useEffect } from 'react';
import { Building2, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginForm = () => {
  const { login, signup, loading, error, clearError, testConnection } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    profile: {
      firstName: '',
      lastName: ''
    }
  });

  // Test API connection on component mount lol
  useEffect(() => {
    const checkConnection = async () => {
      const result = await testConnection();
      setConnectionStatus(result);
    };
    checkConnection();
  }, [testConnection]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('profile.')) {
      const profileField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [profileField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    console.log('📝 Form submission:', { isSignup, email: formData.email });

    // Basic validation
    if (!formData.email || !formData.password) {
      return;
    }

    if (isSignup) {
      if (formData.password !== formData.confirmPassword) {
        return;
      }
      
      const result = await signup({
        email: formData.email,
        password: formData.password,
        profile: formData.profile
      });
      
      if (result.success) {
        console.log('✅ Signup successful, user logged in');
      }
    } else {
      const result = await login({
        email: formData.email,
        password: formData.password
      });
      
      if (result.success) {
        console.log('✅ Login successful');
      }
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    clearError();
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      profile: {
        firstName: '',
        lastName: ''
      }
    });
  };

  const isFormValid = () => {
    if (!formData.email || !formData.password) return false;
    if (isSignup && formData.password !== formData.confirmPassword) return false;
    return true;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            {isSignup ? 'Create your account' : 'Sign in to your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Investment Banking CRM
          </p>

          {/* Connection Status Indicator */}
          {connectionStatus && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${
              connectionStatus.success 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  connectionStatus.success ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                {connectionStatus.success 
                  ? '✅ Connected to server' 
                  : '❌ Unable to connect to server'
                }
              </div>
              {!connectionStatus.success && (
                <p className="mt-1 text-xs">
                  Please check if the backend server is running on http://localhost:5000
                </p>
              )}
            </div>
          )}
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {isSignup && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="profile.firstName"
                    type="text"
                    value={formData.profile.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="profile.lastName"
                    type="text"
                    value={formData.profile.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder={isSignup ? 'Create a password (min. 6 characters)' : 'Enter your password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {isSignup && (
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 6 characters long
                </p>
              )}
            </div>

            {isSignup && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Confirm your password"
                  />
                </div>
                {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                )}
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !isFormValid()}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isSignup ? 'Creating account...' : 'Signing in...'}
                </div>
              ) : (
                isSignup ? 'Create account' : 'Sign in'
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            >
              {isSignup 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"
              }
            </button>
          </div>

          {/* Debug Info in Development */}
          {import.meta.env.DEV && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
              <p><strong>Debug Info:</strong></p>
              <p>API URL: {import.meta.env.VITE_API_URL || 'http://localhost:5000'}</p>
              <p>Environment: {import.meta.env.DEV ? 'Development' : 'Production'}</p>
              <p>Form valid: {isFormValid() ? 'Yes' : 'No'}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
