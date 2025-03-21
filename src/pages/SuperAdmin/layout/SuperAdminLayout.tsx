
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  FileSpreadsheet, 
  CreditCard, 
  CheckSquare, 
  FolderClosed, 
  UserCog,
  User,
  BarChart,
  ClipboardList,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

const SuperAdminLayout: React.FC<SuperAdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/super-admin' },
    { icon: Users, label: 'Customers', path: '/super-admin/customers' },
    { icon: FileText, label: 'Proposals', path: '/super-admin/proposals' },
    { icon: FileSpreadsheet, label: 'Invoices', path: '/super-admin/invoices' },
    { icon: CreditCard, label: 'Subscriptions', path: '/super-admin/subscriptions' },
    { icon: CheckSquare, label: 'Todos', path: '/super-admin/todos' },
    { icon: FolderClosed, label: 'Transactions', path: '/super-admin/transactions' },
    { icon: UserCog, label: 'Roles', path: '/super-admin/roles' },
    { icon: User, label: 'Users', path: '/super-admin/user-list' },
    { icon: BarChart, label: 'Reports', path: '/super-admin/reports' },
    { icon: ClipboardList, label: 'Action Logs', path: '/super-admin/action-logs' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div 
        className={cn(
          "bg-[#0f0c29] text-white transition-all duration-300 flex flex-col",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {/* Logo Area */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center">
              <span className="font-bold text-xl">KurdMatch</span>
              <span className="text-xs bg-gradient-to-r from-tinder-rose to-tinder-orange text-white px-1.5 py-0.5 rounded ml-2">Pro</span>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-400 hover:text-white"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        </div>

        {/* Admin Profile */}
        <div className={cn(
          "p-4 border-b border-gray-800",
          collapsed ? "items-center justify-center" : "items-start"
        )}>
          <div className="flex items-center">
            <Avatar className="h-10 w-10 border-2 border-tinder-rose">
              <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="ml-3">
                <h3 className="text-sm font-medium">Mohammad Reza</h3>
                <p className="text-xs text-gray-400">Admin</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu Section Label */}
        {!collapsed && (
          <div className="px-4 py-2 text-xs text-gray-400 uppercase tracking-wider">
            Menus
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm rounded-lg",
                    isActive(item.path) 
                      ? "bg-gradient-to-r from-tinder-rose/10 to-tinder-orange/10 text-white" 
                      : "text-gray-400 hover:bg-gray-800 hover:text-white",
                    collapsed ? "justify-center" : "justify-start"
                  )}
                >
                  <item.icon size={20} className={collapsed ? "" : "mr-3"} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <header className="bg-white h-16 border-b flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">{
              menuItems.find(item => isActive(item.path))?.label || 'Overview'
            }</h1>
          </div>
          
          {/* Search */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                type="search" 
                placeholder="Search Customers" 
                className="pl-10 pr-4 py-2 rounded-md border-gray-200"
              />
            </div>
          </div>
          
          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5 text-gray-600" />
            </Button>
            <div className="relative">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5 text-gray-600" />
              </Button>
              <span className="absolute top-0 right-0 h-5 w-5 text-xs bg-tinder-rose text-white rounded-full flex items-center justify-center">
                3
              </span>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
