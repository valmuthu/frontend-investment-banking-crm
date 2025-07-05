import { useState } from 'react';
import { 
  ArrowLeft, Edit2, Plus, Award, Calendar, Building2, 
  User, Target, Clock, AlertCircle, X, Save, Trash2
} from 'lucide-react';

const InterviewDetailPage = ({ 
  interview, 
  contacts,
  onBack, 
  onEdit, 
  onUpdateInterview,
  onAddRound,
  onUpdateRound,
  onDeleteRound,
  onShowContactDetail,
  interviewStages,
  interviewNextSteps,
  groups
}) => {
  const [showAddRound, setShowAddRound] = useState(false);
  const [editingRound, setEditingRound] = useState(null);
  const [isEditingInterview, setIsEditingInterview] = useState(false);
  const [editedInterview, setEditedInterview] = useState(interview);

  const [newRound, setNewRound] = useState({
    stage: 'Phone Screen',
    date: new Date().toISOString().split('T')[0],
    interviewer: '',
    format: 'Video',
    outcome: 'Pending',
    notes: ''
  });

  const roundStages = ['Phone Screen', 'First Round', 'Second Round', 'Third Round', 'Case Study', 'Superday'];
  const roundFormats = ['Phone', 'Video', 'In-Person', 'Assessment'];
  const roundOutcomes = ['Pending', 'Passed', 'Failed', 'Cancelled'];

  const handleAddRound = (e) => {
    e.preventDefault();
    if (newRound.stage && newRound.date) {
      onAddRound(interview.id, newRound);
      setNewRound({
        stage: 'Phone Screen',
        date: new Date().toISOString().split('T')[0],
        interviewer: '',
        format: 'Video',
        outcome: 'Pending',
        notes: ''
      });
      setShowAddRound(false);
    }
  };

  const handleUpdateRound = (e) => {
    e.preventDefault();
    if (editingRound.stage && editingRound.date) {
      onUpdateRound(interview.id, editingRound.id, editingRound);
      setEditingRound(null);
    }
  };

  const handleSaveInterview = () => {
    onUpdateInterview(editedInterview);
    setIsEditingInterview(false);
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'Applied': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'Phone Screen': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'First Round': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Second Round': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Third Round': return 'bg-violet-50 text-violet-700 border-violet-200';
      case 'Case Study': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Superday': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Offer Received': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Rejected': return 'bg-red-50 text-red-700 border-red-200';
      case 'Withdrawn': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getOutcomeColor = (outcome) => {
    switch (outcome) {
      case 'Passed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Failed': return 'bg-red-50 text-red-700 border-red-200';
      case 'Cancelled': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'Pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
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

  const referralContact = interview.referralContactId 
    ? contacts.find(c => c.id === interview.referralContactId)
    : null;

  // Get firm logo URL
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

  const firmLogo = getFirmLogo(interview.firm);

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg mr-4 overflow-hidden">
                {firmLogo ? (
                  <img 
                    src={firmLogo} 
                    alt={interview.firm}
                    className="w-full h-full object-contain p-2"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`${firmLogo ? 'hidden' : 'flex'} w-full h-full items-center justify-center`}>
                  <Building2 className="w-8 h-8" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">{interview.firm}</h1>
                <div className="flex items-center text-gray-600 mt-1">
                  <span className="font-medium text-lg">{interview.position}</span>
                  {interview.group && (
                    <>
                      <span className="mx-2">•</span>
                      <span className="font-medium">{interview.group}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center mt-3">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getStageColor(interview.stage)}`}>
                    {interview.stage}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsEditingInterview(!isEditingInterview)}
              className={`flex items-center px-4 py-2 rounded-xl transition-colors font-semibold ${
                isEditingInterview 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isEditingInterview ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Interview
                </>
              )}
            </button>
            {isEditingInterview && (
              <button
                onClick={handleSaveInterview}
                className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Interview Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Interview Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Interview Details</h3>
              
              {isEditingInterview ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                    <input
                      type="text"
                      value={editedInterview.position}
                      onChange={(e) => setEditedInterview({...editedInterview, position: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Group</label>
                    <select
                      value={editedInterview.group}
                      onChange={(e) => setEditedInterview({...editedInterview, group: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Group</option>
                      {groups.map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
                    <select
                      value={editedInterview.stage}
                      onChange={(e) => setEditedInterview({...editedInterview, stage: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {interviewStages.map(stage => (
                        <option key={stage} value={stage}>{stage}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stage Date</label>
                    <input
                      type="date"
                      value={editedInterview.stageDate}
                      onChange={(e) => setEditedInterview({...editedInterview, stageDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Current Stage:</span>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getStageColor(interview.stage)}`}>
                        {interview.stage}
                      </span>
                      <span className="ml-3 text-sm text-gray-500">({interview.stageDate})</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Next Steps Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Next Steps</h3>
              
              {isEditingInterview ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Next Steps</label>
                    <select
                      value={editedInterview.nextSteps}
                      onChange={(e) => setEditedInterview({...editedInterview, nextSteps: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Next Steps</option>
                      {interviewNextSteps.map(step => (
                        <option key={step} value={step}>{step}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Next Steps Date</label>
                    <input
                      type="date"
                      value={editedInterview.nextStepsDate}
                      onChange={(e) => setEditedInterview({...editedInterview, nextStepsDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Referral Contact</label>
                    <select
                      value={editedInterview.referralContactId || ''}
                      onChange={(e) => setEditedInterview({...editedInterview, referralContactId: e.target.value ? parseInt(e.target.value) : ''})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">No referral</option>
                      {contacts.map(contact => (
                        <option key={contact.id} value={contact.id}>{contact.name} - {contact.firm}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      rows="3"
                      value={editedInterview.notes}
                      onChange={(e) => setEditedInterview({...editedInterview, notes: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {interview.nextSteps && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Action Required:</span>
                      <p className="mt-1 text-gray-900 font-medium">{interview.nextSteps}</p>
                      {interview.nextStepsDate && (
                        <p className={`text-sm mt-1 ${getDateUrgency(interview.nextStepsDate)}`}>
                          Due: {interview.nextStepsDate}
                        </p>
                      )}
                    </div>
                  )}

                  {referralContact && (
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <div className="flex items-center">
                        <Award className="w-5 h-5 text-emerald-600 mr-2" />
                        <div>
                          <p className="text-emerald-800 font-medium text-sm">Referred by</p>
                          <button
                            onClick={() => onShowContactDetail(referralContact.id)}
                            className="text-emerald-600 hover:text-emerald-800 hover:underline font-medium"
                          >
                            {referralContact.name} at {referralContact.firm}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {interview.notes && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Notes:</span>
                      <p className="mt-1 text-gray-700 bg-gray-50 p-3 rounded-lg">{interview.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Interview Rounds */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Interview Rounds</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {interview.rounds?.length || 0} rounds completed
                  </p>
                </div>
                <button
                  onClick={() => setShowAddRound(!showAddRound)}
                  className={`flex items-center px-4 py-2 rounded-xl transition-colors font-semibold ${
                    showAddRound 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {showAddRound ? (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Round
                    </>
                  )}
                </button>
              </div>

              {/* Add Round Form */}
              {showAddRound && (
                <form onSubmit={handleAddRound} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Add Interview Round</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
                      <select
                        value={newRound.stage}
                        onChange={(e) => setNewRound({...newRound, stage: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {roundStages.map(stage => (
                          <option key={stage} value={stage}>{stage}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                      <input
                        type="date"
                        required
                        value={newRound.date}
                        onChange={(e) => setNewRound({...newRound, date: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Interviewer</label>
                      <input
                        type="text"
                        value={newRound.interviewer}
                        onChange={(e) => setNewRound({...newRound, interviewer: e.target.value})}
                        placeholder="Interviewer name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                      <select
                        value={newRound.format}
                        onChange={(e) => setNewRound({...newRound, format: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {roundFormats.map(format => (
                          <option key={format} value={format}>{format}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Outcome</label>
                    <select
                      value={newRound.outcome}
                      onChange={(e) => setNewRound({...newRound, outcome: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {roundOutcomes.map(outcome => (
                        <option key={outcome} value={outcome}>{outcome}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      rows="3"
                      value={newRound.notes}
                      onChange={(e) => setNewRound({...newRound, notes: e.target.value})}
                      placeholder="Notes about this interview round..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddRound(false)}
                      className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add Round
                    </button>
                  </div>
                </form>
              )}

              {/* Rounds List */}
              {interview.rounds && interview.rounds.length > 0 ? (
                <div className="space-y-4">
                  {interview.rounds.map((round, index) => (
                    <div key={round.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow">
                      {editingRound && editingRound.id === round.id ? (
                        <form onSubmit={handleUpdateRound} className="p-4 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
                              <select
                                value={editingRound.stage}
                                onChange={(e) => setEditingRound({...editingRound, stage: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                {roundStages.map(stage => (
                                  <option key={stage} value={stage}>{stage}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                              <input
                                type="date"
                                required
                                value={editingRound.date}
                                onChange={(e) => setEditingRound({...editingRound, date: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Interviewer</label>
                              <input
                                type="text"
                                value={editingRound.interviewer}
                                onChange={(e) => setEditingRound({...editingRound, interviewer: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                              <select
                                value={editingRound.format}
                                onChange={(e) => setEditingRound({...editingRound, format: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                {roundFormats.map(format => (
                                  <option key={format} value={format}>{format}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Outcome</label>
                            <select
                              value={editingRound.outcome}
                              onChange={(e) => setEditingRound({...editingRound, outcome: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              {roundOutcomes.map(outcome => (
                                <option key={outcome} value={outcome}>{outcome}</option>
                              ))}
                            </select>
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                            <textarea
                              rows="3"
                              value={editingRound.notes}
                              onChange={(e) => setEditingRound({...editingRound, notes: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="flex justify-end space-x-3">
                            <button
                              type="button"
                              onClick={() => setEditingRound(null)}
                              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Save Changes
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start flex-1">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-sm mr-4">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold text-gray-900">{round.stage}</h4>
                                  <span className="text-sm text-gray-500">{round.date}</span>
                                </div>
                                
                                <div className="flex items-center space-x-4 mb-2">
                                  {round.interviewer && (
                                    <div className="flex items-center text-sm text-gray-600">
                                      <User className="w-3 h-3 mr-1" />
                                      {round.interviewer}
                                    </div>
                                  )}
                                  {round.format && (
                                    <div className="text-sm text-gray-600">
                                      Format: {round.format}
                                    </div>
                                  )}
                                </div>

                                {round.outcome && (
                                  <div className="mb-2">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getOutcomeColor(round.outcome)}`}>
                                      {round.outcome}
                                    </span>
                                  </div>
                                )}

                                {round.notes && (
                                  <p className="text-gray-700 text-sm leading-relaxed">{round.notes}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={() => setEditingRound(round)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onDeleteRound(interview.id, round.id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No interview rounds recorded</h4>
                  <p className="text-gray-500 mb-6">Start tracking your interview progress by adding your first round.</p>
                  <button
                    onClick={() => setShowAddRound(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Add Your First Round
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewDetailPage;
