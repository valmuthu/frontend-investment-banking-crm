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

  // Get unique values for filters
  const filterOptions = useMemo(() => ({
    firms: [...new Set(contacts.map(c => c.firm))].sort(),
    positions: [...new Set(contacts.map(c => c.position))].sort(),
    groups: [...new Set(contacts.map(c => c.group).filter(Boolean))].sort(),
    networkingStatuses: networkingStatuses,
    nextSteps: [...new Set(contacts.map(c => c.nextSteps).filter(Boolean))].sort()
  }), [contacts, networkingStatuses]);

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
      case 'Not Yet Contacted': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'Initial Outreach Sent': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Intro Call Scheduled': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Intro Call Complete': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Follow-Up Email Sent': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Follow-Up Call Scheduled': return 'bg-orange-50 text-orange-700 border-orange-200';
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
    if (diffDays <= 2) return 'text-orange-600 font-semibold';
    return 'text-gray-600';
  };

  const getDateUrgency = (date) => {
    if (!date) return 'text-gray-600';
    const today = new Date();
    const dateObj = new Date(date);
    const diffDays = Math.ceil((dateObj - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-red-600 font-bold';
    return 'text-gray-800 font-medium';
  };

  const FilterDropdown = ({ title, options, selected, onChange, filterKey }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center px-4 py-3 border border-gray-300 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-md ${
            selected.length > 0 
              ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-sm' 
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
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
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
        sortField ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'
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
              key={option}
              onClick={() => setViewMode('table')}
              className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                viewMode === 'table'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4 mr-2" />
              Table
            </button>
          ))} {/* <-- Close sortOptions.map here */}
        </div>
        <button
          onClick={onAdd}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl flex items-center hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Contact
        </button>
      </div>
    )}
  </div>
); // <-- Close arrow function here
  
      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm shadow-sm"
            />
          </div>
          
          <SortDropdown />
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold hover:shadow-md ${
              Object.values(filters).some(f => f.length > 0) ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-sm' : 'text-gray-700'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>

        {/* Filter Dropdowns */}
        {showFilters && (
          <div className="flex flex-wrap items-center gap-4 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
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
                className="flex items-center px-4 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-white rounded-xl transition-colors border border-gray-300 font-semibold"
              >
                <X className="w-4 h-4 mr-2" />
                Clear All
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-8">
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedContacts.map(contact => (
              <ContactCard key={contact.id} contact={contact} />
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
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
            >
              Add Your First Contact
            </button>
          </div>
        )}
      </div>
 
export default Contacts;
                key={option.field}
                onClick={() => handleSort(option.field)}
                className={`w-full text-left p-3 hover:bg-gray-50 rounded-lg text-sm transition-colors ${
                  sortField === option.field ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-900'
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

  const ContactCard = ({ contact }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-blue-200"
         onClick={() => onShowContactDetail(contact.id)}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center flex-1">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg mr-4 shadow-md">
              {contact.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">{contact.name}</h3>
              <div className="flex items-center mt-1">
                <Building2 className="w-4 h-4 text-gray-400 mr-1" />
                <p className="text-sm font-semibold text-gray-900">{contact.firm}</p>
              </div>
              <p className="text-gray-600 font-medium text-sm">{contact.position}</p>
              {contact.group && <p className="text-xs text-gray-500 mt-1 font-medium bg-gray-100 px-2 py-1 rounded-full inline-block">{contact.group}</p>}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(contact);
              }}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(contact.id);
              }}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(contact.networkingStatus)}`}>
                {contact.networkingStatus}
              </span>
              {contact.referred && (
                <div className="flex items-center text-sm text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
                  <Check className="w-4 h-4 mr-1" />
                  Referred
                </div>
              )}
            </div>
            <p className={`text-xs ${getDateUrgency(contact.networkingDate)}`}>
              Status Date: {contact.networkingDate}
            </p>
          </div>

          {contact.nextSteps && (
            <div className="pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600 font-medium">Next Steps:</span>
                <span className={`text-sm ${getPriorityColor(contact.nextStepsDate)}`}>
                  {contact.nextStepsDate}
                </span>
              </div>
              <p className="text-sm text-gray-700">{contact.nextSteps}</p>
            </div>
          )}

          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <div className="relative">
                  <button
                    onMouseEnter={() => setHoveredContact(`email-${contact.id}`)}
                    onMouseLeave={() => setHoveredContact(null)}
                    className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50 group/btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(contact.email, `email-${contact.id}`);
                    }}
                  >
                    {copiedInfo === `email-${contact.id}` ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                  </button>
                  {hoveredContact === `email-${contact.id}` && (
                    <div className="absolute bottom-12 left-0 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                      Click to copy: {contact.email}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    onMouseEnter={() => setHoveredContact(`phone-${contact.id}`)}
                    onMouseLeave={() => setHoveredContact(null)}
                    className="text-gray-400 hover:text-green-600 transition-colors p-2 rounded-lg hover:bg-green-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(contact.phone, `phone-${contact.id}`);
                    }}
                  >
                    {copiedInfo === `phone-${contact.id}` ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Phone className="w-4 h-4" />
                    )}
                  </button>
                  {hoveredContact === `phone-${contact.id}` && (
                    <div className="absolute bottom-12 left-0 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                      Click to copy: {contact.phone}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    onMouseEnter={() => setHoveredContact(`linkedin-${contact.id}`)}
                    onMouseLeave={() => setHoveredContact(null)}
                    className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(contact.linkedin, `linkedin-${contact.id}`);
                    }}
                  >
                    {copiedInfo === `linkedin-${contact.id}` ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Linkedin className="w-4 h-4" />
                    )}
                  </button>
                  {hoveredContact === `linkedin-${contact.id}` && (
                    <div className="absolute bottom-12 left-0 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                      Click to copy LinkedIn
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium group-hover:translate-x-1 transition-transform">
                <span>View Details</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>

            {/* Interaction count */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                {contact.interactions?.length || 0} interactions
              </div>
              <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ContactTable = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 w-80">Contact</th>
              <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 w-72">Company & Role</th>
              <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 w-64">Status</th>
              <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 w-72">Next Steps</th>
              <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 w-48">Contact Info</th>
              <th className="px-8 py-6 text-center text-sm font-bold text-gray-700 w-32">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredAndSortedContacts.map(contact => (
              <tr key={contact.id} className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onShowContactDetail(contact.id)}>
                <td className="px-8 py-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold mr-4 shadow-sm">
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 hover:text-blue-600 transition-colors text-base">{contact.name}</div>
                      <div className="flex items-center mt-2 space-x-3">
                        {contact.referred && (
                          <div className="flex items-center text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
                            <Check className="w-3 h-3 mr-1" />
                            Referred
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div>
                    <div className="flex items-center font-semibold text-gray-900 text-base">
                      <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                      {contact.firm}
                    </div>
                    <div className="text-sm text-gray-600 mt-1 font-medium">{contact.position}</div>
                    {contact.group && <div className="text-xs text-gray-500 mt-1 font-medium bg-gray-100 px-2 py-1 rounded-full inline-block">{contact.group}</div>}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div>
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(contact.networkingStatus)}`}>
                      {contact.networkingStatus}
                    </span>
                    <div className={`text-sm mt-2 ${getDateUrgency(contact.networkingDate)}`}>{contact.networkingDate}</div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  {contact.nextSteps && (
                    <div>
                      <div className="text-sm text-gray-900 font-medium">{contact.nextSteps}</div>
                      <div className={`text-sm mt-1 font-medium ${getPriorityColor(contact.nextStepsDate)}`}>
                        {contact.nextStepsDate}
                      </div>
                    </div>
                  )}
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col space-y-2">
                    <div className="relative">
                      <button
                        onMouseEnter={() => setHoveredContact(`table-email-${contact.id}`)}
                        onMouseLeave={() => setHoveredContact(null)}
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(contact.email, `table-email-${contact.id}`);
                        }}
                        className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50"
                      >
                        {copiedInfo === `table-email-${contact.id}` ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Mail className="w-4 h-4" />
                        )}
                      </button>
                      {hoveredContact === `table-email-${contact.id}` && (
                        <div className="absolute bottom-8 left-0 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                          Click to copy: {contact.email}
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <button
                        onMouseEnter={() => setHoveredContact(`table-phone-${contact.id}`)}
                        onMouseLeave={() => setHoveredContact(null)}
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(contact.phone, `table-phone-${contact.id}`);
                        }}
                        className="text-gray-400 hover:text-green-600 transition-colors p-2 rounded-lg hover:bg-green-50"
                      >
                        {copiedInfo === `table-phone-${contact.id}` ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Phone className="w-4 h-4" />
                        )}
                      </button>
                      {hoveredContact === `table-phone-${contact.id}` && (
                        <div className="absolute bottom-8 left-0 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                          Click to copy: {contact.phone}
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <button
                        onMouseEnter={() => setHoveredContact(`table-linkedin-${contact.id}`)}
                        onMouseLeave={() => setHoveredContact(null)}
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(contact.linkedin, `table-linkedin-${contact.id}`);
                        }}
                        className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50"
                      >
                        {copiedInfo === `table-linkedin-${contact.id}` ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Linkedin className="w-4 h-4" />
                        )}
                      </button>
                      {hoveredContact === `table-linkedin-${contact.id}` && (
                        <div className="absolute bottom-8 left-0 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                          Click to copy LinkedIn
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center justify-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(contact);
                      }}
                      className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(contact.id);
                      }}
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
  );

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Contacts</h1>
            <p className="text-lg text-gray-600 mb-4">Manage your investment banking network</p>
            <div className="flex items-center text-sm text-gray-500">
              <Users className="w-4 h-4 mr-2" />
              {filteredAndSortedContacts.length} contacts
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1.5">
              <button
                onClick={() => setViewMode('cards')}
                className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  viewMode === 'cards' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="w-4 h-4 mr-2" />
                Cards
              </button>
              <button
