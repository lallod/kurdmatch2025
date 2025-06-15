
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useToast } from '@/hooks/use-toast';
import { isUserSuperAdmin } from '@/utils/auth/roleUtils';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user, loading } = useSupabaseAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (loading) return;

      try {
        if (user) {
          console.log('OAuth callback - user authenticated:', user.email);
          
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
          // No user found, redirect to auth page
          console.log('OAuth callback - no user found');
          toast({
            title: "Authentication failed",
            description: "Please try logging in again.",
            variant: "destructive",
          });
          navigate('/auth');
        }
      } catch (error) {
        console.error('Error in OAuth callback:', error);
        toast({
          title: "Authentication error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
        navigate('/auth');
      }
    };

    handleAuthCallback();
  }, [user, loading, navigate, toast]);

  // Show loading spinner while processing
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-white">Processing login...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
