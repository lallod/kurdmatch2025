
import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { isUserSuperAdmin } from '@/utils/auth/roleUtils';
import { useNavigate } from 'react-router-dom';

export const useAdminRoleCheck = () => {
  const [isCheckingRole, setIsCheckingRole] = useState(true);
  const [hasAdminRole, setHasAdminRole] = useState(false);
  const { user, loading } = useSupabaseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminRole = async () => {
      console.log('useAdminRoleCheck: Starting role check', { user: user?.id, loading });
      
      // Wait for auth loading to complete
      if (loading) {
        console.log('useAdminRoleCheck: Auth still loading, waiting...');
        return;
      }

      // If no user after loading is complete, redirect to login
      if (!user) {
        console.log('useAdminRoleCheck: No user found after auth loading complete');
        setIsCheckingRole(false);
        // Add a small delay to prevent immediate redirect loops
        setTimeout(() => {
          navigate('/admin-login');
        }, 100);
        return;
      }

      try {
        console.log('useAdminRoleCheck: Checking admin role for user:', user.id);
        const isAdmin = await isUserSuperAdmin(user.id);
        console.log('useAdminRoleCheck: Admin role check result:', isAdmin);
        
        if (!isAdmin) {
          console.log('useAdminRoleCheck: User does not have admin role');
          setHasAdminRole(false);
          setIsCheckingRole(false);
          // Add delay to prevent redirect loops
          setTimeout(() => {
            navigate('/admin-login');
          }, 100);
          return;
        }

        console.log('useAdminRoleCheck: Admin role verified successfully');
        setHasAdminRole(true);
      } catch (error) {
        console.error('useAdminRoleCheck: Error checking admin role:', error);
        setHasAdminRole(false);
        // Add delay to prevent redirect loops
        setTimeout(() => {
          navigate('/admin-login');
        }, 100);
      } finally {
        setIsCheckingRole(false);
      }
    };

    checkAdminRole();
  }, [user, loading, navigate]);

  return {
    isCheckingRole,
    hasAdminRole,
    user
  };
};
