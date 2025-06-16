
import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { isUserSuperAdmin } from '@/utils/auth/roleUtils';
import { useNavigate } from 'react-router-dom';

export const useAdminRoleCheck = () => {
  const [isCheckingRole, setIsCheckingRole] = useState(true);
  const [hasAdminRole, setHasAdminRole] = useState(false);
  const [roleCheckComplete, setRoleCheckComplete] = useState(false);
  const { user, loading, session } = useSupabaseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminRole = async () => {
      console.log('useAdminRoleCheck: Starting role check', { 
        userId: user?.id, 
        loading, 
        sessionExists: !!session,
        roleCheckComplete 
      });
      
      // Wait for auth loading to complete
      if (loading) {
        console.log('useAdminRoleCheck: Auth still loading, waiting...');
        return;
      }

      // If no user after loading is complete, redirect to login after delay
      if (!user || !session) {
        console.log('useAdminRoleCheck: No user/session found after auth loading complete');
        setHasAdminRole(false);
        setIsCheckingRole(false);
        setRoleCheckComplete(true);
        
        // Only redirect if we're not already on the login page
        if (window.location.pathname !== '/admin-login') {
          setTimeout(() => {
            console.log('useAdminRoleCheck: Redirecting to admin login');
            navigate('/admin-login');
          }, 500);
        }
        return;
      }

      // If role check is already complete and we have a valid session, don't re-check
      if (roleCheckComplete && session) {
        console.log('useAdminRoleCheck: Role check already complete, using cached result');
        setIsCheckingRole(false);
        return;
      }

      try {
        console.log('useAdminRoleCheck: Checking admin role for user:', user.id);
        
        // Add a small delay to ensure session is fully established
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const isAdmin = await isUserSuperAdmin(user.id);
        console.log('useAdminRoleCheck: Admin role check result:', isAdmin);
        
        if (!isAdmin) {
          console.log('useAdminRoleCheck: User does not have admin role');
          setHasAdminRole(false);
          setRoleCheckComplete(true);
          
          // Only redirect if we're not already on the login page
          if (window.location.pathname !== '/admin-login') {
            setTimeout(() => {
              console.log('useAdminRoleCheck: Redirecting non-admin user');
              navigate('/admin-login');
            }, 500);
          }
          return;
        }

        console.log('useAdminRoleCheck: Admin role verified successfully');
        setHasAdminRole(true);
        setRoleCheckComplete(true);
      } catch (error) {
        console.error('useAdminRoleCheck: Error checking admin role:', error);
        setHasAdminRole(false);
        setRoleCheckComplete(true);
        
        // Only redirect if we're not already on the login page
        if (window.location.pathname !== '/admin-login') {
          setTimeout(() => {
            console.log('useAdminRoleCheck: Redirecting due to error');
            navigate('/admin-login');
          }, 500);
        }
      } finally {
        setIsCheckingRole(false);
      }
    };

    // Only run the check if we haven't completed it yet or if the user changed
    if (!roleCheckComplete || (user && !loading)) {
      checkAdminRole();
    }
  }, [user, loading, session, navigate, roleCheckComplete]);

  // Reset role check when user changes
  useEffect(() => {
    if (!user && roleCheckComplete) {
      console.log('useAdminRoleCheck: User changed, resetting role check');
      setRoleCheckComplete(false);
      setHasAdminRole(false);
    }
  }, [user, roleCheckComplete]);

  return {
    isCheckingRole,
    hasAdminRole,
    user
  };
};
