
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useRoleCheck } from '@/hooks/useRoleCheck';

const Admin = () => {
  const { user, loading } = useSupabaseAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { hasRole: isAdmin, isChecking } = useRoleCheck(user?.id, 'super_admin');

  // Redirect to auth page if not authenticated
  React.useEffect(() => {
    if (!loading && !user) {
      console.log('No session found, redirecting to auth');
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Redirect non-admin users away from admin pages
  React.useEffect(() => {
    if (!loading && !isChecking && isAdmin === false) {
      console.log('User is not admin, redirecting');
      toast({
        title: "Access Denied",
        description: "You don't have admin permissions",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [isAdmin, isChecking, loading, navigate, toast]);

  if (loading || isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <LoadingSpinner className="mx-auto mb-4" size="large" />
          <p>Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect via useEffect
  }

  return <AdminDashboard />;
};

export default Admin;
