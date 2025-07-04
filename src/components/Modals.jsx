import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export const ContactModal = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [firm, setFirm] = useState('');
  const [position, setPosition] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && firm) {
      onSubmit({
        name,
        firm,
        position,
        email,
        phone: '',
        linkedin: '',
        group: '',
        networkingStatus: 'To Be Contacted',
        networkingStatusDate: new Date().toISOString().split('T')[0],
        nextSteps: '',
        nextStepsDate: '',
        referred: false,
        referredBy: '',
        notes: ''
      });
      setName('');
      setFirm('');
      setPosition('');
      setEmail('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Add Contact</h2>
            <button onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Firm</label>
            <input
              type="text"
              required
              value={firm}
              onChange={(e) => setFirm(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Position</label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              Add Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const EditContactModal = ({ isOpen, contact, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [firm, setFirm] = useState('');
  const [position, setPosition] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (contact) {
      setName(contact.name || '');
      setFirm(contact.firm || '');
      setPosition(contact.position || '');
      setEmail(contact.email || '');
    }
  }, [contact]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && firm) {
      onSubmit({
        ...contact,
        name,
        firm,
        position,
        email
      });
      onClose();
    }
  };

  if (!isOpen || !contact) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Edit Contact</h2>
            <button onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Firm</label>
            <input
              type="text"
              required
              value={firm}
              onChange={(e) => setFirm(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Position</label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const InterviewModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Add Interview</h2>
        <p className="mb-4">Interview modal coming soon...</p>
        <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Edit Interview</h2>
        <p className="mb-4">Edit interview modal coming soon...</p>
        <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          Close
        </button>
      </div>
    </div>
  );
};

export const CallModal = ({ isOpen, onClose, onSubmit, newCall, setNewCall }) => {
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (notes) {
      onSubmit({
        type: 'Call',
        date: new Date().toISOString().split('T')[0],
        duration: '',
        notes: notes,
        outcome: ''
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
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Notes about this interaction..."
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">{contact.name}</h1>
            <button onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-600">{contact.position} at {contact.firm}</p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
              <p><strong>Email:</strong> {contact.email}</p>
              <p><strong>Phone:</strong> {contact.phone}</p>
              <p><strong>LinkedIn:</strong> {contact.linkedin}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Status</h3>
              <p><strong>Networking Status:</strong> {contact.networkingStatus}</p>
              <p><strong>Next Steps:</strong> {contact.nextSteps}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Notes</h3>
              <p>{contact.notes}</p>
            </div>

            <div className="flex space-x-3 pt-4">
              <button onClick={onEdit} className="px-4 py-2 border rounded-lg">
                Edit
              </button>
              <button onClick={onAddCall} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                Add Interaction
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
