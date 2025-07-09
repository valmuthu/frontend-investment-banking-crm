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

// Mock authentication for demo purposes
const mockAuthContext = {
  user: null,
  login: async (credentials) => {
    console.log('Mock login:', credentials);
    return { success: true, user: { id: 1, email: credentials.email, name: 'Demo User' } };
  },
  logout: () => {
    console.log('Mock logout');
  },
  loading: false
};

export default function App() {
  // Mock authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  
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

  // Data states
  const [contacts, setContacts] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [documents, setDocuments] = useState([]);

  // Constants
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

  // Load sample data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadSampleData();
    }
  }, [isAuthenticated]);

  const loadSampleData = () => {
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
      }
    ]);
  };

  // Mock authentication functions
  const handleLogin = async (credentials) => {
    setAuthLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsAuthenticated(true);
      setCurrentPage('app');
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('landing');
    setActiveTab('dashboard');
    setCurrentView('main');
    setContacts([]);
    setInterviews([]);
    setDocuments([]);
    setError(null);
  };

  // CRUD functions
  const addContact = async (contactData) => {
    const newContact = {
      ...contactData,
      id: Date.now(),
      interactions: []
    };
    setContacts(prev => [newContact, ...prev]);
    return newContact;
  };

  const updateContact = async (updatedContact) => {
    setContacts(prev => prev.map(contact => 
      contact.id === updatedContact.id ? updatedContact : contact
    ));
    return updatedContact;
  };

  const deleteContact = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      setContacts(prev => prev.filter(contact => contact.id !== id));
    }
  };

  const addInterview = async (interviewData) => {
    const newInterview = {
      ...interviewData,
      id: Date.now(),
      rounds: []
    };
    setInterviews(prev => [newInterview, ...prev]);
    return newInterview;
  };

  const updateInterview = async (updatedInterview) => {
    setInterviews(prev => prev.map(interview => 
      interview.id === updatedInterview.id ? updatedInterview : interview
    ));
    return updatedInterview;
  };

  const deleteInterview = async (id) => {
    if (window.confirm('Are you sure you want to delete this interview?')) {
      setInterviews(prev => prev.filter(interview => interview.id !== id));
    }
  };

  const addInteraction = async (contactId, interactionData) => {
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
  };

  const updateInteraction = async (contactId, interactionId, updatedInteraction) => {
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
  };

  const deleteInteraction = async (contactId, interactionId) => {
    if (window.confirm('Are you sure you want to delete this interaction?')) {
      setContacts(prev => prev.map(contact => {
        if (contact.id === contactId) {
          return {
            ...contact,
            interactions: contact.interactions.filter(interaction => interaction.id !== interactionId)
          };
        }
        return contact;
      }));
    }
  };

  const addInterviewRound = async (interviewId, roundData) => {
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
  };

  const updateInterviewRound = async (interviewId, roundId, updatedRound) => {
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
  };

  const deleteInterviewRound = async (interviewId, roundId) => {
    if (window.confirm('Are you sure you want to delete this interview round?')) {
      setInterviews(prev => prev.map(interview => {
        if (interview.id === interviewId) {
          return {
            ...interview,
            rounds: interview.rounds.filter(round => round.id !== roundId)
          };
        }
        return interview;
      }));
    }
  };

  // Document management functions
  const addDocument = async (documentData) => {
    const newDocument = {
      ...documentData,
      id: Date.now(),
      uploadDate: new Date().toISOString().split('T')[0]
    };
    setDocuments(prev => [newDocument, ...prev]);
    return newDocument;
  };

  const updateDocument = async (updatedDocument) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === updatedDocument.id ? updatedDocument : doc
    ));
    return updatedDocument;
  };

  const deleteDocument = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setDocuments(prev => prev.filter(doc => doc.id !== id));
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
  if (!isAuthenticated) {
    if (currentPage === 'login') {
      return <LoginForm onLogin={handleLogin} />;
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
        
        <EditContactModal 
          isOpen={!!editingContact}
          contact={editingContact}
          onClose={() => setEditingContact(null)}
          onSubmit={updateContact}
          networkingStatuses={networkingStatuses}
          nextStepsOptions={nextStepsOptions}
          groups={groups}
        />
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
        <Settings onBack={goBack} />
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
          await addContact(contactData);
          setShowContactModal(false);
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
          await updateContact(contactData);
          setEditingContact(null);
        }}
        networkingStatuses={networkingStatuses}
        nextStepsOptions={nextStepsOptions}
        groups={groups}
      />

      <InterviewModal 
        isOpen={showInterviewModal}
        onClose={() => setShowInterviewModal(false)}
        onSubmit={async (interviewData) => {
          await addInterview(interviewData);
          setShowInterviewModal(false);
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
          await updateInterview(interviewData);
          setEditingInterview(null);
        }}
        interviewStages={interviewStages}
        interviewNextSteps={interviewNextSteps}
        groups={groups}
        contacts={contacts}
      />
    </div>
  );
}
