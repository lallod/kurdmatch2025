
import React from 'react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { Home, Eye, Heart, MessageCircle, UserRound } from 'lucide-react';

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
      icon: Eye,
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
      icon: UserRound,
      path: '/admin',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-950 shadow-lg border-t border-gray-200 dark:border-gray-800 py-3">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center justify-center p-3 rounded-full transition-colors",
                isActive 
                  ? "text-tinder-rose bg-rose-50 dark:bg-rose-950/30" 
                  : "text-gray-500 hover:text-tinder-rose hover:bg-rose-50/50 dark:hover:bg-rose-950/20"
              )}
              aria-label={item.name}
            >
              <item.icon 
                size={26} 
                className={cn(
                  "transition-all",
                  isActive ? "stroke-tinder-rose" : "stroke-gray-500"
                )} 
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
