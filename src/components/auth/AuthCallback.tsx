
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useToast } from '@/hooks/use-toast';
import { isUserSuperAdmin } from '@/utils/auth/roleUtils';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user, loading } = useSupabaseAuth();
  const { toast } = useToast();
  const [hasProcessed, setHasProcessed] = useState(false);
  const [processingAttempts, setProcessingAttempts] = useState(0);

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (loading || hasProcessed || processingAttempts >= 3) return;

      setProcessingAttempts(prev => prev + 1);

      try {
        console.log('OAuth callback - processing authentication...', { attempt: processingAttempts + 1 });
        
        // Handle the auth callback from URL
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        const currentUser = sessionData?.session?.user || user;

        if (currentUser) {
          console.log('OAuth callback - user authenticated:', currentUser.email);
          setHasProcessed(true);
          
          // Small delay to ensure user state is fully updated
          await new Promise(resolve => setTimeout(resolve, 500));
          
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
        } else if (processingAttempts >= 2) {
          // After multiple attempts, show error
          console.log('OAuth callback - no user found after multiple attempts');
          setHasProcessed(true);
          toast({
            title: "Authentication incomplete",
            description: "Please try logging in again.",
            variant: "destructive",
          });
          navigate('/auth', { replace: true });
        }
      } catch (error) {
        console.error('Error in OAuth callback:', error);
        setHasProcessed(true);
        toast({
          title: "Authentication error",
          description: "Something went wrong during login. Please try again.",
          variant: "destructive",
        });
        navigate('/auth', { replace: true });
      }
    };

    // Add progressive delays for retries
    const delay = processingAttempts === 0 ? 500 : processingAttempts * 1000;
    const timeoutId = setTimeout(() => {
      handleAuthCallback();
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [user, loading, navigate, toast, hasProcessed, processingAttempts]);

  // Show loading spinner while processing
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-white">Processing login...</p>
        <p className="mt-2 text-gray-300 text-sm">
          {processingAttempts > 0 ? `Attempt ${processingAttempts + 1}...` : 'Please wait while we complete your authentication...'}
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
