import { useState, useMemo } from 'react';
import { 
  Search, Plus, Filter, ArrowUpDown, Grid, List, 
  Edit2, Trash2, Eye, Calendar, Clock, User, 
  ExternalLink, X, ChevronDown, Building2,
  Award, AlertCircle, Target, TrendingUp
} from 'lucide-react';

const Interviews = ({ 
  interviews = [], 
  contacts = [],
  interviewStages = [], 
  interviewNextSteps = [], 
  groups = [],
  onEdit, 
  onDelete, 
  onAdd,
  onShowContactDetail,
  onShowInterviewDetail
}) => {
  const [viewMode, setViewMode] = useState('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  
  const [filters, setFilters] = useState({
    companies: [],
    positions: [],
    groups: [],
    stages: [],
    nextSteps: [],
    priorities: []
  });

  // Sorting options
  const sortOptions = [
    { field: 'firm', label: 'Firm' },
    { field: 'position', label: 'Position' },
    { field: 'stage', label: 'Stage' },
    { field: 'stageDate', label: 'Stage Date' },
    { field: 'nextSteps', label: 'Next Steps' },
    { field: 'nextStepsDate', label: 'Next Steps Date' },
    { field: 'applicationDate', label: 'Application Date' },
    { field: 'priority', label: 'Priority' }
  ];

  // Get unique values for filters
  const filterOptions = useMemo(() => ({
    companies: [...new Set(interviews.map(i => i.firm))].sort(),
    positions: [...new Set(interviews.map(i => i.position))].sort(),
    groups: [...new Set(interviews.map(i => i.group).filter(Boolean))].sort(),
    stages: interviewStages,
    nextSteps: [...new Set(interviews.map(i => i.nextSteps).filter(Boolean))].sort(),
    priorities: ['Low', 'Medium', 'High']
  }), [interviews, interviewStages]);

  // Filtered and sorted interviews
  const filteredAndSortedInterviews = useMemo(() => {
    let filtered = interviews.filter(interview => {
      const matchesSearch = searchTerm === '' || 
        interview.firm.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interview.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (interview.stage && interview.stage.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (interview.group && interview.group.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCompany = filters.companies.length === 0 || filters.companies.includes(interview.firm);
      const matchesPosition = filters.positions.length === 0 || filters.positions.includes(interview.position);
      const matchesGroup = filters.groups.length === 0 || filters.groups.includes(interview.group);
      const matchesStage = filters.stages.length === 0 || filters.stages.includes(interview.stage);
      const matchesNextSteps = filters.nextSteps.length === 0 || filters.nextSteps.includes(interview.nextSteps);
      const matchesPriority = filters.priorities.length === 0 || filters.priorities.includes(interview.priority);
      
      return matchesSearch && matchesCompany && matchesPosition && matchesGroup && 
             matchesStage && matchesNextSteps && matchesPriority;
    });

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
  }, [interviews, searchTerm, filters, sortField, sortDirection]);

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
      companies: [],
      positions: [],
      groups: [],
      stages: [],
      nextSteps: [],
      priorities: []
    });
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'Applied': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'Phone Screen': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'First Round': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Second Round': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Final Round': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Case Study': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Offer': return 'bg-green-50 text-green-700 border-green-200';
      case 'Rejected': return 'bg-red-50 text-red-700 border-red-200';
      case 'Withdrawn': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-50 text-red-700 border-red-200';
      case 'Medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getDateUrgency = (date) => {
    if (!date) return 'text-gray-600';
    const today = new Date();
    const taskDate = new Date(date);
    const diffDays = Math.ceil((taskDate - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-red-600 font-semibold';
    if (diffDays <= 2) return 'text-orange-600 font-semibold';
    return 'text-gray-600';
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

  const SortDropdown = () => (
    <div className="relative">
      <button
        onClick={() => setShowSortOptions(!showSortOptions)}
        className={`flex items-center px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
          sortField ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        <ArrowUpDown className="w-4 h-4 mr-2" />
        Sort {sortField && `(${sortField})`}
        <ChevronDown className="w-4 h-4 ml-1" />
      </button>
      
      {showSortOptions && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="p-2">
            {sortOptions.map(option => (
              <button
                key={option.field}
                onClick={() => handleSort(option.field)}
                className={`w-full text-left p-2 hover:bg-gray-50 rounded text-sm ${
                  sortField === option.field ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
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

  const InterviewCard = ({ interview }) => {
    const referralContact = interview.referralContactId 
      ? contacts.find(c => c.id === interview.referralContactId)
      : null;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer group"
           onClick={() => onShowInterviewDetail(interview.id)}>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center flex-1">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold mr-4 shadow-md">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">{interview.firm}</h3>
                <p className="text-gray-600 font-medium">{interview.position}</p>
                {interview.group && <p className="text-xs text-gray-500 mt-1 font-medium">{interview.group}</p>}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(interview);
                }}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(interview.id);
                }}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getStageColor(interview.stage)}`}>
                {interview.stage}
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(interview.priority)}`}>
                {interview.priority} Priority
              </span>
            </div>

            <div className="text-xs text-gray-500 flex items-center justify-between">
              <span>Stage Date: {interview.stageDate}</span>
              <span>Applied: {interview.applicationDate}</span>
            </div>

            {referralContact && (
              <div className="flex items-center p-2 bg-green-50 rounded-lg border border-green-200">
                <Award className="w-4 h-4 text-green-600 mr-2" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onShowContactDetail(referralContact.id);
                  }}
                  className="text-green-600 hover:text-green-800 hover:underline text-sm font-medium"
                >
                  Referred by {referralContact.name}
                </button>
              </div>
            )}

            {interview.nextSteps && (
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600 font-medium">Next Steps:</span>
                  {interview.nextStepsDate && (
                    <span className={`text-sm ${getDateUrgency(interview.nextStepsDate)}`}>
                      {interview.nextStepsDate}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700">{interview.nextSteps}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                {interview.rounds?.length || 0} rounds completed
              </div>
              <div className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium group-hover:translate-x-1 transition-transform">
                <span>View Details</span>
                <Eye className="w-4 h-4 ml-1" />
              </div>
            </div>

            {interview.notes && (
              <div className="pt-2">
                <p className="text-sm text-gray-600 line-clamp-2">{interview.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const InterviewTable = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Company</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Position</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Stage & Priority</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Next Steps</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Progress</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredAndSortedInterviews.map(interview => {
              const referralContact = interview.referralContactId 
                ? contacts.find(c => c.id === interview.referralContactId)
                : null;

              return (
                <tr key={interview.id} className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => onShowInterviewDetail(interview.id)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm mr-4 shadow-sm">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">{interview.firm}</div>
                        {referralContact && (
                          <div className="flex items-center text-xs text-green-600 mt-1">
                            <Award className="w-3 h-3 mr-1" />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onShowContactDetail(referralContact.id);
                              }}
                              className="hover:underline"
                            >
                              Referred by {referralContact.name}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{interview.position}</div>
                      {interview.group && <div className="text-xs text-gray-500 mt-1 font-medium">{interview.group}</div>}
                      <div className="text-xs text-gray-500 mt-1">Applied: {interview.applicationDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStageColor(interview.stage)}`}>
                        {interview.stage}
                      </span>
                      <div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(interview.priority)}`}>
                          {interview.priority}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">{interview.stageDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {interview.nextSteps && (
                      <div>
                        <div className="text-sm text-gray-900 font-medium">{interview.nextSteps}</div>
                        {interview.nextStepsDate && (
                          <div className={`text-xs mt-1 ${getDateUrgency(interview.nextStepsDate)}`}>
                            Due: {interview.nextStepsDate}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {interview.rounds?.length || 0} rounds
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(interview);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(interview.id);
                        }}
                        className="text-red-600 hover:text-red-800 text-sm font-medium hover:bg-red-50 px-2 py-1 rounded transition-colors"
                      >
                        Delete
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
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Interviews</h1>
            <p className="text-gray-600 mt-1">Track your investment banking interviews</p>
            <div className="flex items-center mt-3 text-sm text-gray-500">
              <Target className="w-4 h-4 mr-1" />
              {filteredAndSortedInterviews.length} interviews
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('cards')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
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
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
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
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg flex items-center hover:bg-blue-700 transition-colors shadow-sm font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Interview
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
              placeholder="Search interviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <SortDropdown />
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors font-medium ${
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
              title="Company"
              options={filterOptions.companies}
              selected={filters.companies}
              onChange={handleFilterChange}
              filterKey="companies"
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
              title="Stage"
              options={filterOptions.stages}
              selected={filters.stages}
              onChange={handleFilterChange}
              filterKey="stages"
            />
            <FilterDropdown
              title="Next Steps"
              options={filterOptions.nextSteps}
              selected={filters.nextSteps}
              onChange={handleFilterChange}
              filterKey="nextSteps"
            />
            <FilterDropdown
              title="Priority"
              options={filterOptions.priorities}
              selected={filters.priorities}
              onChange={handleFilterChange}
              filterKey="priorities"
            />
            
            {Object.values(filters).some(f => f.length > 0) && (
              <button
                onClick={clearFilters}
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors"
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
            {filteredAndSortedInterviews.map(interview => (
              <InterviewCard key={interview.id} interview={interview} />
            ))}
          </div>
        ) : (
          <InterviewTable />
        )}

        {filteredAndSortedInterviews.length === 0 && (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No interviews found</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {searchTerm || Object.values(filters).some(f => f.length > 0)
                ? 'Try adjusting your search or filters to find what you\'re looking for.'
                : 'Get started by adding your first interview to track your application progress.'
              }
            </p>
            <button
              onClick={onAdd}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              Add Your First Interview
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Interviews;
