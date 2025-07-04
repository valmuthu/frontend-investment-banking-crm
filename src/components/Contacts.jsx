import { useState, useMemo } from 'react';
import { 
  Search, Plus, Filter, ArrowUpDown, Grid, List, 
  Edit2, Trash2, Eye, Mail, Phone, ExternalLink, 
  Check, MapPin, ChevronRight, X, ChevronDown
} from 'lucide-react';

const Contacts = ({ 
  contacts, 
  networkingStatuses, 
  nextStepsOptions, 
  groups,
  onEdit, 
  onDelete, 
  onAdd,
  setSelectedContactId,
  setShowContactDetail 
}) => {
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    firms: [],
    positions: [],
    groups: [],
    networkingStatuses: [],
    nextSteps: []
  });

  // Get unique values for filters
  const filterOptions = useMemo(() => ({
    firms: [...new Set(contacts.map(c => c.firm))].sort(),
    positions: [...new Set(contacts.map(c => c.position))].sort(),
    groups: [...new Set(contacts.map(c => c.group))].sort(),
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
        contact.group.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase());
      
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
      case 'To Be Contacted': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Initial Outreach Sent': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Intro Call Complete': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Follow-Up Complete': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Regular Contact': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const FilterDropdown = ({ title, options, selected, onChange, filterKey }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
            selected.length > 0 
              ? 'bg-blue-50 border-blue-200 text-blue-700' 
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {title} {selected.length > 0 && `(${selected.length})`}
          <ChevronDown className="w-4 h-4 ml-1" />
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
            <div className="p-2">
              {options.map(option => (
                <label key={option} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selected.includes(option)}
                    onChange={() => onChange(filterKey, option)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-900">{option}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const ContactCard = ({ contact }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <img
              src={contact.avatar}
              alt={contact.name}
              className="w-12 h-12 rounded-full object-cover mr-3"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{contact.name}</h3>
              <p className="text-sm text-gray-600">{contact.position}</p>
              <p className="text-sm font-medium text-gray-900">{contact.firm}</p>
              <p className="text-xs text-gray-500">{contact.group}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setSelectedContactId(contact.id);
                setShowContactDetail(true);
              }}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(contact)}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(contact.id)}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(contact.networkingStatus)}`}>
              {contact.networkingStatus}
            </span>
            <p className="text-xs text-gray-500 mt-1">
              Status Date: {contact.networkingStatusDate}
            </p>
          </div>

          {contact.referred && (
            <div className="flex items-center text-sm text-green-600">
              <Check className="w-4 h-4 mr-2" />
              Referred by {contact.referredBy}
            </div>
          )}

          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Next Steps:</span>
              <span className="font-medium text-gray-900">{contact.nextStepsDate}</span>
            </div>
            <p className="text-sm text-gray-700 mt-1">{contact.nextSteps}</p>
          </div>

          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center space-x-3">
              <a href={`mailto:${contact.email}`} className="text-gray-400 hover:text-blue-600 transition-colors">
                <Mail className="w-4 h-4" />
              </a>
              <a href={`tel:${contact.phone}`} className="text-gray-400 hover:text-green-600 transition-colors">
                <Phone className="w-4 h-4" />
              </a>
              <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <button
              onClick={() => {
                setSelectedContactId(contact.id);
                setShowContactDetail(true);
              }}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View Details
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ContactTable = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Name
                  <ArrowUpDown className="w-4 h-4 ml-1" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('firm')}
                  className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Firm
                  <ArrowUpDown className="w-4 h-4 ml-1" />
                </button>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Position</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Group</th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('networkingStatus')}
                  className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Status
                  <ArrowUpDown className="w-4 h-4 ml-1" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('networkingStatusDate')}
                  className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Status Date
                  <ArrowUpDown className="w-4 h-4 ml-1" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('nextSteps')}
                  className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Next Steps
                  <ArrowUpDown className="w-4 h-4 ml-1" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('nextStepsDate')}
                  className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Due Date
                  <ArrowUpDown className="w-4 h-4 ml-1" />
                </button>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAndSortedContacts.map(contact => (
              <tr key={contact.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{contact.name}</div>
                  <div className="text-sm text-gray-600">{contact.email}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{contact.firm}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{contact.position}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{contact.group}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(contact.networkingStatus)}`}>
                    {contact.networkingStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{contact.networkingStatusDate}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{contact.nextSteps}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{contact.nextStepsDate}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedContactId(contact.id);
                        setShowContactDetail(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEdit(contact)}
                      className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(contact.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
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
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
            <p className="text-gray-600 mt-1">Manage your investment banking network</p>
          </div>
          <div className="flex items-center space-x-3">
            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('cards')}
                className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'cards' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="w-4 h-4 mr-1" />
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'table' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4 mr-1" />
                Table
              </button>
            </div>
            <button
              onClick={onAdd}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-4 py-2.5 border rounded-lg hover:bg-gray-50 transition-colors ${
              Object.values(filters).some(f => f.length > 0) ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-300'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>

        {/* Filter Dropdowns */}
        {showFilters && (
          <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 rounded-lg">
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
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <X className="w-4 h-4 mr-1" />
                Clear All
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
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
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || Object.values(filters).some(f => f.length > 0)
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first contact'
              }
            </p>
            <button
              onClick={onAdd}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
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
