import { useState } from 'react';
import { User, Calendar, FileText, BarChart3, Search, Plus, Edit2, Trash2, Phone, ExternalLink, Check, Filter, ArrowUpDown, Clock, DollarSign, ArrowLeft, MessageSquare, PhoneCall, Mail, MapPin, Building2, ChevronRight, Eye } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('contacts');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterStatus, setFilterStatus] = useState('');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [showCallModal, setShowCallModal] = useState(false);
  const [newCall, setNewCall] = useState({
    type: 'Call',
    date: new Date().toISOString().split('T')[0],
    duration: '',
    notes: '',
    outcome: ''
  });

  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: 'Kevin Burns',
      position: 'Associate, TMT',
      email: 'burnsk@gmail.com',
      phone: '+1 (212) 555-0123',
      linkedin: 'https://linkedin.com/in/kevinburns',
      firm: 'Evercore',
      location: 'New York, NY',
      networkingStatus: 'Follow up Call Scheduled',
      networkingDate: 'Jun 11, 2025',
      nextSteps: 'Prepare for Upcoming Call',
      nextStepsDate: 'Jun 11, 2025',
      referred: true,
      referredBy: 'Sarah Johnson',
      notes: 'Colleague referred. Assess profile for suitability. Very interested in TMT deals.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      callHistory: [
        {
          id: 1,
          type: 'Call',
          date: '2025-06-20',
          duration: '25 min',
          notes: 'Great conversation about TMT deals. Discussed upcoming opportunities.',
          outcome: 'Positive'
        },
        {
          id: 2,
          type: 'Email',
          date: '2025-06-15',
          duration: '',
          notes: 'Sent introduction email with background and experience.',
          outcome: 'Sent'
        }
      ]
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      position: 'VP Investment Banking',
      email: 'sarah.johnson@ms.com',
      phone: '+1 (212) 555-0456',
      linkedin: 'https://linkedin.com/in/sarahjohnson',
      firm: 'Morgan Stanley',
      location: 'New York, NY',
      networkingStatus: 'Regular Contact',
      networkingDate: 'Jun 25, 2025',
      nextSteps: 'Monthly Check-in Call',
      nextStepsDate: 'Jul 25, 2025',
      referred: false,
      referredBy: '',
      notes: 'Senior contact who provides market insights. Very helpful with referrals.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b12c?w=150&h=150&fit=crop&crop=face',
      callHistory: [
        {
          id: 1,
          type: 'Call',
          date: '2025-06-25',
          duration: '30 min',
          notes: 'Monthly check-in. Discussed market trends and potential openings.',
          outcome: 'Positive'
        }
      ]
    }
  ]);

  const [interviews, setInterviews] = useState([
    {
      id: 1,
      company: 'Goldman Sachs',
      position: 'Investment Banking Analyst',
      date: '2025-07-10',
      time: '10:00 AM',
      interviewer: 'John Smith',
      status: 'Scheduled',
      stage: 'Final Round',
      notes: 'Technical interview focus on valuation models'
    }
  ]);

  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Resume_2025.pdf',
      type: 'Resume',
      uploadDate: '2025-07-01',
      size: '245 KB',
      status: 'Active'
    }
  ]);

  const [newContact, setNewContact] = useState({
    name: '',
    position: '',
    email: '',
    phone: '',
    linkedin: '',
    firm: '',
    location: '',
    networkingStatus: 'To Be Contacted',
    networkingDate: '',
    nextSteps: '',
    nextStepsDate: '',
    referred: false,
    referredBy: '',
    notes: ''
  });

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
    'Monthly Check-in Call',
    'Schedule Follow-up Meeting',
    'Send Proposal',
    'No Action Required'
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'To Be Contacted': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Initial Outreach Sent': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Follow up Call Scheduled': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Intro Call Complete': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Follow up Email Sent': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Meeting Scheduled': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Regular Contact': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredAndSortedContacts = contacts
    .filter(contact => {
      const matchesSearch = searchTerm === '' || 
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.firm.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.position.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterStatus === '' || contact.networkingStatus === filterStatus;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortField === '') return 0;
      
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setShowSortMenu(false);
  };

  const handleEdit = (contact) => {
    setEditingContact({ ...contact });
  };

  const handleSaveEdit = () => {
    setContacts(contacts.map(contact => 
      contact.id === editingContact.id ? editingContact : contact
    ));
    setEditingContact(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      setContacts(contacts.filter(contact => contact.id !== id));
    }
  };

  const addContact = () => {
    if (newContact.name && newContact.firm) {
      const contact = {
        ...newContact,
        id: Date.now(),
        callHistory: [],
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      };
      setContacts([...contacts, contact]);
      setNewContact({
        name: '',
        position: '',
        email: '',
        phone: '',
        linkedin: '',
        firm: '',
        location: '',
        networkingStatus: 'To Be Contacted',
        networkingDate: '',
        nextSteps: '',
        nextStepsDate: '',
        referred: false,
        referredBy: '',
        notes: ''
      });
      setShowContactModal(false);
    }
  };

  const addCallRecord = () => {
    if (newCall.notes) {
      const updatedContacts = contacts.map(contact => {
        if (contact.id === selectedContactId) {
          return {
            ...contact,
            callHistory: [{
              id: Date.now(),
              ...newCall
            }, ...contact.callHistory]
          };
        }
        return contact;
      });
      setContacts(updatedContacts);
      setNewCall({
        type: 'Call',
        date: new Date().toISOString().split('T')[0],
        duration: '',
        notes: '',
        outcome: ''
      });
      setShowCallModal(false);
    }
  };

  const selectedContact = contacts.find(c => c.id === selectedContactId);

  const Navigation = () => (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <div className="flex items-center mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">IB CRM</h1>
        </div>
        <nav className="space-y-1">
          <button
            onClick={() => {
              setActiveTab('dashboard');
              setSelectedContactId(null);
            }}
            className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
              activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            Dashboard
          </button>
          <button
            onClick={() => {
              setActiveTab('contacts');
              setSelectedContactId(null);
            }}
            className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
              activeTab === 'contacts' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <User className="w-5 h-5 mr-3" />
            Contacts
          </button>
          <button
            onClick={() => {
              setActiveTab('interviews');
              setSelectedContactId(null);
            }}
            className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
              activeTab === 'interviews' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Calendar className="w-5 h-5 mr-3" />
            Interviews
          </button>
          <button
            onClick={() => {
              setActiveTab('documents');
              setSelectedContactId(null);
            }}
            className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
              activeTab === 'documents' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-5 h-5 mr-3" />
            Documents
          </button>
        </nav>
      </div>
    </div>
  );

  const ContactDetailPage = () => {
    if (!selectedContact) return null;

    return (
      <div className="flex-1 bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSelectedContactId(null)}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center">
                <img
                  src={selectedContact.avatar}
                  alt={selectedContact.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{selectedContact.name}</h1>
                  <p className="text-gray-600">{selectedContact.position} at {selectedContact.firm}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowCallModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Interaction
              </button>
              <button
                onClick={() => handleEdit(selectedContact)}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center hover:bg-gray-50 transition-colors"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-400 mr-3" />
                    <a href={`mailto:${selectedContact.email}`} className="text-blue-600 hover:text-blue-800">
                      {selectedContact.email}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-400 mr-3" />
                    <a href={`tel:${selectedContact.phone}`} className="text-blue-600 hover:text-blue-800">
                      {selectedContact.phone}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <ExternalLink className="w-5 h-5 text-gray-400 mr-3" />
                    <a href={selectedContact.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      LinkedIn Profile
                    </a>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">{selectedContact.location}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Networking Status</label>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedContact.networkingStatus)}`}>
                        {selectedContact.networkingStatus}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Next Steps</label>
                    <p className="mt-1 text-gray-900">{selectedContact.nextSteps}</p>
                    <p className="text-sm text-gray-500">Due: {selectedContact.nextStepsDate}</p>
                  </div>
                  {selectedContact.referred && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Referred By</label>
                      <p className="mt-1 text-gray-900">{selectedContact.referredBy}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                <p className="text-gray-700 leading-relaxed">{selectedContact.notes}</p>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Interaction History</h3>
                  <span className="text-sm text-gray-500">
                    {selectedContact.callHistory.length} interactions
                  </span>
                </div>
                
                <div className="space-y-4">
                  {selectedContact.callHistory.map((interaction) => (
                    <div key={interaction.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                            interaction.type === 'Call' ? 'bg-green-100' :
                            interaction.type === 'Email' ? 'bg-blue-100' :
                            'bg-purple-100'
                          }`}>
                            {interaction.type === 'Call' ? (
                              <PhoneCall className="w-5 h-5 text-green-600" />
                            ) : interaction.type === 'Email' ? (
                              <Mail className="w-5 h-5 text-blue-600" />
                            ) : (
                              <MessageSquare className="w-5 h-5 text-purple-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <h4 className="font-medium text-gray-900">{interaction.type}</h4>
                              {interaction.duration && (
                                <span className="text-sm text-gray-500">• {interaction.duration}</span>
                              )}
                              <span className="text-sm text-gray-500">• {interaction.date}</span>
                            </div>
                            <p className="mt-2 text-gray-700">{interaction.notes}</p>
                            {interaction.outcome && (
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                                interaction.outcome === 'Positive' || interaction.outcome === 'Excellent' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {interaction.outcome}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {selectedContact.callHistory.length === 0 && (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No interactions recorded yet</p>
                      <button
                        onClick={() => setShowCallModal(true)}
                        className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Add your first interaction
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Contacts = () => (
    <div className="flex-1 bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
            <p className="text-gray-600 mt-1">Manage your investment banking network</p>
          </div>
          <button
            onClick={() => setShowContactModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </button>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex items-center px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Networking Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Statuses</option>
                    {networkingStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowUpDown className="w-4 h-4 mr-2" />
              Sort
            </button>
            {showSortMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-2">
                  <button onClick={() => handleSort('name')} className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">Name</button>
                  <button onClick={() => handleSort('firm')} className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">Firm</button>
                  <button onClick={() => handleSort('networkingStatus')} className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">Status</button>
                  <button onClick={() => handleSort('nextStepsDate')} className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">Next Steps Date</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedContacts.map(contact => (
            <div key={contact.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-12 h-12 rounded-full object-cover mr-3"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                      <p className="text-sm text-gray-600">{contact.position}</p>
                      <p className="text-sm font-medium text-gray-900">{contact.firm}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedContactId(contact.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(contact)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(contact.networkingStatus)}`}>
                      {contact.networkingStatus}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {contact.location}
                  </div>

                  {contact.referred && (
                    <div className="flex items-center text-sm text-green-600">
                      <Check className="w-4 h-4 mr-2" />
                      Referred by {contact.referredBy}
                    </div>
                  )}

                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Next Steps:</span>
                      <span className="font-medium text-gray-900">{contact.nextStepsDate}</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{contact.nextSteps}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3">
                    <div className="flex items-center space-x-3">
                      <a href={`mailto:${contact.email}`} className="text-gray-400 hover:text-blue-600 transition-colors">
                        <Mail className="w-4 h-4" />
                      </a>
                      <a href={`tel:${contact.phone}`} className="text-gray-400 hover:text-green-600 transition-colors">
                        <Phone className="w-4 h-4" />
                      </a>
                      <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <button
                      onClick={() => setSelectedContactId(contact.id)}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Details
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAndSortedContacts.length === 0 && (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
            <p className="text-gray-500 mb-6">Get started by adding your first contact</p>
            <button
              onClick={() => setShowContactModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Contact
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const Dashboard = () => (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Investment Banking CRM Overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Contacts</p>
              <p className="text-3xl font-bold text-gray-900">{contacts.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Networking</p>
              <p className="text-3xl font-bold text-gray-900">
                {contacts.filter(c => c.networkingStatus !== 'To Be Contacted').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Referred Contacts</p>
              <p className="text-3xl font-bold text-gray-900">
                {contacts.filter(c => c.referred).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <Check className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Interviews</p>
              <p className="text-3xl font-bold text-gray-900">{interviews.length}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Contacts</h3>
          <div className="space-y-3">
            {contacts.slice(0, 3).map(contact => (
              <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setSelectedContactId(contact.id)}>
                <div className="flex items-center">
                  <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full object-cover mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{contact.name}</p>
                    <p className="text-sm text-gray-600">{contact.firm}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(contact.networkingStatus)}`}>
                  {contact.networkingStatus}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Interviews</h3>
          <div className="space-y-3">
            {interviews.slice(0, 3).map(interview => (
              <div key={interview.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{interview.company}</p>
                  <p className="text-sm text-gray-600">{interview.date} at {interview.time}</p>
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  {interview.stage}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const Interviews = () => (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Interviews</h1>
          <p className="text-gray-600">Track your investment banking interviews</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Add Interview
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviews.map(interview => (
          <div key={interview.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{interview.company}</h3>
                <p className="text-sm text-gray-600">{interview.position}</p>
              </div>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                {interview.status}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                {interview.date} at {interview.time}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <User className="w-4 h-4 mr-2" />
                {interview.interviewer}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                {interview.stage}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">{interview.notes}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const Documents = () => (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Documents</h1>
          <p className="text-gray-600">Manage your resumes, cover letters, and templates</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Upload Document
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Type</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Upload Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Size</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {documents.map(doc => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 mr-3 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{doc.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{doc.uploadDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{doc.size}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-3">
                      <button className="text-blue-600 hover:text-blue-800">Download</button>
                      <button className="text-red-600 hover:text-red-800">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const EditContactModal = () => (
    editingContact && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Edit Contact</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={editingContact.name}
                onChange={(e) => setEditingContact({...editingContact, name: e.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Position"
                value={editingContact.position}
                onChange={(e) => setEditingContact({...editingContact, position: e.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Company"
                value={editingContact.firm}
                onChange={(e) => setEditingContact({...editingContact, firm: e.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={editingContact.email}
                onChange={(e) => setEditingContact({...editingContact, email: e.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={editingContact.phone}
                onChange={(e) => setEditingContact({...editingContact, phone: e.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Location"
                value={editingContact.location}
                onChange={(e) => setEditingContact({...editingContact, location: e.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="LinkedIn URL"
                value={editingContact.linkedin}
                onChange={(e) => setEditingContact({...editingContact, linkedin: e.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={editingContact.networkingStatus}
                onChange={(e) => setEditingContact({...editingContact, networkingStatus: e.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {networkingStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <input
                type="date"
                value={editingContact.networkingDate}
                onChange={(e) => setEditingContact({...editingContact, networkingDate: e.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={editingContact.nextSteps}
                onChange={(e) => setEditingContact({...editingContact, nextSteps: e.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Next Steps</option>
                {nextStepsOptions.map(step => (
                  <option key={step} value={step}>{step}</option>
                ))}
              </select>
              <input
                type="date"
                value={editingContact.nextStepsDate}
                onChange={(e) => setEditingContact({...editingContact, nextStepsDate: e.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={editingContact.referred}
                  onChange={(e) => setEditingContact({...editingContact, referred: e.target.checked})}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium text-gray-700">Referred Contact</label>
              </div>
              {editingContact.referred && (
                <input
                  type="text"
                  placeholder="Referred By"
                  value={editingContact.referredBy}
                  onChange={(e) => setEditingContact({...editingContact, referredBy: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
              <textarea
                placeholder="Notes"
                value={editingContact.notes}
                onChange={(e) => setEditingContact({...editingContact, notes: e.target.value})}
                className="col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              onClick={() => setEditingContact(null)}
              className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    )
  );

  const ContactModal = () => (
    showContactModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Add New Contact</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name *"
                value={newContact.name}
                onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Position"
                value={newContact.position}
                onChange={(e) => setNewContact({...newContact, position: e.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Company *"
                value={newContact.firm}
                onChange={(e) => setNewContact({...newContact, firm: e.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={newContact.email}
                onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={newContact.phone}
                onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Location"
                value={newContact.location}
                onChange={(e) => setNewContact({...newContact, location: e.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="LinkedIn URL"
                value={newContact.linkedin}
                onChange={(e) => setNewContact({...newContact, linkedin: e.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newContact.networkingStatus}
                onChange={(e) => setNewContact({...newContact, networkingStatus: e.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {networkingStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <input
                type="date"
                value={newContact.networkingDate}
                onChange={(e) => setNewContact({...newContact, networkingDate: e.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newContact.nextSteps}
                onChange={(e) => setNewContact({...newContact, nextSteps: e.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Next Steps</option>
                {nextStepsOptions.map(step => (
                  <option key={step} value={step}>{step}</option>
                ))}
              </select>
              <input
                type="date"
                value={newContact.nextStepsDate}
                onChange={(e) => setNewContact({...newContact, nextStepsDate: e.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={newContact.referred}
                  onChange={(e) => setNewContact({...newContact, referred: e.target.checked})}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium text-gray-700">Referred Contact</label>
              </div>
              {newContact.referred && (
                <input
                  type="text"
                  placeholder="Referred By"
                  value={newContact.referredBy}
                  onChange={(e) => setNewContact({...newContact, referredBy: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
              <textarea
                placeholder="Notes"
                value={newContact.notes}
                onChange={(e) => setNewContact({...newContact, notes: e.target.value})}
                className="col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              onClick={() => setShowContactModal(false)}
              className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={addContact}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Contact
            </button>
          </div>
        </div>
      </div>
    )
  );

  const CallModal = () => (
    showCallModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Add Interaction</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <select
                value={newCall.type}
                onChange={(e) => setNewCall({...newCall, type: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Call">Phone Call</option>
                <option value="Email">Email</option>
                <option value="Coffee">Coffee Meeting</option>
                <option value="Lunch">Lunch</option>
                <option value="Video Call">Video Call</option>
              </select>
              <input
                type="date"
                value={newCall.date}
                onChange={(e) => setNewCall({...newCall, date: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Duration (e.g., 30 min)"
                value={newCall.duration}
                onChange={(e) => setNewCall({...newCall, duration: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newCall.outcome}
                onChange={(e) => setNewCall({...newCall, outcome: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Outcome</option>
                <option value="Excellent">Excellent</option>
                <option value="Positive">Positive</option>
                <option value="Neutral">Neutral</option>
                <option value="Sent">Sent</option>
                <option value="No Response">No Response</option>
              </select>
              <textarea
                placeholder="Notes about this interaction..."
                value={newCall.notes}
                onChange={(e) => setNewCall({...newCall, notes: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              onClick={() => setShowCallModal(false)}
              className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={addCallRecord}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Interaction
            </button>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Navigation />
      {selectedContactId ? (
        <ContactDetailPage />
      ) : (
        <div className="flex-1">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'contacts' && <Contacts />}
          {activeTab === 'interviews' && <Interviews />}
          {activeTab === 'documents' && <Documents />}
        </div>
      )}
      <EditContactModal />
      <ContactModal />
      <CallModal />
    </div>
  );
}
