import { useState, useMemo } from 'react';
import { 
  User, Calendar, TrendingUp, Target, Phone, Award,
  Clock, CheckCircle, AlertCircle, BarChart3, Users,
  ArrowUp, ArrowDown, Eye, Building2, MessageSquare,
  UserCheck, Percent, Filter, TrendingDown, Info
} from 'lucide-react';

const Dashboard = ({ contacts, interviews, onShowContactDetail, setActiveTab }) => {
  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalInteractions = contacts.reduce((sum, contact) => sum + (contact.interactions?.length || 0), 0);
    const totalInterviews = interviews.length;
    const activeInterviews = interviews.filter(i => !['Offer Received', 'Rejected', 'Withdrawn'].includes(i.stage)).length;
    const offers = interviews.filter(i => i.stage === 'Offer Received').length;
    const successRate = totalInterviews > 0 ? ((offers / totalInterviews) * 100).toFixed(1) : 0;
    
    // New KPIs
    const contactsWithReferrals = contacts.filter(c => c.referred).length;
    const referralPercentage = contacts.length > 0 ? ((contactsWithReferrals / contacts.length) * 100).toFixed(1) : 0;
    
    const referralInterviews = interviews.filter(i => i.referralContactId).length;
    const referralConversionRate = contactsWithReferrals > 0 ? ((referralInterviews / contactsWithReferrals) * 100).toFixed(1) : 0;

    return {
      totalContacts: contacts.length,
      totalInteractions,
      totalInterviews,
      activeInterviews,
      successRate,
      referralPercentage,
      referralConversionRate
    };
  }, [contacts, interviews]);

  // Visual funnel data for interviews
  const interviewFunnel = useMemo(() => {
    const stages = ['Applied', 'Phone Screen', 'First Round', 'Second Round', 'Superday', 'Offer Received'];
    return stages.map(stage => ({
      stage,
      count: interviews.filter(i => i.stage === stage).length
    }));
  }, [interviews]);

  // Suggested follow-ups with days since last contact
  const followUpContacts = useMemo(() => {
    const today = new Date();
    
    return contacts.filter(contact => {
      const hasNoNextSteps = !contact.nextSteps || !contact.nextStepsDate;
      const statusDate = new Date(contact.networkingDate);
      const daysSinceLastContact = Math.floor((today - statusDate) / (1000 * 60 * 60 * 24));
      
      return hasNoNextSteps && daysSinceLastContact >= 7; // 7+ days since last contact
    }).map(contact => {
      const statusDate = new Date(contact.networkingDate);
      const daysSinceLastContact = Math.floor((today - statusDate) / (1000 * 60 * 60 * 24));
      return { ...contact, daysSinceLastContact };
    }).sort((a, b) => b.daysSinceLastContact - a.daysSinceLastContact).slice(0, 5);
  }, [contacts]);

  // Upcoming tasks with categorization
  const upcomingTasks = useMemo(() => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const interviewTasks = interviews
      .filter(i => {
        if (!i.nextStepsDate) return false;
        const taskDate = new Date(i.nextStepsDate);
        return taskDate >= today && taskDate <= nextWeek;
      })
      .map(i => ({
        id: i.id,
        type: 'interview',
        category: 'Interview',
        title: i.nextSteps,
        subtitle: `${i.firm} - ${i.position}`,
        date: i.nextStepsDate,
        priority: new Date(i.nextStepsDate) <= new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000) ? 'high' : 'normal'
      }));

    const networkingTasks = contacts
      .filter(c => {
        if (!c.nextStepsDate) return false;
        const taskDate = new Date(c.nextStepsDate);
        return taskDate >= today && taskDate <= nextWeek;
      })
      .map(c => ({
        id: c.id,
        type: 'networking',
        category: 'Networking',
        title: c.nextSteps,
        subtitle: `${c.name} - ${c.firm}`,
        date: c.nextStepsDate,
        priority: new Date(c.nextStepsDate) <= new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000) ? 'high' : 'normal'
      }));

    return [...interviewTasks, ...networkingTasks].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [contacts, interviews]);

  const KPICard = ({ title, value, icon: Icon, change, color = 'blue', description }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-200">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center mb-2">
            <p className="text-sm font-semibold text-gray-600">{title}</p>
            {description && (
              <div className="group relative ml-2">
                <Info className="w-4 h-4 text-gray-400 cursor-help" />
                <div className="absolute bottom-6 left-0 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {description}
                </div>
              </div>
            )}
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {change && (
            <div className={`flex items-center text-sm ${change > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {change > 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
              {Math.abs(change)}% vs last month
            </div>
          )}
        </div>
        <div className={`w-14 h-14 bg-gradient-to-br from-${color}-50 to-${color}-100 rounded-xl flex items-center justify-center shadow-sm`}>
          <Icon className={`w-7 h-7 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const FunnelChart = ({ data, title, color = 'blue' }) => {
    const maxCount = Math.max(...data.map(d => d.count));
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <div className="text-sm text-gray-500">
            {data.reduce((sum, item) => sum + item.count, 0)} total
          </div>
        </div>
        
        {title === "Interview Funnel" ? (
          // Visual funnel shape for interviews
          <div className="space-y-4">
            {data.map((item, index) => {
              const width = maxCount > 0 ? Math.max((item.count / maxCount) * 100, 15) : 15;
              const leftMargin = (100 - width) / 2;
              
              return (
                <div key={item.stage} className="flex flex-col items-center">
                  <div className="w-full flex justify-center">
                    <div 
                      className={`bg-gradient-to-r from-${color}-400 to-${color}-600 rounded-lg h-10 flex items-center justify-center transition-all duration-700 hover:shadow-lg relative group`}
                      style={{ 
                        width: `${width}%`,
                        marginLeft: `${leftMargin}%`
                      }}
                    >
                      <span className="text-white text-sm font-bold">
                        {item.count > 0 ? item.count : '0'}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-gray-700 mt-2 text-center">
                    {item.stage}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Regular bar chart for networking
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={item.stage} className="flex items-center">
                <div className="w-40 text-sm font-semibold text-gray-700 flex-shrink-0">
                  {item.stage}
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-100 rounded-full h-8 relative overflow-hidden">
                    <div 
                      className={`bg-gradient-to-r from-${color}-400 to-${color}-600 h-full rounded-full transition-all duration-700 flex items-center justify-end pr-3 hover:shadow-md`}
                      style={{ width: `${maxCount > 0 ? (item.count / maxCount) * 100 : 0}%` }}
                    >
                      <span className="text-white text-sm font-bold">
                        {item.count > 0 ? item.count : ''}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-10 text-sm font-bold text-gray-900 text-right">
                  {item.count}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const TaskTimeline = ({ tasks, title }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <div className="flex items-center space-x-3">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">{tasks.length} tasks</span>
        </div>
      </div>
      {tasks.length > 0 ? (
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {tasks.map((task) => (
            <div key={`${task.type}-${task.id}`} className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100 hover:border-blue-200">
              <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-2 ${
                task.priority === 'high' ? 'bg-red-500 shadow-lg shadow-red-200' : 'bg-blue-500 shadow-lg shadow-blue-200'
              }`}></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    task.category === 'Interview' 
                      ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                      : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  }`}>
                    {task.category}
                  </span>
                  {task.priority === 'high' && (
                    <div className="flex items-center">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-xs font-semibold text-red-600 ml-1">Urgent</span>
                    </div>
                  )}
                </div>
                <p className="text-sm font-semibold text-gray-900 truncate mb-1">{task.title}</p>
                <p className="text-sm text-gray-600 truncate mb-2">{task.subtitle}</p>
                <p className="text-xs text-gray-500 font-medium">{new Date(task.date).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h4>
          <p className="text-gray-500">No upcoming tasks in the next 7 days</p>
        </div>
      )}
    </div>
  );

  const FollowUpContacts = ({ contacts, title }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <button 
          onClick={() => setActiveTab('contacts')}
          className="text-blue-600 hover:text-blue-800 text-sm font-semibold hover:underline transition-colors"
        >
          View All
        </button>
      </div>
      {contacts.length > 0 ? (
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {contacts.map(contact => (
            <div 
              key={contact.id} 
              className="flex items-center p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl hover:from-amber-100 hover:to-orange-100 transition-all duration-300 cursor-pointer group shadow-sm"
              onClick={() => onShowContactDetail(contact.id)}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-sm font-bold mr-4 shadow-md">
                {contact.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{contact.name}</p>
                <p className="text-sm text-gray-600 truncate">{contact.firm} • {contact.position}</p>
                <p className="text-xs text-amber-700 font-medium mt-1">
                  {contact.daysSinceLastContact} days since last contact
                </p>
              </div>
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-amber-600 mr-3" />
                <Eye className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Great work!</h4>
          <p className="text-gray-500">All contacts have recent follow-ups</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Dashboard</h1>
        <p className="text-lg text-gray-600">Investment Banking CRM Overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6 mb-10">
        <KPICard 
          title="Total Contacts" 
          value={kpis.totalContacts} 
          icon={User} 
          color="blue"
          description="Total number of networking contacts"
        />
        <KPICard 
          title="Total Interactions" 
          value={kpis.totalInteractions} 
          icon={Phone} 
          color="emerald"
          description="All networking interactions recorded"
        />
        <KPICard 
          title="Total Interviews" 
          value={kpis.totalInterviews} 
          icon={Calendar} 
          color="purple"
          description="All interview opportunities tracked"
        />
        <KPICard 
          title="Active Interviews" 
          value={kpis.activeInterviews} 
          icon={TrendingUp} 
          color="orange"
          description="Interviews currently in progress"
        />
        <KPICard 
          title="Success Rate" 
          value={`${kpis.successRate}%`} 
          icon={Target} 
          color="rose"
          description="Percentage of interviews resulting in offers"
        />
        <KPICard 
          title="Referral Rate" 
          value={`${kpis.referralPercentage}%`} 
          icon={UserCheck} 
          color="indigo"
          description="Percentage of contacts that provided referrals"
        />
        <KPICard 
          title="Referral Conversion" 
          value={`${kpis.referralConversionRate}%`} 
          icon={Percent} 
          color="cyan"
          description="Referrals that led to interview opportunities"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <FunnelChart 
          data={interviewFunnel} 
          title="Interview Funnel" 
          color="blue"
        />
        <FunnelChart 
          data={[
            { stage: 'Not Yet Contacted', count: contacts.filter(c => c.networkingStatus === 'Not Yet Contacted').length },
            { stage: 'Initial Outreach Sent', count: contacts.filter(c => c.networkingStatus === 'Initial Outreach Sent').length },
            { stage: 'Intro Call Scheduled', count: contacts.filter(c => c.networkingStatus === 'Intro Call Scheduled').length },
            { stage: 'Intro Call Complete', count: contacts.filter(c => c.networkingStatus === 'Intro Call Complete').length },
            { stage: 'Follow-Up Complete', count: contacts.filter(c => c.networkingStatus === 'Follow-Up Call Complete').length }
          ]} 
          title="Networking Funnel" 
          color="emerald"
        />
      </div>

      {/* Tasks and Follow-ups Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <TaskTimeline 
          tasks={upcomingTasks}
          title="Upcoming Tasks (Next 7 Days)"
        />
        
        <FollowUpContacts 
          contacts={followUpContacts}
          title="Suggested Follow-Ups"
        />
      </div>

      {/* Recent Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Contacts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Recent Contacts</h3>
            <button 
              onClick={() => setActiveTab('contacts')}
              className="text-blue-600 hover:text-blue-800 text-sm font-semibold hover:underline transition-colors"
            >
              View All
            </button>
          </div>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {contacts.slice(0, 6).map(contact => (
              <div 
                key={contact.id} 
                className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group border border-gray-100 hover:border-blue-200"
                onClick={() => onShowContactDetail(contact.id)}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-sm font-bold mr-4 shadow-md">
                  {contact.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{contact.name}</p>
                  <p className="text-sm text-gray-600 truncate">{contact.firm} • {contact.position}</p>
                  {contact.group && <p className="text-xs text-gray-500 mt-1">{contact.group}</p>}
                </div>
                <Eye className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Interviews */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Recent Interviews</h3>
            <button 
              onClick={() => setActiveTab('interviews')}
              className="text-blue-600 hover:text-blue-800 text-sm font-semibold hover:underline transition-colors"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {interviews.slice(0, 6).map(interview => {
              const getStageColor = (stage) => {
                switch (stage) {
                  case 'Applied': return 'bg-gray-100 text-gray-800 border-gray-200';
                  case 'Phone Screen': return 'bg-blue-100 text-blue-800 border-blue-200';
                  case 'First Round': return 'bg-purple-100 text-purple-800 border-purple-200';
                  case 'Second Round': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
                  case 'Superday': return 'bg-orange-100 text-orange-800 border-orange-200';
                  case 'Offer Received': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
                  case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
                  default: return 'bg-gray-100 text-gray-800 border-gray-200';
                }
              };

              return (
                <div 
                  key={interview.id} 
                  className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group border border-gray-100 hover:border-blue-200"
                  onClick={() => setActiveTab('interviews')}
                >
                  <Building2 className="w-10 h-10 text-gray-400 mr-4" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{interview.firm}</p>
                    <p className="text-sm text-gray-600 truncate">{interview.position}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold mt-2 border ${getStageColor(interview.stage)}`}>
                      {interview.stage}
                    </span>
                  </div>
                  <Eye className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
