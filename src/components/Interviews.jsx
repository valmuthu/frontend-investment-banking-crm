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
    nextSteps: []
  });

  // Sorting options
  const sortOptions = [
    { field: 'firm', label: 'Firm' },
    { field: 'position', label: 'Position' },
    { field: 'stage', label: 'Stage' },
    { field: 'stageDate', label: 'Stage Date' },
    { field: 'nextSteps', label: 'Next Steps' },
    { field: 'nextStepsDate', label: 'Next Steps Date' }
  ];

  // Get unique values for filters
  const filterOptions = useMemo(() => ({
    companies: [...new Set(interviews.map(i => i.firm))].sort(),
    positions: [...new Set(interviews.map(i => i.position))].sort(),
    groups: [...new Set(interviews.map(i => i.group).filter(Boolean))].sort(),
    stages: interviewStages,
    nextSteps: [...new Set(interviews.map(i => i.nextSteps).filter(Boolean))].sort()
  }), [interviews, interviewStages]);

  // Get firm logo URL based on firm name
  const getFirmLogo = (firmName) => {
    const logoMap = {
      'Goldman Sachs': 'https://logo.clearbit.com/goldmansachs.com',
      'Morgan Stanley': 'https://logo.clearbit.com/morganstanley.com',
      'JPMorgan Chase': 'https://logo.clearbit.com/jpmorgan.com',
      'Deutsche Bank': 'https://logo.clearbit.com/db.com',
      'Credit Suisse': 'https://logo.clearbit.com/credit-suisse.com',
      'UBS': 'https://logo.clearbit.com/ubs.com',
      'Barclays': 'https://logo.clearbit.com/barclays.com',
      'Citi': 'https://logo.clearbit.com/citigroup.com',
      'Bank of America': 'https://logo.clearbit.com/bankofamerica.com',
      'Wells Fargo': 'https://logo.clearbit.com/wellsfargo.com',
      'Evercore': 'https://logo.clearbit.com/evercore.com',
      'Lazard': 'https://logo.clearbit.com/lazard.com',
      'Rothschild': 'https://logo.clearbit.com/rothschild.com',
      'Jefferies': 'https://logo.clearbit.com/jefferies.com',
      'PJT Partners': 'https://logo.clearbit.com/pjtpartners.com'
    };
    return logoMap[firmName] || null;
  };

  // Helper function to format position and group
  const formatPositionGroup = (position, group) => {
    if (group) {
      return `${position}, ${group}`;
    }
    return position;
  };

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
      nextSteps: []
    });
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'Not Yet Applied': return 'status-gray';
      case 'Applied': return 'status-blue';
      case 'Phone Screen': return 'status-blue';
      case 'First Round': return 'status-amber';
      case 'Second Round': return 'status-amber';
      case 'Third Round': return 'status-coral';
      case 'Case Study': return 'status-amber';
      case 'Superday': return 'status-coral';
      case 'Offer Received': return 'status-emerald';
      case 'Withdrawn': return 'status-gray';
      case 'Rejected': return 'status-red';
      default: return 'status-gray';
    }
  };

  const getDateUrgency = (date) => {
    if (!date) return 'text-gray-500';
    const today = new Date();
    const taskDate = new Date(date);
    const diffDays = Math.ceil((taskDate - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-red-600 font-semibold';
    if (diffDays <= 2) return 'text-amber-600 font-semibold';
    return 'text-gray-600';
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

  const InterviewCard = ({ interview }) => {
    const referralContact = interview.referralContactId 
      ? contacts.find(c => c.id === interview.referralContactId)
      : null;
    
    const firmLogo = getFirmLogo(interview.firm);

    return (
      <div className="card-interactive"
           onClick={() => onShowInterviewDetail(interview.id)}>
        <div className="section-padding">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center flex-1 min-w-0 mr-3">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-4 shadow-sm overflow-hidden border border-gray-200 flex-shrink-0">
                {firmLogo ? (
                  <img 
                    src={firmLogo} 
                    alt={interview.firm}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`${firmLogo ? 'hidden' : 'flex'} w-full h-full items-center justify-center`}>
                  <Building2 className="w-6 h-6 text-gray-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-heading-3 group-hover:text-primary-600 transition-colors truncate">{interview.firm}</h3>
                <p className="text-body truncate">{formatPositionGroup(interview.position, interview.group)}</p>
              </div>
            </div>
            <div className="action-buttons flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(interview);
                }}
                className="action-button"
                title="Edit"
              >
                <Edit2 className="icon-sm" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(interview.id);
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
              <span className={`status-badge ${getStageColor(interview.stage)}`}>
                {interview.stage}
              </span>
            </div>

            <div className="text-xs text-gray-500">
              <span>Stage Date: {interview.stageDate}</span>
            </div>

            {referralContact && (
              <div className="referral-badge">
                <Award className="w-3 h-3" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onShowContactDetail(referralContact.id);
                  }}
                  className="text-success-600 hover:text-success-800 hover:underline text-xs font-medium truncate"
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
                    <span className={`text-sm font-medium ${getDateUrgency(interview.nextStepsDate)}`}>
                      {interview.nextStepsDate}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700 truncate">{interview.nextSteps}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                {interview.rounds?.length || 0} rounds completed
              </div>
              <div className="flex items-center text-sm text-primary-600 hover:text-primary-800 font-medium group-hover:translate-x-1 transition-transform">
                <span>View Details</span>
                <Eye className="icon-sm ml-1" />
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
    <div className="card-base overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full table-compact">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left font-semibold text-gray-700 w-72">Company</th>
              <th className="text-left font-semibold text-gray-700 w-64">Position</th>
              <th className="text-left font-semibold text-gray-700 w-48">Stage</th>
              <th className="text-left font-semibold text-gray-700 w-52">Next Steps</th>
              <th className="text-left font-semibold text-gray-700 w-32">Progress</th>
              <th className="text-center font-semibold text-gray-700 w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredAndSortedInterviews.map(interview => {
              const referralContact = interview.referralContactId 
                ? contacts.find(c => c.id === interview.referralContactId)
                : null;
              const firmLogo = getFirmLogo(interview.firm);

              return (
                <tr key={interview.id} className="hover:bg-primary-50 transition-colors cursor-pointer"
                    onClick={() => onShowInterviewDetail(interview.id)}>
                  <td>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3 shadow-sm overflow-hidden border border-gray-200">
                        {firmLogo ? (
                          <img 
                            src={firmLogo} 
                            alt={interview.firm}
                            className="w-6 h-6 object-contain"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className={`${firmLogo ? 'hidden' : 'flex'} w-full h-full items-center justify-center`}>
                          <Building2 className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 hover:text-primary-600 transition-colors truncate">{interview.firm}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          {referralContact && (
                            <div className="referral-badge">
                              <Award className="w-3 h-3" />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onShowContactDetail(referralContact.id);
                                }}
                                className="hover:underline font-medium truncate"
                              >
                                Referred by {referralContact.name}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div className="font-medium text-gray-900 truncate">{formatPositionGroup(interview.position, interview.group)}</div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span className={`status-badge text-nowrap ${getStageColor(interview.stage)}`}>
                        {interview.stage}
                      </span>
                      <div className="text-xs mt-1 text-gray-600 font-medium">{interview.stageDate}</div>
                    </div>
                  </td>
                  <td>
                    {interview.nextSteps && (
                      <div>
                        <div className="text-sm text-gray-900 font-medium truncate">{interview.nextSteps}</div>
                        {interview.nextStepsDate && (
                          <div className={`text-xs mt-1 font-medium ${getDateUrgency(interview.nextStepsDate)}`}>
                            {interview.nextStepsDate}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {interview.rounds?.length || 0} rounds
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(interview);
                        }}
                        className="action-button"
                        title="Edit"
                      >
                        <Edit2 className="icon-sm" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(interview.id);
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
            <h1 className="text-heading-1 mb-2">Interviews</h1>
            <p className="text-body mb-4">Track your investment banking interviews</p>
            <div className="flex items-center text-sm text-gray-500">
              <Target className="icon-sm mr-2" />
              {filteredAndSortedInterviews.length} interviews
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
              Add Interview
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
              placeholder="Search interviews..."
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
            {filteredAndSortedInterviews.map(interview => (
              <InterviewCard key={interview.id} interview={interview} />
            ))}
          </div>
        ) : (
          <InterviewTable />
        )}

        {filteredAndSortedInterviews.length === 0 && (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No interviews found</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {searchTerm || Object.values(filters).some(f => f.length > 0)
                ? 'Try adjusting your search or filters to find what you\'re looking for.'
                : 'Get started by adding your first interview to track your application progress.'
              }
            </p>
            <button
              onClick={onAdd}
              className="btn-primary"
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
