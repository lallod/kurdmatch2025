
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const SuperAdminRoute = () => {
  const { session, loading } = useSupabaseAuth();
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!session?.user) {
        setIsSuperAdmin(false);
        setCheckingRole(false);
        return;
      }
      
      try {
        console.log("Checking super admin status for user:", session.user.id);
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'super_admin');
        
        if (error) throw error;
        
        const isAdmin = data && data.length > 0;
        console.log("Is admin result:", isAdmin, data);
        setIsSuperAdmin(isAdmin);
        
        if (!isAdmin) {
          setCheckingRole(false);
          toast({
            title: 'Access Denied',
            description: 'You do not have permission to access this area',
            variant: 'destructive'
          });
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
        setIsSuperAdmin(false);
        toast({
          title: 'Error',
          description: 'Could not verify admin permissions',
          variant: 'destructive'
        });
      } finally {
        setCheckingRole(false);
      }
    };
    
    if (!loading) {
      checkAdminStatus();
    }
  }, [session, loading, toast]);
  
  if (loading || checkingRole) {
    return <div className="flex h-screen items-center justify-center">Verifying permissions...</div>;
  }
  
  if (!isSuperAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

export default SuperAdminRoute;
