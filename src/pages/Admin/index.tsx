
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { user, loading, session } = useSupabaseAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    // Check if user has admin role when session exists
    const checkAdminStatus = async () => {
      if (!session?.user) {
        console.log('No session user found, will redirect to auth');
        setIsAdmin(false);
        setCheckingRole(false);
        return;
      }
      
      try {
        // We've confirmed the user is authenticated, now let's verify they have admin permissions
        const { data: userData } = await useSupabaseAuth().supabase.auth.getUser();
        console.log('Current user data:', userData?.user?.email);
        
        if (!userData?.user) {
          throw new Error('User data not available');
        }
        
        // Fetch user roles to check if they have admin access
        console.log('Checking admin access for:', userData.user.id);
        const { data: roleData, error: roleError } = await useSupabaseAuth().supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userData.user.id)
          .eq('role', 'super_admin')
          .maybeSingle();
        
        if (roleError) {
          console.error('Error fetching admin role:', roleError);
          throw roleError;
        }
        
        setIsAdmin(!!roleData);
        console.log('Admin status:', !!roleData);
        
        if (!roleData) {
          // User doesn't have admin role, redirect them
          toast({
            title: "Access Denied",
            description: "You don't have admin permissions",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error verifying admin status:', error);
        setIsAdmin(false);
        toast({
          title: "Authentication Error",
          description: "Please sign in again",
          variant: "destructive"
        });
      } finally {
        setCheckingRole(false);
      }
    };
    
    if (!loading) {
      checkAdminStatus();
    }
  }, [session, loading, navigate, toast]);

  // Redirect to auth page if not authenticated
  useEffect(() => {
    if (!loading && !session) {
      console.log('No session found, redirecting to auth');
      navigate('/auth');
    }
  }, [session, loading, navigate]);

  // Redirect non-admin users away from admin pages
  useEffect(() => {
    if (!loading && !checkingRole && isAdmin === false) {
      console.log('User is not admin, redirecting');
      navigate('/');
    }
  }, [isAdmin, checkingRole, loading, navigate]);

  if (loading || checkingRole) {
    return <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Verifying admin access...</p>
      </div>
    </div>;
  }

  if (!isAdmin) {
    return null; // Will redirect via useEffect
  }

  return <AdminDashboard />;
};

export default Admin;
