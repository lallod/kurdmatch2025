
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
      // Wait for auth to fully initialize
      if (loading) {
        return;
      }

      // If already checked and we have both user and session, don't re-check
      if (roleCheckComplete && user && session) {
        setIsCheckingRole(false);
        return;
      }

      // If no user after loading is complete, redirect to login
      if (!user || !session) {
        setHasAdminRole(false);
        setIsCheckingRole(false);
        setRoleCheckComplete(true);
        
        // Only redirect if we're not already on the login page
        if (window.location.pathname !== '/admin-login') {
          setTimeout(() => {
            navigate('/admin-login');
          }, 1000);
        }
        return;
      }

      // Wait for session to be stable (prevent checking during rapid state changes)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Double-check that user and session are still available after delay
      if (!user || !session) {
        return;
      }

      try {
        const isAdmin = await isUserSuperAdmin(user.id);
        
        if (!isAdmin) {
          setHasAdminRole(false);
          setRoleCheckComplete(true);
          
          // Only redirect if we're not already on the login page
          if (window.location.pathname !== '/admin-login') {
            setTimeout(() => {
              navigate('/admin-login');
            }, 500);
          }
          return;
        }

        setHasAdminRole(true);
        setRoleCheckComplete(true);
      } catch (error) {
        console.error('useAdminRoleCheck: Error checking admin role:', error);
        setHasAdminRole(false);
        setRoleCheckComplete(true);
        
        // Only redirect if we're not already on the login page
        if (window.location.pathname !== '/admin-login') {
          setTimeout(() => {
            navigate('/admin-login');
          }, 500);
        }
      } finally {
        setIsCheckingRole(false);
      }
    };

    // Only check role when we have stable auth state
    if (!loading && (!roleCheckComplete || (user && session && !hasAdminRole))) {
      checkAdminRole();
    }
  }, [user, loading, session, navigate, roleCheckComplete, hasAdminRole]);

  // Reset role check when user changes
  useEffect(() => {
    if (!user && roleCheckComplete) {
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
