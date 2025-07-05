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
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen shadow-sm">
      <div className="p-6">
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center mr-3 shadow-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">IB CRM</h1>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold group ${
                  activeTab === item.id 
                    ? 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border border-purple-200 shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-purple-600'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 transition-colors ${
                  activeTab === item.id ? 'text-purple-600' : 'text-gray-500 group-hover:text-purple-500'
                }`} />
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
