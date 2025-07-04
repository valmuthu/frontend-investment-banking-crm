import { useState } from 'react';
import { Building2 } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Contacts from './components/Contacts';
import Interviews from './components/Interviews';
import Navigation from './components/Navigation';
import { ContactModal, EditContactModal, InterviewModal, EditInterviewModal, CallModal, ContactDetailModal } from './components/Modals';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Modal states
  const [showContactModal, setShowContactModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);
  const [showCallModal, setShowCallModal] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [showContactDetail, setShowContactDetail] = useState(false);

  // Sample data - you can move this to a separate data file
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
      networkingStatusDate: '2025-06-15',
      nextSteps: 'Prepare for Upcoming Call',
      nextStepsDate: '2025-06-20',
      referred: true,
      referredBy: 'Sarah Johnson',
      notes: 'Very interested in TMT deals. Strong technical background.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      networkingHistory: [
        {
          id: 1,
          status: 'Initial Outreach Sent',
          date: '2025-06-10',
          notes: 'Sent LinkedIn connection request'
        }
      ],
      callHistory: [
        {
          id: 1,
          type: 'Call',
          date: '2025-06-20',
          duration: '25 min',
          notes: 'Great conversation about TMT deals.',
          outcome: 'Positive'
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
      networkingStatusDate: '2025-06-25',
      nextSteps: 'Monthly Check-in Call',
      nextStepsDate: '2025-07-25',
      referred: false,
      referredBy: '',
      notes: 'Senior contact who provides market insights.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b12c?w=150&h=150&fit=crop&crop=face',
      networkingHistory: [],
      callHistory: []
    }
  ]);

  const [interviews, setInterviews] = useState([
    {
      id: 1,
      company: 'Goldman Sachs',
      position: 'Investment Banking Analyst',
      group: 'TMT',
      date: '2025-07-10',
      time: '10:00 AM',
      interviewer: 'John Smith',
      status: 'Scheduled',
      stage: 'Super Day',
      nextSteps: 'Send Thank You Email',
      nextStepsDate: '2025-07-11',
      notes: 'Technical interview focus on valuation models',
      referralContactId: 1,
      interviewHistory: [
        {
          id: 1,
          stage: 'First Round',
          date: '2025-06-15',
          interviewer: 'Jane Doe',
          outcome: 'Advanced'
        }
      ]
    },
    {
      id: 2,
      company: 'Morgan Stanley',
      position: 'Investment Banking Analyst',
      group: 'Healthcare',
      date: '2025-07-15',
      time: '2:00 PM',
      interviewer: 'Mike Chen',
      status: 'Scheduled',
      stage: 'First Round',
      nextSteps: 'Schedule Next Round',
      nextStepsDate: '2025-07-16',
      notes: 'Initial screening call',
      referralContactId: 2,
      interviewHistory: []
    }
  ]);

  const [newCall, setNewCall] = useState({
    type: 'Call',
    date: new Date().toISOString().split('T')[0],
    duration: '',
    notes: '',
    outcome: ''
  });

  // Constants
  const networkingStatuses = [
    'To Be Contacted',
    'Initial Outreach Sent',
    'Intro Call Complete',
    'Follow-Up Complete',
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
    'Monthly Check-in Call',
    'Schedule Follow-up Meeting'
  ];

  const interviewStages = [
    'Applied',
    'First Round',
    'Second Round',
    'Super Day',
    'Offer'
  ];

  const interviewNextSteps = [
    'Schedule Next Round',
    'Follow Up on Application',
    'Send Thank You Email',
    'Wait for Response',
    'Negotiate Offer',
    'Accept/Decline Offer'
  ];

  const groups = ['TMT', 'Healthcare', 'Financial Services', 'Real Estate', 'Energy', 'Consumer'];

  // Helper functions
  const addContact = (contactData) => {
    const contact = {
      ...contactData,
      id: Date.now(),
      callHistory: [],
      networkingHistory: [],
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    };
    setContacts([...contacts, contact]);
  };

  const updateContact = (updatedContact) => {
    // Check if networking status changed to add to history
    const oldContact = contacts.find(c => c.id === updatedContact.id);
    if (oldContact && oldContact.networkingStatus !== updatedContact.networkingStatus) {
      const historyEntry = {
        id: Date.now(),
        status: oldContact.networkingStatus,
        date: oldContact.networkingStatusDate,
        notes: `Changed from ${oldContact.networkingStatus} to ${updatedContact.networkingStatus}`
      };
      updatedContact.networkingHistory = [...(oldContact.networkingHistory || []), historyEntry];
    }
    
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
      interviewHistory: []
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

  const addCallRecord = (callData) => {
    if (callData.notes && selectedContactId) {
      const updatedContacts = contacts.map(contact => {
        if (contact.id === selectedContactId) {
          return {
            ...contact,
            callHistory: [{
              id: Date.now(),
              ...callData
            }, ...contact.callHistory]
          };
        }
        return contact;
      });
      setContacts(updatedContacts);
    }
  };

  const selectedContact = contacts.find(c => c.id === selectedContactId);

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
            setSelectedContactId={setSelectedContactId}
            setShowContactDetail={setShowContactDetail}
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
            setSelectedContactId={setSelectedContactId}
            setShowContactDetail={setShowContactDetail}
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
            setSelectedContactId={setSelectedContactId}
            setShowContactDetail={setShowContactDetail}
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

      <CallModal 
        isOpen={showCallModal}
        onClose={() => setShowCallModal(false)}
        onSubmit={addCallRecord}
        newCall={newCall}
        setNewCall={setNewCall}
      />

      <ContactDetailModal 
        isOpen={showContactDetail}
        contact={selectedContact}
        onClose={() => {
          setShowContactDetail(false);
          setSelectedContactId(null);
        }}
        onEdit={() => {
          setEditingContact(selectedContact);
          setShowContactDetail(false);
        }}
        onAddCall={() => {
          setShowCallModal(true);
          setShowContactDetail(false);
        }}
      />
    </div>
  );
}
