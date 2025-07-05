import { useState, useMemo, useRef } from 'react';
import { 
  Search, Plus, Filter, ArrowUpDown, Edit2, Trash2, Eye, 
  Download, FileText, Calendar, Building2, Users, X, 
  ChevronDown, Upload, Tag, File, Check
} from 'lucide-react';

const Documents = ({ documents, contacts, onAdd, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('uploadDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const fileInputRef = useRef(null);
  
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewDocument(prev => ({ ...prev, file }));
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (newDocument.name && newDocument.type) {
      onAdd(newDocument);
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
  };

  const handleView = (document) => {
    // Implement view functionality
    console.log('Viewing document:', document);
  };

  const handleDownload = (document) => {
    // Implement download functionality
    console.log('Downloading document:', document);
  };

  const handleTagInput = (value, field) => {
    if (value.includes(',')) {
      const newTags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
      setNewDocument(prev => ({
        ...prev,
        [field]: [...new Set([...prev[field], ...newTags])]
      }));
    }
  };

  const removeTag = (tagToRemove, field) => {
    setNewDocument(prev => ({
      ...prev,
      [field]: prev[field].filter(tag => tag !== tagToRemove)
    }));
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
          className={`flex items-center px-4 py-3 border border-gray-300 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-md ${
            selected.length > 0 
              ? 'bg-purple-50 border-purple-300 text-purple-700 shadow-sm' 
              : 'bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'
          }`}
        >
          {title} {selected.length > 0 && `(${selected.length})`}
          <ChevronDown className="w-4 h-4 ml-2" />
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-10 max-h-60 overflow-y-auto">
            <div className="p-2">
              {options.map(option => (
                <label key={option} className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={selected.includes(option)}
                    onChange={() => onChange(filterKey, option)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
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
        className={`flex items-center px-4 py-3 border border-gray-300 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-md ${
          sortField ? 'bg-purple-50 border-purple-300 text-purple-700 shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'
        }`}
      >
        <ArrowUpDown className="w-4 h-4 mr-2" />
        Sort {sortField && `(${sortField})`}
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>
      
      {showSortOptions && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-10">
          <div className="p-2">
            {sortOptions.map(option => (
              <button
                key={option.field}
                onClick={() => handleSort(option.field)}
                className={`w-full text-left p-3 hover:bg-gray-50 rounded-lg text-sm transition-colors ${
                  sortField === option.field ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-gray-900'
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

  const MultiSelectDropdown = ({ title, options, selected, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-left flex items-center justify-between"
        >
          <span className={selected.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
            {selected.length > 0 ? `${selected.length} selected` : placeholder}
          </span>
          <ChevronDown className="w-4 h-4" />
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
            <div className="p-2">
              {options.map(option => (
                <label key={option.value || option} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selected.includes(option.value || option)}
                    onChange={() => onChange(option.value || option)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-900">{option.label || option}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const UploadModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Upload Document</h2>
            <button onClick={() => setShowUploadModal(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <form onSubmit={handleUpload} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Document Title *</label>
            <input
              type="text"
              required
              value={newDocument.name}
              onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
              placeholder="e.g., Resume - Investment Banking 2025"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">File Upload</label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                {newDocument.file ? newDocument.file.name : 'Click to browse files'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supports: PDF, DOC, DOCX, TXT (Max 10MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Document Type *</label>
            <select
              value={newDocument.type}
              onChange={(e) => setNewDocument({ ...newDocument, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                options={contacts.map(contact => ({ value: contact.name, label: `${contact.name} - ${contact.firm}` }))}
                selected={newDocument.associatedContacts}
                onChange={(contactName) => {
                  setNewDocument(prev => ({
                    ...prev,
                    associatedContacts: prev.associatedContacts.includes(contactName)
                      ? prev.associatedContacts.filter(c => c !== contactName)
                      : [...prev.associatedContacts, contactName]
                  }));
                }}
                placeholder="Select contacts"
              />
              {newDocument.associatedContacts.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {newDocument.associatedContacts.map(contact => (
                    <span key={contact} className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      {contact}
                      <button
                        type="button"
                        onClick={() => removeTag(contact, 'associatedContacts')}
                        className="ml-1 text-purple-600 hover:text-purple-800"
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
              <input
                type="text"
                value={newDocument.associatedFirms.join(', ')}
                onChange={(e) => handleTagInput(e.target.value, 'associatedFirms')}
                placeholder="Goldman Sachs, Morgan Stanley..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
              {newDocument.associatedFirms.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {newDocument.associatedFirms.map(firm => (
                    <span key={firm} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {firm}
                      <button
                        type="button"
                        onClick={() => removeTag(firm, 'associatedFirms')}
                        className="ml-1 text-blue-600 hover:text-blue-800"
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
                    if (newDocument.tags.includes(tag)) {
                      removeTag(tag, 'tags');
                    } else {
                      setNewDocument(prev => ({ ...prev, tags: [...prev.tags, tag] }));
                    }
                  }}
                  className={`px-2 py-1 text-xs rounded-full transition-colors ${
                    newDocument.tags.includes(tag)
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
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
                  handleTagInput(e.target.value + ',', 'tags');
                  e.target.value = '';
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {newDocument.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {newDocument.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag, 'tags')}
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
              value={newDocument.notes}
              onChange={(e) => setNewDocument({ ...newDocument, notes: e.target.value })}
              placeholder="Additional notes about this document..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button 
              type="button" 
              onClick={() => setShowUploadModal(false)} 
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Upload Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex-1 bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Documents</h1>
            <p className="text-lg text-gray-600 mb-4">Manage your networking documents and templates</p>
            <div className="flex items-center text-sm text-gray-500">
              <FileText className="w-4 h-4 mr-2" />
              {filteredAndSortedDocuments.length} documents
            </div>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl flex items-center hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Upload Document
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm shadow-sm"
            />
          </div>
          
          <SortDropdown />
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold hover:shadow-md ${
              Object.values(filters).some(f => f.length > 0) ? 'bg-purple-50 border-purple-300 text-purple-700 shadow-sm' : 'text-gray-700'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>

        {/* Filter Dropdowns */}
        {showFilters && (
          <div className="flex flex-wrap items-center gap-4 p-6 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl border border-gray-200">
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
                className="flex items-center px-4 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-white rounded-xl transition-colors border border-gray-300 font-semibold"
              >
                <X className="w-4 h-4 mr-2" />
                Clear All
              </button>
            )}
          </div>
        )}
      </div>

      {/* Documents Table */}
      <div className="p-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-purple-50 border-b border-gray-200">
                <tr>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700">Document</th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700">Type</th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700">Upload Date</th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700">Associated</th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700">Tags</th>
                  <th className="px-8 py-6 text-center text-sm font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAndSortedDocuments.map(document => (
                  <tr key={document.id} className="hover:bg-purple-50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-lg mr-4 shadow-sm">
                          {getTypeIcon(document.type)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-base">{document.name}</div>
                          {document.notes && (
                            <div className="text-sm text-gray-600 mt-1 truncate max-w-md">{document.notes}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200">
                        {document.type}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(document.uploadDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-2">
                        {document.associatedContacts.length > 0 && (
                          <div className="flex items-center text-sm">
                            <Users className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-gray-600">
                              {document.associatedContacts.slice(0, 2).join(', ')}
                              {document.associatedContacts.length > 2 && ` +${document.associatedContacts.length - 2} more`}
                            </span>
                          </div>
                        )}
                        {document.associatedFirms.length > 0 && (
                          <div className="flex items-center text-sm">
                            <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-gray-600">
                              {document.associatedFirms.slice(0, 2).join(', ')}
                              {document.associatedFirms.length > 2 && ` +${document.associatedFirms.length - 2} more`}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-1">
                        {document.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                        {document.tags.length > 3 && (
                          <span className="text-xs text-gray-500">+{document.tags.length - 3} more</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleView(document)}
                          className="text-gray-400 hover:text-purple-600 transition-colors p-2 rounded-lg hover:bg-purple-50"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(document)}
                          className="text-gray-400 hover:text-emerald-600 transition-colors p-2 rounded-lg hover:bg-emerald-50"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(document)}
                          className="text-gray-400 hover:text-orange-600 transition-colors p-2 rounded-lg hover:bg-orange-50"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(document.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                          title="Delete"
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
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
            >
              Upload Your First Document
            </button>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && <UploadModal />}
    </div>
  );
};

export default Documents;
