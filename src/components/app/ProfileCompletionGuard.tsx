import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { checkProfileCompleteness } from '@/utils/auth/profileUtils';

interface ProfileCompletionGuardProps {
  children: React.ReactNode;
}

/**
 * Guard component that ensures users have complete profiles before accessing protected routes
 */
export const ProfileCompletionGuard: React.FC<ProfileCompletionGuardProps> = ({ children }) => {
  const { user } = useSupabaseAuth();
  const location = useLocation();
  const [isComplete, setIsComplete] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Routes that should be accessible even with incomplete profiles
  const allowedIncompleteRoutes = [
    '/complete-profile',
    '/register',
    '/login',
    '/auth',
    '/'
  ];

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Skip check for allowed routes
      if (allowedIncompleteRoutes.includes(location.pathname)) {
        setIsLoading(false);
        return;
      }

      try {
        const complete = await checkProfileCompleteness(user.id);
        setIsComplete(complete);
      } catch (error) {
        console.error('Error checking profile completeness:', error);
        setIsComplete(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkProfile();
  }, [user, location.pathname]);

  // Show loading while checking
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  // Allow access to allowed routes regardless of profile status
  if (allowedIncompleteRoutes.includes(location.pathname)) {
    return <>{children}</>;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/register" replace />;
  }

  // Redirect to profile completion if profile is incomplete
  if (isComplete === false) {
    return <Navigate to="/complete-profile" replace />;
  }

  // Allow access if profile is complete
  return <>{children}</>;
};