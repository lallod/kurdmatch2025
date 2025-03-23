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
import { setupSupabase } from '@/utils/setupSupabase';
import SuperAdminLogin from './components/auth/SuperAdminLogin';

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
  
  if (isSuperAdmin) {
    return <Navigate to="/super-admin" replace />;
  }
  
  return <Outlet />;
};

const SuperAdminRoute = () => {
  const { user, loading } = useSupabaseAuth();
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);
  const location = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsSuperAdmin(false);
        setCheckingRole(false);
        return;
      }
      
      try {
        console.log("Checking super admin status for user:", user.id);
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'super_admin');
        
        if (error) throw error;
        
        const isAdmin = data && data.length > 0;
        console.log("Is admin result:", isAdmin, data);
        setIsSuperAdmin(isAdmin);
        
        if (!isAdmin) {
          setCheckingRole(false);
          toast({
            title: 'Access Denied',
            description: 'You do not have permission to access this area',
            variant: 'destructive'
          });
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
        setIsSuperAdmin(false);
        toast({
          title: 'Error',
          description: 'Could not verify admin permissions',
          variant: 'destructive'
        });
      } finally {
        setCheckingRole(false);
      }
    };
    
    if (!loading) {
      checkAdminStatus();
    }
  }, [user, loading, toast]);
  
  if (loading || checkingRole) {
    return <div className="flex h-screen items-center justify-center">Verifying permissions...</div>;
  }
  
  if (!isSuperAdmin) {
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
    return <Navigate to="/app" replace />;
  }
  
  return <Outlet />;
};

function App() {
  const { user } = useSupabaseAuth();
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await setupSupabase();
        console.log('Supabase setup completed');
      } catch (error) {
        console.error('Error during Supabase setup:', error);
        toast({
          title: 'Setup Error',
          description: 'There was an error setting up the application',
          variant: 'destructive'
        });
      }
    };
    
    initializeApp();
  }, [toast]);
  
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
  
  const showBottomNav = user && !isSuperAdmin && !checkingRole;
  const showUserMenu = user && !isSuperAdmin && !checkingRole;
  
  return (
    <Router>
      {showUserMenu && (
        <div className="fixed top-4 right-4 z-50">
          <UserMenu />
        </div>
      )}
      
      <Routes>
        {/* Make Landing route accessible to anyone without protection */}
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
        
        {/* Add the super admin login route */}
        <Route path="/admin-login" element={<SuperAdminLogin />} />
        
        <Route element={<PublicOnlyRoute />}>
          <Route path="/auth" element={<Auth />} />
        </Route>
        
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<Index />} />
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
