import { useState } from 'react';
import { User, Calendar, FileText, BarChart3, Search, Plus, Edit2, Trash2, Phone, Mail, Building, DollarSign, Clock, Filter } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: 'John Smith',
      company: 'Goldman Sachs',
      position: 'Managing Director',
      email: 'john.smith@gs.com',
      phone: '+1 (212) 555-0123',
      dealValue: '$50M',
      status: 'Hot Lead',
      lastContact: '2025-07-01',
      notes: 'Interested in M&A advisory services'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      company: 'Morgan Stanley',
      position: 'VP Investment Banking',
      email: 'sarah.johnson@ms.com',
      phone: '+1 (212) 555-0456',
      dealValue: '$25M',
      status: 'In Progress',
      lastContact: '2025-06-28',
      notes: 'Following up on equity financing proposal'
    },
    {
      id: 3,
      name: 'Michael Chen',
      company: 'JPMorgan Chase',
      position: 'Executive Director',
      email: 'michael.chen@jpm.com',
      phone: '+1 (212) 555-0789',
      dealValue: '$75M',
      status: 'Cold Lead',
      lastContact: '2025-06-15',
      notes: 'Potential debt restructuring opportunity'
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

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    company: '',
    position: '',
    email: '',
    phone: '',
    dealValue: '',
    status: 'Cold Lead',
    notes: ''
  });

  const addContact = () => {
    if (newContact.name && newContact.company) {
      const contact = {
        ...newContact,
        id: Date.now(),
        lastContact: new Date().toISOString().split('T')[0]
      };
      setContacts([...contacts, contact]);
      setNewContact({
        name: '',
        company: '',
        position: '',
        email: '',
        phone: '',
        dealValue: '',
        status: 'Cold Lead',
        notes: ''
      });
      setShowContactModal(false);
    }
  };

  const deleteContact = (id) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Hot Lead': return 'bg-red-100 text-red-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Cold Lead': return 'bg-blue-100 text-blue-800';
      case 'Closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalDeals = contacts.reduce((sum, contact) => {
    const value = parseFloat(contact.dealValue.replace(/[$M,]/g, '')) || 0;
    return sum + value;
  }, 0);

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
            Contacts
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
              <p className="text-sm text-gray-600">Total Deal Value</p>
              <p className="text-2xl font-bold text-gray-900">${totalDeals}M</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Hot Leads</p>
              <p className="text-2xl font-bold text-gray-900">
                {contacts.filter(c => c.status === 'Hot Lead').length}
              </p>
            </div>
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">H</span>
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
                  <p className="text-sm text-gray-600">{contact.company}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(contact.status)}`}>
                  {contact.status}
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contacts</h1>
          <p className="text-gray-600">Manage your investment banking contacts</p>
        </div>
        <button
          onClick={() => setShowContactModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Contact
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deal Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContacts.map(contact => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {contact.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Building className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm text-gray-900">{contact.company}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contact.position}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{contact.dealValue}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(contact.status)}`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contact.lastContact}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteContact(contact.id)}
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

  const ContactModal = () => (
    showContactModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Add New Contact</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={newContact.name}
              onChange={(e) => setNewContact({...newContact, name: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Company"
              value={newContact.company}
              onChange={(e) => setNewContact({...newContact, company: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Position"
              value={newContact.position}
              onChange={(e) => setNewContact({...newContact, position: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={newContact.email}
              onChange={(e) => setNewContact({...newContact, email: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Phone"
              value={newContact.phone}
              onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Deal Value (e.g., $50M)"
              value={newContact.dealValue}
              onChange={(e) => setNewContact({...newContact, dealValue: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={newContact.status}
              onChange={(e) => setNewContact({...newContact, status: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Cold Lead">Cold Lead</option>
              <option value="Hot Lead">Hot Lead</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
            <textarea
              placeholder="Notes"
              value={newContact.notes}
              onChange={(e) => setNewContact({...newContact, notes: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowContactModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={addContact}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Contact
            </button>
          </div>
