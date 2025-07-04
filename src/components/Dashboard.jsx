import { useState, useMemo } from 'react';
import { 
  User, Calendar, TrendingUp, Target, Phone, Award,
  Clock, CheckCircle, AlertCircle, BarChart3, Users,
  ArrowUp, ArrowDown, Eye, Building2, MessageSquare,
  UserCheck, Percent, TrendingDown
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

  // Networking funnel data
  const networkingFunnel = useMemo(() => {
    const stages = ['Not Yet Contacted', 'Initial Outreach Sent', 'Intro Call Scheduled', 'Intro Call Complete', 'Follow-Up Call Complete'];
    return stages.map(stage => ({
      stage,
      count: contacts.filter(c => c.networkingStatus === stage).length
    }));
  }, [contacts]);

  // Contacts to follow up with
  const followUpContacts = useMemo(() => {
    const today = new Date();
    const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    return contacts.filter(contact => {
      const hasNoNextSteps = !contact.nextSteps || !contact.nextStepsDate;
      const statusDate = new Date(contact.networkingDate);
      const isOldStatus = statusDate < twoWeeksAgo;
      
      return hasNoNextSteps && isOldStatus;
    }).slice(0, 5);
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

  const KPICard = ({ title, value, icon: Icon, change, color = 'blue' }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <div className={`w-12 h-12 bg-${color}-50 rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const FunnelChart = ({ data, title, color = 'blue' }) => {
    const maxCount = Math.max(...data.map(d => d.count));
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
        
        {title === "Interview Funnel" ? (
          // Visual funnel shape for interviews
          <div className="space-y-2">
            {data.map((item, index) => {
              const width = maxCount > 0 ? Math.max((item.count / maxCount) * 100, 10) : 10;
              const leftMargin = (100 - width) / 2;
              
              return (
                <div key={item.stage} className="flex flex-col items-center">
                  <div className="w-full flex justify-center">
                    <div 
                      className={`bg-gradient-to-r from-${color}-400 to-${color}-600 rounded-lg h-8 flex items-center justify-center transition-all duration-500 relative`}
                      style={{ 
                        width: `${width}%`,
                        marginLeft: `${leftMargin}%`
                      }}
                    >
                      <span className="text-white text-sm font-semibold">
                        {item.count > 0 ? item.count : ''}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-gray-700 mt-1 text-center">
                    {item.stage}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Regular bar chart for networking
          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={item.stage} className="flex items-center">
                <div className="w-32 text-sm font-medium text-gray-700 flex-shrink-0">
                  {item.stage}
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-6 relative overflow-hidden">
                    <div 
                      className={`bg-gradient-to-r from-${color}-400 to-${color}-600 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                      style={{ width: `${maxCount > 0 ? (item.count / maxCount) * 100 : 0}%` }}
                    >
                      <span className="text-white text-xs font-semibold">
                        {item.count > 0 ? item.count : ''}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-8 text-sm font-semibold text-gray-900 text-right">
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {tasks.length > 0 ? (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {tasks.map((task) => (
            <div key={`${task.type}-${task.id}`} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                task.priority === 'high' ? 'bg-red-500' : 'bg-blue-500'
              }`}></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    task.category === 'Interview' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {task.category}
                  </span>
                  {task.priority === 'high' && (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                <p className="text-sm text-gray-600 truncate">{task.subtitle}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(task.date).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No upcoming tasks</p>
        </div>
      )}
    </div>
  );

  const FollowUpContacts = ({ contacts, title }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <button 
          onClick={() => setActiveTab('contacts')}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View All
        </button>
      </div>
      {contacts.length > 0 ? (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {contacts.map(contact => (
            <div 
              key={contact.id} 
              className="flex items-center p-3 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer group"
              onClick={() => onShowContactDetail(contact.id)}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
                {contact.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{contact.name}</p>
                <p className="text-sm text-gray-600 truncate">{contact.firm} • {contact.position}</p>
                <p className="text-xs text-amber-700">Last status: {contact.networkingDate}</p>
              </div>
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 text-amber-600 mr-2" />
                <Eye className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <CheckCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>All contacts up to date!</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex-1 bg-gray-50 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Investment Banking CRM Overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6 mb-8">
        <KPICard 
          title="Total Contacts" 
          value={kpis.totalContacts} 
          icon={User} 
          color="blue"
        />
        <KPICard 
          title="Total Interactions" 
          value={kpis.totalInteractions} 
          icon={Phone} 
          color="green"
        />
        <KPICard 
          title="Total Interviews" 
          value={kpis.totalInterviews} 
          icon={Calendar} 
          color="purple"
        />
        <KPICard 
          title="Active Interviews" 
          value={kpis.activeInterviews} 
          icon={TrendingUp} 
          color="orange"
        />
        <KPICard 
          title="Success Rate" 
          value={`${kpis.successRate}%`} 
          icon={Target} 
          color="emerald"
        />
        <KPICard 
          title="Referral Rate" 
          value={`${kpis.referralPercentage}%`} 
          icon={UserCheck} 
          color="pink"
        />
        <KPICard 
          title="Referral Conversion" 
          value={`${kpis.referralConversionRate}%`} 
          icon={Percent} 
          color="indigo"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <FunnelChart 
          data={interviewFunnel} 
          title="Interview Funnel" 
          color="blue"
        />
        <FunnelChart 
          data={networkingFunnel} 
          title="Networking Funnel" 
          color="green"
        />
      </div>

      {/* Tasks and Follow-ups Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <TaskTimeline 
          tasks={upcomingTasks}
          title="Upcoming Tasks (Next 7 Days)"
        />
        
        <FollowUpContacts 
          contacts={followUpContacts}
          title="Contacts Needing Follow-up"
        />
      </div>

      {/* Recent Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Contacts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Contacts</h3>
            <button 
              onClick={() => setActiveTab('contacts')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {contacts.slice(0, 6).map(contact => (
              <div 
                key={contact.id} 
                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
                onClick={() => onShowContactDetail(contact.id)}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
                  {contact.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{contact.name}</p>
                  <p className="text-sm text-gray-600 truncate">{contact.firm} • {contact.position}</p>
                  {contact.group && <p className="text-xs text-gray-500">{contact.group}</p>}
                </div>
                <Eye className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Interviews */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Interviews</h3>
            <button 
              onClick={() => setActiveTab('interviews')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {interviews.slice(0, 6).map(interview => {
              const getStageColor = (stage) => {
                switch (stage) {
                  case 'Applied': return 'bg-gray-100 text-gray-800';
                  case 'Phone Screen': return 'bg-blue-100 text-blue-800';
                  case 'First Round': return 'bg-purple-100 text-purple-800';
                  case 'Second Round': return 'bg-indigo-100 text-indigo-800';
                  case 'Superday': return 'bg-orange-100 text-orange-800';
                  case 'Offer Received': return 'bg-green-100 text-green-800';
                  case 'Rejected': return 'bg-red-100 text-red-800';
                  default: return 'bg-gray-100 text-gray-800';
                }
              };

              return (
                <div 
                  key={interview.id} 
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
                  onClick={() => setActiveTab('interviews')}
                >
                  <Building2 className="w-8 h-8 text-gray-400 mr-3" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{interview.firm}</p>
                    <p className="text-sm text-gray-600 truncate">{interview.position}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStageColor(interview.stage)}`}>
                      {interview.stage}
                    </span>
                  </div>
                  <Eye className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
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
