import { useState } from 'react';
import { User, Calendar, FileText, BarChart3, Search, Plus, Edit2, Trash2, Phone, ExternalLink, Check, Filter, ArrowUpDown, Clock, DollarSign } from 'lucide-react';

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

  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: 'Kevin Burns',
      position: 'Associate, TMT',
      email: 'burnsk@gmail.com',
      phone: '',
      linkedin: 'https://linkedin.com/in/kevinburns',
      firm: 'Evercore',
      networkingStatus: 'Follow up Call Scheduled',
      networkingDate: 'Jun 11, 2025',
      nextSteps: 'Prepare for Upcoming Call',
      nextStepsDate: 'Jun 11, 2025',
      referred: true,
      notes: 'Colleague referred. Assess profile for suitability.',
      hasInterview: true,
      interviewStatus: 'Add Interview'
    },
    {
      id: 2,
      name: 'Greg Smith',
      position: 'Director, TMT',
      email: 'gsmith@gmail.com',
      phone: '',
      linkedin: 'https://linkedin.com/in/gregsmith',
      firm: 'Morgan Stanley',
      networkingStatus: 'Intro Call Complete',
      networkingDate: 'Jun 11, 2025',
      nextSteps: 'Send Thank You Email',
      nextStepsDate: 'Jul 11, 2025',
      referred: true,
      notes: 'Upgrading role expectations and requirements.',
      hasInterview: true,
      interviewStatus: 'Second Round',
      interviewDate: 'Jul 9, 2025'
    },
    {
      id: 3,
      name: 'Hannah Collins',
      position: 'Managing Director, FIG',
      email: 'colhan@gmail.com',
      phone: '',
      linkedin: 'https://linkedin.com/in/hannahcollins',
      firm: 'Redmond Corp',
      networkingStatus: 'To Be Contacted',
      networkingDate: '',
      nextSteps: 'Send Initial Outreach',
      nextStepsDate: 'Sep 17, 2025',
      referred: true,
      notes: 'Advise on company developments for next steps.',
      hasInterview: false,
      interviewStatus: 'Applied',
      interviewDate: 'Jul 16, 2025'
    },
    {
      id: 4,
      name: 'Sarah Jacobs',
      position: 'Vice President, Healthcare',
      email: 'hcob@gmail.com',
      phone: '',
      linkedin: 'https://linkedin.com/in/sarahjacobs',
      firm: 'Goldman Sachs',
      networkingStatus: 'Follow up Email Sent',
      networkingDate: 'Jun 22, 2025',
      nextSteps: 'Schedule Intro Call',
      nextStepsDate: 'Jul 19, 2025',
      referred: true,
      notes: 'Next call for updating latest changes.',
      hasInterview: true,
      interviewStatus: 'Add Interview'
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
    },
    {
      id: 2,
      company: 'Morgan Stanley',
      position: 'Investment Banking Associate',
      date: '2025-07-12',
      time: '2:00 PM',
      interviewer: 'Sarah Johnson',
      status: 'Confirmed',
      stage: 'Second Round',
      notes: 'Behavioral interview with deal team'
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
    },
    {
      id: 2,
      name: 'Cover_Letter_GS.pdf',
      type: 'Cover Letter',
      uploadDate: '2025-06-28',
      size: '158 KB',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Financial_Model_Template.xlsx',
      type: 'Template',
      uploadDate: '2025-06-25',
      size: '892 KB',
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
    networkingStatus: 'To Be Contacted',
    networkingDate: '',
    nextSteps: '',
    nextStepsDate: '',
    referred: false,
    notes: '',
    hasInterview: false,
    interviewStatus: '',
    interviewDate: ''
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
    'Send Thank You Note',
    'Schedule Follow-up Meeting',
    'Send Proposal',
    'Prepare Interview Materials',
    'Complete Application',
    'No Action Required'
  ];

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
        id: Date.now()
      };
      setContacts([...contacts, contact]);
      setNewContact({
        name: '',
        position: '',
        email: '',
        phone: '',
        linkedin: '',
        firm: '',
        networkingStatus: 'To Be Contacted',
        networkingDate: '',
        nextSteps: '',
        nextStepsDate: '',
        referred: false,
        notes: '',
        hasInterview: false,
        interviewStatus: '',
        interviewDate: ''
      });
      setShowContactModal(false);
    }
  };

  const Navigation = () => (
    <div className="w-64 bg-slate-900 text-white min-h-screen">
      <div className="p-6">
        <h1 className="text-xl font-bold text-white mb-8">IB CRM</h1>
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'dashboard' ? 'bg-blue-600' : 'hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'contacts' ? 'bg-blue-600' : 'hover:bg-slate-800'
            }`}
          >
            <User className="w-5 h-5 mr-3" />
            Networking Details
          </button>
          <button
            onClick={() => setActiveTab('interviews')}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'interviews' ? 'bg-blue-600' : 'hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-5 h-5 mr-3" />
            Interviews
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'documents' ? 'bg-blue-600' : 'hover:bg-slate-800'
            }`}
          >
            <FileText className="w-5 h-5 mr-3" />
            Documents
          </button>
        </nav>
      </div>
    </div>
  );

  const Dashboard = () => (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Investment Banking CRM Overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Contacts</p>
              <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
            </div>
            <User className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Networking</p>
              <p className="text-2xl font-bold text-gray-900">
                {contacts.filter(c => c.networkingStatus !== 'To Be Contacted').length}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Referred Contacts</p>
              <p className="text-2xl font-bold text-gray-900">
                {contacts.filter(c => c.referred).length}
              </p>
            </div>
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Interviews</p>
              <p className="text-2xl font-bold text-gray-900">{interviews.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Recent Contacts</h3>
          <div className="space-y-3">
            {contacts.slice(0, 3).map(contact => (
              <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-gray-600">{contact.firm}</p>
                </div>
                <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  {contact.networkingStatus}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Upcoming Interviews</h3>
          <div className="space-y-3">
            {interviews.slice(0, 3).map(interview => (
              <div key={interview.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{interview.company}</p>
                  <p className="text-sm text-gray-600">{interview.date} at {interview.time}</p>
                </div>
                <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  {interview.stage}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const Contacts = () => (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Networking Details</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
                {showFilterMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-10">
                    <div className="p-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Networking Status</label>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  Sort
                </button>
                {showSortMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                    <div className="p-2">
                      <button onClick={() => handleSort('name')} className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">Name</button>
                      <button onClick={() => handleSort('firm')} className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">Firm</button>
                      <button onClick={() => handleSort('networkingStatus')} className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">Networking Status</button>
                      <button onClick={() => handleSort('nextStepsDate')} className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">Next Steps Date</button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowContactModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Contact
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Contact Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Firm</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Networking Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Next Steps</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 text-center">Referred?</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Notes</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedContacts.map(contact => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                      <div className="text-sm text-gray-600">{contact.position}</div>
                      <div className="text-sm text-gray-500">{contact.email}</div>
                      <div className="flex items-center mt-1 space-x-2">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{contact.firm}</div>
                      {contact.hasInterview && (
                        <div className="mt-1">
                          <button className="text-blue-600 text-xs hover:text-blue-800">
                            + {contact.interviewStatus === 'Add Interview' ? 'Add Interview' : 'Edit Interview'}
                          </button>
                          {contact.interviewDate && (
                            <div className="text-xs text-gray-500 italic">{contact.interviewDate}</div>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{contact.networkingStatus}</div>
                      {contact.networkingDate && (
                        <div className="text-xs text-gray-500">{contact.networkingDate}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{contact.nextSteps}</div>
                      {contact.nextStepsDate && (
                        <div className="text-xs text-gray-500">{contact.nextStepsDate}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap text-center">
                    {contact.referred && (
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-6">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{contact.notes}</div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(contact)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(contact.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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

  const Interviews = () => (
    <div className="p-6">
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
          <div key={interview.id} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{interview.company}</h3>
                <p className="text-sm text-gray-600">{interview.position}</p>
              </div>
              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
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
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600">{interview.notes}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const Documents = () => (
    <div className="p-6">
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

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documents.map(doc => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 mr-3 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doc.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doc.uploadDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doc.size}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">Download</button>
                      <button className="text-red-600 hover:text-red-800">Delete</button>
