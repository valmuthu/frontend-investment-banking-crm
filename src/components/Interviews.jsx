// src/components/Interviews.jsx
import { Plus, Calendar } from 'lucide-react';

export default function Interviews({ 
  interviews, 
  contacts, 
  interviewStages, 
  interviewNextSteps, 
  groups, 
  onEdit, 
  onDelete, 
  onAdd, 
  onShowContactDetail, 
  onShowInterviewDetail 
}) {
  return (
    <div className="flex-1 p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Interviews</h1>
          <p className="text-gray-600">Track your interview processes and progress</p>
        </div>
        <button
          onClick={onAdd}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Interview</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        {interviews.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">No interviews tracked yet</p>
            <button
              onClick={onAdd}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your first interview
            </button>
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-4">
              {interviews.map((interview) => (
                <div
                  key={interview.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => onShowInterviewDetail(interview.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{interview.firm}</h3>
                      <p className="text-sm text-gray-600">{interview.position} - {interview.group}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {interview.stage}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// src/components/Documents.jsx
import { FileText, Upload } from 'lucide-react';

export default function Documents({ documents, contacts, onAdd, onEdit, onDelete }) {
  return (
    <div className="flex-1 p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Documents</h1>
          <p className="text-gray-600">Manage your resumes, cover letters, and other files</p>
        </div>
        <button
          onClick={() => onAdd({ name: 'New Document', type: 'Other' })}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Upload className="h-5 w-5" />
          <span>Upload Document</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        {documents.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">No documents uploaded yet</p>
            <button
              onClick={() => onAdd({ name: 'New Document', type: 'Other' })}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Upload your first document
            </button>
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div>
                        <h3 className="font-medium text-gray-900">{doc.name}</h3>
                        <p className="text-sm text-gray-600">{doc.type} • Uploaded {doc.uploadDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEdit(doc)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(doc.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// src/components/ContactDetailPage.jsx
import { ArrowLeft, Edit, Mail, Phone, Linkedin } from 'lucide-react';

export default function ContactDetailPage({ 
  contact, 
  onBack, 
  onEdit, 
  onUpdateContact, 
  onAddInteraction, 
  onUpdateInteraction, 
  onDeleteInteraction,
  networkingStatuses,
  nextStepsOptions,
  groups
}) {
  return (
    <div className="flex-1 p-8">
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{contact.name}</h1>
          <p className="text-gray-600">{contact.position} at {contact.firm}</p>
        </div>
        <button
          onClick={() => onEdit(contact)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Edit className="h-5 w-5" />
          <span>Edit Contact</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span>{contact.email}</span>
              </div>
              {contact.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span>{contact.phone}</span>
                </div>
              )}
              {contact.linkedin && (
                <div className="flex items-center space-x-3">
                  <Linkedin className="h-5 w-5 text-gray-400" />
                  <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    LinkedIn Profile
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Interactions</h2>
            {(!contact.interactions || contact.interactions.length === 0) ? (
              <p className="text-gray-500">No interactions recorded yet</p>
            ) : (
              <div className="space-y-4">
                {contact.interactions.map((interaction) => (
                  <div key={interaction.id} className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-medium text-gray-900">{interaction.title}</h3>
                    <p className="text-sm text-gray-600">{interaction.type} • {interaction.date}</p>
                    {interaction.notes && (
                      <p className="text-gray-700 mt-2">{interaction.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Status</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Networking Status
                </label>
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  {contact.networkingStatus}
                </span>
              </div>
              {contact.nextSteps && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Next Steps
                  </label>
                  <p className="text-gray-900">{contact.nextSteps}</p>
                  {contact.nextStepsDate && (
                    <p className="text-sm text-gray-600">Due: {contact.nextStepsDate}</p>
                  )}
                </div>
              )}
              {contact.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <p className="text-gray-700">{contact.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// src/components/InterviewDetailPage.jsx
import { ArrowLeft, Edit } from 'lucide-react';

export default function InterviewDetailPage({ 
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
}) {
  return (
    <div className="flex-1 p-8">
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{interview.firm}</h1>
          <p className="text-gray-600">{interview.position} - {interview.group}</p>
        </div>
        <button
          onClick={() => onEdit(interview)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Edit className="h-5 w-5" />
          <span>Edit Interview</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Interview Rounds</h2>
            {(!interview.rounds || interview.rounds.length === 0) ? (
              <p className="text-gray-500">No interview rounds recorded yet</p>
            ) : (
              <div className="space-y-4">
                {interview.rounds.map((round) => (
                  <div key={round.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{round.stage}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        round.outcome === 'Passed' ? 'bg-green-100 text-green-800' :
                        round.outcome === 'Failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {round.outcome || 'Pending'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {round.interviewer} • {round.format} • {round.date}
                    </p>
                    {round.notes && (
                      <p className="text-gray-700 mt-2">{round.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Status</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Stage
                </label>
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  {interview.stage}
                </span>
              </div>
              {interview.nextSteps && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Next Steps
                  </label>
                  <p className="text-gray-900">{interview.nextSteps}</p>
                  {interview.nextStepsDate && (
                    <p className="text-sm text-gray-600">Due: {interview.nextStepsDate}</p>
                  )}
                </div>
              )}
              {interview.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <p className="text-gray-700">{interview.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// src/components/Settings.jsx
import { ArrowLeft, User, Bell, Shield, Download } from 'lucide-react';

export default function Settings({ onBack }) {
  return (
    <div className="flex-1 p-8">
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <User className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
            </div>
            <p className="text-gray-600">Manage your personal information and account details.</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Bell className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
            </div>
            <p className="text-gray-600">Configure your notification preferences.</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Privacy & Security</h2>
            </div>
            <p className="text-gray-600">Manage your privacy settings and account security.</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Download className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Export Data</h2>
            </div>
            <p className="text-gray-600">Download your data in various formats.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
