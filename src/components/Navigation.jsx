import { User, Calendar, FileText, BarChart3, Building2 } from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab, setSelectedContactId }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'contacts', label: 'Contacts', icon: User },
    { id: 'interviews', label: 'Interviews', icon: Calendar },
    { id: 'documents', label: 'Documents', icon: FileText }
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setSelectedContactId(null);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <div className="flex items-center mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">IB CRM</h1>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                  activeTab === item.id 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Navigation;
