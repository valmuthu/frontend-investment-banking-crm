// src/App.jsx
import { useState, useEffect, lazy, Suspense } from 'react';
import { Building2 } from 'lucide-react';

// Import auth context
import { useAuth } from './contexts/AuthContext';

// Import API service
import apiService from './services/apiService';

// Import only essential components directly
import Navigation from './components/Navigation';
import LoginForm from './components/LoginForm';

// Lazy load heavy components to avoid circular dependencies
const Dashboard = lazy(() => import('./components/Dashboard'));
const Contacts = lazy(() => import('./components/Contacts'));
const Interviews = lazy(() => import('./components/Interviews'));
const Documents = lazy(() => import('./components/Documents'));
const ContactDetailPage = lazy(() => import('./components/ContactDetailPage'));
const InterviewDetailPage = lazy(() => import('./components/InterviewDetailPage'));
const Settings = lazy(() => import('./components/Settings'));
const LandingPage = lazy(() => import('./components/LandingPage'));
const FeaturesPage = lazy(() => import('./components/FeaturesPage'));
const AdditionalFeaturesPage = lazy(() => import('./components/AdditionalFeaturesPage'));

// Lazy load modals
const ContactModal = lazy(() => import('./components/Modals').then(module => ({ default: module.ContactModal })));
const EditContactModal = lazy(() => import('./components/Modals').then(module => ({ default: module.EditContactModal })));
const InterviewModal = lazy(() => import('./components/Modals').then(module => ({ default: module.InterviewModal })));
const EditInterviewModal = lazy(() => import('./components/Modals').then(module => ({ default: module.EditInterviewModal })));
const CallModal = lazy(() => import('./components/Modals').then(module => ({ default: module.CallModal })));

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex items-center space-x-3">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="text-gray-600">Loading...</span>
    </div>
  </div>
);

export default function App() {
  // Use auth context directly
  const { user, logout, loading: authLoading } = useAuth();
  
  // App navigation state
  const [currentPage, setCurrentPage] = useState('landing');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentView, setCurrentView] = useState('main');
  
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
  const [dataLoading, setDataLoading] = useState(true);

  // Data states - Initialize as empty arrays
  const [contacts, setContacts] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [documents, setDocuments] = useState([]);

  // Constants - Define these as static values to avoid re-declaration
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
      loadDataFromAPI();
    } else if (!authLoading) {
      setCurrentPage('landing');
      setDataLoading(false);
    }
  }, [user, authLoading]);

  // Load data from API
  const loadDataFromAPI = async () => {
    try {
      setDataLoading(true);
      console.log('📊 Loading data from API...');

      // Load all data in parallel
      const [contactsResponse, interviewsResponse, documentsResponse] = await Promise.all([
        apiService.getContacts(),
        apiService.getInterviews(),
        apiService.getDocuments()
      ]);

      console.log('✅ Data loaded successfully:', {
        contacts: contactsResponse.contacts?.length || 0,
        interviews: interviewsResponse.interviews?.length || 0,
        documents: documentsResponse.documents?.length || 0
      });

      setContacts(contactsResponse.contacts || []);
      setInterviews(interviewsResponse.interviews || []);
      setDocuments(documentsResponse.documents || []);
    } catch (err) {
      console.error('❌ Error loading data:', err);
      setError('Failed to load data. Please refresh the page.');
    } finally {
      setDataLoading(false);
    }
  };

  // CRUD functions with API integration
  const addContact = async (contactData) => {
    try {
      setLoading(true);
      const response = await apiService.createContact(contactData);
      const newContact = response.contact;
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
      const response = await apiService.updateContact(updatedContact.id || updatedContact._id, updatedContact);
      const updated = response.contact;
      setContacts(prev => prev.map(contact => 
        (contact.id === updated.id || contact._id === updated._id) ? updated : contact
      ));
      return updated;
    } catch (error) {
      console.error('Error updating contact:', error);
      setError('Failed to update contact. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        setLoading(true);
        await apiService.deleteContact(id);
        setContacts(prev => prev.filter(contact => contact.id !== id && contact._id !== id));
      } catch (error) {
        console.error('Error deleting contact:', error);
        setError('Failed to delete contact. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Interview CRUD functions with API
  const addInterview = async (interviewData) => {
    try {
      setLoading(true);
      
      // Auto-match referral contact if not set
      if (!interviewData.referralContactId && interviewData.firm) {
        const matchingContact = contacts.find(contact => 
          contact.firm.toLowerCase() === interviewData.firm.toLowerCase()
        );
        if (matchingContact) {
          interviewData.referralContactId = matchingContact._id || matchingContact.id;
        }
      }
      
      const response = await apiService.createInterview(interviewData);
      const newInterview = response.interview;
      setInterviews(prev => [newInterview, ...prev]);
      return newInterview;
    } catch (error) {
      console.error('Error adding interview:', error);
      setError('Failed to add interview. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateInterview = async (updatedInterview) => {
    try {
      setLoading(true);
      const response = await apiService.updateInterview(updatedInterview.id || updatedInterview._id, updatedInterview);
      const updated = response.interview;
      setInterviews(prev => prev.map(interview => 
        (interview.id === updated.id || interview._id === updated._id) ? updated : interview
      ));
      return updated;
    } catch (error) {
      console.error('Error updating interview:', error);
      setError('Failed to update interview. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteInterview = async (id) => {
    if (window.confirm('Are you sure you want to delete this interview?')) {
      try {
        setLoading(true);
        await apiService.deleteInterview(id);
        setInterviews(prev => prev.filter(interview => interview.id !== id && interview._id !== id));
      } catch (error) {
        console.error('Error deleting interview:', error);
        setError('Failed to delete interview. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Interaction functions with API
  const addInteraction = async (contactId, interactionData) => {
    try {
      const response = await apiService.addInteraction(contactId, interactionData);
      const newInteraction = response.interaction;

      setContacts(prev => prev.map(contact => {
        if (contact.id === contactId || contact._id === contactId) {
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
      throw error;
    }
  };

  const updateInteraction = async (contactId, interactionId, updatedInteraction) => {
    try {
      const response = await apiService.updateInteraction(contactId, interactionId, updatedInteraction);
      const updated = response.interaction;

      setContacts(prev => prev.map(contact => {
        if (contact.id === contactId || contact._id === contactId) {
          return {
            ...contact,
            interactions: contact.interactions.map(interaction =>
              (interaction.id === interactionId || interaction._id === interactionId) ? updated : interaction
            )
          };
        }
        return contact;
      }));

      return updated;
    } catch (error) {
      console.error('Error updating interaction:', error);
      setError('Failed to update interaction. Please try again.');
      throw error;
    }
  };

  const deleteInteraction = async (contactId, interactionId) => {
    if (window.confirm('Are you sure you want to delete this interaction?')) {
      try {
        await apiService.deleteInteraction(contactId, interactionId);
        
        setContacts(prev => prev.map(contact => {
          if (contact.id === contactId || contact._id === contactId) {
            return {
              ...contact,
              interactions: contact.interactions.filter(interaction => 
                interaction.id !== interactionId && interaction._id !== interactionId
              )
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

  // Interview round functions with API
  const addInterviewRound = async (interviewId, roundData) => {
    try {
      const response = await apiService.addInterviewRound(interviewId, roundData);
      const newRound = response.round;

      setInterviews(prev => prev.map(interview => {
        if (interview.id === interviewId || interview._id === interviewId) {
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
      throw error;
    }
  };

  const updateInterviewRound = async (interviewId, roundId, updatedRound) => {
    try {
      const response = await apiService.updateInterviewRound(interviewId, roundId, updatedRound);
      const updated = response.round;

      setInterviews(prev => prev.map(interview => {
        if (interview.id === interviewId || interview._id === interviewId) {
          return {
            ...interview,
            rounds: interview.rounds.map(round =>
              (round.id === roundId || round._id === roundId) ? updated : round
            )
          };
        }
        return interview;
      }));

      return updated;
    } catch (error) {
      console.error('Error updating interview round:', error);
      setError('Failed to update interview round. Please try again.');
      throw error;
    }
  };

  const deleteInterviewRound = async (interviewId, roundId) => {
    if (window.confirm('Are you sure you want to delete this interview round?')) {
      try {
        await apiService.deleteInterviewRound(interviewId, roundId);
        
        setInterviews(prev => prev.map(interview => {
          if (interview.id === interviewId || interview._id === interviewId) {
            return {
              ...interview,
              rounds: interview.rounds.filter(round => 
                round.id !== roundId && round._id !== roundId
              )
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

  // Document management functions with API
  const addDocument = async (documentData) => {
    try {
      setLoading(true);
      
      // For file uploads, you'll need to implement FormData handling
      // This is a simplified version
      const response = await apiService.createDocument(documentData);
      const newDocument = response.document;
      setDocuments(prev => [newDocument, ...prev]);
      
      return newDocument;
    } catch (error) {
      console.error('Error adding document:', error);
      setError('Failed to add document. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateDocument = async (updatedDocument) => {
    try {
      setLoading(true);
      const response = await apiService.updateDocument(updatedDocument.id || updatedDocument._id, updatedDocument);
      const updated = response.document;
      
      setDocuments(prev => prev.map(doc => 
        (doc.id === updated.id || doc._id === updated._id) ? updated : doc
      ));
      
      return updated;
    } catch (error) {
      console.error('Error updating document:', error);
      setError('Failed to update document. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        setLoading(true);
        await apiService.deleteDocument(id);
        setDocuments(prev => prev.filter(doc => doc.id !== id && doc._id !== id));
      } catch (error) {
        console.error('Error deleting document:', error);
        setError('Failed to delete document. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Navigation functions
  const showContactDetail = (contactId) => {
    setSelectedContactId(contactId);
    setCurrentView('contact-detail');
  };

  const showInterviewDetail = (interviewId) => {
    // When clicking on an interview from Recent interviews, open the specific detail page
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

  // Get selected items - handle both id and _id
  const selectedContact = contacts.find(c => c.id === selectedContactId || c._id === selectedContactId);
  const selectedInterview = interviews.find(i => i.id === selectedInterviewId || i._id === selectedInterviewId);

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

  // Show loading while checking auth or loading data
  if (authLoading || (user && dataLoading)) {
    return <LoadingFallback />;
  }

  // Public pages (before login)
  if (!user) {
    if (currentPage === 'login') {
      return <LoginForm />;
    }
    
    if (currentPage === 'features') {
      return (
        <Suspense fallback={<LoadingFallback />}>
          <FeaturesPage 
            onShowLogin={() => setCurrentPage('login')}
            onShowSignup={() => setCurrentPage('login')}
          />
        </Suspense>
      );
    }
    
    if (currentPage === 'additional-features') {
      return (
        <Suspense fallback={<LoadingFallback />}>
          <AdditionalFeaturesPage 
            onShowLogin={() => setCurrentPage('login')}
            onShowSignup={() => setCurrentPage('login')}
          />
        </Suspense>
      );
    }
    
    // Default to landing page
    return (
      <Suspense fallback={<LoadingFallback />}>
        <LandingPage 
          onShowLogin={() => setCurrentPage('login')}
          onShowSignup={() => setCurrentPage('login')}
        />
      </Suspense>
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
        <Suspense fallback={<LoadingFallback />}>
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
          
          <EditContactModal 
            isOpen={!!editingContact}
            contact={editingContact}
            onClose={() => setEditingContact(null)}
            onSubmit={updateContact}
            networkingStatuses={networkingStatuses}
            nextStepsOptions={nextStepsOptions}
            groups={groups}
          />
        </Suspense>
        
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
        <Suspense fallback={<LoadingFallback />}>
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
        </Suspense>
        
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
          setActiveTab={(tab) => {
            setActiveTab(tab);
            goBack();
          }}
          onShowSettings={showSettings}
          onLogout={handleLogout}
        />
        <Suspense fallback={<LoadingFallback />}>
          <Settings
            onBack={goBack}
            onLogout={handleLogout}
          />
        </Suspense>
        
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
        <Suspense fallback={<LoadingFallback />}>
          {activeTab === 'dashboard' && (
            <Dashboard 
              contacts={contacts}
              interviews={interviews}
              onShowContactDetail={showContactDetail}
              onShowInterviewDetail={showInterviewDetail}
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
        </Suspense>
      </div>

      {/* Modals */}
      <Suspense fallback={null}>
        <ContactModal 
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          onSubmit={addContact}
          networkingStatuses={networkingStatuses}
          nextStepsOptions={nextStepsOptions}
          groups={groups}
        />

        <EditContactModal 
          isOpen={!!editingContact}
          contact={editingContact}
          onClose={() => setEditingContact(null)}
          onSubmit={updateContact}
          networkingStatuses={networkingStatuses}
          nextStepsOptions={nextStepsOptions}
          groups={groups}
        />

        <InterviewModal 
          isOpen={showInterviewModal}
          onClose={() => setShowInterviewModal(false)}
          onSubmit={addInterview}
          interviewStages={interviewStages}
          interviewNextSteps={interviewNextSteps}
          groups={groups}
          contacts={contacts}
        />

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

        <CallModal 
          isOpen={showCallModal}
          onClose={() => setShowCallModal(false)}
          onSubmit={(data) => {
            if (selectedContactId) {
              addInteraction(selectedContactId, data);
            }
            setShowCallModal(false);
          }}
        />
      </Suspense>
      
      <ErrorNotification />
      <LoadingOverlay />
    </div>
  );
}
