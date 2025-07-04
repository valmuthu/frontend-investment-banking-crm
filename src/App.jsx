import { useState } from 'react';
import { Building2 } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Contacts from './components/Contacts';
import Interviews from './components/Interviews';
import ContactDetailPage from './components/ContactDetailPage';
import InterviewDetailPage from './components/InterviewDetailPage';
import Navigation from './components/Navigation';
import { ContactModal, EditContactModal, InterviewModal, EditInterviewModal, CallModal } from './components/Modals';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentView, setCurrentView] = useState('main'); // 'main', 'contact-detail', 'interview-detail'
  
  // Modal states
  const [showContactModal, setShowContactModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);
  const [showCallModal, setShowCallModal] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [selectedInterviewId, setSelectedInterviewId] = useState(null);

  // Enhanced sample data
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: 'Kevin Burns',
      position: 'Associate',
      group: 'TMT',
      email: 'burnsk@gmail.com',
      phone: '+1 (212) 555-0123',
      linkedin: 'https://linkedin.com/in/kevinburns',
      firm: 'Evercore',
      networkingStatus: 'Follow up Call Scheduled',
      networkingDate: '2025-06-15',
      nextSteps: 'Prepare for Upcoming Call',
      nextStepsDate: '2025-06-20',
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
      networkingStatus: 'Regular Contact',
      networkingDate: '2025-06-25',
      nextSteps: 'Monthly Check-in Call',
      nextStepsDate: '2025-07-25',
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
      nextSteps: 'Follow up Email',
      nextStepsDate: '2025-07-08',
      referred: true,
      notes: 'Alumni connection, interested in FIG deals.',
      interactions: []
    }
  ]);

  const [interviews, setInterviews] = useState([
    {
      id: 1,
      firm: 'Goldman Sachs',
      position: 'Investment Banking Analyst',
      group: 'TMT',
      stage: 'Final Round',
      stageDate: '2025-07-10',
      nextSteps: 'Send Thank You Email',
      nextStepsDate: '2025-07-11',
      priority: 'High',
      applicationDate: '2025-06-01',
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
      priority: 'Medium',
      applicationDate: '2025-06-10',
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

  // Constants
  const networkingStatuses = [
    'To Be Contacted',
    'Initial Outreach Sent',
    'Follow up Call Scheduled',
    'Intro Call Complete',
    'Follow up Email Sent',
    'Meeting Scheduled',
    'Regular Contact'
  ];

  const nextStepsOptions = [
    'Send Initial Outreach',
    'Follow up Email',
    'Schedule Call',
    'Prepare for Upcoming Call',
    'Send Thank You Email',
    'Schedule Intro Call',
    'Send Resume',
    'Send Thank You Note',
    'Schedule Follow-up Meeting',
    'Send Proposal',
    'Prepare Interview Materials',
    'Complete Application',
    'No Action Required'
  ];

  const interviewStages = [
    'Applied',
    'Phone Screen',
    'First Round',
    'Second Round',
    'Final Round',
    'Case Study',
    'Offer',
    'Rejected',
    'Withdrawn'
  ];

  const interviewNextSteps = [
    'Wait for Response',
    'Schedule Next Round',
    'Prepare Case Study',
    'Follow Up on Application',
    'Send Thank You Email',
    'Submit Additional Materials',
    'Schedule Call with Team',
    'Complete Assessment',
    'Negotiate Offer',
    'Make Decision'
  ];

  const groups = ['TMT', 'Healthcare', 'Financial Services', 'Real Estate', 'Energy', 'Consumer'];

  // Helper functions
  const addContact = (contactData) => {
    const contact = {
      ...contactData,
      id: Date.now(),
      interactions: []
    };
    setContacts([...contacts, contact]);
  };

  const updateContact = (updatedContact) => {
    setContacts(contacts.map(contact => 
      contact.id === updatedContact.id ? updatedContact : contact
    ));
  };

  const deleteContact = (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      setContacts(contacts.filter(contact => contact.id !== id));
    }
  };

  const addInterview = (interviewData) => {
    const interview = {
      ...interviewData,
      id: Date.now(),
      rounds: []
    };
    setInterviews([...interviews, interview]);
  };

  const updateInterview = (updatedInterview) => {
    setInterviews(interviews.map(interview => 
      interview.id === updatedInterview.id ? updatedInterview : interview
    ));
  };

  const deleteInterview = (id) => {
    if (window.confirm('Are you sure you want to delete this interview?')) {
      setInterviews(interviews.filter(interview => interview.id !== id));
    }
  };

  const addInteraction = (contactId, interactionData) => {
    const updatedContacts = contacts.map(contact => {
      if (contact.id === contactId) {
        return {
          ...contact,
          interactions: [{
            id: Date.now(),
            ...interactionData
          }, ...contact.interactions]
        };
      }
      return contact;
    });
    setContacts(updatedContacts);
  };

  const updateInteraction = (contactId, interactionId, updatedInteraction) => {
    const updatedContacts = contacts.map(contact => {
      if (contact.id === contactId) {
        return {
          ...contact,
          interactions: contact.interactions.map(interaction =>
            interaction.id === interactionId ? { ...interaction, ...updatedInteraction } : interaction
          )
        };
      }
      return contact;
    });
    setContacts(updatedContacts);
  };

  const deleteInteraction = (contactId, interactionId) => {
    if (window.confirm('Are you sure you want to delete this interaction?')) {
      const updatedContacts = contacts.map(contact => {
        if (contact.id === contactId) {
          return {
            ...contact,
            interactions: contact.interactions.filter(interaction => interaction.id !== interactionId)
          };
        }
        return contact;
      });
      setContacts(updatedContacts);
    }
  };

  const addInterviewRound = (interviewId, roundData) => {
    const updatedInterviews = interviews.map(interview => {
      if (interview.id === interviewId) {
        return {
          ...interview,
          rounds: [...interview.rounds, {
            id: Date.now(),
            ...roundData
          }]
        };
      }
      return interview;
    });
    setInterviews(updatedInterviews);
  };

  const updateInterviewRound = (interviewId, roundId, updatedRound) => {
    const updatedInterviews = interviews.map(interview => {
      if (interview.id === interviewId) {
        return {
          ...interview,
          rounds: interview.rounds.map(round =>
            round.id === roundId ? { ...round, ...updatedRound } : round
          )
        };
      }
      return interview;
    });
    setInterviews(updatedInterviews);
  };

  const deleteInterviewRound = (interviewId, roundId) => {
    if (window.confirm('Are you sure you want to delete this interview round?')) {
      const updatedInterviews = interviews.map(interview => {
        if (interview.id === interviewId) {
          return {
            ...interview,
            rounds: interview.rounds.filter(round => round.id !== roundId)
          };
        }
        return interview;
      });
      setInterviews(updatedInterviews);
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

  const goBack = () => {
    setCurrentView('main');
    setSelectedContactId(null);
    setSelectedInterviewId(null);
  };

  const selectedContact = contacts.find(c => c.id === selectedContactId);
  const selectedInterview = interviews.find(i => i.id === selectedInterviewId);

  // Render based on current view
  if (currentView === 'contact-detail' && selectedContact) {
    return (
      <div className="flex bg-gray-50 min-h-screen">
        <Navigation 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab);
            goBack();
          }}
          setSelectedContactId={setSelectedContactId}
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
          setSelectedContactId={setSelectedContactId}
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
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        setSelectedContactId={setSelectedContactId}
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
      </div>

      {/* Modals */}
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
    </div>
  );
}
