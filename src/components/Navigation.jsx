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
    <div className="nav-fixed bg-white border-r border-gray-200 min-h-screen">
      <div className="section-padding">
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 gradient-blue rounded-xl flex items-center justify-center mr-3 shadow-md">
            <Building2 className="w-6 h-6 text-white" />
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
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium group ${
                  activeTab === item.id 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <Icon className={`icon-md mr-3 transition-colors ${
                  activeTab === item.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'
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
