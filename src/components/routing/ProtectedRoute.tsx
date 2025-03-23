
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useRoleCheck } from '@/hooks/useRoleCheck';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const ProtectedRoute = () => {
  const { user, loading } = useSupabaseAuth();
  const location = useLocation();
  const { hasRole, isChecking } = useRoleCheck(user?.id, 'super_admin');
  
  if (loading || isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner className="mr-2" />
        <span>Loading...</span>
      </div>
    );
  }
  
  // Redirect to auth if not logged in
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // Redirect super admins to their dedicated area
  if (hasRole) {
    return <Navigate to="/super-admin" replace />;
  }
  
  // Allow access to regular protected routes
  return <Outlet />;
};

export default ProtectedRoute;
