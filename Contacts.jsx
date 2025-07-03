import { useState } from 'react';

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState('');

  const addContact = () => {
    if (newContact) {
      setContacts([...contacts, newContact]);
      setNewContact('');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Contacts</h1>
      <input
        type="text"
        value={newContact}
        onChange={(e) => setNewContact(e.target.value)}
        placeholder="Add new contact"
        className="border p-2 rounded"
      />
      <button onClick={addContact} className="ml-2 bg-purple-700 text-white p-2 rounded">
        Add
      </button>
      <ul className="mt-4">
        {contacts.map((contact, index) => (
          <li key={index} className="border-b py-2">{contact}</li>
        ))}
      </ul>
    </div>
  );
}
