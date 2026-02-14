
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
    name: 'Views',
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
    <nav className="fixed bottom-0 left-0 right-0 z-[100] mx-4 mb-4 safe-area-inset-bottom">
      <div className="flex items-center justify-around w-full max-w-md mx-auto px-4 sm:px-6 py-2 rounded-[28px] bg-surface-secondary/80 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
        {navItems.map(item => {
          const isActive = currentPath === item.path;
          return (
            <Link 
              key={item.name} 
              to={item.path} 
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 relative",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )} 
              aria-label={item.name}
            >
              <item.icon 
                size={20} 
                className={cn(
                  "transition-all mb-0.5", 
                  isActive 
                    ? "stroke-primary drop-shadow-[0_0_8px_hsl(336_90%_60%/0.6)]" 
                    : "stroke-muted-foreground"
                )} 
              />
              {/* Notification badges */}
              {item.path === '/messages' && counts.messages > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {counts.messages > 99 ? '99+' : counts.messages}
                </span>
              )}
              {item.path === '/viewed-me' && counts.views > 0 && (
                <span className="absolute -top-1 -right-1 bg-success text-success-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
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
