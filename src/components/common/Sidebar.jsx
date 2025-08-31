import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  BarChart3, 
  User, 
  Settings,
  ChevronRight,
  Leaf,
  TrendingUp,
  FileText,
  Calendar
} from 'lucide-react';

const Sidebar = ({ isOpen, currentPath = '/dashboard' }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      description: 'Overview & Analytics'
    },
    {
      id: 'suppliers',
      label: 'Suppliers',
      icon: Users,
      path: '/suppliers',
      description: 'Manage & Discover',
      badge: '45 Active'
    },
    {
      id: 'procurement',
      label: 'Procurement',
      icon: ShoppingCart,
      path: '/procurement',
      description: 'Planning & Bidding',
      badge: '3 Active'
    },
    {
      id: 'scenarios',
      label: 'Scenario Analysis',
      icon: BarChart3,
      path: '/scenarios',
      description: 'AI-Powered Insights'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileText,
      path: '/reports',
      description: 'Performance & Impact'
    }
  ];

  const bottomMenuItems = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      path: '/profile',
      description: 'Personal Settings'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/settings',
      description: 'App Configuration'
    }
  ];

  const sustainabilityMetrics = {
    carbonSaved: 250.5,
    trend: '+15%',
    goal: 300
  };

  const MenuItem = ({ item, isActive }) => (
    <a
      href={item.path}
      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
        isActive
          ? 'bg-emerald-100 text-emerald-900 shadow-sm'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <div className={`p-2 rounded-lg ${
        isActive 
          ? 'bg-emerald-200' 
          : 'bg-gray-100 group-hover:bg-gray-200'
      }`}>
        <item.icon className={`w-4 h-4 ${
          isActive ? 'text-emerald-700' : 'text-gray-600'
        }`} />
      </div>
      
      {isOpen && (
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">{item.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">
                {item.description}
              </div>
            </div>
            {item.badge && (
              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
          </div>
        </div>
      )}
      
      {isActive && (
        <ChevronRight className="w-4 h-4 text-emerald-600" />
      )}
    </a>
  );

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20" />
      )}
      
      <aside className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-30 ${
        isOpen ? 'w-72' : 'w-20'
      } lg:relative lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              {isOpen && (
                <div>
                  <h1 className="font-bold text-lg text-gray-900">
                    SustainProcure
                  </h1>
                  <p className="text-xs text-gray-500">
                    Sustainable Supply Chain
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Main Navigation */}
          <div className="flex-1 px-4 py-6 overflow-y-auto">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <MenuItem
                  key={item.id}
                  item={item}
                  isActive={currentPath === item.path}
                />
              ))}
            </nav>

            {/* Sustainability Widget */}
            {isOpen && (
              <div className="mt-8 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium text-sm text-emerald-900">
                    Carbon Impact
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Saved This Year</span>
                    <span className="text-sm font-semibold text-emerald-700">
                      {sustainabilityMetrics.carbonSaved}t CO₂
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Trend</span>
                    <span className="text-sm font-semibold text-emerald-600">
                      {sustainabilityMetrics.trend}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(sustainabilityMetrics.carbonSaved / sustainabilityMetrics.goal) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 text-center mt-1">
                    {Math.round((sustainabilityMetrics.carbonSaved / sustainabilityMetrics.goal) * 100)}% of annual goal
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            {isOpen && (
              <div className="mt-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                    <Calendar className="w-4 h-4" />
                    Schedule Supplier Meeting
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                    <FileText className="w-4 h-4" />
                    Generate Impact Report
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          <div className="p-4 border-t border-gray-200">
            <nav className="space-y-2">
              {bottomMenuItems.map((item) => (
                <MenuItem
                  key={item.id}
                  item={item}
                  isActive={currentPath === item.path}
                />
              ))}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
