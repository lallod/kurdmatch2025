
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { isUserSuperAdmin } from '@/utils/auth/roleUtils';
import { checkProfileCompleteness } from '@/utils/auth/profileUtils';
import { supabase } from '@/integrations/supabase/client';

export const useOAuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        console.log('Processing OAuth callback...');
        
        // Check if this is an OAuth callback
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        // Handle error cases first
        if (urlParams.has('error')) {
          const errorDescription = urlParams.get('error_description') || urlParams.get('error');
          throw new Error(errorDescription || 'OAuth authentication failed');
        }
        
        // Handle authorization code flow
        if (urlParams.has('code')) {
          console.log('Processing authorization code...');
          const { data, error: authError } = await supabase.auth.exchangeCodeForSession(window.location.search);
          
          if (authError) {
            console.error('OAuth code exchange error:', authError);
            throw authError;
          }

          console.log('OAuth code exchange successful:', data);
        }
        // Handle implicit flow (fallback)
        else if (hashParams.has('access_token')) {
          console.log('Processing access token from URL fragment...');
          // For implicit flow, Supabase should automatically handle the session
        }
        else {
          throw new Error('Invalid OAuth callback - missing required parameters');
        }
        
        // Get the current session immediately after OAuth processing
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        const currentUser = sessionData?.session?.user;
        
        if (!currentUser) {
          throw new Error('No user found after OAuth callback');
        }

        console.log('User authenticated successfully:', currentUser.email);
        
        // Check if user is super admin first
        const isSuperAdmin = await isUserSuperAdmin(currentUser.id);
        
        if (isSuperAdmin) {
          toast({
            title: "Welcome back!",
            description: "Redirecting to super admin dashboard...",
          });
          navigate('/super-admin', { replace: true });
          return;
        }

        // Check if user has complete profile
        const hasCompleteProfile = await checkProfileCompleteness(currentUser.id);
        
        if (hasCompleteProfile) {
          // Returning user with complete profile
          toast({
            title: "Welcome back!",
            description: "Redirecting to discovery...",
          });
          navigate('/discovery', { replace: true });
        } else {
          // New user or incomplete profile - set OAuth flag and redirect to registration wizard
          sessionStorage.setItem('oauth_registration_flow', 'true');
          toast({
            title: "Welcome!",
            description: "Let's complete your profile to get started...",
          });
          navigate('/register', { replace: true });
        }
        
      } catch (error: any) {
        console.error('OAuth callback failed:', error);
        setError(error.message || 'Authentication failed');
        
        toast({
          title: "Authentication failed",
          description: error.message || "Please try logging in again.",
          variant: "destructive",
        });
        
        // Redirect to auth page after a short delay
        setTimeout(() => {
          navigate('/auth', { replace: true });
        }, 2000);
      } finally {
        setIsProcessing(false);
      }
    };

    // Only process if we have URL parameters indicating an OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const hasOAuthParams = urlParams.has('code') || urlParams.has('error') || hashParams.has('access_token');
    
    if (hasOAuthParams) {
      handleOAuthCallback();
    } else {
      // No OAuth params, redirect to auth
      console.log('No OAuth parameters found, redirecting to auth');
      navigate('/auth', { replace: true });
      setIsProcessing(false);
    }
  }, [navigate, toast]);

  return { isProcessing, error };
};
