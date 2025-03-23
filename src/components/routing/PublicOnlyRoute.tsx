
import { Navigate, Outlet } from 'react-router-dom';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useRoleCheck } from '@/hooks/useRoleCheck';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const PublicOnlyRoute = () => {
  const { user, loading } = useSupabaseAuth();
  const { hasRole, isChecking } = useRoleCheck(user?.id, 'super_admin');
  
  if (loading || isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner className="mr-2" />
        <span>Loading...</span>
      </div>
    );
  }
  
  if (user) {
    if (hasRole) {
      return <Navigate to="/super-admin" replace />;
    }
    return <Navigate to="/app" replace />;
  }
  
  return <Outlet />;
};

export default PublicOnlyRoute;
