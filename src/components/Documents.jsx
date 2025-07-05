import { useState, useMemo, useRef } from 'react';
import { 
  Search, Plus, Filter, ArrowUpDown, Edit2, Trash2, Eye, 
  Download, FileText, Calendar, Building2, Users, X, 
  ChevronDown, Upload, Tag, File, Check
} from 'lucide-react';

const Documents = ({ documents, contacts, onAdd, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState(''); // No default sort
  const [sortDirection, setSortDirection] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [viewingDocument, setViewingDocument] = useState(null);
  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);
  
  const [filters, setFilters] = useState({
    types: [],
    contacts: [],
    firms: [],
    tags: []
  });

  const [newDocument, setNewDocument] = useState({
    name: '',
    type: 'Resume',
    associatedContacts: [],
    associatedFirms: [],
    tags: [],
    notes: '',
    file: null
  });

  const [editingFormData, setEditingFormData] = useState({
    name: '',
    type: 'Resume',
    associatedContacts: [],
    associatedFirms: [],
    tags: [],
    notes: '',
    file: null
  });

  const documentTypes = [
    'Resume',
    'Email Template',
    'Thank You Email',
    'Meeting Notes',
    'Referral Letter',
    'Cover Letter',
    'Follow-up Template',
    'Other'
  ];

  const commonTags = [
    'current', 'template', 'networking', 'interview', 'analyst', 
    'associate', 'draft', 'final', 'urgent', 'follow-up'
  ];

  // Get unique firms from contacts
  const uniqueFirms = useMemo(() => {
    return [...new Set(contacts.map(c => c.firm))].sort();
  }, [contacts]);

  // Sorting options
  const sortOptions = [
    { field: 'name', label: 'Name' },
    { field: 'type', label: 'Type' },
    { field: 'uploadDate', label: 'Upload Date' },
    { field: 'associatedContacts', label: 'Associated Contacts' },
    { field: 'associatedFirms', label: 'Associated Firms' }
  ];

  // Get unique values for filters
  const filterOptions = useMemo(() => ({
    types: [...new Set(documents.map(d => d.type))].sort(),
    contacts: [...new Set(documents.flatMap(d => d.associatedContacts))].sort(),
    firms: [...new Set(documents.flatMap(d => d.associatedFirms))].sort(),
    tags: [...new Set(documents.flatMap(d => d.tags))].sort()
  }), [documents]);

  // Filtered and sorted documents
  const filteredAndSortedDocuments = useMemo(() => {
    let filtered = documents.filter(document => {
      const matchesSearch = searchTerm === '' || 
        document.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        document.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        document.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        document.associatedContacts.some(contact => 
          contact.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        document.associatedFirms.some(firm => 
          firm.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        document.tags.some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesType = filters.types.length === 0 || filters.types.includes(document.type);
      const matchesContact = filters.contacts.length === 0 || 
        document.associatedContacts.some(contact => filters.contacts.includes(contact));
      const matchesFirm = filters.firms.length === 0 || 
        document.associatedFirms.some(firm => filters.firms.includes(firm));
      const matchesTag = filters.tags.length === 0 || 
        document.tags.some(tag => filters.tags.includes(tag));
      
      return matchesSearch && matchesType && matchesContact && matchesFirm && matchesTag;
    });

    if (sortField) {
      filtered.sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];
        
        if (sortField === 'associatedContacts' || sortField === 'associatedFirms') {
          aValue = aValue.length;
          bValue = bValue.length;
        } else if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (sortDirection === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    return filtered;
  }, [documents, searchTerm, filters, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setShowSortOptions(false);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      types: [],
      contacts: [],
      firms: [],
      tags: []
    });
  };

  const handleFileUpload = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      if (isEdit) {
        setEditingFormData(prev => ({ ...prev, file }));
      } else {
        setNewDocument(prev => ({ ...prev, file }));
      }
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (newDocument.name && newDocument.type) {
      const documentToAdd = {
        ...newDocument,
        fileData: newDocument.file ? {
          name: newDocument.file.name,
          size: newDocument.file.size,
          type: newDocument.file.type,
          content: newDocument.file // Store the actual file for download
        } : null
      };
      onAdd(documentToAdd);
      setNewDocument({
        name: '',
        type: 'Resume',
        associatedContacts: [],
        associatedFirms: [],
        tags: [],
        notes: '',
        file: null
      });
      setShowUploadModal(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleEdit = (document) => {
    setEditingDocument(document);
    setEditingFormData({
      name: document.name || '',
      type: document.type || 'Resume',
      associatedContacts: document.associatedContacts || [],
      associatedFirms: document.associatedFirms || [],
      tags: document.tags || [],
      notes: document.notes || '',
      file: null
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editingFormData.name && editingFormData.type) {
      const updatedDocument = {
        ...editingDocument,
        ...editingFormData,
        fileData: editingFormData.file ? {
          name: editingFormData.file.name,
          size: editingFormData.file.size,
          type: editingFormData.file.type,
          content: editingFormData.file
        } : editingDocument.fileData
      };
      onEdit(updatedDocument);
      setEditingDocument(null);
      setEditingFormData({
        name: '',
        type: 'Resume',
        associatedContacts: [],
        associatedFirms: [],
        tags: [],
        notes: '',
        file: null
      });
      if (editFileInputRef.current) {
        editFileInputRef.current.value = '';
      }
    }
  };

  const handleView = (document) => {
    setViewingDocument(document);
  };

  const handleDownload = (document) => {
    if (document.fileData && document.fileData.content) {
      // Create download from actual file
      const url = URL.createObjectURL(document.fileData.content);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.fileData.name || `${document.name}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // Fallback for demo purposes
      const content = `Document: ${document.name}\nType: ${document.type}\nUpload Date: ${document.uploadDate}\nNotes: ${document.notes || 'No notes'}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${document.name}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleTagInput = (value, field, isEdit = false) => {
    if (value.includes(',')) {
      const newTags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
      if (isEdit) {
        setEditingFormData(prev => ({
          ...prev,
          [field]: [...new Set([...prev[field], ...newTags])]
        }));
      } else {
        setNewDocument(prev => ({
          ...prev,
          [field]: [...new Set([...prev[field], ...newTags])]
        }));
      }
    }
  };

  const removeTag = (tagToRemove, field, isEdit = false) => {
    if (isEdit) {
      setEditingFormData(prev => ({
        ...prev,
        [field]: prev[field].filter(tag => tag !== tagToRemove)
      }));
    } else {
      setNewDocument(prev => ({
        ...prev,
        [field]: prev[field].filter(tag => tag !== tagToRemove)
      }));
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Resume': return '📄';
      case 'Email Template': return '📧';
      case 'Thank You Email': return '💌';
      case 'Meeting Notes': return '📝';
      case 'Referral Letter': return '🔗';
      case 'Cover Letter': return '📋';
      case 'Follow-up Template': return '🔄';
      default: return '📁';
    }
  };

  const FilterDropdown = ({ title, options, selected, onChange, filterKey }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`btn-control ${selected.length > 0 ? 'active' : ''}`}
        >
          {title}
          {selected.length > 0 && (
            <span className="ml-1">({selected.length})</span>
          )}
          <ChevronDown className="icon-sm" />
        </button>
        
        {isOpen && (
          <div className="filter-dropdown">
            <div className="p-2">
              {options.map(option => (
                <label key={option} className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={selected.includes(option)}
                    onChange={() => onChange(filterKey, option)}
                    className="form-checkbox"
                  />
                  <span className="ml-3 text-sm text-gray-900">{option}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const SortDropdown = () => (
    <div className="relative">
      <button
        onClick={() => setShowSortOptions(!showSortOptions)}
        className={`btn-control ${sortField ? 'active' : ''}`}
      >
        <ArrowUpDown className="icon-sm" />
        Sort
        {sortField && (
          <span className="ml-1">({sortField})</span>
        )}
        <ChevronDown className="icon-sm" />
      </button>
      
      {showSortOptions && (
        <div className="filter-dropdown">
          <div className="p-2">
            {sortOptions.map(option => (
              <button
                key={option.field}
                onClick={() => handleSort(option.field)}
                className={`w-full text-left p-3 hover:bg-gray-50 rounded-lg text-sm transition-colors ${
                  sortField === option.field ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-900'
                }`}
              >
                {option.label}
                {sortField === option.field && (
                  <span className="ml-2">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const MultiSelectDropdown = ({ title, options, selected, onChange, placeholder, isContacts = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="form-input text-left flex items-center justify-between"
        >
          <span className={selected.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
            {selected.length > 0 ? `${selected.length} selected` : placeholder}
          </span>
          <ChevronDown className="icon-sm" />
        </button>
        
        {isOpen && (
          <div className="filter-dropdown">
            <div className="p-2">
              {options.map(option => {
                const optionValue = isContacts ? option.name : option;
                const optionLabel = isContacts ? `${option.name} - ${option.firm}` : option;
                
                return (
                  <label key={optionValue} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selected.includes(optionValue)}
                      onChange={() => onChange(optionValue)}
                      className="form-checkbox"
                    />
                    <span className="ml-2 text-sm text-gray-900">{optionLabel}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const DocumentFormFields = ({ formData, setFormData, fileInputRef, isEdit = false }) => (
    <>
      <div>
        <label className="block text-sm font-medium mb-2">Document Title *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Resume - Investment Banking 2025"
          className="form-input"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">File Upload</label>
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            {formData.file ? formData.file.name : 'Click to browse files'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Supports: PDF, DOC, DOCX, TXT (Max 10MB)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => handleFileUpload(e, isEdit)}
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Document Type *</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
          className="form-select"
        >
          {documentTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Associated Contacts</label>
          <MultiSelectDropdown
            title="Associated Contacts"
            options={contacts}
            selected={formData.associatedContacts}
            onChange={(contactName) => {
              setFormData(prev => ({
                ...prev,
                associatedContacts: prev.associatedContacts.includes(contactName)
                  ? prev.associatedContacts.filter(c => c !== contactName)
                  : [...prev.associatedContacts, contactName]
              }));
            }}
            placeholder="Select contacts"
            isContacts={true}
          />
          {formData.associatedContacts.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.associatedContacts.map(contact => (
                <span key={contact} className="status-badge status-blue">
                  {contact}
                  <button
                    type="button"
                    onClick={() => removeTag(contact, 'associatedContacts', isEdit)}
                    className="ml-1 text-primary-600 hover:text-primary-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Associated Firms</label>
          <MultiSelectDropdown
            title="Associated Firms"
            options={uniqueFirms}
            selected={formData.associatedFirms}
            onChange={(firmName) => {
              setFormData(prev => ({
                ...prev,
                associatedFirms: prev.associatedFirms.includes(firmName)
                  ? prev.associatedFirms.filter(f => f !== firmName)
                  : [...prev.associatedFirms, firmName]
              }));
            }}
            placeholder="Select firms"
          />
          {formData.associatedFirms.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.associatedFirms.map(firm => (
                <span key={firm} className="status-badge status-amber">
                  {firm}
                  <button
                    type="button"
                    onClick={() => removeTag(firm, 'associatedFirms', isEdit)}
                    className="ml-1 text-amber-600 hover:text-amber-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {commonTags.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                if (formData.tags.includes(tag)) {
                  removeTag(tag, 'tags', isEdit);
                } else {
                  setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
                }
              }}
              className={`px-2 py-1 text-xs rounded-full transition-colors ${
                formData.tags.includes(tag)
                  ? 'status-badge status-emerald'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Add custom tags (separate with commas)"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleTagInput(e.target.value + ',', 'tags', isEdit);
              e.target.value = '';
            }
          }}
          onChange={(e) => {
            if (e.target.value.includes(',')) {
              handleTagInput(e.target.value, 'tags', isEdit);
              e.target.value = '';
            }
          }}
          className="form-input"
        />
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map(tag => (
              <span key={tag} className="status-badge status-emerald">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag, 'tags', isEdit)}
                  className="ml-1 text-emerald-600 hover:text-emerald-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Notes</label>
        <textarea
          rows="3"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Additional notes about this document..."
          className="form-textarea"
        />
      </div>
    </>
  );

  const UploadModal = () => (
    <div className="modal-backdrop">
      <div className="modal-content max-w-2xl">
        <div className="section-padding border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-2">Upload Document</h2>
            <button onClick={() => setShowUploadModal(false)} className="btn-tertiary p-2">
              <X className="icon-md" />
            </button>
          </div>
        </div>
        <form onSubmit={handleUpload} className="section-padding space-y-6">
          <DocumentFormFields 
            formData={newDocument}
            setFormData={setNewDocument}
            fileInputRef={fileInputRef}
            isEdit={false}
          />
          <div className="flex justify-end space-x-3 pt-4">
            <button 
              type="button" 
              onClick={() => setShowUploadModal(false)} 
              className="btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
            >
              Upload Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const EditModal = () => (
    <div className="modal-backdrop">
      <div className="modal-content max-w-2xl">
        <div className="section-padding border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-2">Edit Document</h2>
            <button onClick={() => setEditingDocument(null)} className="btn-tertiary p-2">
              <X className="icon-md" />
            </button>
          </div>
        </div>
        <form onSubmit={handleEditSubmit} className="section-padding space-y-6">
          <DocumentFormFields 
            formData={editingFormData}
            setFormData={setEditingFormData}
            fileInputRef={editFileInputRef}
            isEdit={true}
          />
          <div className="flex justify-end space-x-3 pt-4">
            <button 
              type="button"
              onClick={() => setEditingDocument(null)} 
              className="btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="btn-primary"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const ViewModal = () => (
    <div className="modal-backdrop">
      <div className="modal-content max-w-4xl">
        <div className="section-padding border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-2">{viewingDocument?.name}</h2>
            <button onClick={() => setViewingDocument(null)} className="btn-tertiary p-2">
              <X className="icon-md" />
            </button>
          </div>
        </div>
        <div className="section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Document Info */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Document Details</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Type:</span>
                    <span className="ml-2">{viewingDocument?.type}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Uploaded:</span>
                    <span className="ml-2">{viewingDocument?.uploadDate}</span>
                  </div>
                  {viewingDocument?.fileData && (
                    <div>
                      <span className="font-medium text-gray-600">File:</span>
                      <span className="ml-2">{viewingDocument.fileData.name}</span>
                    </div>
                  )}
                  {viewingDocument?.tags && viewingDocument.tags.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-600">Tags:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {viewingDocument.tags.map(tag => (
                          <span key={tag} className="status-badge status-emerald text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {viewingDocument?.notes && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
                  <p className="text-sm text-gray-700">{viewingDocument.notes}</p>
                </div>
              )}
            </div>
            
            {/* Document Preview */}
            <div className="lg:col-span-2">
              <div className="bg-gray-100 p-8 rounded-lg text-center min-h-96 flex items-center justify-center">
                <div>
                  <div className="w-20 h-20 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-10 h-10 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Document Preview</h3>
                  <p className="text-gray-600 mb-4">
                    {viewingDocument?.fileData ? 
                      `File: ${viewingDocument.fileData.name}` : 
                      `Preview functionality for ${viewingDocument?.type?.toLowerCase()} documents`
                    }
                  </p>
                  {viewingDocument?.fileData && (
                    <div className="space-y-2 text-sm text-gray-500">
                      <p>• File size: {Math.round(viewingDocument.fileData.size / 1024)} KB</p>
                      <p>• Type: {viewingDocument.fileData.type}</p>
                      <p>• Preview available for supported formats</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-6">
            <div className="text-sm text-gray-500">
              {viewingDocument?.fileData ? 
                `File size: ${Math.round(viewingDocument.fileData.size / 1024)} KB • Last modified: ${viewingDocument?.uploadDate}` :
                `Last modified: ${viewingDocument?.uploadDate}`
              }
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => setViewingDocument(null)} 
                className="btn-secondary"
              >
                Close
              </button>
              <button 
                onClick={() => handleDownload(viewingDocument)}
                className="btn-primary"
              >
                <Download className="icon-sm" />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 section-padding-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 mb-2">Documents</h1>
            <p className="text-body mb-4">Manage your networking documents and templates</p>
            <div className="flex items-center text-sm text-gray-500">
              <FileText className="icon-sm mr-2" />
              {filteredAndSortedDocuments.length} documents
            </div>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-primary"
          >
            <Plus className="icon-sm" />
            Upload Document
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200 section-padding">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex-1 relative">
            <Search className="icon-md absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
          </div>
          
          <div className="controls-container">
            <SortDropdown />
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-control ${Object.values(filters).some(f => f.length > 0) ? 'active' : ''}`}
            >
              <Filter className="icon-sm" />
              Filters
            </button>
          </div>
        </div>

        {/* Filter Dropdowns */}
        {showFilters && (
          <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <FilterDropdown
              title="Type"
              options={filterOptions.types}
              selected={filters.types}
              onChange={handleFilterChange}
              filterKey="types"
            />
            <FilterDropdown
              title="Contacts"
              options={filterOptions.contacts}
              selected={filters.contacts}
              onChange={handleFilterChange}
              filterKey="contacts"
            />
            <FilterDropdown
              title="Firms"
              options={filterOptions.firms}
              selected={filters.firms}
              onChange={handleFilterChange}
              filterKey="firms"
            />
            <FilterDropdown
              title="Tags"
              options={filterOptions.tags}
              selected={filters.tags}
              onChange={handleFilterChange}
              filterKey="tags"
            />
            
            {Object.values(filters).some(f => f.length > 0) && (
              <button
                onClick={clearFilters}
                className="btn-control"
              >
                <X className="icon-sm" />
                Clear All
              </button>
            )}
          </div>
        )}
      </div>

      {/* Documents Table - Fixed width container */}
      <div className="section-padding-lg">
        <div className="max-w-full overflow-hidden">
          <div className="card-base overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-compact min-w-[1200px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left font-semibold text-gray-700 w-80">Document</th>
                    <th className="text-left font-semibold text-gray-700 w-32">Type</th>
                    <th className="text-left font-semibold text-gray-700 w-40">Upload Date</th>
                    <th className="text-left font-semibold text-gray-700 w-96">Associated</th>
                    <th className="text-left font-semibold text-gray-700 w-48">Tags</th>
                    <th className="text-center font-semibold text-gray-700 w-32">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAndSortedDocuments.map(document => (
                    <tr key={document.id} className="hover:bg-primary-50 transition-colors">
                      <td>
                        <div className="flex items-center">
                          <div className="w-12 h-12 gradient-blue rounded-lg flex items-center justify-center text-white text-lg mr-4 shadow-sm">
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-gray-900 text-base truncate">{document.name}</div>
                            {document.notes && (
                              <div className="text-sm text-gray-600 mt-1 truncate max-w-md">{document.notes}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="status-badge status-blue text-nowrap">
                          {document.type}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="icon-sm mr-2" />
                          {new Date(document.uploadDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        <div className="space-y-2">
                          {document.associatedContacts.length > 0 && (
                            <div className="flex items-center text-sm">
                              <Users className="icon-sm mr-2 text-gray-400" />
                              <span className="text-gray-600 truncate">
                                {document.associatedContacts.slice(0, 2).join(', ')}
                                {document.associatedContacts.length > 2 && ` +${document.associatedContacts.length - 2} more`}
                              </span>
                            </div>
                          )}
                          {document.associatedFirms.length > 0 && (
                            <div className="flex items-center text-sm">
                              <Building2 className="icon-sm mr-2 text-gray-400" />
                              <span className="text-gray-600 truncate">
                                {document.associatedFirms.slice(0, 2).join(', ')}
                                {document.associatedFirms.length > 2 && ` +${document.associatedFirms.length - 2} more`}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {document.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="status-badge status-emerald">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                          {document.tags.length > 3 && (
                            <span className="text-xs text-gray-500">+{document.tags.length - 3} more</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons justify-center">
                          <button
                            onClick={() => handleView(document)}
                            className="action-button"
                            title="View"
                          >
                            <Eye className="icon-sm" />
                          </button>
                          <button
                            onClick={() => handleDownload(document)}
                            className="action-button"
                            title="Download"
                          >
                            <Download className="icon-sm" />
                          </button>
                          <button
                            onClick={() => handleEdit(document)}
                            className="action-button"
                            title="Edit"
                          >
                            <Edit2 className="icon-sm" />
                          </button>
                          <button
                            onClick={() => onDelete(document.id)}
                            className="action-button delete"
                            title="Delete"
                          >
                            <Trash2 className="icon-sm" />
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

        {filteredAndSortedDocuments.length === 0 && (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No documents found</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {searchTerm || Object.values(filters).some(f => f.length > 0)
                ? 'Try adjusting your search or filters to find what you\'re looking for.'
                : 'Get started by uploading your first networking document.'
              }
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn-primary"
            >
              Upload Your First Document
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {showUploadModal && <UploadModal />}
      {editingDocument && <EditModal />}
      {viewingDocument && <ViewModal />}
    </div>
  );
};

export default Documents;
