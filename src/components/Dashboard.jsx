import { useState, useMemo, useEffect } from 'react';
import { 
  User, Calendar, TrendingUp, Target, Phone, Award,
  Clock, CheckCircle, AlertCircle, BarChart3, Users,
  ArrowUp, ArrowDown, Eye, Building2, MessageSquare,
  UserCheck, Percent, Filter, TrendingDown, Info
} from 'lucide-react';
import apiService from '../services/apiService';

const Dashboard = ({ contacts, interviews, onShowContactDetail, setActiveTab }) => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load dashboard data from API
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getDashboardStats();
      setDashboardStats(data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Failed to load dashboard statistics');
      // Fall back to calculating from props
      calculateStatsFromProps();
    } finally {
      setLoading(false);
    }
  };

  const calculateStatsFromProps = () => {
    // Fallback calculation using the contacts and interviews props
    const totalInteractions = contacts.reduce((sum, contact) => sum + (contact.interactions?.length || 0), 0);
    const totalInterviews = interviews.length;
    const offers = interviews.filter(i => i.stage === 'Offer Received').length;
    const successRate = totalInterviews > 0 ? ((offers / totalInterviews) * 100).toFixed(1) : 0;
    
    const uniqueFirms = [...new Set(contacts.map(c => c.firm))].length;
    const contactsWithReferrals = contacts.filter(c => c.referred).length;
    const referralPercentage = contacts.length > 0 ? ((contactsWithReferrals / contacts.length) * 100).toFixed(1) : 0;
    
    const appliedInterviews = interviews.filter(i => ['Applied', 'Phone Screen', 'First Round', 'Second Round', 'Third Round', 'Case Study', 'Superday', 'Offer Received'].includes(i.stage)).length;
    const interviewedCount = interviews.filter(i => ['Phone Screen', 'First Round', 'Second Round', 'Third Round', 'Case Study', 'Superday', 'Offer Received'].includes(i.stage)).length;
    const applicationSuccessRate = appliedInterviews > 0 ? ((interviewedCount / appliedInterviews) * 100).toFixed(1) : 0;

    setDashboardStats({
      stats: {
        totalContacts: contacts.length,
        uniqueFirms,
        totalInterviews,
        referrals: contactsWithReferrals,
        successRate: parseFloat(successRate),
        referralPercentage: parseFloat(referralPercentage),
        applicationSuccessRate: parseFloat(applicationSuccessRate)
      },
      funnels: {
        networking: [],
        interview: []
      },
      recent: {
        contacts: contacts.slice(0, 5),
        interviews: interviews.slice(0, 5)
      },
      tasks: {
        upcoming: [],
        followUps: []
      }
    });
  };

  // Calculate KPIs - use API data if available, otherwise fallback
  const kpis = useMemo(() => {
    if (dashboardStats) {
      return dashboardStats.stats;
    }

    // Fallback calculation
    const totalInteractions = contacts.reduce((sum, contact) => sum + (contact.interactions?.length || 0), 0);
    const totalInterviews = interviews.length;
    const offers = interviews.filter(i => i.stage === 'Offer Received').length;
    const successRate = totalInterviews > 0 ? ((offers / totalInterviews) * 100).toFixed(1) : 0;
    
    const uniqueFirms = [...new Set(contacts.map(c => c.firm))].length;
    const contactsWithReferrals = contacts.filter(c => c.referred).length;
    const referralPercentage = contacts.length > 0 ? ((contactsWithReferrals / contacts.length) * 100).toFixed(1) : 0;
    
    const appliedInterviews = interviews.filter(i => ['Applied', 'Phone Screen', 'First Round', 'Second Round', 'Third Round', 'Case Study', 'Superday', 'Offer Received'].includes(i.stage)).length;
    const interviewedCount = interviews.filter(i => ['Phone Screen', 'First Round', 'Second Round', 'Third Round', 'Case Study', 'Superday', 'Offer Received'].includes(i.stage)).length;
    const applicationSuccessRate = appliedInterviews > 0 ? ((interviewedCount / appliedInterviews) * 100).toFixed(1) : 0;

    return {
      totalContacts: contacts.length,
      uniqueFirms,
      totalInterviews,
      referrals: contactsWithReferrals,
      successRate: parseFloat(successRate),
      referralPercentage: parseFloat(referralPercentage),
      applicationSuccessRate: parseFloat(applicationSuccessRate)
    };
  }, [contacts, interviews, dashboardStats]);

  // Visual funnel data for interviews with softer colors
  const interviewFunnel = useMemo(() => {
    const data = dashboardStats?.funnels?.interview || [];
    
    if (data.length > 0) {
      return data.map(item => ({
        stage: item._id,
        count: item.count,
        color: getInterviewStageColor(item._id)
      }));
    }

    // Fallback calculation
    const stages = [
      { name: 'Applied', color: 'from-slate-400 to-slate-500' },
      { name: 'Phone Screen', color: 'from-blue-400 to-blue-500' },
      { name: 'First Round', color: 'from-indigo-400 to-indigo-500' },
      { name: 'Second Round', color: 'from-purple-400 to-purple-500' },
      { name: 'Superday', color: 'from-emerald-400 to-emerald-500' },
      { name: 'Offer Received', color: 'from-green-400 to-green-500' }
    ];
    
    return stages.map(stage => ({
      stage: stage.name,
      color: stage.color,
      count: interviews.filter(i => i.stage === stage.name).length
    }));
  }, [interviews, dashboardStats]);

  // Networking funnel data with softer colors
  const networkingFunnel = useMemo(() => {
    const data = dashboardStats?.funnels?.networking || [];
    
    if (data.length > 0) {
      return data.map(item => ({
        stage: item._id,
        count: item.count,
        color: getNetworkingStageColor(item._id)
      }));
    }

    // Fallback calculation
    const stages = [
      { name: 'Not Yet Contacted', color: 'from-gray-300 to-gray-400' },
      { name: 'Initial Outreach Sent', color: 'from-blue-300 to-blue-400' },
      { name: 'Intro Call Scheduled', color: 'from-amber-300 to-amber-400' },
      { name: 'Intro Call Complete', color: 'from-emerald-300 to-emerald-400' },
      { name: 'Follow-Up Call Complete', color: 'from-green-400 to-green-500' }
    ];
    
    return stages.map(stage => ({
      stage: stage.name,
      color: stage.color,
      count: contacts.filter(c => c.networkingStatus === stage.name).length
    }));
  }, [contacts, dashboardStats]);

  // Suggested follow-ups
  const followUpContacts = useMemo(() => {
    if (dashboardStats?.tasks?.followUps) {
      return dashboardStats.tasks.followUps;
    }

    // Fallback calculation
    const today = new Date();
    
    return contacts.filter(contact => {
      const hasNoNextSteps = !contact.nextSteps || !contact.nextStepsDate;
      const statusDate = new Date(contact.networkingDate);
      const daysSinceLastContact = Math.floor((today - statusDate) / (1000 * 60 * 60 * 24));
      
      return hasNoNextSteps && daysSinceLastContact >= 7;
    }).map(contact => {
      const statusDate = new Date(contact.networkingDate);
      const daysSinceLastContact = Math.floor((today - statusDate) / (1000 * 60 * 60 * 24));
      return { ...contact, daysSinceLastContact };
    }).sort((a, b) => b.daysSinceLastContact - a.daysSinceLastContact).slice(0, 5);
  }, [contacts, dashboardStats]);

  // Upcoming tasks
  const upcomingTasks = useMemo(() => {
    if (dashboardStats?.tasks?.upcoming) {
      return dashboardStats.tasks.upcoming;
    }

    // Fallback calculation
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
  }, [contacts, interviews, dashboardStats]);

  // Helper functions for colors
  const getInterviewStageColor = (stage) => {
    const colorMap = {
      'Applied': 'from-slate-400 to-slate-500',
      'Phone Screen': 'from-blue-400 to-blue-500',
      'First Round': 'from-indigo-400 to-indigo-500',
      'Second Round': 'from-purple-400 to-purple-500',
      'Superday': 'from-emerald-400 to-emerald-500',
      'Offer Received': 'from-green-400 to-green-500'
    };
    return colorMap[stage] || 'from-gray-400 to-gray-500';
  };

  const getNetworkingStageColor = (stage) => {
    const colorMap = {
      'Not Yet Contacted': 'from-gray-300 to-gray-400',
      'Initial Outreach Sent': 'from-blue-300 to-blue-400',
      'Intro Call Scheduled': 'from-amber-300 to-amber-400',
      'Intro Call Complete': 'from-emerald-300 to-emerald-400',
      'Follow-Up Call Complete': 'from-green-400 to-green-500'
    };
    return colorMap[stage] || 'from-gray-300 to-gray-400';
  };

  const KPICard = ({ title, value, icon: Icon, description, gradientFrom, gradientTo }) => (
    <div className={`card-hover bg-gradient-to-br from-${gradientFrom} to-${gradientTo} rounded-xl shadow-sm border border-gray-100 p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <p className="text-sm font-medium text-white/90">{title}</p>
            {description && (
              <div className="group relative ml-2">
                <Info className="w-4 h-4 text-white/70 cursor-help" />
                <div className="absolute bottom-6 left-0 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {description}
                </div>
              </div>
            )}
          </div>
          <p className="text-3xl font-bold text-white mb-2">{loading ? '...' : value}</p>
        </div>
        <div className={`w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
  );

  const DonutChart = ({ percentage, title, color = 'blue' }) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

    return (
      <div className="card-base p-6">
        <h3 className="text-heading-3 mb-4 text-center text-gray-700">{title}</h3>
        <div className="flex items-center justify-center">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-200"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={strokeDasharray}
                strokeLinecap="round"
                className={`text-${color}-400 transition-all duration-1000 ease-out`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-700">{loading ? '...' : percentage}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const FunnelChart = ({ data, title }) => {
    const maxCount = Math.max(...data.map(d => d.count));
    
    return (
      <div className="card-base p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-heading-3 text-gray-700">{title}</h3>
          <div className="text-sm text-gray-500">
            {data.reduce((sum, item) => sum + item.count, 0)} total
          </div>
        </div>
        
        <div className="space-y-3">
          {data.map((item, index) => {
            const width = maxCount > 0 ? Math.max((item.count / maxCount) * 100, 8) : 8;
            
            return (
              <div key={item.stage} className="flex items-center">
                <div className="w-32 text-sm font-medium text-gray-600 flex-shrink-0 text-right pr-4">
                  {item.stage}
                </div>
                <div className="flex-1 mx-3">
                  <div className="bg-gray-100 rounded-full h-8 relative overflow-hidden">
                    <div 
                      className={`bg-gradient-to-r ${item.color} h-full rounded-full transition-all duration-700 flex items-center justify-end pr-3 hover:shadow-md relative group`}
                      style={{ width: `${width}%` }}
                    >
                      <span className="text-white text-sm font-medium">
                        {item.count > 0 ? item.count : ''}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-8 text-sm font-medium text-gray-700 text-left">
                  {item.count}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const TaskTimeline = ({ tasks, title }) => (
    <div className="card-base p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-heading-3 text-gray-700">{title}</h3>
        <div className="flex items-center space-x-3">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">{tasks.length} tasks</span>
        </div>
      </div>
      {tasks.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {tasks.map((task) => (
            <div key={`${task.type}-${task.id}`} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100 hover:border-gray-200">
              <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-2 ${
                task.priority === 'high' ? 'bg-amber-400 shadow-sm' : 'bg-blue-400 shadow-sm'
              }`}></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`status-badge ${
                    task.category === 'Interview' 
                      ? 'status-blue' 
                      : 'status-emerald'
                  }`}>
                    {task.category}
                  </span>
                  {task.priority === 'high' && (
                    <div className="flex items-center">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-medium text-amber-600 ml-1">Urgent</span>
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-800 truncate mb-1">{task.title}</p>
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
          <h4 className="text-lg font-medium text-gray-700 mb-2">All caught up!</h4>
          <p className="text-gray-500">No upcoming tasks in the next 7 days</p>
        </div>
      )}
    </div>
  );

  const FollowUpContacts = ({ contacts, title }) => (
    <div className="card-base p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-heading-3 text-gray-700">{title}</h3>
        <button 
          onClick={() => setActiveTab('contacts')}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition-colors"
        >
          View All
        </button>
      </div>
      {contacts.length > 0 ? (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {contacts.map(contact => (
            <div 
              key={contact.id} 
              className="flex items-center p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg hover:from-amber-100 hover:to-orange-100 transition-all duration-300 cursor-pointer group shadow-sm"
              onClick={() => onShowContactDetail(contact.id)}
            >
              <div className="w-12 h-12 gradient-blue rounded-lg flex items-center justify-center text-white text-sm font-bold mr-4 shadow-sm">
                {contact.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">{contact.name}</p>
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
          <h4 className="text-lg font-medium text-gray-700 mb-2">Great work!</h4>
          <p className="text-gray-500">All contacts have recent follow-ups</p>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex-1 bg-gray-50 section-padding-lg">
        <div className="animate-pulse">
          <div className="mb-10">
            <div className="h-8 bg-gray-200 rounded w-64 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-96"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-32"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-gray-50 section-padding-lg">
        <div className="text-center py-20">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Failed to Load Dashboard</h3>
          <p className="text-gray-500 mb-8">{error}</p>
          <button
            onClick={loadDashboardData}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 section-padding-lg">
      <div className="mb-10">
        <h1 className="text-heading-1 mb-3 text-gray-800">Dashboard</h1>
        <p className="text-lg text-gray-600">Investment Banking CRM Overview</p>
      </div>

      {/* KPI Cards with softer colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <KPICard 
          title="Total Contacts" 
          value={kpis.totalContacts} 
          icon={Users} 
          gradientFrom="blue-400"
          gradientTo="indigo-500"
          description="Total number of networking contacts"
        />
        <KPICard 
          title="Unique Firms" 
          value={kpis.uniqueFirms} 
          icon={Building2} 
          gradientFrom="emerald-400"
          gradientTo="teal-500"
          description="Number of unique investment banking firms"
        />
        <KPICard 
          title="Total Interviews" 
          value={kpis.totalInterviews} 
          icon={Calendar} 
          gradientFrom="purple-400"
          gradientTo="violet-500"
          description="All interview opportunities tracked"
        />
        <KPICard 
          title="Referrals" 
          value={kpis.referrals} 
          icon={Award} 
          gradientFrom="amber-400"
          gradientTo="orange-500"
          description="Contacts that provided referrals"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-10">
        <div className="xl:col-span-2">
          <FunnelChart 
            data={interviewFunnel} 
            title="Interview Funnel"
          />
        </div>
        <div className="xl:col-span-2">
          <FunnelChart 
            data={networkingFunnel} 
            title="Networking Funnel"
          />
        </div>
      </div>

      {/* Combined Chart Section - Fixed height alignment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2">
          <TaskTimeline 
            tasks={upcomingTasks}
            title="Upcoming Tasks (Next 7 Days)"
          />
        </div>
        
        <div className="space-y-6">
          <DonutChart 
            percentage={parseFloat(kpis.referralPercentage)} 
            title="Referral Rate" 
            color="blue"
          />
          <DonutChart 
            percentage={parseFloat(kpis.applicationSuccessRate)} 
            title="Application Success" 
            color="emerald"
          />
        </div>
      </div>

      {/* Tasks and Follow-ups Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <FollowUpContacts 
          contacts={followUpContacts}
          title="Suggested Follow-Ups"
        />

        {/* Recent Contacts */}
        <div className="card-base p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-heading-3 text-gray-700">Recent Contacts</h3>
            <button 
              onClick={() => setActiveTab('contacts')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition-colors"
            >
              View All
            </button>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {(dashboardStats?.recent?.contacts || contacts.slice(0, 6)).map(contact => (
              <div 
                key={contact.id} 
                className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer group border border-gray-100 hover:border-blue-200"
                onClick={() => onShowContactDetail(contact.id)}
              >
                <div className="w-12 h-12 gradient-blue rounded-lg flex items-center justify-center text-white text-sm font-bold mr-4 shadow-sm">
                  {contact.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{contact.name}</p>
                  <p className="text-sm text-gray-600 truncate">{contact.firm} • {contact.position}</p>
                  {contact.group && <p className="text-xs text-gray-500 mt-1">{contact.group}</p>}
                </div>
                <Eye className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Interviews */}
      <div className="grid grid-cols-1 gap-8">
        <div className="card-base p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-heading-3 text-gray-700">Recent Interviews</h3>
            <button 
              onClick={() => setActiveTab('interviews')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition-colors"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {(dashboardStats?.recent?.interviews || interviews.slice(0, 6)).map(interview => {
              const getStageColor = (stage) => {
                switch (stage) {
                  case 'Applied': return 'status-blue';
                  case 'Phone Screen': return 'status-blue';
                  case 'First Round': return 'status-amber';
                  case 'Second Round': return 'status-amber';
                  case 'Superday': return 'status-coral';
                  case 'Offer Received': return 'status-emerald';
                  case 'Rejected': return 'status-red';
                  default: return 'status-gray';
                }
              };

              return (
                <div 
                  key={interview.id} 
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer group border border-gray-100 hover:border-blue-200"
                  onClick={() => setActiveTab('interviews')}
                >
                  <Building2 className="w-10 h-10 text-gray-400 mr-4" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{interview.firm}</p>
                    <p className="text-sm text-gray-600 truncate">{interview.position}</p>
                    <span className={`status-badge mt-2 ${getStageColor(interview.stage)}`}>
                      {interview.stage}
                    </span>
                  </div>
                  <Eye className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
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
