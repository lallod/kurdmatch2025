
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { Home, Eye, Heart, MessageCircle, UserRound, Newspaper, Shield } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useTranslations } from '@/hooks/useTranslations';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

const BottomNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { counts } = useNotifications();
  const { t } = useTranslations();
  const { user } = useSupabaseAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'super_admin')
      .maybeSingle();
    
    setIsAdmin(!!data);
  };
  
  const baseNavItems = [{
    nameKey: 'nav.discover',
    name: t('nav.discover', 'Discovery'),
    icon: Newspaper,
    path: '/discovery'
  }, {
    nameKey: 'nav.swipe',
    name: t('nav.swipe', 'Swipe'),
    icon: Home,
    path: '/swipe'
  }, {
    nameKey: 'nav.messages',
    name: t('nav.messages', 'Messages'),
    icon: MessageCircle,
    path: '/messages'
  }, {
    nameKey: 'nav.views',
    name: 'Views', // Not translated yet
    icon: Eye,
    path: '/viewed-me'
  }, {
    nameKey: 'nav.profile',
    name: t('nav.profile', 'Profile'),
    icon: UserRound,
    path: '/my-profile'
  }];

  const navItems = isAdmin 
    ? [...baseNavItems.slice(0, 4), {
        nameKey: 'nav.admin',
        name: 'Admin',
        icon: Shield,
        path: '/admin/dashboard'
      }]
    : baseNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md border-t border-white/20 py-1 bg-black/[0.17] safe-area-inset-bottom">
      <div className="flex items-center justify-around w-full max-w-md mx-auto px-4 sm:px-6">
        {navItems.map(item => {
          const isActive = currentPath === item.path;
          return (
            <Link 
              key={item.name} 
              to={item.path} 
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 relative",
                isActive ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105" : "text-purple-200 hover:text-white hover:bg-white/10"
              )} 
              aria-label={item.name}
            >
              <item.icon size={20} className={cn("transition-all mb-0.5", isActive ? "stroke-white" : "stroke-purple-200")} />
              {/* Notification badges */}
              {item.path === '/messages' && counts.messages > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {counts.messages > 99 ? '99+' : counts.messages}
                </span>
              )}
              {item.path === '/viewed-me' && counts.views > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {counts.views > 99 ? '99+' : counts.views}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
