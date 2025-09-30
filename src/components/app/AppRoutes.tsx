import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { RegisterProtection } from './RegisterProtection';
import EmailVerificationGuard from './EmailVerificationGuard';
import Landing from '@/pages/Landing';
import Auth from '@/pages/Auth';
import Register from '@/pages/Register';
import Swipe from '@/pages/Swipe';
import Profile from '@/pages/Profile';
import InstagramProfile from '@/pages/InstagramProfile';
import Discovery from '@/pages/Discovery';
import DiscoveryNearby from '@/pages/DiscoveryNearby';
import DiscoveryFeed from '@/pages/DiscoveryFeed';
import CreatePost from '@/pages/CreatePost';
import CreateEvent from '@/pages/CreateEvent';
import EventDetail from '@/pages/EventDetail';
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
import { CompleteProfile } from '@/pages/CompleteProfile';

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
        element={user ? <Navigate to="/discovery" replace /> : <Landing />} 
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
      
      {/* Profile Completion Route */}
      <Route 
        path="/complete-profile" 
        element={user ? <CompleteProfile /> : <Navigate to="/auth" replace />} 
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
      
      {/* Protected routes - wrapped with email verification */}
      <Route 
        path="/swipe" 
        element={user ? (
          <EmailVerificationGuard>
            <Swipe />
          </EmailVerificationGuard>
        ) : <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/discovery" 
        element={user ? (
          <EmailVerificationGuard>
            <DiscoveryFeed />
          </EmailVerificationGuard>
        ) : <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/discovery-old" 
        element={user ? (
          <EmailVerificationGuard>
            <Discovery />
          </EmailVerificationGuard>
        ) : <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/discovery-nearby" 
        element={user ? (
          <EmailVerificationGuard>
            <DiscoveryNearby />
          </EmailVerificationGuard>
        ) : <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/create-post" 
        element={user ? (
          <EmailVerificationGuard>
            <CreatePost />
          </EmailVerificationGuard>
        ) : <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/create-event" 
        element={user ? (
          <EmailVerificationGuard>
            <CreateEvent />
          </EmailVerificationGuard>
        ) : <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/event/:id" 
        element={user ? (
          <EmailVerificationGuard>
            <EventDetail />
          </EmailVerificationGuard>
        ) : <Navigate to="/auth" replace />} 
      />
      <Route
        path="/liked-me"
        element={user ? (
          <EmailVerificationGuard>
            <LikedMe />
          </EmailVerificationGuard>
        ) : <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/viewed-me" 
        element={user ? (
          <EmailVerificationGuard>
            <ViewedMe />
          </EmailVerificationGuard>
        ) : <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/messages" 
        element={user ? (
          <EmailVerificationGuard>
            <Messages />
          </EmailVerificationGuard>
        ) : <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/my-profile" 
        element={user ? (
          <EmailVerificationGuard>
            <MyProfile />
          </EmailVerificationGuard>
        ) : <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/user/:id" 
        element={user ? <UserProfile /> : <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/profile/:id" 
        element={user ? <InstagramProfile /> : <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/profile" 
        element={user ? (
          <EmailVerificationGuard>
            <Profile />
          </EmailVerificationGuard>
        ) : <Navigate to="/auth" replace />} 
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
