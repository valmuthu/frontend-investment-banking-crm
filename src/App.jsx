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
import { useAuth } from './contexts/AuthContext';
import apiService from './services/apiService';

export default function App() {
  const { user, logout } = useAuth();
  
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

  // Check authentication and load data
  useEffect(() => {
    if (user) {
      setCurrentPage('app');
      loadInitialData();
    }
  }, [user]);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [contactsData, interviewsData, documentsData] = await Promise.all([
        apiService.getContacts(),
        apiService.getInterviews(),
        apiService.getDocuments()
      ]);

      setContacts(contactsData.contacts || []);
      setInterviews(interviewsData.interviews || []);
      setDocuments(documentsData.documents || []);
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError('Failed to load data. Please refresh the page.');
      
      // Fallback to sample data if API fails
      loadSampleData();
    } finally {
      setLoading(false);
    }
  };

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

  // Helper functions with API integration - FIXED CONTACT UPDATE ISSUE
  const addContact = async (contactData) => {
    try {
      setLoading(true);
      const response = await apiService.createContact(contactData);
      const newContact = response.contact;
      
      setContacts(prev => [newContact, ...prev]);
      
      // Track analytics
      try {
        await apiService.trackAnalytics('contact_added');
      } catch (analyticsError) {
        console.warn('Analytics tracking failed:', analyticsError);
      }
      
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
      
      // For sample data mode (when API is not available)
      if (!user || error) {
        setContacts(prev => prev.map(contact => 
          contact.id === updatedContact.id ? updatedContact : contact
        ));
        setLoading(false);
        return updatedContact;
      }

      const response = await apiService.updateContact(updatedContact.id, updatedContact);
      const updated = response.contact;
      
      setContacts(prev => prev.map(contact => 
        contact.id === updated.id ? updated : contact
      ));
      
      return updated;
    } catch (error) {
      console.error('Error updating contact:', error);
      
      // Fallback: update locally if API fails
      setContacts(prev => prev.map(contact => 
        contact.id === updatedContact.id ? updatedContact : contact
      ));
      
      setError('Contact updated locally. Server sync may be delayed.');
      return updatedContact;
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        setLoading(true);
        
        // For sample data mode
        if (!user || error) {
          setContacts(prev => prev.filter(contact => contact.id !== id));
          setLoading(false);
          return;
        }

        await apiService.deleteContact(id);
        setContacts(prev => prev.filter(contact => contact.id !== id));
      } catch (error) {
        console.error('Error deleting contact:', error);
        
        // Fallback: delete locally
        setInterviews(prev => prev.map(interview => {
          if (interview.id === interviewId) {
            return {
              ...interview,
              rounds: interview.rounds.filter(round => round.id !== roundId)
            };
          }
          return interview;
        }));
        
        setError('Interview round deleted locally. Server sync may be delayed.');
      }
    }
  };

  // Document management functions - FIXED FILE UPLOAD
  const addDocument = async (documentData) => {
    try {
      setLoading(true);
      
      // Handle file upload
      let processedDocumentData = { ...documentData };
      
      if (documentData.file) {
        // In a real app, you'd upload to a file storage service
        // For now, we'll store file info locally
        processedDocumentData.fileData = {
          name: documentData.file.name,
          size: documentData.file.size,
          type: documentData.file.type,
          content: documentData.file // Store the actual file for download
        };
        delete processedDocumentData.file;
      }
      
      // For sample data mode
      if (!user || error) {
        const newDocument = {
          ...processedDocumentData,
          id: Date.now(),
          uploadDate: new Date().toISOString().split('T')[0]
        };
        setDocuments(prev => [newDocument, ...prev]);
        setLoading(false);
        return newDocument;
      }

      const response = await apiService.createDocument(processedDocumentData);
      const newDocument = response.document;
      
      setDocuments(prev => [newDocument, ...prev]);
      
      // Track analytics
      try {
        await apiService.trackAnalytics('document_created');
      } catch (analyticsError) {
        console.warn('Analytics tracking failed:', analyticsError);
      }
      
      return newDocument;
    } catch (error) {
      console.error('Error adding document:', error);
      
      // Fallback: add locally
      const newDocument = {
        ...processedDocumentData,
        id: Date.now(),
        uploadDate: new Date().toISOString().split('T')[0]
      };
      setDocuments(prev => [newDocument, ...prev]);
      setError('Document added locally. Server sync may be delayed.');
      return newDocument;
    } finally {
      setLoading(false);
    }
  };

  const updateDocument = async (updatedDocument) => {
    try {
      setLoading(true);
      
      // For sample data mode
      if (!user || error) {
        setDocuments(prev => prev.map(doc => 
          doc.id === updatedDocument.id ? updatedDocument : doc
        ));
        setLoading(false);
        return updatedDocument;
      }

      const response = await apiService.updateDocument(updatedDocument.id, updatedDocument);
      const updated = response.document;
      
      setDocuments(prev => prev.map(doc => 
        doc.id === updated.id ? updated : doc
      ));
      
      return updated;
    } catch (error) {
      console.error('Error updating document:', error);
      
      // Fallback: update locally
      setDocuments(prev => prev.map(doc => 
        doc.id === updatedDocument.id ? updatedDocument : doc
      ));
      
      setError('Document updated locally. Server sync may be delayed.');
      return updatedDocument;
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        setLoading(true);
        
        // For sample data mode
        if (!user || error) {
          setDocuments(prev => prev.filter(doc => doc.id !== id));
          setLoading(false);
          return;
        }

        await apiService.deleteDocument(id);
        setDocuments(prev => prev.filter(doc => doc.id !== id));
      } catch (error) {
        console.error('Error deleting document:', error);
        
        // Fallback: delete locally
        setDocuments(prev => prev.filter(doc => doc.id !== id));
        setError('Document deleted locally. Server sync may be delayed.');
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
    await logout();
    setCurrentPage('landing');
    setActiveTab('dashboard');
    setCurrentView('main');
    setContacts([]);
    setInterviews([]);
    setDocuments([]);
    setError(null);
  };

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
}: delete locally
        setContacts(prev => prev.filter(contact => contact.id !== id));
        setError('Contact deleted locally. Server sync may be delayed.');
      } finally {
        setLoading(false);
      }
    }
  };

  const addInterview = async (interviewData) => {
    try {
      setLoading(true);
      
      // For sample data mode
      if (!user || error) {
        const newInterview = {
          ...interviewData,
          id: Date.now(),
          rounds: []
        };
        setInterviews(prev => [newInterview, ...prev]);
        setLoading(false);
        return newInterview;
      }

      const response = await apiService.createInterview(interviewData);
      const newInterview = response.interview;
      
      setInterviews(prev => [newInterview, ...prev]);
      
      // Track analytics
      try {
        await apiService.trackAnalytics('interview_scheduled');
      } catch (analyticsError) {
        console.warn('Analytics tracking failed:', analyticsError);
      }
      
      return newInterview;
    } catch (error) {
      console.error('Error adding interview:', error);
      
      // Fallback: add locally
      const newInterview = {
        ...interviewData,
        id: Date.now(),
        rounds: []
      };
      setInterviews(prev => [newInterview, ...prev]);
      setError('Interview added locally. Server sync may be delayed.');
      return newInterview;
    } finally {
      setLoading(false);
    }
  };

  const updateInterview = async (updatedInterview) => {
    try {
      setLoading(true);
      
      // For sample data mode
      if (!user || error) {
        setInterviews(prev => prev.map(interview => 
          interview.id === updatedInterview.id ? updatedInterview : interview
        ));
        setLoading(false);
        return updatedInterview;
      }

      const response = await apiService.updateInterview(updatedInterview.id, updatedInterview);
      const updated = response.interview;
      
      setInterviews(prev => prev.map(interview => 
        interview.id === updated.id ? updated : interview
      ));
      
      return updated;
    } catch (error) {
      console.error('Error updating interview:', error);
      
      // Fallback: update locally
      setInterviews(prev => prev.map(interview => 
        interview.id === updatedInterview.id ? updatedInterview : interview
      ));
      
      setError('Interview updated locally. Server sync may be delayed.');
      return updatedInterview;
    } finally {
      setLoading(false);
    }
  };

  const deleteInterview = async (id) => {
    if (window.confirm('Are you sure you want to delete this interview?')) {
      try {
        setLoading(true);
        
        // For sample data mode
        if (!user || error) {
          setInterviews(prev => prev.filter(interview => interview.id !== id));
          setLoading(false);
          return;
        }

        await apiService.deleteInterview(id);
        setInterviews(prev => prev.filter(interview => interview.id !== id));
      } catch (error) {
        console.error('Error deleting interview:', error);
        
        // Fallback: delete locally
        setInterviews(prev => prev.filter(interview => interview.id !== id));
        setError('Interview deleted locally. Server sync may be delayed.');
      } finally {
        setLoading(false);
      }
    }
  };

  const addInteraction = async (contactId, interactionData) => {
    try {
      // For sample data mode
      if (!user || error) {
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
      }

      const response = await apiService.addInteraction(contactId, interactionData);
      const newInteraction = response.interaction;

      setContacts(prev => prev.map(contact => {
        if (contact.id === contactId) {
          return {
            ...contact,
            interactions: [newInteraction, ...(contact.interactions || [])]
          };
        }
        return contact;
      }));

      // Track analytics
      try {
        await apiService.trackAnalytics('interaction_logged');
      } catch (analyticsError) {
        console.warn('Analytics tracking failed:', analyticsError);
      }

      return newInteraction;
    } catch (error) {
      console.error('Error adding interaction:', error);
      
      // Fallback: add locally
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

      setError('Interaction added locally. Server sync may be delayed.');
      return newInteraction;
    }
  };

  const updateInteraction = async (contactId, interactionId, updatedInteraction) => {
    try {
      // For sample data mode
      if (!user || error) {
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
      }

      const response = await apiService.updateInteraction(contactId, interactionId, updatedInteraction);
      const updated = response.interaction;

      setContacts(prev => prev.map(contact => {
        if (contact.id === contactId) {
          return {
            ...contact,
            interactions: contact.interactions.map(interaction =>
              interaction.id === interactionId ? updated : interaction
            )
          };
        }
        return contact;
      }));

      return updated;
    } catch (error) {
      console.error('Error updating interaction:', error);
      
      // Fallback: update locally
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
      
      setError('Interaction updated locally. Server sync may be delayed.');
      return updatedInteraction;
    }
  };

  const deleteInteraction = async (contactId, interactionId) => {
    if (window.confirm('Are you sure you want to delete this interaction?')) {
      try {
        // For sample data mode
        if (!user || error) {
          setContacts(prev => prev.map(contact => {
            if (contact.id === contactId) {
              return {
                ...contact,
                interactions: contact.interactions.filter(interaction => interaction.id !== interactionId)
              };
            }
            return contact;
          }));
          return;
        }

        await apiService.deleteInteraction(contactId, interactionId);
        
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
        
        // Fallback: delete locally
        setContacts(prev => prev.map(contact => {
          if (contact.id === contactId) {
            return {
              ...contact,
              interactions: contact.interactions.filter(interaction => interaction.id !== interactionId)
            };
          }
          return contact;
        }));
        
        setError('Interaction deleted locally. Server sync may be delayed.');
      }
    }
  };

  const addInterviewRound = async (interviewId, roundData) => {
    try {
      // For sample data mode
      if (!user || error) {
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
      }

      const response = await apiService.addInterviewRound(interviewId, roundData);
      const newRound = response.round;

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
      
      // Fallback: add locally
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

      setError('Interview round added locally. Server sync may be delayed.');
      return newRound;
    }
  };

  const updateInterviewRound = async (interviewId, roundId, updatedRound) => {
    try {
      // For sample data mode
      if (!user || error) {
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
      }

      const response = await apiService.updateInterviewRound(interviewId, roundId, updatedRound);
      const updated = response.round;

      setInterviews(prev => prev.map(interview => {
        if (interview.id === interviewId) {
          return {
            ...interview,
            rounds: interview.rounds.map(round =>
              round.id === roundId ? updated : round
            )
          };
        }
        return interview;
      }));

      return updated;
    } catch (error) {
      console.error('Error updating interview round:', error);
      
      // Fallback: update locally
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
      
      setError('Interview round updated locally. Server sync may be delayed.');
      return updatedRound;
    }
  };

  const deleteInterviewRound = async (interviewId, roundId) => {
    if (window.confirm('Are you sure you want to delete this interview round?')) {
      try {
        // For sample data mode
        if (!user || error) {
          setInterviews(prev => prev.map(interview => {
            if (interview.id === interviewId) {
              return {
                ...interview,
                rounds: interview.rounds.filter(round => round.id !== roundId)
              };
            }
            return interview;
          }));
          return;
        }

        await apiService.deleteInterviewRound(interviewId, roundId);
        
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
        
        // Fallback
