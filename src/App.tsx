
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
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ProtectedRoute = () => {
  const { user, loading } = useSupabaseAuth();
  const location = useLocation();
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  return <Outlet />;
};

const SuperAdminRoute = () => {
  const { user, loading } = useSupabaseAuth();
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null);
  const location = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
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
        toast({
          title: 'Error',
          description: 'Could not verify admin permissions',
          variant: 'destructive'
        });
      }
    };
    
    if (user) {
      checkAdminStatus();
    } else {
      setIsSuperAdmin(false);
    }
  }, [user]);
  
  if (loading || isSuperAdmin === null) {
    return <div className="flex h-screen items-center justify-center">Verifying permissions...</div>;
  }
  
  if (!user || !isSuperAdmin) {
    toast({
      title: 'Access Denied',
      description: 'You do not have permission to access this area',
      variant: 'destructive'
    });
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

const PublicOnlyRoute = () => {
  const { user, loading } = useSupabaseAuth();
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

function App() {
  return (
    <Router>
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
      
      <BottomNavigation />
      <Toaster />
    </Router>
  );
}

export default App;
