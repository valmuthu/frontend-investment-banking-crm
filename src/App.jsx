import { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';

// Simple debug version to test if React is working
export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState('landing');

  useEffect(() => {
    setIsLoaded(true);
    console.log('App component mounted successfully');
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading Investment Banking CRM...</p>
        </div>
      </div>
    );
  }

  if (currentPage === 'app') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Investment Banking CRM - Dashboard
            </h1>
            <p className="text-gray-600 mb-8">Welcome to your CRM dashboard!</p>
            <button 
              onClick={() => setCurrentPage('landing')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Back to Landing
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                onClick={() => setCurrentPage('app')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Enter App
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Your Investment Banking
            <span className="text-blue-600"> CRM</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Streamline your networking, track interview processes, and manage your path to investment banking success.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Network Management</h3>
              <p className="text-gray-600">
                Track contacts, conversations, and next steps with industry professionals.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Interview Tracking</h3>
              <p className="text-gray-600">
                Monitor your progress through interview rounds and maintain detailed records.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Document Organization</h3>
              <p className="text-gray-600">
                Store and organize resumes, cover letters, and other important documents.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <button 
              onClick={() => setCurrentPage('app')}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            >
              Get Started
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 Investment Banking CRM. Built for aspiring bankers.</p>
            <p className="mt-2 text-sm">Debug version - React is working correctly!</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
