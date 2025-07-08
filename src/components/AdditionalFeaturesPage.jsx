// src/components/AdditionalFeaturesPage.jsx
import { Building2 } from 'lucide-react';

export default function AdditionalFeaturesPage({ onShowLogin, onShowSignup }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Banking CRM</h1>
            </div>
            <div className="space-x-4">
              <button 
                onClick={onShowLogin}
                className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg"
              >
                Sign In
              </button>
              <button 
                onClick={onShowSignup}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Additional Features
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            More powerful tools and features are in development.
          </p>
          
          <button 
            onClick={onShowSignup}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            Get Started Now
          </button>
        </div>
      </main>
    </div>
  );
}
