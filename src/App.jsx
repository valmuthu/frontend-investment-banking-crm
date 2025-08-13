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
  const [previousViewMode, setPreviousViewMode] = useState('cards'); // Track view mode for contacts/interviews
  
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
    '', // Blank option
    'Not Yet Contacted',
    'Initial Outreach Sent',
    'Intro Call Scheduled',
    'Intro Call Complete',
    'Follow-Up Email Sent',
    'Follow-Up Call Scheduled',
    'Follow-Up Call Complete'
  ];

  const nextStepsOptions = [
    '', // Blank option
    'Send Initial Outreach',
    'Schedule Intro Call',
    'Prepare for Upcoming Call',
    'Send Thank You Email',
    'Send Resume',
    'Send Follow-Up Email',
    'Schedule Follow-Up Call'
  ];

  const interviewStages = [
    '', // Blank option
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
    '', // Blank option
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

  // Helper function to get contact ID (handles both id and _id)
  const getContactId = (contact) => contact._id || contact.id;

  // Helper function to get interview ID (handles both id and _id)
  const getInterviewId = (interview) => interview._id || interview.id;

  // CRUD functions with API integration
  const addContact = async (contactData) => {
    try {
      setLoading(true);
      // Convert empty strings to null for backend
      const cleanedData = {
        ...contactData,
        networkingStatus: contactData.networkingStatus || null,
        nextSteps: contactData.nextSteps || null
      };
      const response = await apiService.createContact(cleanedData);
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
      console.log('🔄 Updating contact:', updatedContact);
      
      // Get the correct ID to use for the API call
      const contactId = getContactId(updatedContact);
      console.log('📋 Using contact ID:', contactId);
      
      // Convert empty strings to null for backend
      const cleanedData = {
        ...updatedContact,
        networkingStatus: updatedContact.networkingStatus || null,
        nextSteps: updatedContact.nextSteps || null
      };
      
      const response = await apiService.updateContact(contactId, cleanedData);
      const updated = response.contact;
      console.log('✅ Updated contact received:', updated);
      
      // Update the contacts state - be more specific with ID matching
      setContacts(prev => {
        const newContacts = prev.map(contact => {
          const currentContactId = getContactId(contact);
          const updatedContactId = getContactId(updated);
          
          console.log('🔍 Comparing:', { currentContactId, updatedContactId });
          
          if (currentContactId === updatedContactId) {
            console.log('✅ Match found, updating contact');
            return updated;
          }
          return contact;
        });
        
        console.log('📊 Updated contacts array length:', newContacts.length);
        return newContacts;
      });
      
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
        setContacts(prev => prev.filter(contact => {
          const contactId = getContactId(contact);
          return contactId !== id;
        }));
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
      
      // Convert empty strings to null for backend
      const cleanedData = {
        ...interviewData,
        stage: interviewData.stage || null,
        nextSteps: interviewData.nextSteps || null,
        referralContactId: interviewData.referralContactId || null
      };
      
      // Auto-match referral contact if not set
      if (!cleanedData.referralContactId && cleanedData.firm) {
        const matchingContact = contacts.find(contact => 
          contact.firm.toLowerCase() === cleanedData.firm.toLowerCase() && contact.referred
        );
        if (matchingContact) {
          cleanedData.referralContactId = getContactId(matchingContact);
        }
      }
      
      const response = await apiService.createInterview(cleanedData);
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

      // Convert empty strings to null for backend
      const cleanedData = {
        ...updatedInterview,
        stage: updatedInterview.stage || null,
        nextSteps: updatedInterview.nextSteps || null,
        referralContactId: updatedInterview.referralContactId || null
      };
      
      const interviewId = getInterviewId(cleanedData);
      const response = await apiService.updateInterview(interviewId, cleanedData);
      const updated = response.interview;
      
      setInterviews(prev => prev.map(interview => {
        const currentInterviewId = getInterviewId(interview);
        const updatedInterviewId = getInterviewId(updated);
        
        if (currentInterviewId === updatedInterviewId) {
          return updated;
        }
        return interview;
      }));
      
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
        setInterviews(prev => prev.filter(interview => {
          const interviewId = getInterviewId(interview);
          return interviewId !== id;
        }));
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
        const currentContactId = getContactId(contact);
        if (currentContactId === contactId) {
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
        const currentContactId = getContactId(contact);
        if (currentContactId === contactId) {
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
          const currentContactId = getContactId(contact);
          if (currentContactId === contactId) {
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
        const currentInterviewId = getInterviewId(interview);
        if (currentInterviewId === interviewId) {
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
        const currentInterviewId = getInterviewId(interview);
        if (currentInterviewId === interviewId) {
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
          const currentInterviewId = getInterviewId(interview);
          if (currentInterviewId === interviewId) {
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
      
      // Create FormData for file upload
      const formData = new FormData();
      if (documentData.file) {
        formData.append('file', documentData.file);
      }
      formData.append('name', documentData.name);
      formData.append('type', documentData.type);
      formData.append('notes', documentData.notes || '');
      formData.append('associatedContacts', JSON.stringify(documentData.associatedContacts || []));
      formData.append('associatedFirms', JSON.stringify(documentData.associatedFirms || []));
      formData.append('tags', JSON.stringify(documentData.tags || []));
      
      const response = await apiService.uploadDocument(formData);
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
      const documentId = updatedDocument._id || updatedDocument.id;
      const response = await apiService.updateDocument(documentId, updatedDocument);
      const updated = response.document;
      
      setDocuments(prev => prev.map(doc => {
        const currentDocId = doc._id || doc.id;
        const updatedDocId = updated._id || updated.id;
        return currentDocId === updatedDocId ? updated : doc;
      }));
      
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
        setDocuments(prev => prev.filter(doc => {
          const docId = doc._id || doc.id;
          return docId !== id;
        }));
      } catch (error) {
        console.error('Error deleting document:', error);
        setError('Failed to delete document. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Navigation functions
  const showContactDetail = (contactId, viewMode) => {
    console.log('🔍 Showing contact detail for ID:', contactId);
    setSelectedContactId(contactId);
    setPreviousViewMode(viewMode || 'cards'); // Save the current view mode
    setCurrentView('contact-detail');
  };

  const showInterviewDetail = (interviewId, viewMode) => {
    console.log('🔍 Showing interview detail for ID:', interviewId);
    setSelectedInterviewId(interviewId);
    setPreviousViewMode(viewMode || 'cards'); // Save the current view mode
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
  const selectedContact = contacts.find(c => {
    const contactId = getContactId(c);
    return contactId === selectedContactId;
  });
  
  const selectedInterview = interviews.find(i => {
    const interviewId = getInterviewId(i);
    return interviewId === selectedInterviewId;
  });

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
    console.log('🎯 Rendering interview detail page for:', selectedInterview);
    
    // Check if interview should be marked as referred based on matching contact
    const referralContact = selectedInterview.referralContactId
      ? contacts.find(c => getContactId(c) === selectedInterview.referralContactId)
      : contacts.find(c => c.firm.toLowerCase() === selectedInterview.firm.toLowerCase() && c.referred);
    
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
            onShowContactDetail={(contactId) => showContactDetail(contactId, previousViewMode)}
            interviewStages={interviewStages}
            interviewNextSteps={interviewNextSteps}
            groups={groups}
            hasReferral={!!referralContact}
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
              onShowContactDetail={(contactId) => showContactDetail(contactId, 'cards')}
              onShowInterviewDetail={(interviewId) => showInterviewDetail(interviewId, 'cards')}
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
              previousViewMode={previousViewMode}
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
              onShowContactDetail={(contactId) => showContactDetail(contactId, previousViewMode)}
              onShowInterviewDetail={showInterviewDetail}
              previousViewMode={previousViewMode}
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
