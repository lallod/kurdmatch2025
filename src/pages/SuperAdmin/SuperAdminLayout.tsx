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
  LogOut,
  ClipboardList,
  Zap,
  Brain,
  UserCheck,
  Flag,
  BarChart,
  TestTube,
  ServerCrash,
  Mail,
  Download,
  FileText,
  ShieldCheck,
  UserCog,
  CreditCard,
  Wallet,
  Facebook,
  Home,
  Edit
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
    { path: '/super-admin/subscribers', icon: <Zap size={20} />, label: 'Subscribers' },
    { path: '/super-admin/payments', icon: <CreditCard size={20} />, label: 'Payments' },
    { path: '/super-admin/verification', icon: <UserCheck size={20} />, label: 'User Verification' },
    { path: '/super-admin/moderation', icon: <Flag size={20} />, label: 'Content Moderation' },
    { path: '/super-admin/landing-page', icon: <Edit size={20} />, label: 'Landing Page Editor' },
    { path: '/super-admin/analytics', icon: <BarChart size={20} />, label: 'Advanced Analytics' },
    { path: '/super-admin/ab-testing', icon: <TestTube size={20} />, label: 'A/B Testing' },
    { path: '/super-admin/system-health', icon: <ServerCrash size={20} />, label: 'System Health' },
    { path: '/super-admin/email-campaigns', icon: <Mail size={20} />, label: 'Email Campaigns' },
    { path: '/super-admin/exports', icon: <Download size={20} />, label: 'Data Exports' },
    { path: '/super-admin/audit-logs', icon: <FileText size={20} />, label: 'Audit Logs' },
    { path: '/super-admin/roles', icon: <ShieldCheck size={20} />, label: 'Role Management' },
    { path: '/super-admin/bulk-actions', icon: <UserCog size={20} />, label: 'Bulk User Actions' },
    { path: '/super-admin/social-login', icon: <Facebook size={20} />, label: 'Social Login' },
    { path: '/super-admin/categories', icon: <Tag size={20} />, label: 'Categories' },
    { path: '/super-admin/registration-questions', icon: <ClipboardList size={20} />, label: 'Registration Questions' },
    { path: '/super-admin/messages', icon: <MessageSquare size={20} />, label: 'Messages' },
    { path: '/super-admin/photos', icon: <ImageIcon size={20} />, label: 'Photos' },
    { path: '/super-admin/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="absolute inset-0 opacity-5 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(253,41,123,0.05),transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(255,88,100,0.05),transparent_50%)]"></div>
      </div>
      
      <aside 
        className={`fixed top-0 left-0 z-40 h-screen backdrop-blur-sm bg-white/90 border-r border-tinder-rose/10 transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-tinder-rose/10">
            {!collapsed && (
              <div className="flex items-center">
                <Brain size={20} className="mr-2 text-tinder-rose" />
                <h2 className="text-xl font-bold ai-text-gradient">AI Admin</h2>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar} 
              className="ml-auto text-tinder-rose hover:bg-tinder-rose/5"
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </Button>
          </div>
          
          <nav className="flex-1 py-4 overflow-y-auto">
            <ul className="space-y-1 px-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/super-admin'}
                    className={({ isActive }) => 
                      `flex items-center p-2 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? 'bg-gradient-to-r from-tinder-rose/10 to-tinder-orange/10 text-tinder-rose' 
                          : 'hover:bg-gray-100 text-gray-700'
                      } ${collapsed ? 'justify-center' : 'px-3'}`
                    }
                  >
                    <span className="transition-colors duration-200">
                      {item.icon}
                    </span>
                    {!collapsed && <span className="ml-3">{item.label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t border-tinder-rose/10">
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
      
      <main className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="p-6 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default SuperAdminLayout;
