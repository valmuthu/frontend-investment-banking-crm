import { useState, useEffect } from 'react';
import { 
  X, Mail, Phone, ExternalLink, Building2, ArrowLeft, Plus, 
  MessageSquare, PhoneCall, Edit2
} from 'lucide-react';

// Contact Modal
export const ContactModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  networkingStatuses = [], 
  nextStepsOptions = [], 
  groups = [] 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    group: '',
    email: '',
    phone: '',
    linkedin: '',
    firm: '',
    networkingStatus: 'To Be Contacted',
    networkingStatusDate: new Date().toISOString().split('T')[0],
    nextSteps: '',
    nextStepsDate: '',
    referred: false,
    referredBy: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.firm) {
      onSubmit(formData);
      setFormData({
        name: '',
        position: '',
        group: '',
        email: '',
        phone: '',
        linkedin: '',
        firm: '',
        networkingStatus: 'To Be Contacted',
        networkingStatusDate: new Date().toISOString().split('T')[0],
        nextSteps: '',
        nextStepsDate: '',
        referred: false,
        referredBy: '',
        notes: ''
      });
      onClose();
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Add New Contact</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Firm *</label>
              <input
                type="text"
                required
                value={formData.firm}
                onChange={(e) => handleChange('firm', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => handleChange('position', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Group</label>
              <select
                value={formData.group}
                onChange={(e) => handleChange('group', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select group</option>
                {groups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => handleChange('linkedin', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.networkingStatus}
                onChange={(e) => handleChange('networkingStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {networkingStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status Date</label>
              <input
                type="date"
                value={formData.networkingStatusDate}
                onChange={(e) => handleChange('networkingStatusDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Next Steps</label>
              <select
                value={formData.nextSteps}
                onChange={(e) => handleChange('nextSteps', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select next steps</option>
                {nextStepsOptions.map(step => (
                  <option key={step} value={step}>{step}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Next Steps Date</label>
              <input
                type="date"
                value={formData.nextStepsDate}
                onChange={(e) => handleChange('nextStepsDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="referred"
              checked={formData.referred}
              onChange={(e) => handleChange('referred', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="referred" className="ml-2 text-sm text-gray-700">Referred contact</label>
          </div>
          
          {formData.referred && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Referred By</label>
              <input
                type="text"
                value={formData.referredBy}
                onChange={(e) => handleChange('referredBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              rows="3"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Contact Modal
export const EditContactModal = ({ 
  isOpen, 
  contact, 
  onClose, 
  onSubmit, 
  networkingStatuses = [], 
  nextStepsOptions = [], 
  groups = [] 
}) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (contact) {
      setFormData(contact);
    }
  }, [contact]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.firm) {
      onSubmit(formData);
      onClose();
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen || !contact) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Edit Contact</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Firm *</label>
              <input
                type="text"
                required
                value={formData.firm || ''}
                onChange={(e) => handleChange('firm', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
              <input
                type="text"
                value={formData.position || ''}
                onChange={(e) => handleChange('position', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Group</label>
              <select
                value={formData.group || ''}
                onChange={(e) => handleChange('group', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select group</option>
                {groups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Placeholder modals
export const InterviewModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Add Interview</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <p className="text-gray-600 mb-4">Interview modal coming soon...</p>
        <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Close
        </button>
      </div>
    </div>
  );
};

export const EditInterviewModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Edit Interview</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <p className="text-gray-600 mb-4">Edit interview modal coming soon...</p>
        <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Close
        </button>
      </div>
    </div>
  );
};

export const CallModal = ({ isOpen, onClose, onSubmit, newCall, setNewCall }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newCall && newCall.notes) {
      onSubmit(newCall);
      setNewCall({
        type: 'Call',
        date: new Date().toISOString().split('T')[0],
        duration: '',
        notes: '',
        outcome: ''
      });
      onClose();
    }
  };

  const handleChange = (field, value) => {
    if (setNewCall) {
      setNewCall(prev => ({ ...prev, [field]: value }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Add Interaction</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={newCall ? newCall.type : 'Call'}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Call">Phone Call</option>
              <option value="Email">Email</option>
              <option value="Coffee">Coffee Meeting</option>
              <option value="Lunch">Lunch</option>
              <option value="Video Call">Video Call</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={newCall ? newCall.date : ''}
              onChange={(e) => handleChange('date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
            <input
              type="text"
              value={newCall ? newCall.duration : ''}
              onChange={(e) => handleChange('duration', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 30 min"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes *</label>
            <textarea
              required
              rows="3"
              value={newCall ? newCall.notes : ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Notes about this interaction..."
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Interaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const ContactDetailModal = ({ isOpen, contact, onClose, onEdit, onAddCall }) => {
  if (!isOpen || !contact) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'To Be Contacted': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Initial Outreach Sent': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Intro Call Complete': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Follow-Up Complete': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Regular Contact': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button onClick={onClose} className="mr-4 p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{contact.name}</h1>
                  <p className="text-gray-600">{contact.position} at {contact.firm}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onAddCall}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Interaction
              </button>
              <button
                onClick={onEdit}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center hover:bg-gray-50"
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
                    <a href={`mailto:${contact.email}`} className="text-blue-600 hover:text-blue-800">
                      {contact.email}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-400 mr-3" />
                    <a href={`tel:${contact.phone}`} className="text-blue-600 hover:text-blue-800">
                      {contact.phone}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <ExternalLink className="w-5 h-5 text-gray-400 mr-3" />
                    <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      LinkedIn Profile
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Building2 className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">{contact.group}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Networking Status</label>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(contact.networkingStatus)}`}>
                        {contact.networkingStatus}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Status Date: {contact.networkingStatusDate}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Next Steps</label>
                    <p className="mt-1 text-gray-900">{contact.nextSteps}</p>
                    <p className="text-sm text-gray-500">Due: {contact.nextStepsDate}</p>
                  </div>
                  {contact.referred && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Referred By</label>
                      <p className="mt-1 text-gray-900">{contact.referredBy}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                <p className="text-gray-700 leading-relaxed">{contact.notes}</p>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Interaction History</h3>
                  <span className="text-sm text-gray-500">
                    {contact.callHistory ? contact.callHistory.length : 0} interactions
                  </span>
                </div>
                
                <div className="space-y-4">
                  {contact.callHistory && contact.callHistory.length > 0 ? (
                    contact.callHistory.map((interaction) => (
                      <div key={interaction.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                            interaction.type === 'Call' ? 'bg-green-100' :
                            interaction.type === 'Email' ? 'bg-blue-100' :
                            'bg-purple-100'
                          }`}>
                            {interaction.type === 'Call' ? (
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
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No interactions recorded yet</p>
                      <button
                        onClick={onAddCall}
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
    </div>
  );
};
