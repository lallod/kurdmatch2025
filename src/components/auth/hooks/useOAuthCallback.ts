
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from '@/hooks/useTranslations';
import { isUserSuperAdmin } from '@/utils/auth/roleUtils';
import { checkProfileCompleteness } from '@/utils/auth/profileUtils';
import { supabase } from '@/integrations/supabase/client';

export const useOAuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslations();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        if (urlParams.has('error')) {
          const errorDescription = urlParams.get('error_description') || urlParams.get('error');
          throw new Error(errorDescription || 'OAuth authentication failed');
        }
        
        if (urlParams.has('code')) {
          const { data, error: authError } = await supabase.auth.exchangeCodeForSession(window.location.search);
          
          if (authError) {
            console.error('OAuth code exchange error:', authError);
            throw authError;
          }
        }
        else if (hashParams.has('access_token')) {
          // For implicit flow, Supabase should automatically handle the session
        }
        else {
          throw new Error('Invalid OAuth callback - missing required parameters');
        }
        
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        const currentUser = sessionData?.session?.user;
        
        if (!currentUser) {
          throw new Error('No user found after OAuth callback');
        }
        
        const isSuperAdmin = await isUserSuperAdmin(currentUser.id);
        
        if (isSuperAdmin) {
          toast({
            title: t('auth.welcome_back', 'Welcome back!'),
            description: t('auth.redirect_admin', 'Redirecting to super admin dashboard...'),
          });
          navigate('/super-admin', { replace: true });
          return;
        }

        const hasCompleteProfile = await checkProfileCompleteness(currentUser.id);
        
        if (hasCompleteProfile) {
          toast({
            title: t('auth.welcome_back', 'Welcome back!'),
            description: t('auth.redirect_discovery', 'Redirecting to discovery...'),
          });
          navigate('/discovery', { replace: true });
        } else {
          sessionStorage.setItem('oauth_registration_flow', 'true');
          toast({
            title: t('auth.welcome', 'Welcome!'),
            description: t('auth.complete_profile', "Let's complete your profile to get started..."),
          });
          navigate('/register', { replace: true });
        }
        
      } catch (error: any) {
        console.error('OAuth callback failed:', error);
        setError(error.message || 'Authentication failed');
        
        toast({
          title: t('auth.auth_failed', 'Authentication failed'),
          description: error.message || t('auth.try_again', 'Please try logging in again.'),
          variant: "destructive",
        });
        
        setTimeout(() => {
          navigate('/auth', { replace: true });
        }, 2000);
      } finally {
        setIsProcessing(false);
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const hasOAuthParams = urlParams.has('code') || urlParams.has('error') || hashParams.has('access_token');
    
    if (hasOAuthParams) {
      handleOAuthCallback();
    } else {
      navigate('/auth', { replace: true });
      setIsProcessing(false);
    }
  }, [navigate, toast]);

  return { isProcessing, error };
};
