
import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { isUserSuperAdmin } from '@/utils/auth/roleUtils';

export const useWizardManager = () => {
  const { user, loading } = useSupabaseAuth();
  const [showWizard, setShowWizard] = useState(false);
  const [checkingRole, setCheckingRole] = useState(false);
  const [isOAuthFlow, setIsOAuthFlow] = useState(false);

  useEffect(() => {
    // Check if this is an OAuth flow by looking at the current URL
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const isOAuth = urlParams.has('code') || urlParams.has('error') || hashParams.has('access_token') || 
                    window.location.pathname === '/auth/callback';
    
    setIsOAuthFlow(isOAuth);
    
    // Only check for wizard if not in OAuth flow
    if (!isOAuth && user && !loading) {
      checkUserRoleAndShowWizard();
    }
  }, [user, loading]);

  const checkUserRoleAndShowWizard = async () => {
    if (!user) return;
    
    setCheckingRole(true);
    try {
      // Check if user is super-admin
      const isSuperAdmin = await isUserSuperAdmin(user.id);
      
      // Only show wizard for non-super-admin users
      if (!isSuperAdmin) {
        setShowWizard(true);
      } else {
        setShowWizard(false);
      }
    } catch (error) {
      console.error('Error checking user role:', error);
      // Default to showing wizard if role check fails
      setShowWizard(true);
    } finally {
      setCheckingRole(false);
    }
  };

  const handleWizardComplete = () => {
    setShowWizard(false);
  };

  return {
    showWizard,
    checkingRole,
    isOAuthFlow,
    handleWizardComplete,
    loading: loading || checkingRole
  };
};
