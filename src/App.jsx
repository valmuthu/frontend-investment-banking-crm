// src/App.jsx
import { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Contacts from './components/Contacts';
import Interviews from './components/Interviews';
import Documents from './components/Documents';
import ContactDetailPage from './components/ContactDetailPage';
import InterviewDetailPage from './components/InterviewDetailPage';
import Navigation from './components/Navigation';
import Settings from './components/Settings';
import LandingPage from './components/LandingPage';
import FeaturesPage from './components/FeaturesPage';
import AdditionalFeaturesPage from './components/AdditionalFeaturesPage';
import LoginForm from './components/LoginForm';
import { ContactModal, EditContactModal, InterviewModal, EditInterviewModal, CallModal } from './components/Modals';

// Check if AuthContext is available
let useAuth;
try {
  const authModule = await import('./contexts/AuthContext');
  useAuth = authModule.useAuth;
} catch (error) {
  console.warn('AuthContext not available, using mock auth');
  useAuth = () => ({
    user: null,
    logout: () => {},
    loading: false
  });
}

export default function App() {
  // Try to use real auth, fallback to mock
  let authState;
  try {
    authState = useAuth();
  } catch (error) {
    console.warn('Auth hook failed, using fallback');
    authState = {
      user: null,
      logout: () => {},
      loading: false
    };
  }

  const { user, logout, loading: authLoading } = authState;
  
  // App navigation state
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing', 'features', 'additional-features', 'login', 'app'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentView, setCurrentView] = useState('main'); // 'main', 'contact-detail', 'interview-detail', 'settings'
  
  // Modal states
  const [showContactModal, setShowContactModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);
  const [showCallModal, setShowCallModal] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [selectedInterviewId, setSelectedInterviewId] = useState(null);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Data states
  const [contacts, setContacts] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [documents, setDocuments] = useState([]);

  // Constants - Updated networking statuses and next steps
  const networkingStatuses = [
    'Not Yet Contacted',
    'Initial Outreach Sent',
    'Intro Call Scheduled',
    'Intro Call Complete',
    'Follow-Up Email Sent',
    'Follow-Up Call Scheduled',
    'Follow-Up Call Complete'
  ];

  const nextStepsOptions = [
    'Send Initial Outreach',
    'Schedule Intro Call',
    'Prepare for Upcoming Call',
    'Send Thank You Email',
    'Send Resume',
    'Send Follow-Up Email',
    'Schedule Follow-Up Call'
  ];

  // Updated interview stages and next steps
  const interviewStages = [
    'Not Yet Applied',
    'Applied',
    'Phone Screen',
    'First Round',
    'Second Round',
    'Third Round',
    'Case Study',
    'Superday',
    'Offer Received',
    'Withdrawn',
    'Rejected'
  ];

  const interviewNextSteps = [
    'Submit Application',
    'Follow-Up on Application',
    'Prepare for Upcoming Interview',
    'Send Thank You Email',
    'Submit Additional Materials',
    'Follow-Up on Status',
    'Schedule Next Round',
    'Complete Case Study',
    'Negotiate Offer'
  ];

  const groups = ['TMT', 'Healthcare', 'Financial Services', 'Real Estate', 'Energy', 'Consumer'];

  // Handle user authentication state changes
  useEffect(() => {
    if (user) {
      setCurrentPage('app');
      loadSampleData(); // Load sample data when user logs in
    } else if (!authLoading) {
      // Only reset to landing if not loading auth
      setCurrentPage('landing');
    }
  }, [user, authLoading]);

  const loadSampleData = () => {
    // Enhanced sample data
    setContacts([
      {
        id: 1,
        name: 'Kevin Burns',
        position: 'Associate',
        group: 'TMT',
        email: 'burnsk@gmail.com',
        phone: '+1 (212) 555-0123',
        linkedin: 'https://linkedin.com/in/kevinburns',
        firm: 'Evercore',
        networkingStatus: 'Intro Call Scheduled',
        networkingDate: '2025-06-15',
        nextSteps: 'Prepare for Upcoming Call',
        nextStepsDate: '2025-07-20',
        referred: true,
        notes: 'Very interested in TMT deals. Strong technical background.',
        interactions: [
          {
            id: 1,
            type: 'Email',
            title: 'Initial outreach',
            date: '2025-06-10',
            notes: 'Initial outreach about summer internship opportunities'
          },
          {
            id: 2,
            type: 'Call',
            title: 'Phone conversation',
            date: '2025-06-15',
            notes: 'Had a great conversation about the tech banking group'
          }
        ]
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        position: 'VP',
        group: 'Healthcare',
        email: 'sarah.johnson@ms.com',
        phone: '+1 (212) 555-0456',
        linkedin: 'https://linkedin.com/in/sarahjohnson',
        firm: 'Morgan Stanley',
        networkingStatus: 'Follow-Up Call Complete',
        networkingDate: '2025-05-25',
        nextSteps: '',
        nextStepsDate: '',
        referred: false,
        notes: 'Senior contact who provides market insights.',
        interactions: [
          {
            id: 1,
            type: 'Meeting',
            title: 'Coffee chat',
            date: '2025-06-01',
            notes: 'Coffee chat to discuss market trends'
          }
        ]
      },
      {
        id: 3,
        name: 'Michael Chen',
        position: 'Analyst',
        group: 'Financial Services',
        email: 'mchen@jpmorgan.com',
        phone: '+1 (212) 555-0789',
        linkedin: 'https://linkedin.com/in/michaelchen',
        firm: 'JPMorgan Chase',
        networkingStatus: 'Initial Outreach Sent',
        networkingDate: '2025-07-01',
        nextSteps: 'Send Follow-Up Email',
        nextStepsDate: '2025-07-08',
        referred: true,
        notes: 'Alumni connection, interested in FIG deals.',
        interactions: []
      }
    ]);

    setInterviews([
      {
        id: 1,
        firm: 'Goldman Sachs',
        position: 'Investment Banking Analyst',
        group: 'TMT',
        stage: 'Superday',
        stageDate: '2025-07-10',
        nextSteps: 'Send Thank You Email',
        nextStepsDate: '2025-07-11',
        notes: 'Technical interview focus on valuation models',
        referralContactId: 1,
        rounds: [
          {
            id: 1,
            stage: 'Phone Screen',
            date: '2025-06-15',
            interviewer: 'Jane Doe',
            format: 'Phone',
            outcome: 'Passed',
            notes: 'Initial screening went well'
          },
          {
            id: 2,
            stage: 'First Round',
            date: '2025-07-01',
            interviewer: 'John Smith',
            format: 'Video',
            outcome: 'Passed',
            notes: 'Technical questions on DCF models'
          }
        ]
      },
      {
        id: 2,
        firm: 'Morgan Stanley',
        position: 'Investment Banking Analyst',
        group: 'Healthcare',
        stage: 'First Round',
        stageDate: '2025-07-15',
        nextSteps: 'Schedule Next Round',
        nextStepsDate: '2025-07-16',
        notes: 'Initial screening call',
        referralContactId: 2,
        rounds: [
          {
            id: 1,
            stage: 'Phone Screen',
            date: '2025-07-15',
            interviewer: 'Mike Chen',
            format: 'Phone',
            outcome: 'Pending',
            notes: 'Initial screening call'
          }
        ]
      }
    ]);

    setDocuments([
      {
        id: 1,
        name: 'Resume - Investment Banking 2025',
        type: 'Resume',
        uploadDate: '2025-01-15',
        associatedContacts: ['Kevin Burns', 'Sarah Johnson'],
        associatedFirms: ['Evercore', 'Morgan Stanley'],
        tags: ['current', 'analyst'],
        notes: 'Latest version with TMT experience highlighted'
      },
      {
        id: 2,
        name: 'Coffee Chat Email Template',
        type: 'Email Template',
        uploadDate: '2025-01-10',
        associatedContacts: [],
        associatedFirms: [],
        tags: ['networking', 'template'],
        notes: 'Standard template for initial outreach'
      }
    ]);
  };

  // Helper functions with local state management
  const addContact = async (contactData) => {
    try {
      setLoading(true);
      
      const newContact = {
        ...contactData,
        id: Date.now(),
        interactions: []
      };
      setContacts(prev => [newContact, ...prev]);
      
      return newContact;
    } catch (error) {
      console.error('Error adding contact:', error);
      setError('Failed to add contact. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateContact = async (updatedContact) => {
    try {
      setLoading(true);
      
      setContacts(prev => prev.map(contact => 
        contact.id === updatedContact.id ? updatedContact : contact
      ));
      
      return updatedContact;
    } catch (error) {
      console.error('Error updating contact:', error);
      setError('Failed to update contact. Please try again.');
      return updatedContact;
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        setLoading(true);
        setContacts(prev => prev.filter(contact => contact.id !== id));
      } catch (error) {
        console.error('Error deleting contact:', error);
        setError('Failed to delete contact. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const addInterview = async (interviewData) => {
    try {
      setLoading(true);
      
      const newInterview = {
        ...interviewData,
        id: Date.now(),
        rounds: []
      };
      setInterviews(prev => [newInterview, ...prev]);
      
      return newInterview;
    } catch (error) {
      console.error('Error adding interview:', error);
      setError('Failed to add interview. Please try again.');
      return newInterview;
    } finally {
      setLoading(false);
    }
  };

  const updateInterview = async (updatedInterview) => {
    try {
      setLoading(true);
      
      setInterviews(prev => prev.map(interview => 
        interview.id === updatedInterview.id ? updatedInterview : interview
      ));
      
      return updatedInterview;
    } catch (error) {
      console.error('Error updating interview:', error);
      setError('Failed to update interview. Please try again.');
      return updatedInterview;
    } finally {
      setLoading(false);
    }
  };

  const deleteInterview = async (id) => {
    if (window.confirm('Are you sure you want to delete this interview?')) {
      try {
        setLoading(true);
        setInterviews(prev => prev.filter(interview => interview.id !== id));
      } catch (error) {
        console.error('Error deleting interview:', error);
        setError('Failed to delete interview. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const addInteraction = async (contactId, interactionData) => {
    try {
      const newInteraction = {
        ...interactionData,
        id: Date.now(),
        createdAt: new Date()
      };

      setContacts(prev => prev.map(contact => {
        if (contact.id === contactId) {
          return {
            ...contact,
            interactions: [newInteraction, ...(contact.interactions || [])]
          };
        }
        return contact;
      }));

      return newInteraction;
    } catch (error) {
      console.error('Error adding interaction:', error);
      setError('Failed to add interaction. Please try again.');
      return newInteraction;
    }
  };

  const updateInteraction = async (contactId, interactionId, updatedInteraction) => {
    try {
      setContacts(prev => prev.map(contact => {
        if (contact.id === contactId) {
          return {
            ...contact,
            interactions: contact.interactions.map(interaction =>
              interaction.id === interactionId ? updatedInteraction : interaction
            )
          };
        }
        return contact;
      }));

      return updatedInteraction;
    } catch (error) {
      console.error('Error updating interaction:', error);
      setError('Failed to update interaction. Please try again.');
      return updatedInteraction;
    }
  };

  const deleteInteraction = async (contactId, interactionId) => {
    if (window.confirm('Are you sure you want to delete this interaction?')) {
      try {
        setContacts(prev => prev.map(contact => {
          if (contact.id === contactId) {
            return {
              ...contact,
              interactions: contact.interactions.filter(interaction => interaction.id !== interactionId)
            };
          }
          return contact;
        }));
      } catch (error) {
        console.error('Error deleting interaction:', error);
        setError('Failed to delete interaction. Please try again.');
      }
    }
  };

  const addInterviewRound = async (interviewId, roundData) => {
    try {
      const newRound = {
        ...roundData,
        id: Date.now(),
        createdAt: new Date()
      };

      setInterviews(prev => prev.map(interview => {
        if (interview.id === interviewId) {
          return {
            ...interview,
            rounds: [...(interview.rounds || []), newRound]
          };
        }
        return interview;
      }));

      return newRound;
    } catch (error) {
      console.error('Error adding interview round:', error);
      setError('Failed to add interview round. Please try again.');
      return newRound;
    }
  };

  const updateInterviewRound = async (interviewId, roundId, updatedRound) => {
    try {
      setInterviews(prev => prev.map(interview => {
        if (interview.id === interviewId) {
          return {
            ...interview,
            rounds: interview.rounds.map(round =>
              round.id === roundId ? updatedRound : round
            )
          };
        }
        return interview;
      }));

      return updatedRound;
    } catch (error) {
      console.error('Error updating interview round:', error);
      setError('Failed to update interview round. Please try again.');
      return updatedRound;
    }
  };

  const deleteInterviewRound = async (interviewId, roundId) => {
    if (window.confirm('Are you sure you want to delete this interview round?')) {
      try {
        setInterviews(prev => prev.map(interview => {
          if (interview.id === interviewId) {
            return {
              ...interview,
              rounds: interview.rounds.filter(round => round.id !== roundId)
            };
          }
          return interview;
        }));
      } catch (error) {
        console.error('Error deleting interview round:', error);
        setError('Failed to delete interview round. Please try again.');
      }
    }
  };

  // Document management functions
  const addDocument = async (documentData) => {
    try {
      setLoading(true);
      
      let processedDocumentData = { ...documentData };
      
      if (documentData.file) {
        processedDocumentData.fileData = {
          name: documentData.file.name,
          size: documentData.file.size,
          type: documentData.file.type,
          content: documentData.file
        };
        delete processedDocumentData.file;
      }
      
      const newDocument = {
        ...processedDocumentData,
        id: Date.now(),
        uploadDate: new Date().toISOString().split('T')[0]
      };
      setDocuments(prev => [newDocument, ...prev]);
      
      return newDocument;
    } catch (error) {
      console.error('Error adding document:', error);
      setError('Failed to add document. Please try again.');
      return newDocument;
    } finally {
      setLoading(false);
    }
  };

  const updateDocument = async (updatedDocument) => {
    try {
      setLoading(true);
      
      setDocuments(prev => prev.map(doc => 
        doc.id === updatedDocument.id ? updatedDocument : doc
      ));
      
      return updatedDocument;
    } catch (error) {
      console.error('Error updating document:', error);
      setError('Failed to update document. Please try again.');
      return updatedDocument;
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        setLoading(true);
        setDocuments(prev => prev.filter(doc => doc.id !== id));
      } catch (error) {
        console.error('Error deleting document:', error);
        setError('Failed to delete document. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const showContactDetail = (contactId) => {
    setSelectedContactId(contactId);
    setCurrentView('contact-detail');
  };

  const showInterviewDetail = (interviewId) => {
    setSelectedInterviewId(interviewId);
    setCurrentView('interview-detail');
  };

  const showSettings = () => {
    setCurrentView('settings');
  };

  const goBack = () => {
    setCurrentView('main');
    setSelectedContactId(null);
    setSelectedInterviewId(null);
  };

  const selectedContact = contacts.find(c => c.id === selectedContactId);
  const selectedInterview = interviews.find(i => i.id === selectedInterviewId);

  // Error notification component
  const ErrorNotification = () => {
    if (!error) return null;
    
    return (
      <div className="fixed top-4 right-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg z-50">
        <div className="flex items-center justify-between">
          <span>{error}</span>
          <button 
            onClick={() => setError(null)}
            className="ml-4 text-red-600 hover:text-red-800"
          >
            ×
          </button>
        </div>
      </div>
    );
  };

  // Loading overlay component
  const LoadingOverlay = () => {
    if (!loading) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.warn('Logout error:', error);
    }
    setCurrentPage('landing');
    setActiveTab('dashboard');
    setCurrentView('main');
    setContacts([]);
    setInterviews([]);
    setDocuments([]);
    setError(null);
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  // Public pages (before login)
  if (!user) {
    if (currentPage === 'login') {
      return <LoginForm />;
    }
    
    if (currentPage === 'features') {
      return (
        <FeaturesPage 
          onShowLogin={() => setCurrentPage('login')}
          onShowSignup={() => setCurrentPage('login')}
        />
      );
    }
    
    if (currentPage === 'additional-features') {
      return (
        <AdditionalFeaturesPage 
          onShowLogin={() => setCurrentPage('login')}
          onShowSignup={() => setCurrentPage('login')}
        />
      );
    }
    
    // Default to landing page
    return (
      <LandingPage 
        onShowLogin={() => setCurrentPage('login')}
        onShowSignup={() => setCurrentPage('login')}
      />
    );
  }

  // Render based on current view (authenticated users)
  if (currentView === 'contact-detail' && selectedContact) {
    return (
      <div className="flex bg-gray-50 min-h-screen">
        <Navigation 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab);
            goBack();
          }}
          onShowSettings={showSettings}
          onLogout={handleLogout}
        />
        <ContactDetailPage
          contact={selectedContact}
          onBack={goBack}
          onEdit={setEditingContact}
          onUpdateContact={updateContact}
          onAddInteraction={addInteraction}
          onUpdateInteraction={updateInteraction}
          onDeleteInteraction={deleteInteraction}
          networkingStatuses={networkingStatuses}
          nextStepsOptions={nextStepsOptions}
          groups={groups}
        />
        
        {/* Edit Contact Modal */}
        <EditContactModal 
          isOpen={!!editingContact}
          contact={editingContact}
          onClose={() => setEditingContact(null)}
          onSubmit={updateContact}
          networkingStatuses={networkingStatuses}
          nextStepsOptions={nextStepsOptions}
          groups={groups}
        />
        
        <ErrorNotification />
        <LoadingOverlay />
      </div>
    );
  }

  if (currentView === 'interview-detail' && selectedInterview) {
    return (
      <div className="flex bg-gray-50 min-h-screen">
        <Navigation 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab);
            goBack();
          }}
          onShowSettings={showSettings}
          onLogout={handleLogout}
        />
        <InterviewDetailPage
          interview={selectedInterview}
          contacts={contacts}
          onBack={goBack}
          onEdit={setEditingInterview}
          onUpdateInterview={updateInterview}
          onAddRound={addInterviewRound}
          onUpdateRound={updateInterviewRound}
          onDeleteRound={deleteInterviewRound}
          onShowContactDetail={showContactDetail}
          interviewStages={interviewStages}
          interviewNextSteps={interviewNextSteps}
          groups={groups}
        />
        
        {/* Edit Interview Modal */}
        <EditInterviewModal 
          isOpen={!!editingInterview}
          interview={editingInterview}
          onClose={() => setEditingInterview(null)}
          onSubmit={updateInterview}
          interviewStages={interviewStages}
          interviewNextSteps={interviewNextSteps}
          groups={groups}
          contacts={contacts}
        />
        
        <ErrorNotification />
        <LoadingOverlay />
      </div>
    );
  }

  if (currentView === 'settings') {
    return (
      <div className="flex bg-gray-50 min-h-screen">
        <Navigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          onShowSettings={showSettings}
          onLogout={handleLogout}
        />
        <Settings
          onBack={goBack}
        />
        
        <ErrorNotification />
        <LoadingOverlay />
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onShowSettings={showSettings}
        onLogout={handleLogout}
      />
      
      <div className="flex-1">
        {activeTab === 'dashboard' && (
          <Dashboard 
            contacts={contacts}
            interviews={interviews}
            onShowContactDetail={showContactDetail}
            setActiveTab={setActiveTab}
          />
        )}
        
        {activeTab === 'contacts' && (
          <Contacts 
            contacts={contacts}
            networkingStatuses={networkingStatuses}
            nextStepsOptions={nextStepsOptions}
            groups={groups}
            onEdit={setEditingContact}
            onDelete={deleteContact}
            onAdd={() => setShowContactModal(true)}
            onShowContactDetail={showContactDetail}
          />
        )}
        
        {activeTab === 'interviews' && (
          <Interviews 
            interviews={interviews}
            contacts={contacts}
            interviewStages={interviewStages}
            interviewNextSteps={interviewNextSteps}
            groups={groups}
            onEdit={setEditingInterview}
            onDelete={deleteInterview}
            onAdd={() => setShowInterviewModal(true)}
            onShowContactDetail={showContactDetail}
            onShowInterviewDetail={showInterviewDetail}
          />
        )}

        {activeTab === 'documents' && (
          <Documents 
            documents={documents}
            contacts={contacts}
            onAdd={addDocument}
            onEdit={updateDocument}
            onDelete={deleteDocument}
          />
        )}
      </div>

      {/* Modals */}
      <ContactModal 
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        onSubmit={async (contactData) => {
          try {
            await addContact(contactData);
            setShowContactModal(false);
          } catch (error) {
            // Error is already handled in addContact
          }
        }}
        networkingStatuses={networkingStatuses}
        nextStepsOptions={nextStepsOptions}
        groups={groups}
      />

      <EditContactModal 
        isOpen={!!editingContact}
        contact={editingContact}
        onClose={() => setEditingContact(null)}
        onSubmit={async (contactData) => {
          try {
            await updateContact(contactData);
            setEditingContact(null);
          } catch (error) {
            // Error is already handled in updateContact
          }
        }}
        networkingStatuses={networkingStatuses}
        nextStepsOptions={nextStepsOptions}
        groups={groups}
      />

      <InterviewModal 
        isOpen={showInterviewModal}
        onClose={() => setShowInterviewModal(false)}
        onSubmit={async (interviewData) => {
          try {
            await addInterview(interviewData);
            setShowInterviewModal(false);
          } catch (error) {
            // Error is already handled in addInterview
          }
        }}
        interviewStages={interviewStages}
        interviewNextSteps={interviewNextSteps}
        groups={groups}
        contacts={contacts}
      />

      <EditInterviewModal 
        isOpen={!!editingInterview}
        interview={editingInterview}
        onClose={() => setEditingInterview(null)}
        onSubmit={async (interviewData) => {
          try {
            await updateInterview(interviewData);
            setEditingInterview(null);
          } catch (error) {
            // Error is already handled in updateInterview
          }
        }}
        interviewStages={interviewStages}
        interviewNextSteps={interviewNextSteps}
        groups={groups}
        contacts={contacts}
      />

      {/* Global Error and Loading */}
      <ErrorNotification />
      <LoadingOverlay />
    </div>
  );
}
