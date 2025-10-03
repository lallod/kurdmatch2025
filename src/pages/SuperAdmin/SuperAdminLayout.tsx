
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
  Edit,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminRoleCheck } from '@/hooks/useAdminRoleCheck';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

const SuperAdminLayout = ({ children }: SuperAdminLayoutProps) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const { isCheckingRole, hasAdminRole } = useAdminRoleCheck();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleSignOut = async () => {
    console.log('SuperAdminLayout: Signing out admin user');
    try {
      await supabase.auth.signOut();
      navigate('/admin-login');
    } catch (error) {
      console.error('Error signing out:', error);
      navigate('/admin-login');
    }
  };

  // Show loading spinner while checking role
  if (isCheckingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-tinder-rose" />
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user doesn't have admin role (redirect handled by hook)
  if (!hasAdminRole) {
    return null;
  }

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
    <div className="flex min-h-screen bg-[#0a0a0a]">
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-40 h-screen bg-[#0f0f0f] border-r border-white/5 transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            {!collapsed && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">L</span>
                </div>
                <span className="text-white font-semibold">LoveAffection</span>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar} 
              className="ml-auto text-white/60 hover:text-white hover:bg-white/5"
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </Button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 py-4 overflow-y-auto scrollbar-hide">
            <ul className="space-y-1 px-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/super-admin'}
                    className={({ isActive }) => 
                      `flex items-center p-3 rounded-lg transition-all duration-200 group ${
                        isActive 
                          ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-500' 
                          : 'hover:bg-white/5 text-white/60 hover:text-white'
                      } ${collapsed ? 'justify-center' : ''}`
                    }
                  >
                    <span className="transition-colors duration-200">
                      {item.icon}
                    </span>
                    {!collapsed && <span className="ml-3 text-sm">{item.label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Sign Out */}
          <div className="p-4 border-t border-white/5">
            <Button
              onClick={handleSignOut}
              variant="ghost"
              className="flex items-center p-3 text-red-500 rounded-lg hover:bg-red-500/10 w-full justify-start"
            >
              <LogOut size={20} />
              {!collapsed && <span className="ml-3 text-sm">Sign Out</span>}
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default SuperAdminLayout;
