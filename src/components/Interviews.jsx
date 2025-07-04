import { useState, useMemo } from 'react';
import { 
  Search, Plus, Filter, ArrowUpDown, Grid, List, 
  Edit2, Trash2, Eye, Calendar, Clock, User, 
  ExternalLink, X, ChevronDown, Building2,
  Award, AlertCircle
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
  setSelectedContactId,
  setShowContactDetail 
}) => {
  const [viewMode, setViewMode] = useState('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [showInterviewHistory, setShowInterviewHistory] = useState(null);
  
  const [filters, setFilters] = useState({
    companies: [],
    positions: [],
    groups: [],
    stages: [],
    nextSteps: []
  });

  // Get unique values for filters
  const filterOptions = useMemo(() => ({
    companies: [...new Set(interviews.map(i => i.company))].sort(),
    positions: [...new Set(interviews.map(i => i.position))].sort(),
    groups: [...new Set(interviews.map(i => i.group))].sort(),
    stages: interviewStages,
    nextSteps: [...new Set(interviews.map(i => i.nextSteps).filter(Boolean))].sort()
  }), [interviews, interviewStages]);

  // Filtered and sorted interviews
  const filteredAndSortedInterviews = useMemo(() => {
    let filtered = interviews.filter(interview => {
      const matchesSearch = searchTerm === '' || 
        interview.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interview.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (interview.group && interview.group.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (interview.interviewer && interview.interviewer.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCompany = filters.companies.length === 0 || filters.companies.includes(interview.company);
      const matchesPosition = filters.positions.length === 0 || filters.positions.includes(interview.position);
      const matchesGroup = filters.groups.length === 0 || filters.groups.includes(interview.group);
      const matchesStage = filters.stages.length === 0 || filters.stages.includes(interview.stage);
      const matchesNextSteps = filters.nextSteps.length === 0 || filters.nextSteps.includes(interview.nextSteps);
      
      return matchesSearch && matchesCompany && matchesPosition && matchesGroup && 
             matchesStage && matchesNextSteps;
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
      nextSteps: []
    });
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'Applied': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'First Round': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Second Round': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Super Day': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Offer': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (date) => {
    if (!date) return 'text-gray-600';
    const today = new Date();
    const taskDate = new Date(date);
    const diffDays = Math.ceil((taskDate - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-red-600';
    if (diffDays <= 2) return 'text-orange-600';
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

  const InterviewCard = ({ interview }) => {
    const referralContact = interview.referralContactId 
      ? contacts.find(c => c.id === interview.referralContactId)
      : null;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center mb-2">
                <Building2 className="w-5 h-5 text-gray-400 mr-2" />
                <button
                  onClick={() => setShowInterviewHistory && setShowInterviewHistory(interview)}
                  className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {interview.company}
                </button>
              </div>
              <p className="text-sm text-gray-600">{interview.position}</p>
              <p className="text-xs text-gray-500">{interview.group}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowInterviewHistory && setShowInterviewHistory(interview)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="View History"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => onEdit && onEdit(interview)}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete && onDelete(interview.id)}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStageColor(interview.stage)}`}>
                {interview.stage}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                {interview.date} {interview.time && `at ${interview.time}`}
              </div>
              {interview.interviewer && (
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  {interview.interviewer}
                </div>
              )}
            </div>

            {referralContact && (
              <div className="flex items-center text-sm text-green-600 bg-green-50 p-2 rounded">
                <Award className="w-4 h-4 mr-2" />
                Referred by {referralContact.name}
              </div>
            )}

            {interview.nextSteps && (
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Next Steps:</span>
                  {interview.nextStepsDate && (
                    <span className={`font-medium ${getPriorityColor(interview.nextStepsDate)}`}>
                      {interview.nextStepsDate}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700">{interview.nextSteps}</p>
              </div>
            )}

            {interview.notes && (
              <div className="pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-600">{interview.notes}</p>
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
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('company')}
                  className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Company
                  <ArrowUpDown className="w-4 h-4 ml-1" />
                </button>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Position</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Group</th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('stage')}
                  className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Stage
                  <ArrowUpDown className="w-4 h-4 ml-1" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Date
                  <ArrowUpDown className="w-4 h-4 ml-1" />
                </button>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Next Steps</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAndSortedInterviews.map(interview => {
              const referralContact = interview.referralContactId 
                ? contacts.find(c => c.id === interview.referralContactId)
                : null;

              return (
                <tr key={interview.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div>
                        <button
                          onClick={() => setShowInterviewHistory && setShowInterviewHistory(interview)}
                          className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {interview.company}
                        </button>
                        {referralContact && (
                          <div className="flex items-center text-xs text-green-600 mt-1">
                            <Award className="w-3 h-3 mr-1" />
                            Referred
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{interview.position}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{interview.group}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStageColor(interview.stage)}`}>
                      {interview.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {interview.date} {interview.time && `at ${interview.time}`}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {interview.nextSteps && (
                      <div>
                        <div>{interview.nextSteps}</div>
                        {interview.nextStepsDate && (
                          <div className={`text-xs ${getPriorityColor(interview.nextStepsDate)}`}>
                            Due: {interview.nextStepsDate}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowInterviewHistory && setShowInterviewHistory(interview)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View
                      </button>
                      <button
                        onClick={() => onEdit && onEdit(interview)}
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete && onDelete(interview.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
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
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Interviews</h1>
            <p className="text-gray-600 mt-1">Track your investment banking interviews</p>
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
              onClick={() => onAdd && onAdd()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors shadow-sm"
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
            {filteredAndSortedInterviews.map(interview => (
              <InterviewCard key={interview.id} interview={interview} />
            ))}
          </div>
        ) : (
          <InterviewTable />
        )}

        {filteredAndSortedInterviews.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || Object.values(filters).some(f => f.length > 0)
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first interview'
              }
            </p>
            <button
              onClick={() => onAdd && onAdd()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Interview
            </button>
          </div>
        )}
      </div>

      {/* Simple Interview History Modal placeholder */}
      {showInterviewHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">{showInterviewHistory.company}</h2>
              <button
                onClick={() => setShowInterviewHistory(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">Interview history modal - Coming soon!</p>
            <p className="text-sm text-gray-500">This will show detailed interview history, past rounds, and referral information.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Interviews;
