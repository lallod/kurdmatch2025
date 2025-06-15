
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

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (loading || hasProcessed) return;

      try {
        console.log('OAuth callback - processing authentication...');
        
        // First, try to get the session from the URL fragments
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          throw error;
        }

        if (data.session && data.session.user) {
          console.log('OAuth callback - user authenticated:', data.session.user.email);
          setHasProcessed(true);
          
          // Check if user is super admin
          const isSuperAdmin = await isUserSuperAdmin(data.session.user.id);
          
          if (isSuperAdmin) {
            toast({
              title: "Welcome back!",
              description: "Redirecting to super admin dashboard...",
            });
            navigate('/super-admin');
          } else {
            toast({
              title: "Welcome!",
              description: "Login successful. Redirecting...",
            });
            navigate('/discovery');
          }
        } else if (user) {
          console.log('OAuth callback - user from context:', user.email);
          setHasProcessed(true);
          
          // Check if user is super admin
          const isSuperAdmin = await isUserSuperAdmin(user.id);
          
          if (isSuperAdmin) {
            toast({
              title: "Welcome back!",
              description: "Redirecting to super admin dashboard...",
            });
            navigate('/super-admin');
          } else {
            toast({
              title: "Welcome!",
              description: "Login successful. Redirecting...",
            });
            navigate('/discovery');
          }
        } else {
          // No user found after sufficient time, redirect to auth page
          console.log('OAuth callback - no user found after processing');
          setHasProcessed(true);
          toast({
            title: "Authentication failed",
            description: "Please try logging in again.",
            variant: "destructive",
          });
          navigate('/auth');
        }
      } catch (error) {
        console.error('Error in OAuth callback:', error);
        setHasProcessed(true);
        toast({
          title: "Authentication error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
        navigate('/auth');
      }
    };

    // Add a small delay to ensure auth state is properly updated
    const timeoutId = setTimeout(() => {
      handleAuthCallback();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [user, loading, navigate, toast, hasProcessed]);

  // Show loading spinner while processing
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-white">Processing login...</p>
        <p className="mt-2 text-gray-300 text-sm">Please wait while we complete your authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
