
import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { supabase } from '@/integrations/supabase/client';
import UserMenu from '@/components/UserMenu';
import BottomNavigation from '@/components/BottomNavigation';
import { Toaster } from '@/components/ui/toaster';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { user } = useSupabaseAuth();
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);
  
  useEffect(() => {
    const checkSuperAdminStatus = async () => {
      if (!user) {
        setIsSuperAdmin(false);
        setCheckingRole(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'super_admin');
        
        if (error) throw error;
        
        setIsSuperAdmin(data && data.length > 0);
      } catch (err) {
        console.error('Error checking admin status:', err);
        setIsSuperAdmin(false);
      } finally {
        setCheckingRole(false);
      }
    };
    
    if (user) {
      checkSuperAdminStatus();
    } else {
      setIsSuperAdmin(false);
      setCheckingRole(false);
    }
  }, [user]);
  
  const showBottomNav = user && !isSuperAdmin && !checkingRole;
  const showUserMenu = user && !isSuperAdmin && !checkingRole;
  
  return (
    <>
      {showUserMenu && (
        <div className="fixed top-4 right-4 z-50">
          <UserMenu />
        </div>
      )}
      
      {children}
      
      {showBottomNav && <BottomNavigation />}
      <Toaster />
    </>
  );
};

export default AppLayout;
