import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useMockAuth } from '@/integrations/supabase/mockAuth';
import { RegisterProtection } from './RegisterProtection';
import EmailVerificationGuard from './EmailVerificationGuard';
import Landing from '@/pages/Landing';
import ProfileSelector from '@/pages/ProfileSelector';
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
  const { currentProfile, loading } = useMockAuth();

  // Main app routes - only show if wizard is not active or during OAuth flow
  if (currentProfile && showWizard && !isOAuthFlow) {
    return null;
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={currentProfile ? <Navigate to="/discovery" replace /> : <Landing />} 
      />
      <Route 
        path="/profile-selector" 
        element={currentProfile ? <Navigate to="/discovery" replace /> : <ProfileSelector />} 
      />
      <Route 
        path="/auth" 
        element={<Navigate to="/profile-selector" replace />} 
      />
      <Route 
        path="/register" 
        element={<Navigate to="/profile-selector" replace />} 
      />
      
      {/* OAuth Callback Route */}
      <Route 
        path="/auth/callback" 
        element={<AuthCallback />} 
      />
      
      {/* Profile Completion Route */}
      <Route 
        path="/complete-profile" 
        element={currentProfile ? <CompleteProfile /> : <Navigate to="/profile-selector" replace />} 
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
      
      {/* Protected routes - no email verification needed for mock auth */}
      <Route 
        path="/swipe" 
        element={currentProfile ? <Swipe /> : <Navigate to="/profile-selector" replace />} 
      />
      <Route 
        path="/discovery" 
        element={currentProfile ? <DiscoveryFeed /> : <Navigate to="/profile-selector" replace />} 
      />
      <Route 
        path="/discovery-old" 
        element={currentProfile ? <Discovery /> : <Navigate to="/profile-selector" replace />} 
      />
      <Route 
        path="/discovery-nearby" 
        element={currentProfile ? <DiscoveryNearby /> : <Navigate to="/profile-selector" replace />} 
      />
      <Route 
        path="/create-post" 
        element={currentProfile ? <CreatePost /> : <Navigate to="/profile-selector" replace />} 
      />
      <Route 
        path="/create-event" 
        element={currentProfile ? <CreateEvent /> : <Navigate to="/profile-selector" replace />} 
      />
      <Route 
        path="/event/:id" 
        element={currentProfile ? <EventDetail /> : <Navigate to="/profile-selector" replace />} 
      />
      <Route
        path="/liked-me"
        element={currentProfile ? <LikedMe /> : <Navigate to="/profile-selector" replace />} 
      />
      <Route 
        path="/viewed-me" 
        element={currentProfile ? <ViewedMe /> : <Navigate to="/profile-selector" replace />} 
      />
      <Route 
        path="/messages" 
        element={currentProfile ? <Messages /> : <Navigate to="/profile-selector" replace />} 
      />
      <Route 
        path="/my-profile" 
        element={currentProfile ? <MyProfile /> : <Navigate to="/profile-selector" replace />} 
      />
      <Route 
        path="/user/:id" 
        element={currentProfile ? <UserProfile /> : <Navigate to="/profile-selector" replace />} 
      />
      <Route 
        path="/profile/:id" 
        element={currentProfile ? <InstagramProfile /> : <Navigate to="/profile-selector" replace />} 
      />
      <Route 
        path="/profile" 
        element={currentProfile ? <Profile /> : <Navigate to="/profile-selector" replace />} 
      />
      <Route 
        path="/admin" 
        element={currentProfile ? <Admin /> : <Navigate to="/profile-selector" replace />} 
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
