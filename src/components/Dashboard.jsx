// src/components/Dashboard.jsx
import { Users, Calendar, TrendingUp, Clock, Phone, Mail, Building } from 'lucide-react';

export default function Dashboard({ contacts, interviews, onShowContactDetail, setActiveTab }) {
  // Calculate stats
  const totalContacts = contacts.length;
  const totalInterviews = interviews.length;
  const activeInterviews = interviews.filter(i => !['Rejected', 'Withdrawn'].includes(i.stage)).length;
  const pendingFollowUps = contacts.filter(c => c.nextSteps && c.nextSteps.trim()).length;

  // Get upcoming items
  const upcomingItems = [
    ...contacts
      .filter(c => c.nextStepsDate)
      .map(c => ({
        type: 'contact',
        id: c.id,
        title: c.nextSteps,
        subtitle: `${c.name} - ${c.firm}`,
        date: c.nextStepsDate,
        contact: c
      })),
    ...interviews
      .filter(i => i.nextStepsDate)
      .map(i => ({
        type: 'interview',
        id: i.id,
        title: i.nextSteps,
        subtitle: `${i.firm} - ${i.position}`,
        date: i.nextStepsDate,
        interview: i
      }))
  ]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  // Recent activity
  const recentActivity = [
    ...contacts
      .filter(c => c.interactions && c.interactions.length > 0)
      .flatMap(c => 
        c.interactions.slice(0, 2).map(interaction => ({
          type: 'interaction',
          id: `${c.id}-${interaction.id}`,
          title: interaction.title,
          subtitle: `${c.name} - ${interaction.type}`,
          date: interaction.date,
          contact: c
        }))
      ),
    ...interviews
      .filter(i => i.rounds && i.rounds.length > 0)
      .flatMap(i =>
        i.rounds.slice(0, 2).map(round => ({
          type: 'interview_round',
          id: `${i.id}-${round.id}`,
          title: `${round.stage} Interview`,
          subtitle: `${i.firm} - ${round.interviewer || 'TBD'}`,
          date: round.date,
          interview: i
        }))
      )
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'Not Yet Contacted': 'bg-gray-100 text-gray-800',
      'Initial Outreach Sent': 'bg-blue-100 text-blue-800',
      'Intro Call Scheduled': 'bg-yellow-100 text-yellow-800',
      'Intro Call Complete': 'bg-green-100 text-green-800',
      'Follow-Up Email Sent': 'bg-purple-100 text-purple-800',
      'Follow-Up Call Scheduled': 'bg-orange-100 text-orange-800',
      'Follow-Up Call Complete': 'bg-green-100 text-green-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getInterviewStageColor = (stage) => {
    const stageColors = {
      'Not Yet Applied': 'bg-gray-100 text-gray-800',
      'Applied': 'bg-blue-100 text-blue-800',
      'Phone Screen': 'bg-yellow-100 text-yellow-800',
      'First Round': 'bg-orange-100 text-orange-800',
      'Second Round': 'bg-purple-100 text-purple-800',
      'Third Round': 'bg-indigo-100 text-indigo-800',
      'Case Study': 'bg-pink-100 text-pink-800',
      'Superday': 'bg-green-100 text-green-800',
      'Offer Received': 'bg-green-200 text-green-900',
      'Withdrawn': 'bg-gray-100 text-gray-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    return stageColors[stage] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="flex-1 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your networking and interview overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">{totalContacts}</h3>
              <p className="text-gray-600">Total Contacts</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">{activeInterviews}</h3>
              <p className="text-gray-600">Active Interviews</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">{totalInterviews}</h3>
              <p className="text-gray-600">Total Interviews</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">{pendingFollowUps}</h3>
              <p className="text-gray-600">Pending Follow-ups</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Tasks */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Tasks</h2>
          </div>
          <div className="p-6">
            {upcomingItems.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No upcoming tasks</p>
            ) : (
              <div className="space-y-4">
                {upcomingItems.map((item) => (
                  <div key={`${item.type}-${item.id}`} className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.subtitle}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(item.date)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            {recentActivity.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((item) => (
                  <div key={`${item.type}-${item.id}`} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {item.type === 'interaction' ? (
                          <Mail className="h-4 w-4 text-gray-600" />
                        ) : (
                          <Calendar className="h-4 w-4 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.subtitle}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500">
                        {formatDate(item.date)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setActiveTab('contacts')}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="h-6 w-6 text-blue-600" />
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Add Contact</h3>
                <p className="text-sm text-gray-600">Add a new networking contact</p>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('interviews')}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Calendar className="h-6 w-6 text-green-600" />
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Track Interview</h3>
                <p className="text-sm text-gray-600">Add an interview process</p>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Building className="h-6 w-6 text-purple-600" />
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Upload Document</h3>
                <p className="text-sm text-gray-600">Store important files</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Contacts and Interviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Recent Contacts */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Contacts</h2>
              <button
                onClick={() => setActiveTab('contacts')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            {contacts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No contacts yet</p>
            ) : (
              <div className="space-y-4">
                {contacts.slice(0, 3).map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                    onClick={() => onShowContactDetail(contact.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {contact.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{contact.name}</h3>
                        <p className="text-sm text-gray-600">{contact.position} at {contact.firm}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(contact.networkingStatus)}`}>
                        {contact.networkingStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Interviews */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Interviews</h2>
              <button
                onClick={() => setActiveTab('interviews')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            {interviews.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No interviews yet</p>
            ) : (
              <div className="space-y-4">
                {interviews.slice(0, 3).map((interview) => (
                  <div
                    key={interview.id}
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Building className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{interview.firm}</h3>
                        <p className="text-sm text-gray-600">{interview.position}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getInterviewStageColor(interview.stage)}`}>
                        {interview.stage}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
