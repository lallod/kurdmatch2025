
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { RegisterProtection } from './RegisterProtection';
import Index from '@/pages/Index';
import Landing from '@/pages/Landing';
import Auth from '@/pages/Auth';
import Register from '@/pages/Register';
import Swipe from '@/pages/Swipe';
import Discovery from '@/pages/Discovery';
import LikedMe from '@/pages/LikedMe';
import ViewedMe from '@/pages/ViewedMe';
import Messages from '@/pages/Messages';
import MyProfile from '@/pages/MyProfile';
import UserProfile from '@/pages/UserProfile';
import ProfilePage from '@/pages/ProfilePage';
import Admin from '@/pages/Admin';
import SuperAdmin from '@/pages/SuperAdmin';
import SuperAdminLogin from '@/components/auth/SuperAdminLogin';
import SuperAdminSetup from '@/components/auth/SuperAdminSetup';
import AuthCallback from '@/components/auth/AuthCallback';
import NotFound from '@/pages/NotFound';

interface AppRoutesProps {
  showWizard: boolean;
  isOAuthFlow: boolean;
}

export const AppRoutes: React.FC<AppRoutesProps> = ({ showWizard, isOAuthFlow }) => {
  const { user, loading } = useSupabaseAuth();

  // Main app routes - only show if wizard is not active or during OAuth flow
  if (user && showWizard && !isOAuthFlow) {
    return null;
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={user ? <Navigate to="/swipe" replace /> : <Landing />} 
      />
      <Route 
        path="/auth" 
        element={user ? <Navigate to="/swipe" replace /> : <Auth />} 
      />
      <Route 
        path="/register" 
        element={
          <RegisterProtection>
            <Register />
          </RegisterProtection>
        } 
      />
      
      {/* OAuth Callback Route */}
      <Route 
        path="/auth/callback" 
        element={<AuthCallback />} 
      />
      
      {/* Super Admin Login Route - accessible without authentication */}
      <Route 
        path="/admin-login" 
        element={<SuperAdminLogin />} 
      />
      
      {/* Super Admin Setup Route */}
      <Route 
        path="/admin-setup" 
        element={<SuperAdminSetup />} 
      />
      
      {/* Protected routes */}
      <Route 
        path="/swipe" 
        element={user ? <Swipe /> : <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/discovery" 
        element={user ? <Discovery /> : <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/liked-me" 
        element={user ? <LikedMe /> : <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/viewed-me" 
        element={user ? <ViewedMe /> : <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/messages" 
        element={user ? <Messages /> : <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/my-profile" 
        element={user ? <MyProfile /> : <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/user/:id" 
        element={user ? <UserProfile /> : <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/profile/:id" 
        element={user ? <ProfilePage /> : <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/admin" 
        element={user ? <Admin /> : <Navigate to="/auth" replace />} 
      />
      
      {/* Super Admin routes with stable loading state */}
      <Route 
        path="/super-admin/*" 
        element={
          loading ? (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Verifying admin access...</p>
              </div>
            </div>
          ) : (
            <SuperAdmin />
          )
        } 
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
