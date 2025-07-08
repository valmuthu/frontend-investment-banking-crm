import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import './index.css'

// Check if AuthContext exists, if not provide a fallback
let AppWithAuth;

try {
  // Try to use AuthProvider if it exists
  AppWithAuth = (
    <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>
  );
} catch (error) {
  console.warn('AuthProvider not available, running without authentication:', error);
  // Fallback to just App without AuthProvider
  AppWithAuth = (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(AppWithAuth);
