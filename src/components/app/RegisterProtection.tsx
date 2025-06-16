
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { checkProfileCompleteness } from '@/utils/auth/profileUtils';

interface RegisterProtectionProps {
  children: React.ReactNode;
}

export const RegisterProtection: React.FC<RegisterProtectionProps> = ({ children }) => {
  const { user } = useSupabaseAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompleteProfile, setHasCompleteProfile] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const isComplete = await checkProfileCompleteness(user.id);
        setHasCompleteProfile(isComplete);
      } catch (error) {
        console.error('Error checking profile completeness:', error);
        setHasCompleteProfile(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkProfile();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check if this is an OAuth registration flow
  const isOAuthRegistration = sessionStorage.getItem('oauth_registration_flow') === 'true';

  // If user is authenticated and has complete profile, and not in OAuth registration flow, redirect to discovery
  if (user && hasCompleteProfile && !isOAuthRegistration) {
    return <Navigate to="/discovery" replace />;
  }

  // Allow access to registration for:
  // 1. Unauthenticated users (manual registration)
  // 2. Authenticated users with incomplete profiles (OAuth users)
  // 3. OAuth users in registration flow
  return <>{children}</>;
};
