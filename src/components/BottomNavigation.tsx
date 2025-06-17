
import React from 'react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { Home, Eye, Heart, MessageCircle, UserRound, Search, Settings } from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      name: 'Home',
      icon: Home,
      path: '/swipe',
    },
    {
      name: 'Discovery',
      icon: Search,
      path: '/discovery',
    },
    {
      name: 'Messages',
      icon: MessageCircle,
      path: '/messages',
    },
    {
      name: 'Views',
      icon: Eye,
      path: '/viewed-me',
    },
    {
      name: 'Profile',
      icon: UserRound,
      path: '/my-profile',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md bg-white/10 border-t border-white/20 py-3">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300",
                isActive 
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105" 
                  : "text-purple-200 hover:text-white hover:bg-white/10"
              )}
              aria-label={item.name}
            >
              <item.icon 
                size={22} 
                className={cn(
                  "transition-all mb-1",
                  isActive ? "stroke-white" : "stroke-purple-200"
                )} 
              />
              <span className={cn(
                "text-xs font-medium transition-all",
                isActive ? "text-white" : "text-purple-200"
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
