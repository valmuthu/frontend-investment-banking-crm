import { useState, useMemo } from 'react';
import { 
  Search, Plus, Filter, ArrowUpDown, Grid, List, 
  Edit2, Trash2, Eye, Mail, Phone, ExternalLink, 
  Check, ChevronRight, X, ChevronDown, Linkedin,
  Building2, Calendar, Users, Copy, CheckCircle
} from 'lucide-react';

const Contacts = ({ 
  contacts, 
  networkingStatuses, 
  nextStepsOptions, 
  groups,
  onEdit, 
  onDelete, 
  onAdd,
  onShowContactDetail 
}) => {
  const [viewMode, setViewMode] = useState('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [hoveredContact, setHoveredContact] = useState(null);
  const [copiedInfo, setCopiedInfo] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    firms: [],
    positions: [],
    groups: [],
    networkingStatuses: [],
    nextSteps: []
  });

  // Helper function to get contact ID consistently
  const getContactId = (contact) => contact._id || contact.id;

  // Sorting options
  const sortOptions = [
    { field: 'name', label: 'Name' },
    { field: 'firm', label: 'Firm' },
    { field: 'position', label: 'Position' },
    { field: 'group', label: 'Group' },
    { field: 'networkingStatus', label: 'Status' },
    { field: 'networkingDate', label: 'Status Date' },
    { field: 'nextSteps', label: 'Next Steps' },
    { field: 'nextStepsDate', label: 'Next Steps Date' }
  ];

  // Copy to clipboard function
  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedInfo(type);
      setTimeout(() => setCopiedInfo(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Get unique values for filters - excluding blank values
  const filterOptions = useMemo(() => ({
    firms: [...new Set(contacts.map(c => c.firm).filter(Boolean))].sort(),
    positions: [...new Set(contacts.map(c => c.position).filter(Boolean))].sort(),
    groups: [...new Set(contacts.map(c => c.group).filter(Boolean))].sort(),
    networkingStatuses: [...new Set(contacts.map(c => c.networkingStatus).filter(Boolean))].sort(),
    nextSteps: [...new Set(contacts.map(c => c.nextSteps).filter(Boolean))].sort()
  }), [contacts]);

  // Filtered and sorted contacts
  const filteredAndSortedContacts = useMemo(() => {
    let filtered = contacts.filter(contact => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.firm.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contact.group && contact.group.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Multi-select filters
      const matchesFirm = filters.firms.length === 0 || filters.firms.includes(contact.firm);
      const matchesPosition = filters.positions.length === 0 || filters.positions.includes(contact.position);
      const matchesGroup = filters.groups.length === 0 || filters.groups.includes(contact.group);
      const matchesNetworkingStatus = filters.networkingStatuses.length === 0 || filters.networkingStatuses.includes(contact.networkingStatus);
      const matchesNextSteps = filters.nextSteps.length === 0 || filters.nextSteps.includes(contact.nextSteps);
      
      return matchesSearch && matchesFirm && matchesPosition && matchesGroup && 
             matchesNetworkingStatus && matchesNextSteps;
    });

    // Sort
    if (sortField) {
      filtered.sort((a, b) => {
        let aValue = a[sortField] || '';
        let bValue = b[sortField] || '';
        
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
    }

    return filtered;
  }, [contacts, searchTerm, filters, sortField, sortDirection]);

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
      firms: [],
      positions: [],
      groups: [],
      networkingStatuses: [],
      nextSteps: []
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Not Yet Contacted': return 'status-gray';
      case 'Initial Outreach Sent': return 'status-blue';
      case 'Intro Call Scheduled': return 'status-amber';
      case 'Intro Call Complete': return 'status-emerald';
      case 'Follow-Up Email Sent': return 'status-coral';
      case 'Follow-Up Call Scheduled': return 'status-amber';
      case 'Follow-Up Call Complete': return 'status-emerald';
      default: return 'status-gray';
    }
  };

  const getPriorityColor = (date) => {
    if (!date) return 'text-gray-500';
    const today = new Date();
    const taskDate = new Date(date);
    const diffDays = Math.ceil((taskDate - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-red-600 font-semibold';
    if (diffDays <= 2) return 'text-amber-600 font-semibold';
    return 'text-gray-600';
  };

  // Helper function to format position and group
  const formatPositionGroup = (position, group) => {
    if (group) {
      return `${position}, ${group}`;
    }
    return position;
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

  const ContactCard = ({ contact }) => {
    const contactId = getContactId(contact);
    
    return (
      <div className="card-interactive"
           onClick={() => onShowContactDetail(contactId)}>
        <div className="section-padding">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center flex-1">
              <div className="w-12 h-12 gradient-blue rounded-xl flex items-center justify-center text-white font-semibold text-sm mr-4 shadow-sm">
                {contact.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-heading-3 group-hover:text-primary-600 transition-colors truncate">{contact.name}</h3>
                <div className="flex items-center mt-1">
                  <Building2 className="icon-sm text-gray-400 mr-1" />
                  <p className="text-body-strong truncate">{contact.firm}</p>
                </div>
                <p className="text-body truncate">{formatPositionGroup(contact.position, contact.group)}</p>
              </div>
            </div>
            <div className="action-buttons">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(contact);
                }}
                className="action-button"
                title="Edit"
              >
                <Edit2 className="icon-sm" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(contactId);
                }}
                className="action-button delete"
                title="Delete"
              >
                <Trash2 className="icon-sm" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`status-badge ${getStatusColor(contact.networkingStatus)}`}>
                {contact.networkingStatus}
              </span>
              {contact.referred && (
                <div className="referral-badge">
                  <Check className="icon-sm" />
                  Referred
                </div>
              )}
            </div>

            <div className="text-xs text-gray-500">
              <span>Status Date: {contact.networkingDate}</span>
            </div>

            {contact.nextSteps && (
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600 font-medium">Next Steps:</span>
                  <span className={`text-sm ${getPriorityColor(contact.nextStepsDate)}`}>
                    {contact.nextStepsDate}
                  </span>
                </div>
                <p className="text-sm text-gray-700 truncate">{contact.nextSteps}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(contact.email, `email-${contactId}`);
                  }}
                  className="p-2 text-gray-400 hover:text-primary-600 transition-colors rounded-lg hover:bg-primary-50"
                  title={`Copy email: ${contact.email}`}
                >
                  {copiedInfo === `email-${contactId}` ? (
                    <CheckCircle className="icon-sm text-emerald-600" />
                  ) : (
                    <Mail className="icon-sm" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(contact.phone, `phone-${contactId}`);
                  }}
                  className="p-2 text-gray-400 hover:text-emerald-600 transition-colors rounded-lg hover:bg-emerald-50"
                  title={`Copy phone: ${contact.phone}`}
                >
                  {copiedInfo === `phone-${contactId}` ? (
                    <CheckCircle className="icon-sm text-emerald-600" />
                  ) : (
                    <Phone className="icon-sm" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(contact.linkedin, `linkedin-${contactId}`);
                  }}
                  className="p-2 text-gray-400 hover:text-primary-600 transition-colors rounded-lg hover:bg-primary-50"
                  title="Copy LinkedIn"
                >
                  {copiedInfo === `linkedin-${contactId}` ? (
                    <CheckCircle className="icon-sm text-emerald-600" />
                  ) : (
                    <Linkedin className="icon-sm" />
                  )}
                </button>
              </div>
              <div className="flex items-center text-sm text-primary-600 hover:text-primary-800 font-medium group-hover:translate-x-1 transition-transform">
                <span>View Details</span>
                <ChevronRight className="icon-sm ml-1" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                {contact.interactions?.length || 0} interactions
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ContactTable = () => (
    <div className="card-base overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full table-compact">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left font-semibold text-gray-700 w-72">Contact</th>
              <th className="text-left font-semibold text-gray-700 w-64">Company & Role</th>
              <th className="text-left font-semibold text-gray-700 w-48">Status</th>
              <th className="text-left font-semibold text-gray-700 w-52">Next Steps</th>
              <th className="text-left font-semibold text-gray-700 w-32">Contact Info</th>
              <th className="text-center font-semibold text-gray-700 w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredAndSortedContacts.map(contact => {
              const contactId = getContactId(contact);
              
              return (
                <tr key={contactId} className="hover:bg-primary-50 transition-colors cursor-pointer"
                    onClick={() => onShowContactDetail(contactId)}>
                  <td>
                    <div className="flex items-center">
                      <div className="w-8 h-8 gradient-blue rounded-lg flex items-center justify-center text-white text-xs font-semibold mr-3 shadow-sm">
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 hover:text-primary-600 transition-colors text-truncate">{contact.name}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          {contact.referred && (
                            <div className="referral-badge">
                              <Check className="w-3 h-3" />
                              Referred
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div className="flex items-center font-semibold text-gray-900 text-truncate">
                        <Building2 className="icon-sm text-gray-400 mr-2" />
                        {contact.firm}
                      </div>
                      <div className="text-sm text-gray-600 mt-1 font-medium text-truncate">{formatPositionGroup(contact.position, contact.group)}</div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span className={`status-badge text-nowrap ${getStatusColor(contact.networkingStatus)}`}>
                        {contact.networkingStatus}
                      </span>
                      <div className="text-xs mt-1 text-gray-600 font-medium">{contact.networkingDate}</div>
                    </div>
                  </td>
                  <td>
                    {contact.nextSteps && (
                      <div>
                        <div className="text-sm text-gray-900 font-medium text-truncate">{contact.nextSteps}</div>
                        {contact.nextStepsDate && (
                          <div className={`text-xs mt-1 font-medium ${getPriorityColor(contact.nextStepsDate)}`}>
                            {contact.nextStepsDate}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(contact.email, `table-email-${contactId}`);
                        }}
                        className="p-1.5 text-gray-400 hover:text-primary-600 transition-colors rounded-lg hover:bg-primary-50"
                        title={`Copy email: ${contact.email}`}
                      >
                        {copiedInfo === `table-email-${contactId}` ? (
                          <CheckCircle className="icon-sm text-emerald-600" />
                        ) : (
                          <Mail className="icon-sm" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(contact.phone, `table-phone-${contactId}`);
                        }}
                        className="p-1.5 text-gray-400 hover:text-emerald-600 transition-colors rounded-lg hover:bg-emerald-50"
                        title={`Copy phone: ${contact.phone}`}
                      >
                        {copiedInfo === `table-phone-${contactId}` ? (
                          <CheckCircle className="icon-sm text-emerald-600" />
                        ) : (
                          <Phone className="icon-sm" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(contact.linkedin, `table-linkedin-${contactId}`);
                        }}
                        className="p-1.5 text-gray-400 hover:text-primary-600 transition-colors rounded-lg hover:bg-primary-50"
                        title="Copy LinkedIn"
                      >
                        {copiedInfo === `table-linkedin-${contactId}` ? (
                          <CheckCircle className="icon-sm text-emerald-600" />
                        ) : (
                          <Linkedin className="icon-sm" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(contact);
                        }}
                        className="action-button"
                        title="Edit"
                      >
                        <Edit2 className="icon-sm" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(contactId);
                        }}
                        className="action-button delete"
                        title="Delete"
                      >
                        <Trash2 className="icon-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 section-padding-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-1 mb-2">Contacts</h1>
            <p className="text-body mb-4">Manage your investment banking network</p>
            <div className="flex items-center text-sm text-gray-500">
              <Users className="icon-sm mr-2" />
              {filteredAndSortedContacts.length} contacts
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* View Toggle */}
            <div className="view-toggle">
              <button
                onClick={() => setViewMode('cards')}
                className={`view-toggle-button ${viewMode === 'cards' ? 'active' : ''}`}
              >
                <Grid className="icon-sm" />
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`view-toggle-button ${viewMode === 'table' ? 'active' : ''}`}
              >
                <List className="icon-sm" />
                Table
              </button>
            </div>
            <button
              onClick={onAdd}
              className="btn-primary"
            >
              <Plus className="icon-sm" />
              Add Contact
            </button>
          </div>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200 section-padding">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex-1 relative">
            <Search className="icon-md absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
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
              title="Firm"
              options={filterOptions.firms}
              selected={filters.firms}
              onChange={handleFilterChange}
              filterKey="firms"
            />
            <FilterDropdown
              title="Position"
              options={filterOptions.positions}
              selected={filters.positions}
              onChange={handleFilterChange}
              filterKey="positions"
            />
            <FilterDropdown
              title="Group"
              options={filterOptions.groups}
              selected={filters.groups}
              onChange={handleFilterChange}
              filterKey="groups"
            />
            <FilterDropdown
              title="Status"
              options={filterOptions.networkingStatuses}
              selected={filters.networkingStatuses}
              onChange={handleFilterChange}
              filterKey="networkingStatuses"
            />
            <FilterDropdown
              title="Next Steps"
              options={filterOptions.nextSteps}
              selected={filters.nextSteps}
              onChange={handleFilterChange}
              filterKey="nextSteps"
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

      {/* Content */}
      <div className="section-padding-lg">
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedContacts.map(contact => (
              <ContactCard key={getContactId(contact)} contact={contact} />
            ))}
          </div>
        ) : (
          <ContactTable />
        )}

        {filteredAndSortedContacts.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No contacts found</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {searchTerm || Object.values(filters).some(f => f.length > 0)
                ? 'Try adjusting your search or filters to find what you\'re looking for.'
                : 'Get started by adding your first contact to begin building your network.'
              }
            </p>
            <button
              onClick={onAdd}
              className="btn-primary"
            >
              Add Your First Contact
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contacts;
