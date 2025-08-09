// src/components/Modals.jsx
import { useState, useEffect } from 'react';
import { X, Calendar, User, Phone, Mail, Linkedin, Edit2, Plus, Award, ExternalLink } from 'lucide-react';

// ContactModal
export const ContactModal = ({
  isOpen,
  onClose,
  onSubmit,
  networkingStatuses,
  nextStepsOptions,
  groups,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    firm: '',
    position: '',
    group: '',
    email: '',
    phone: '',
    linkedin: '',
    networkingStatus: '',
    networkingDate: new Date().toISOString().split('T')[0],
    nextSteps: '',
    nextStepsDate: '',
    referred: false,
    notes: '',
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
        networkingStatus: '',
        networkingDate: new Date().toISOString().split('T')[0],
        nextSteps: '',
        nextStepsDate: '',
        referred: false,
        notes: '',
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card-base w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="section-padding border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-2">Add Contact</h2>
            <button onClick={onClose}>
              <X className="icon-md" />
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="section-padding space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Firm *</label>
              <input
                type="text"
                required
                value={formData.firm}
                onChange={(e) => setFormData({ ...formData, firm: e.target.value })}
                className="form-input"
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
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Group</label>
              <input
                type="text"
                value={formData.group}
                onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                placeholder="e.g., TMT, Healthcare, FIG"
                className="form-input"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="form-input"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">LinkedIn</label>
            <input
              type="url"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Networking Status</label>
              <select
                value={formData.networkingStatus}
                onChange={(e) => setFormData({ ...formData, networkingStatus: e.target.value })}
                className="form-select"
              >
                <option value="">Select Networking Status</option>
                {networkingStatuses.map((status) => (
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
                placeholder="mm/dd/yyyy"
                className="form-input"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Next Steps</label>
              <select
                value={formData.nextSteps}
                onChange={(e) => setFormData({ ...formData, nextSteps: e.target.value })}
                className="form-select"
              >
                <option value="">Select Next Steps</option>
                {nextStepsOptions.map((step) => (
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
                placeholder="mm/dd/yyyy"
                className="form-input"
              />
            </div>
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.referred}
                onChange={(e) => setFormData({ ...formData, referred: e.target.checked })}
                className="form-checkbox"
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
              className="form-textarea"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// EditContactModal
export const EditContactModal = ({
  isOpen,
  contact,
  onClose,
  onSubmit,
  networkingStatuses,
  nextStepsOptions,
  groups,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    firm: '',
    position: '',
    group: '',
    email: '',
    phone: '',
    linkedin: '',
    networkingStatus: '',
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
        networkingStatus: contact.networkingStatus || '',
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
      <div className="card-base w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="section-padding border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-2">Edit Contact</h2>
            <button onClick={onClose}>
              <X className="icon-md" />
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="section-padding space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Firm *</label>
              <input
                type="text"
                required
                value={formData.firm}
                onChange={(e) => setFormData({ ...formData, firm: e.target.value })}
                className="form-input"
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
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Group</label>
              <input
                type="text"
                value={formData.group}
                onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                placeholder="e.g., TMT, Healthcare, FIG"
                className="form-input"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="form-input"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">LinkedIn</label>
            <input
              type="url"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Networking Status</label>
              <select
                value={formData.networkingStatus}
                onChange={(e) => setFormData({ ...formData, networkingStatus: e.target.value })}
                className="form-select"
              >
                <option value="">Select Networking Status</option>
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
                placeholder="mm/dd/yyyy"
                className="form-input"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Next Steps</label>
              <select
                value={formData.nextSteps}
                onChange={(e) => setFormData({ ...formData, nextSteps: e.target.value })}
                className="form-select"
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
                placeholder="mm/dd/yyyy"
                className="form-input"
              />
            </div>
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.referred}
                onChange={(e) => setFormData({ ...formData, referred: e.target.checked })}
                className="form-checkbox"
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
              className="form-textarea"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// InterviewModal
export const InterviewModal = ({
  isOpen,
  onClose,
  onSubmit,
  interviewStages,
  interviewNextSteps,
  groups,
  contacts,
}) => {
  const [formData, setFormData] = useState({
    firm: '',
    position: '',
    group: '',
    stage: '',
    stageDate: '',
    nextSteps: '',
    nextStepsDate: '',
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
        stage: '',
        stageDate: '',
        nextSteps: '',
        nextStepsDate: '',
        notes: '',
        referralContactId: ''
      });
      onClose();
    }
  };

  // Auto-match referral contact by firm
  const getMatchingContact = () => {
    return contacts.find(contact => 
      contact.firm.toLowerCase() === formData.firm.toLowerCase()
    );
  };

  const matchingContact = getMatchingContact();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card-base w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="section-padding border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-2">Add Interview</h2>
            <button onClick={onClose}>
              <X className="icon-md" />
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="section-padding space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Firm *</label>
              <input
                type="text"
                required
                value={formData.firm}
                onChange={(e) => setFormData({ ...formData, firm: e.target.value })}
                className="form-input"
              />
              {matchingContact && (
                <p className="text-sm text-emerald-600 mt-1">
                  ✓ Auto-matched with {matchingContact.name}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Position *</label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="form-input"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Group</label>
             <select
            <input
              type="text"
              value={formData.group}
             onChange={(e) =>
        setFormData({ ...formData, stage: e.target.value || null })
      }
      className={`form-select ${!formData.stage ? "text-gray-500" : "text-black"}`}
    >
      {/* Grey placeholder when no value is set */}
      {!formData.stage && (
        <option value="" disabled>
          Select Stage
        </option>
      )}
      
      {/* Blank option for clearing stage later */}
      <option value=""></option>

      {interviewStages.map((stage) => (
        <option key={stage} value={stage}>
          {stage}
        </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Stage Date</label>
              <input
                type="date"
                value={formData.stageDate}
                onChange={(e) => setFormData({ ...formData, stageDate: e.target.value })}
                placeholder="mm/dd/yyyy"
                className="form-input"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Next Steps</label>
              <select
                value={formData.nextSteps}
                onChange={(e) => setFormData({ ...formData, nextSteps: e.target.value })}
                className="form-select"
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
                placeholder="mm/dd/yyyy"
                className="form-input"
              />
            </div>
          </div>
          
          {!matchingContact && (
            <div>
              <label className="block text-sm font-medium mb-2">Referral Contact (Manual Selection)</label>
              <select
                value={formData.referralContactId}
                onChange={(e) => setFormData({ ...formData, referralContactId: e.target.value ? parseInt(e.target.value) : '' })}
                className="form-select"
              >
                <option value="">No referral</option>
                {contacts.map((contact) => (
                  <option key={contact.id || contact._id} value={contact.id || contact._id}>{contact.name} - {contact.firm}</option>
                ))}
              </select>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              rows="3"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="form-textarea"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Interview
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// EditInterviewModal
export const EditInterviewModal = ({
  isOpen,
  interview,
  onClose,
  onSubmit,
  interviewStages,
  interviewNextSteps,
  groups,
  contacts,
}) => {
  const [formData, setFormData] = useState({
    firm: '',
    position: '',
    group: '',
    stage: '',
    stageDate: '',
    nextSteps: '',
    nextStepsDate: '',
    notes: '',
    referralContactId: ''
  });

  useEffect(() => {
    if (interview) {
      setFormData({
        firm: interview.firm || '',
        position: interview.position || '',
        group: interview.group || '',
        stage: interview.stage || '',
        stageDate: interview.stageDate || '',
        nextSteps: interview.nextSteps || '',
        nextStepsDate: interview.nextStepsDate || '',
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

  // Auto-match referral contact by firm
  const getMatchingContact = () => {
    return contacts.find(contact => 
      contact.firm.toLowerCase() === formData.firm.toLowerCase()
    );
  };

  const matchingContact = getMatchingContact();

  if (!isOpen || !interview) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card-base w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="section-padding border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-2">Edit Interview</h2>
            <button onClick={onClose}>
              <X className="icon-md" />
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="section-padding space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Firm *</label>
              <input
                type="text"
                required
                value={formData.firm}
                onChange={(e) => setFormData({ ...formData, firm: e.target.value })}
                className="form-input"
              />
              {matchingContact && (
                <p className="text-sm text-emerald-600 mt-1">
                  ✓ Auto-matched with {matchingContact.name}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Position *</label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="form-input"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Group</label>
            <input
              type="text"
              value={formData.group}
              onChange={(e) => setFormData({ ...formData, group: e.target.value })}
              placeholder="e.g., TMT, Healthcare, FIG"
              className="form-input"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Stage</label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                className="form-select"
              >
                <option value="">Select Stage</option>
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
                placeholder="mm/dd/yyyy"
                className="form-input"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Next Steps</label>
              <select
                value={formData.nextSteps}
                onChange={(e) => setFormData({ ...formData, nextSteps: e.target.value })}
                className="form-select"
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
                placeholder="mm/dd/yyyy"
                className="form-input"
              />
            </div>
          </div>
          
          {!matchingContact && (
            <div>
              <label className="block text-sm font-medium mb-2">Referral Contact (Manual Selection)</label>
              <select
                value={formData.referralContactId}
                onChange={(e) => setFormData({ ...formData, referralContactId: e.target.value ? parseInt(e.target.value) : '' })}
                className="form-select"
              >
                <option value="">No referral</option>
                {contacts.map(contact => (
                  <option key={contact.id || contact._id} value={contact.id || contact._id}>{contact.name} - {contact.firm}</option>
                ))}
              </select>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              rows="3"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="form-textarea"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// CallModal
export const CallModal = ({ isOpen, onClose, onSubmit }) => {
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (notes) {
      onSubmit({
        type: 'Call',
        date: new Date().toISOString().split('T')[0],
        notes,
      });
      setNotes('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card-base w-full max-w-md">
        <div className="section-padding border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-2">Add Interaction</h2>
            <button onClick={onClose}>
              <X className="icon-md" />
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="section-padding space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              required
              rows="4"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="form-textarea"
              placeholder="Notes about this interaction..."
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Interaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// InterviewHistoryModal
export const InterviewHistoryModal = ({
  isOpen,
  interview,
  contacts,
  onClose,
  onEdit,
  setSelectedContactId,
  setShowContactDetail
}) => {
  if (!isOpen || !interview) return null;

  const referralContact = interview.referralContactId
    ? contacts.find(c => c.id === interview.referralContactId || c._id === interview.referralContactId)
    : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card-base w-full max-w-4xl max-h-screen overflow-y-auto">
        <div className="section-padding border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-heading-1">{interview.firm}</h1>
              <p className="text-gray-600">{interview.position}</p>
              {interview.group && <p className="text-sm text-gray-500">{interview.group}</p>}
            </div>
            <button onClick={onClose}>
              <X className="icon-md" />
            </button>
          </div>
        </div>
        <div className="section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-heading-3 mb-3">Interview Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Current Stage:</span>
                    <div className="mt-1">
                      <span className="status-badge status-coral">
                        {interview.stage}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">({interview.stageDate})</span>
                    </div>
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
                  <h3 className="text-heading-3 mb-3">Referral</h3>
                  <div className="flex items-center p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <Award className="w-5 h-5 text-emerald-600 mr-3" />
                    <div>
                      <p className="text-emerald-800 font-medium">Referred by</p>
                      <button
                        onClick={() => {
                          setSelectedContactId(referralContact.id || referralContact._id);
                          setShowContactDetail(true);
                          onClose();
                        }}
                        className="text-emerald-600 hover:text-emerald-800 hover:underline"
                      >
                        {referralContact.name} at {referralContact.firm}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {interview.notes && (
                <div>
                  <h3 className="text-heading-3 mb-3">Notes</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{interview.notes}</p>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-heading-3 mb-4">Interview Rounds</h3>
              {interview.rounds && interview.rounds.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {interview.rounds.map((round, index) => (
                    <div key={round.id || round._id} className="border border-gray-200 rounded-lg p-4">
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
                            <span className={`status-badge ${
                              round.outcome === 'Passed' ? 'status-emerald' :
                              round.outcome === 'Failed' ? 'status-red' :
                              round.outcome === 'Cancelled' ? 'status-gray' :
                              'status-amber'
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
      </div> 
    </div> 
  </div>
);
};
