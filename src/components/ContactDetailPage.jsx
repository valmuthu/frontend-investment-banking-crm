import { useState } from 'react';
import { 
  ArrowLeft, Mail, Phone, Linkedin, Edit2, Plus, Award, ExternalLink,
  Calendar, Building2, User, MessageSquare, Check, X, Save
} from 'lucide-react';

const ContactDetailPage = ({ 
  contact, 
  onBack, 
  onEdit, 
  onUpdateContact,
  onAddInteraction,
  onUpdateInteraction,
  onDeleteInteraction,
  networkingStatuses,
  nextStepsOptions,
  groups
}) => {
  const [showAddInteraction, setShowAddInteraction] = useState(false);
  const [editingInteraction, setEditingInteraction] = useState(null);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [editedContact, setEditedContact] = useState(contact);

  const [newInteraction, setNewInteraction] = useState({
    type: 'Call',
    title: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const interactionTypes = ['Call', 'Email', 'Meeting', 'Note'];

  const handleAddInteraction = (e) => {
    e.preventDefault();
    if (newInteraction.title && newInteraction.notes) {
      onAddInteraction(contact.id, newInteraction);
      setNewInteraction({
        type: 'Call',
        title: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      setShowAddInteraction(false);
    }
  };

  const handleUpdateInteraction = (e) => {
    e.preventDefault();
    if (editingInteraction.title && editingInteraction.notes) {
      onUpdateInteraction(contact.id, editingInteraction.id, editingInteraction);
      setEditingInteraction(null);
    }
  };

  const handleSaveContact = () => {
    onUpdateContact(editedContact);
    setIsEditingContact(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Not Yet Contacted': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'Initial Outreach Sent': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Intro Call Scheduled': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Intro Call Complete': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Follow-Up Email Sent': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Follow-Up Call Scheduled': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Follow-Up Call Complete': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (date) => {
    if (!date) return 'text-gray-600';
    const today = new Date();
    const taskDate = new Date(date);
    const diffDays = Math.ceil((taskDate - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-red-600 font-semibold';
    if (diffDays <= 2) return 'text-amber-600 font-semibold';
    return 'text-gray-600';
  };

  const getInteractionIcon = (type) => {
    switch (type) {
      case 'Call': return <Phone className="w-4 h-4" />;
      case 'Email': return <Mail className="w-4 h-4" />;
      case 'Meeting': return <User className="w-4 h-4" />;
      case 'Note': return <MessageSquare className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getInteractionColor = (type) => {
    switch (type) {
      case 'Call': return 'bg-emerald-100 text-emerald-600';
      case 'Email': return 'bg-blue-100 text-blue-600';
      case 'Meeting': return 'bg-purple-100 text-purple-600';
      case 'Note': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-bold mr-4 shadow-sm">
                {contact.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{contact.name}</h1>
                <div className="flex items-center text-gray-600 mt-1">
                  <span className="font-medium">{contact.position}</span>
                  <span className="mx-2">•</span>
                  <Building2 className="w-4 h-4 mr-1" />
                  <span className="font-semibold">{contact.firm}</span>
                </div>
                {contact.group && <p className="text-sm text-gray-500 mt-1 font-medium">{contact.group}</p>}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsEditingContact(!isEditingContact)}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors font-medium ${
                isEditingContact 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isEditingContact ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Contact
                </>
              )}
            </button>
            {isEditingContact && (
              <button
                onClick={handleSaveContact}
                className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Contact Information</h3>
              
              {isEditingContact ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={editedContact.name}
                      onChange={(e) => setEditedContact({...editedContact, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                    <input
                      type="text"
                      value={editedContact.position}
                      onChange={(e) => setEditedContact({...editedContact, position: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Firm</label>
                    <input
                      type="text"
                      value={editedContact.firm}
                      onChange={(e) => setEditedContact({...editedContact, firm: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Group</label>
                    <select
                      value={editedContact.group}
                      onChange={(e) => setEditedContact({...editedContact, group: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Group</option>
                      {groups.map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={editedContact.email}
                      onChange={(e) => setEditedContact({...editedContact, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={editedContact.phone}
                      onChange={(e) => setEditedContact({...editedContact, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                    <input
                      type="url"
                      value={editedContact.linkedin}
                      onChange={(e) => setEditedContact({...editedContact, linkedin: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-400 mr-3" />
                    <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline font-medium">
                      {contact.email}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-400 mr-3" />
                    <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline font-medium">
                      {contact.phone}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Linkedin className="w-5 h-5 text-gray-400 mr-3" />
                    <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center font-medium">
                      LinkedIn Profile
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>
              )}
            </div>
            
            {/* Status & Next Steps Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Status & Next Steps</h3>
              
              {isEditingContact ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Networking Status</label>
                    <select
                      value={editedContact.networkingStatus}
                      onChange={(e) => setEditedContact({...editedContact, networkingStatus: e.target.value})}
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
                      value={editedContact.networkingDate}
                      onChange={(e) => setEditedContact({...editedContact, networkingDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Next Steps</label>
                    <select
                      value={editedContact.nextSteps}
                      onChange={(e) => setEditedContact({...editedContact, nextSteps: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Next Steps</option>
                      {nextStepsOptions.map(step => (
                        <option key={step} value={step}>{step}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Next Steps Date</label>
                    <input
                      type="date"
                      value={editedContact.nextStepsDate}
                      onChange={(e) => setEditedContact({...editedContact, nextStepsDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editedContact.referred}
                        onChange={(e) => setEditedContact({...editedContact, referred: e.target.checked})}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-900">Referred</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      rows="3"
                      value={editedContact.notes}
                      onChange={(e) => setEditedContact({...editedContact, notes: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Networking Status:</span>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(contact.networkingStatus)}`}>
                        {contact.networkingStatus}
                      </span>
                      <span className="ml-3 text-sm text-gray-500">({contact.networkingDate})</span>
                    </div>
                  </div>
                  
                  {contact.nextSteps && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Next Steps:</span>
                      <p className="mt-1 text-gray-900 font-medium">{contact.nextSteps}</p>
                      {contact.nextStepsDate && (
                        <p className={`text-sm mt-1 ${getPriorityColor(contact.nextStepsDate)}`}>
                          Due: {contact.nextStepsDate}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {contact.referred && (
                    <div className="flex items-center p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <Award className="w-5 h-5 text-emerald-600 mr-2" />
                      <span className="font-medium text-emerald-800">Referred Contact</span>
                    </div>
                  )}

                  {contact.notes && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Notes:</span>
                      <p className="mt-1 text-gray-700 bg-gray-50 p-3 rounded-lg">{contact.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Interactions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Interaction History</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {contact.interactions?.length || 0} total interactions
                  </p>
                </div>
                <button
                  onClick={() => setShowAddInteraction(!showAddInteraction)}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors font-medium ${
                    showAddInteraction 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {showAddInteraction ? (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Interaction
                    </>
                  )}
                </button>
              </div>

              {/* Add Interaction Form */}
              {showAddInteraction && (
                <form onSubmit={handleAddInteraction} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Add New Interaction</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                      <select
                        value={newInteraction.type}
                        onChange={(e) => setNewInteraction({...newInteraction, type: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {interactionTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                      <input
                        type="date"
                        required
                        value={newInteraction.date}
                        onChange={(e) => setNewInteraction({...newInteraction, date: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      required
                      value={newInteraction.title}
                      onChange={(e) => setNewInteraction({...newInteraction, title: e.target.value})}
                      placeholder="Brief title for this interaction"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      required
                      rows="3"
                      value={newInteraction.notes}
                      onChange={(e) => setNewInteraction({...newInteraction, notes: e.target.value})}
                      placeholder="Detailed notes about this interaction..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddInteraction(false)}
                      className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add Interaction
                    </button>
                  </div>
                </form>
              )}

              {/* Interactions List */}
              {contact.interactions && contact.interactions.length > 0 ? (
                <div className="space-y-4">
                  {contact.interactions.map(interaction => (
                    <div key={interaction.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      {editingInteraction && editingInteraction.id === interaction.id ? (
                        <form onSubmit={handleUpdateInteraction} className="p-4 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                              <select
                                value={editingInteraction.type}
                                onChange={(e) => setEditingInteraction({...editingInteraction, type: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                {interactionTypes.map(type => (
                                  <option key={type} value={type}>{type}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                              <input
                                type="date"
                                required
                                value={editingInteraction.date}
                                onChange={(e) => setEditingInteraction({...editingInteraction, date: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                            <input
                              type="text"
                              required
                              value={editingInteraction.title}
                              onChange={(e) => setEditingInteraction({...editingInteraction, title: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                            <textarea
                              required
                              rows="3"
                              value={editingInteraction.notes}
                              onChange={(e) => setEditingInteraction({...editingInteraction, notes: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="flex justify-end space-x-3">
                            <button
                              type="button"
                              onClick={() => setEditingInteraction(null)}
                              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Save Changes
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start flex-1">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${getInteractionColor(interaction.type)}`}>
                                {getInteractionIcon(interaction.type)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold text-gray-900">{interaction.title}</h4>
                                  <span className="text-sm text-gray-500">{interaction.date}</span>
                                </div>
                                <div className="flex items-center mb-2">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getInteractionColor(interaction.type)}`}>
                                    {interaction.type}
                                  </span>
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed">{interaction.notes}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={() => setEditingInteraction(interaction)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onDeleteInteraction(contact.id, interaction.id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded"
                                title="Delete"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No interactions recorded</h4>
                  <p className="text-gray-500 mb-6">Start building your relationship history by adding your first interaction.</p>
                  <button
                    onClick={() => setShowAddInteraction(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Add Your First Interaction
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetailPage;
