
import React from 'react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Heart, MessageCircle } from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      name: 'Home',
      icon: Home,
      path: '/',
    },
    {
      name: 'Viewed Me',
      icon: User,
      path: '/viewed-me',
    },
    {
      name: 'Liked Me',
      icon: Heart,
      path: '/liked-me',
    },
    {
      name: 'Messages',
      icon: MessageCircle,
      path: '/messages',
    },
    {
      name: 'My Profile',
      icon: User,
      path: '/my-profile',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-950 shadow-lg border-t border-gray-200 dark:border-gray-800 py-2">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors",
                isActive 
                  ? "text-tinder-rose" 
                  : "text-gray-500 hover:text-tinder-rose"
              )}
            >
              <item.icon 
                size={24} 
                className={cn(
                  "transition-all",
                  isActive ? "stroke-tinder-rose" : "stroke-gray-500"
                )} 
              />
              <span className="text-xs mt-1 font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
