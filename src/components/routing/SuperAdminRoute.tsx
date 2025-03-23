
import { Navigate, Outlet } from 'react-router-dom';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useToast } from '@/hooks/use-toast';
import { useRoleCheck } from '@/hooks/useRoleCheck';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const SuperAdminRoute = () => {
  const { user, loading } = useSupabaseAuth();
  const { hasRole, isChecking } = useRoleCheck(user?.id, 'super_admin');
  const { toast } = useToast();
  
  // Show loading state while checking authentication or roles
  if (loading || isChecking) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="text-center">
          <LoadingSpinner className="mx-auto mb-4" size="large" />
          <p className="text-gray-300">Verifying super admin permissions...</p>
        </div>
      </div>
    );
  }
  
  // Redirect non-admin users
  if (!hasRole) {
    // Show toast only if we have a user but no admin permission
    if (user && !loading && !isChecking) {
      toast({
        title: 'Access Denied',
        description: 'You do not have super admin permissions',
        variant: 'destructive'
      });
    }
    
    return <Navigate to="/auth" replace />;
  }
  
  // Allow access if user has super admin role
  return <Outlet />;
};

export default SuperAdminRoute;
