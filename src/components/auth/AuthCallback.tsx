
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useToast } from '@/hooks/use-toast';
import { isUserSuperAdmin } from '@/utils/auth/roleUtils';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        console.log('Processing OAuth callback...');
        
        // Handle the OAuth callback by exchanging the code for a session
        const { data, error: authError } = await supabase.auth.exchangeCodeForSession(window.location.search);
        
        if (authError) {
          console.error('OAuth callback error:', authError);
          throw authError;
        }

        console.log('OAuth callback successful:', data);
        
        // Wait a moment for the session to be fully established
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get the current session to ensure we have the user
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
        
        // Check if user is super admin
        const isSuperAdmin = await isUserSuperAdmin(currentUser.id);
        
        if (isSuperAdmin) {
          toast({
            title: "Welcome back!",
            description: "Redirecting to super admin dashboard...",
          });
          navigate('/super-admin', { replace: true });
        } else {
          toast({
            title: "Welcome!",
            description: "Login successful. Redirecting...",
          });
          navigate('/discovery', { replace: true });
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
    const hasOAuthParams = urlParams.has('code') || urlParams.has('error');
    
    if (hasOAuthParams) {
      handleOAuthCallback();
    } else {
      // No OAuth params, redirect to auth
      console.log('No OAuth parameters found, redirecting to auth');
      navigate('/auth', { replace: true });
    }
  }, [navigate, toast]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Authentication Failed</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <p className="text-gray-400 text-sm">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-white text-lg">Processing authentication...</p>
        <p className="mt-2 text-gray-300 text-sm">Please wait while we complete your login...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
