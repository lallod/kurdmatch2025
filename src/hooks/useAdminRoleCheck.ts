
import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { isUserSuperAdmin } from '@/utils/auth/roleUtils';
import { useNavigate } from 'react-router-dom';

export const useAdminRoleCheck = () => {
  const [isCheckingRole, setIsCheckingRole] = useState(true);
  const [hasAdminRole, setHasAdminRole] = useState(false);
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        console.log('No user found, redirecting to admin login');
        navigate('/admin-login');
        return;
      }

      try {
        console.log('Checking admin role for user:', user.id);
        const isAdmin = await isUserSuperAdmin(user.id);
        console.log('Admin role check result:', isAdmin);
        
        if (!isAdmin) {
          console.log('User does not have admin role, redirecting to admin login');
          navigate('/admin-login');
          return;
        }

        setHasAdminRole(true);
      } catch (error) {
        console.error('Error checking admin role:', error);
        navigate('/admin-login');
      } finally {
        setIsCheckingRole(false);
      }
    };

    checkAdminRole();
  }, [user, navigate]);

  return {
    isCheckingRole,
    hasAdminRole,
    user
  };
};
