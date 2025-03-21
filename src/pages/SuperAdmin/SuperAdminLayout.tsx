
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  ImageIcon, 
  Tag, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  LogOut 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

const SuperAdminLayout = ({ children }: SuperAdminLayoutProps) => {
  const [collapsed, setCollapsed] = React.useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    { path: '/super-admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/super-admin/users', icon: <Users size={20} />, label: 'Users Management' },
    { path: '/super-admin/categories', icon: <Tag size={20} />, label: 'Categories' },
    { path: '/super-admin/messages', icon: <MessageSquare size={20} />, label: 'Messages' },
    { path: '/super-admin/photos', icon: <ImageIcon size={20} />, label: 'Photos' },
    { path: '/super-admin/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 border-b">
            {!collapsed && (
              <h2 className="text-xl font-bold text-gray-800">Super Admin</h2>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar} 
              className="ml-auto"
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </Button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 py-4 overflow-y-auto">
            <ul className="space-y-1 px-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/super-admin'}
                    className={({ isActive }) => 
                      `flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 ${
                        isActive ? 'bg-gray-100' : ''
                      } ${collapsed ? 'justify-center' : 'px-3'}`
                    }
                  >
                    <span className="text-gray-500">{item.icon}</span>
                    {!collapsed && <span className="ml-3">{item.label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t">
            <NavLink
              to="/"
              className="flex items-center p-2 text-red-600 rounded-lg hover:bg-red-50"
            >
              <LogOut size={20} />
              {!collapsed && <span className="ml-3">Exit Admin</span>}
            </NavLink>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <main className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default SuperAdminLayout;
