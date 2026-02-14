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
    if (user) checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;
    const { data } = await supabase.from('user_roles').select('role').eq('user_id', user.id).eq('role', 'super_admin').maybeSingle();
    setIsAdmin(!!data);
  };
  
  const baseNavItems = [
    { name: 'Home', icon: Newspaper, path: '/discovery' },
    { name: 'Swipe', icon: Home, path: '/swipe' },
    { name: 'Chat', icon: MessageCircle, path: '/messages' },
    { name: 'Views', icon: Eye, path: '/viewed-me' },
    { name: 'Profile', icon: UserRound, path: '/my-profile' },
  ];

  const navItems = isAdmin 
    ? [...baseNavItems.slice(0, 4), { name: 'Admin', icon: Shield, path: '/admin/dashboard' }]
    : baseNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-card/95 backdrop-blur-xl shadow-[0_-2px_20px_rgba(0,0,0,0.15)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center justify-around w-full max-w-md mx-auto px-2" style={{ height: '56px' }}>
        {navItems.map(item => {
          const isActive = currentPath === item.path;
          return (
            <Link 
              key={item.name} 
              to={item.path} 
              className={cn(
                "flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 relative min-h-[44px]",
                isActive ? "text-foreground" : "text-muted-foreground"
              )} 
              aria-label={item.name}
            >
              {/* Active dot indicator */}
              {isActive && (
                <div className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-primary" />
              )}
              <item.icon size={24} className={cn("mb-0.5", isActive ? "stroke-foreground" : "stroke-muted-foreground")} />
              <span className={cn("text-[11px] leading-tight", isActive ? "font-semibold" : "font-normal")}>{item.name}</span>
              
              {item.path === '/messages' && counts.messages > 0 && (
                <span className="absolute -top-0.5 right-0 bg-primary text-primary-foreground text-[9px] rounded-full h-4 min-w-[16px] flex items-center justify-center font-bold px-1">
                  {counts.messages > 99 ? '99+' : counts.messages}
                </span>
              )}
              {item.path === '/viewed-me' && counts.views > 0 && (
                <span className="absolute -top-0.5 right-0 bg-primary text-primary-foreground text-[9px] rounded-full h-4 min-w-[16px] flex items-center justify-center font-bold px-1">
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
