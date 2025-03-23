
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import Messages from '@/pages/Messages';
import Discovery from '@/pages/Discovery';
import UserProfile from '@/pages/UserProfile';
import ViewedMe from '@/pages/ViewedMe';
import LikedMe from '@/pages/LikedMe';
import MyProfile from '@/pages/MyProfile';
import Landing from '@/pages/Landing';
import ProfilePage from '@/pages/ProfilePage';
import Admin from '@/pages/Admin';
import Auth from '@/pages/Auth';
import SuperAdmin from '@/pages/SuperAdmin';
import './App.css';
import BottomNavigation from './components/BottomNavigation';
import UserMenu from './components/UserMenu';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Regular user route protection
const ProtectedRoute = () => {
  const { user, loading } = useSupabaseAuth();
  const location = useLocation();
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);
  
  useEffect(() => {
    const checkSuperAdminStatus = async () => {
      if (!user) {
        setIsSuperAdmin(false);
        setCheckingRole(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'super_admin');
        
        if (error) throw error;
        
        setIsSuperAdmin(data && data.length > 0);
      } catch (err) {
        console.error('Error checking admin status:', err);
        setIsSuperAdmin(false);
      } finally {
        setCheckingRole(false);
      }
    };
    
    if (!loading) {
      checkSuperAdminStatus();
    }
  }, [user, loading]);
  
  if (loading || checkingRole) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // Redirect super admins to their dashboard
  if (isSuperAdmin) {
    return <Navigate to="/super-admin" replace />;
  }
  
  return <Outlet />;
};

// Super admin route protection
const SuperAdminRoute = () => {
  const { user, loading } = useSupabaseAuth();
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsSuperAdmin(false);
        setShouldRedirect(true);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'super_admin');
        
        if (error) throw error;
        
        const isAdmin = data && data.length > 0;
        setIsSuperAdmin(isAdmin);
        
        if (!isAdmin) {
          setShouldRedirect(true);
          toast({
            title: 'Access Denied',
            description: 'You do not have permission to access this area',
            variant: 'destructive'
          });
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
        setIsSuperAdmin(false);
        setShouldRedirect(true);
        toast({
          title: 'Error',
          description: 'Could not verify admin permissions',
          variant: 'destructive'
        });
      }
    };
    
    if (!loading) {
      checkAdminStatus();
    }
  }, [user, loading, toast]);
  
  if (loading || isSuperAdmin === null) {
    return <div className="flex h-screen items-center justify-center">Verifying permissions...</div>;
  }
  
  if (shouldRedirect) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

const PublicOnlyRoute = () => {
  const { user, loading } = useSupabaseAuth();
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsSuperAdmin(false);
        setCheckingRole(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'super_admin');
        
        if (error) throw error;
        
        setIsSuperAdmin(data && data.length > 0);
      } catch (err) {
        console.error('Error checking admin status:', err);
        setIsSuperAdmin(false);
      } finally {
        setCheckingRole(false);
      }
    };
    
    if (!loading) {
      checkAdminStatus();
    }
  }, [user, loading]);
  
  if (loading || checkingRole) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (user) {
    if (isSuperAdmin) {
      return <Navigate to="/super-admin" replace />;
    }
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

function App() {
  const { user } = useSupabaseAuth();
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);
  
  useEffect(() => {
    const checkSuperAdminStatus = async () => {
      if (!user) {
        setIsSuperAdmin(false);
        setCheckingRole(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'super_admin');
        
        if (error) throw error;
        
        setIsSuperAdmin(data && data.length > 0);
      } catch (err) {
        console.error('Error checking admin status:', err);
        setIsSuperAdmin(false);
      } finally {
        setCheckingRole(false);
      }
    };
    
    if (user) {
      checkSuperAdminStatus();
    } else {
      setIsSuperAdmin(false);
      setCheckingRole(false);
    }
  }, [user]);
  
  // Don't show bottom navigation for super admins
  const showBottomNav = user && !isSuperAdmin && !checkingRole;
  // Only show user menu to regular users, not super admins
  const showUserMenu = user && !isSuperAdmin && !checkingRole;
  
  return (
    <Router>
      {showUserMenu && (
        <div className="fixed top-4 right-4 z-50">
          <UserMenu />
        </div>
      )}
      
      <Routes>
        <Route path="/landing" element={<Landing />} />
        
        <Route element={<PublicOnlyRoute />}>
          <Route path="/auth" element={<Auth />} />
        </Route>
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Index />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/discovery" element={<Discovery />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/viewed-me" element={<ViewedMe />} />
          <Route path="/liked-me" element={<LikedMe />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/admin/*" element={<Admin />} />
        </Route>
        
        <Route element={<SuperAdminRoute />}>
          <Route path="/super-admin/*" element={<SuperAdmin />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {showBottomNav && <BottomNavigation />}
      <Toaster />
    </Router>
  );
}

export default App;
