value={formData.group}
              onChange={(e) => setFormData({ ...formData, group: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Group</option>
              {groups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Stage</label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {interviewStages.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Stage Date</label>
              <input
                type="date"
                value={formData.stageDate}
                onChange={(e) => setFormData({ ...formData, stageDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Next Steps</label>
              <select
                value={formData.nextSteps}
                onChange={(e) => setFormData({ ...formData, nextSteps: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Next Steps</option>
                {interviewNextSteps.map(step => (
                  <option key={step} value={step}>{step}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Next Steps Deadline</label>
              <input
                type="date"
                value={formData.nextStepsDate}
                onChange={(e) => setFormData({ ...formData, nextStepsDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Application Date</label>
              <input
                type="date"
                value={formData.applicationDate}
                onChange={(e) => setFormData({ ...formData, applicationDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Referral Contact</label>
            <select
              value={formData.referralContactId}
              onChange={(e) => setFormData({ ...formData, referralContactId: e.target.value ? parseInt(e.target.value) : '' })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No referral</option>
              {contacts.map(contact => (
                <option key={contact.id} value={contact.id}>{contact.name} - {contact.firm}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              rows="3"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Add Interview
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const EditInterviewModal = ({ isOpen, interview, onClose, onSubmit, interviewStages, interviewNextSteps, groups, contacts }) => {
  const [formData, setFormData] = useState({
    firm: '',
    position: '',
    group: '',
    stage: 'Applied',
    stageDate: '',
    nextSteps: '',
    nextStepsDate: '',
    priority: 'Medium',
    applicationDate: '',
    notes: '',
    referralContactId: ''
  });

  useEffect(() => {
    if (interview) {
      setFormData({
        firm: interview.firm || '',
        position: interview.position || '',
        group: interview.group || '',
        stage: interview.stage || 'Applied',
        stageDate: interview.stageDate || '',
        nextSteps: interview.nextSteps || '',
        nextStepsDate: interview.nextStepsDate || '',
        priority: interview.priority || 'Medium',
        applicationDate: interview.applicationDate || '',
        notes: interview.notes || '',
        referralContactId: interview.referralContactId || ''
      });
    }
  }, [interview]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.firm && formData.position) {
      onSubmit({ ...interview, ...formData });
      onClose();
    }
  };

  if (!isOpen || !interview) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Edit Interview</h2>
            <button onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Firm *</label>
              <input
                type="text"
                required
                value={formData.firm}
                onChange={(e) => setFormData({ ...formData, firm: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Position *</label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Group</label>
            <select
              value={formData.group}
              onChange={(e) => setFormData({ ...formData, group: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Group</option>
              {groups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Stage</label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {interviewStages.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Stage Date</label>
              <input
                type="date"
                value={formData.stageDate}
                onChange={(e) => setFormData({ ...formData, stageDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Next Steps</label>
              <select
                value={formData.nextSteps}
                onChange={(e) => setFormData({ ...formData, nextSteps: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Next Steps</option>
                {interviewNextSteps.map(step => (
                  <option key={step} value={step}>{step}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Next Steps Deadline</label>
              <input
                type="date"
                value={formData.nextStepsDate}
                onChange={(e) => setFormData({ ...formData, nextStepsDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Application Date</label>
              <input
                type="date"
                value={formData.applicationDate}
                onChange={(e) => setFormData({ ...formData, applicationDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Referral Contact</label>
            <select
              value={formData.referralContactId}
              onChange={(e) => setFormData({ ...formData, referralContactId: e.target.value ? parseInt(e.target.value) : '' })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No referral</option>
              {contacts.map(contact => (
                <option key={contact.id} value={contact.id}>{contact.name} - {contact.firm}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              rows="3"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const CallModal = ({ isOpen, onClose, onSubmit }) => {
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (notes) {
      onSubmit({
        type: 'Call',
        date: new Date().toISOString().split('T')[0],
        notes: notes
      });
      setNotes('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Add Interaction</h2>
            <button onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              required
              rows="4"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Notes about this interaction..."
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                {contact.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{contact.name}</h1>
                <p className="text-gray-600">{contact.position} at {contact.firm}</p>
                {contact.group && <p className="text-sm text-gray-500">{contact.group}</p>}
              </div>
            </div>
            <button onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-400 mr-3" />
                    <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                      {contact.email}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-400 mr-3" />
                    <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                      {contact.phone}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Linkedin className="w-5 h-5 text-gray-400 mr-3" />
                    <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                      LinkedIn Profile
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Status & Next Steps</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Networking Status:</span>
                    <div className="mt-1">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        {contact.networkingStatus}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">({contact.networkingDate})</span>
                    </div>
                  </div>
                  {contact.nextSteps && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Next Steps:</span>
                      <p className="mt-1 text-gray-900">{contact.nextSteps}</p>
                      {contact.nextStepsDate && (
                        <p className="text-sm text-gray-500">Due: {contact.nextStepsDate}</p>
                      )}
                    </div>
                  )}
                  {contact.referred && (
                    <div className="flex items-center text-green-600">
                      <Award className="w-5 h-5 mr-2" />
                      <span className="font-medium">Referred Contact</span>
                    </div>
                  )}
                </div>
              </div>

              {contact.notes && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Notes</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{contact.notes}</p>
                </div>
              )}
            </div>

            {/* Interaction History */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Interaction History</h3>
                <button
                  onClick={onAddCall}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Interaction
                </button>
              </div>
              
              {contact.interactions && contact.interactions.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {contact.interactions.map(interaction => (
                    <div key={interaction.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            {interaction.type === 'Call' && <Phone className="w-4 h-4 text-blue-600" />}
                            {interaction.type === 'Email' && <Mail className="w-4 h-4 text-blue-600" />}
                            {interaction.type === 'Meeting' && <User className="w-4 h-4 text-blue-600" />}
                            {interaction.type === 'Note' && <Edit2 className="w-4 h-4 text-blue-600" />}
                          </div>
                          <span className="font-medium text-gray-900">{interaction.type}</span>
                        </div>
                        <span className="text-sm text-gray-500">{interaction.date}</span>
                      </div>
                      <p className="text-gray-700 text-sm">{interaction.notes}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-lg">
                  <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No interactions recorded</p>
                  <button
                    onClick={onAddCall}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Add your first interaction
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
            <button
              onClick={onEdit}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Contact
            </button>
            <button
              onClick={onAddCall}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Interaction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const InterviewHistoryModal = ({ isOpen, interview, contacts, onClose, onEdit, setSelectedContactId, setShowContactDetail }) => {
  if (!isOpen || !interview) return null;

  const referralContact = interview.referralContactId 
    ? contacts.find(c => c.id === interview.referralContactId)
    : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{interview.firm}</h1>
              <p className="text-gray-600">{interview.position}</p>
              {interview.group && <p className="text-sm text-gray-500">{interview.group}</p>}
            </div>
            <button onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Interview Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Interview Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Current Stage:</span>
                    <div className="mt-1">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-50 text-orange-700 border border-orange-200">
                        {interview.stage}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">({interview.stageDate})</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-600">Application Date:</span>
                    <p className="mt-1 text-gray-900">{interview.applicationDate}</p>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-600">Priority:</span>
                    <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      interview.priority === 'High' ? 'bg-red-50 text-red-700' :
                      interview.priority === 'Medium' ? 'bg-yellow-50 text-yellow-700' :
                      'bg-green-50 text-green-700'
                    }`}>
                      {interview.priority}
                    </span>
                  </div>

                  {interview.nextSteps && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Next Steps:</span>
                      <p className="mt-1 text-gray-900">{interview.nextSteps}</p>
                      {interview.nextStepsDate && (
                        <p className="text-sm text-gray-500">Due: {interview.nextStepsDate}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {referralContact && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Referral</h3>
                  <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <Award className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <p className="text-green-800 font-medium">Referred by</p>
                      <button
                        onClick={() => {
                          setSelectedContactId(referralContact.id);
                          setShowContactDetail(true);
                          onClose();
                        }}
                        className="text-green-600 hover:text-green-800 hover:underline"
                      >
                        {referralContact.name} at {referralContact.firm}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {interview.notes && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Notes</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{interview.notes}</p>
                </div>
              )}
            </div>

            {/* Interview Rounds */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Interview Rounds</h3>
              
              {interview.rounds && interview.rounds.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {interview.rounds.map((round, index) => (
                    <div key={round.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 text-sm font-semibold text-blue-600">
                            {index + 1}
                          </div>
                          <span className="font-medium text-gray-900">{round.stage}</span>
                        </div>
                        <span className="text-sm text-gray-500">{round.date}</span>
                      </div>
                      
                      <div className="ml-11 space-y-2">
                        {round.interviewer && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Interviewer:</span> {round.interviewer}
                          </p>
                        )}
                        
                        {round.format && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Format:</span> {round.format}
                          </p>
                        )}
                        
                        {round.outcome && (
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-600 mr-2">Outcome:</span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              round.outcome === 'Passed' ? 'bg-green-50 text-green-700' :
                              round.outcome === 'Failed' ? 'bg-red-50 text-red-700' :
                              round.outcome === 'Cancelled' ? 'bg-gray-50 text-gray-700' :
                              'bg-yellow-50 text-yellow-700'
                            }`}>
                              {round.outcome}
                            </span>
                          </div>
                        )}
                        
                        {round.notes && (
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            {round.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-lg">
                  <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No interview rounds recorded</p>
                  <p className="text-sm mt-1">Interview rounds will appear here as they're added</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
            <button
              onClick={onEdit}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
                          import { useState, useEffect } from 'react';
import { X, Calendar, User, Phone, Mail, Linkedin, Edit2, Plus, Award, ExternalLink } from 'lucide-react';

export const ContactModal = ({ isOpen, onClose, onSubmit, networkingStatuses, nextStepsOptions, groups }) => {
  const [formData, setFormData] = useState({
    name: '',
    firm: '',
    position: '',
    group: '',
    email: '',
    phone: '',
    linkedin: '',
    networkingStatus: 'To Be Contacted',
    networkingDate: new Date().toISOString().split('T')[0],
    nextSteps: '',
    nextStepsDate: '',
    referred: false,
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.firm) {
      onSubmit(formData);
      setFormData({
        name: '',
        firm: '',
        position: '',
        group: '',
        email: '',
        phone: '',
        linkedin: '',
        networkingStatus: 'To Be Contacted',
        networkingDate: new Date().toISOString().split('T')[0],
        nextSteps: '',
        nextStepsDate: '',
        referred: false,
        notes: ''
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Add Contact</h2>
            <button onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Firm *</label>
              <input
                type="text"
                required
                value={formData.firm}
                onChange={(e) => setFormData({ ...formData, firm: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Position</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Group</label>
              <select
                value={formData.group}
                onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Group</option>
                {groups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">LinkedIn</label>
            <input
              type="url"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Networking Status</label>
              <select
                value={formData.networkingStatus}
                onChange={(e) => setFormData({ ...formData, networkingStatus: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {networkingStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status Date</label>
              <input
                type="date"
                value={formData.networkingDate}
                onChange={(e) => setFormData({ ...formData, networkingDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Next Steps</label>
              <select
                value={formData.nextSteps}
                onChange={(e) => setFormData({ ...formData, nextSteps: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Next Steps</option>
                {nextStepsOptions.map(step => (
                  <option key={step} value={step}>{step}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Next Steps Date</label>
              <input
                type="date"
                value={formData.nextStepsDate}
                onChange={(e) => setFormData({ ...formData, nextStepsDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.referred}
                onChange={(e) => setFormData({ ...formData, referred: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-900">Referred</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              rows="3"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Add Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const EditContactModal = ({ isOpen, contact, onClose, onSubmit, networkingStatuses, nextStepsOptions, groups }) => {
  const [formData, setFormData] = useState({
    name: '',
    firm: '',
    position: '',
    group: '',
    email: '',
    phone: '',
    linkedin: '',
    networkingStatus: 'To Be Contacted',
    networkingDate: '',
    nextSteps: '',
    nextStepsDate: '',
    referred: false,
    notes: ''
  });

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || '',
        firm: contact.firm || '',
        position: contact.position || '',
        group: contact.group || '',
        email: contact.email || '',
        phone: contact.phone || '',
        linkedin: contact.linkedin || '',
        networkingStatus: contact.networkingStatus || 'To Be Contacted',
        networkingDate: contact.networkingDate || '',
        nextSteps: contact.nextSteps || '',
        nextStepsDate: contact.nextStepsDate || '',
        referred: contact.referred || false,
        notes: contact.notes || ''
      });
    }
  }, [contact]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.firm) {
      onSubmit({ ...contact, ...formData });
      onClose();
    }
  };

  if (!isOpen || !contact) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Edit Contact</h2>
            <button onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Firm *</label>
              <input
                type="text"
                required
                value={formData.firm}
                onChange={(e) => setFormData({ ...formData, firm: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Position</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Group</label>
              <select
                value={formData.group}
                onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Group</option>
                {groups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">LinkedIn</label>
            <input
              type="url"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Networking Status</label>
              <select
                value={formData.networkingStatus}
                onChange={(e) => setFormData({ ...formData, networkingStatus: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {networkingStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status Date</label>
              <input
                type="date"
                value={formData.networkingDate}
                onChange={(e) => setFormData({ ...formData, networkingDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Next Steps</label>
              <select
                value={formData.nextSteps}
                onChange={(e) => setFormData({ ...formData, nextSteps: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Next Steps</option>
                {nextStepsOptions.map(step => (
                  <option key={step} value={step}>{step}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Next Steps Date</label>
              <input
                type="date"
                value={formData.nextStepsDate}
                onChange={(e) => setFormData({ ...formData, nextStepsDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.referred}
                onChange={(e) => setFormData({ ...formData, referred: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-900">Referred</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              rows="3"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const InterviewModal = ({ isOpen, onClose, onSubmit, interviewStages, interviewNextSteps, groups, contacts }) => {
  const [formData, setFormData] = useState({
    firm: '',
    position: '',
    group: '',
    stage: 'Applied',
    stageDate: new Date().toISOString().split('T')[0],
    nextSteps: '',
    nextStepsDate: '',
    priority: 'Medium',
    applicationDate: new Date().toISOString().split('T')[0],
    notes: '',
    referralContactId: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.firm && formData.position) {
      onSubmit(formData);
      setFormData({
        firm: '',
        position: '',
        group: '',
        stage: 'Applied',
        stageDate: new Date().toISOString().split('T')[0],
        nextSteps: '',
        nextStepsDate: '',
        priority: 'Medium',
        applicationDate: new Date().toISOString().split('T')[0],
        notes: '',
        referralContactId: ''
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Add Interview</h2>
            <button onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Firm *</label>
              <input
                type="text"
                required
                value={formData.firm}
                onChange={(e) => setFormData({ ...formData, firm: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Position *</label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Group</label>
            <select
              value={formData.group}
