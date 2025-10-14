import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Loader2 } from 'lucide-react';
import { RegisterProtection } from './RegisterProtection';
import EmailVerificationGuard from './EmailVerificationGuard';
import LandingV2 from '@/pages/LandingV2';
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
import DataGenerator from '@/pages/DataGenerator';
import SuperAdminLogin from '@/components/auth/SuperAdminLogin';
import SuperAdminSetup from '@/components/auth/SuperAdminSetup';
import AuthCallback from '@/components/auth/AuthCallback';
import NotFound from '@/pages/NotFound';
import { CompleteProfile } from '@/pages/CompleteProfile';
import Subscription from '@/pages/Subscription';
import CreateSuperAdmin from '@/pages/CreateSuperAdmin';
import { HashtagFeed } from '@/pages/HashtagFeed';
import { GroupsList } from '@/pages/GroupsList';
import { GroupDetail } from '@/pages/GroupDetail';
import NotificationSettings from '@/pages/NotificationSettings';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const AppRoutes: React.FC = () => {
  const { user, loading } = useSupabaseAuth();

  const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (!user) {
      return <Navigate to="/auth" replace />;
    }

    return <>{children}</>;
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={user ? <Navigate to="/discovery" replace /> : <LandingV2 />} 
      />
      <Route 
        path="/auth" 
        element={user ? <Navigate to="/discovery" replace /> : <Auth />} 
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to="/discovery" replace /> : <Register />} 
      />
      
      {/* OAuth Callback Route */}
      <Route 
        path="/auth/callback" 
        element={<AuthCallback />} 
      />
      
      {/* Profile Completion Route */}
      <Route 
        path="/complete-profile" 
        element={<ProtectedRoute><CompleteProfile /></ProtectedRoute>} 
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
      
      {/* Create Super Admin Route - public access */}
      <Route 
        path="/create-admin" 
        element={<CreateSuperAdmin />} 
      />
      
      {/* Protected routes */}
      <Route 
        path="/swipe" 
        element={<ProtectedRoute><Swipe /></ProtectedRoute>} 
      />
      <Route 
        path="/discovery" 
        element={<ProtectedRoute><DiscoveryFeed /></ProtectedRoute>} 
      />
      <Route 
        path="/discovery-old" 
        element={<ProtectedRoute><Discovery /></ProtectedRoute>} 
      />
      <Route 
        path="/discovery-nearby" 
        element={<ProtectedRoute><DiscoveryNearby /></ProtectedRoute>} 
      />
      <Route 
        path="/create-post" 
        element={<ProtectedRoute><CreatePost /></ProtectedRoute>} 
      />
      <Route 
        path="/create-event" 
        element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} 
      />
      <Route 
        path="/event/:id" 
        element={<ProtectedRoute><EventDetail /></ProtectedRoute>} 
      />
      <Route
        path="/liked-me"
        element={<ProtectedRoute><LikedMe /></ProtectedRoute>} 
      />
      <Route 
        path="/viewed-me" 
        element={<ProtectedRoute><ViewedMe /></ProtectedRoute>} 
      />
      <Route 
        path="/messages" 
        element={<ProtectedRoute><Messages /></ProtectedRoute>} 
      />
      <Route 
        path="/my-profile" 
        element={<ProtectedRoute><MyProfile /></ProtectedRoute>} 
      />
      <Route 
        path="/user/:id" 
        element={<ProtectedRoute><UserProfile /></ProtectedRoute>} 
      />
      <Route 
        path="/profile/:id" 
        element={<ProtectedRoute><InstagramProfile /></ProtectedRoute>} 
      />
      <Route 
        path="/profile" 
        element={<ProtectedRoute><Profile /></ProtectedRoute>} 
      />
      <Route 
        path="/admin" 
        element={<ProtectedRoute><Admin /></ProtectedRoute>} 
      />
      <Route 
        path="/data-generator" 
        element={<ProtectedRoute><DataGenerator /></ProtectedRoute>} 
      />
      <Route 
        path="/subscription" 
        element={<ProtectedRoute><Subscription /></ProtectedRoute>} 
      />
      <Route 
        path="/hashtag/:hashtag" 
        element={<ProtectedRoute><HashtagFeed /></ProtectedRoute>} 
      />
      <Route 
        path="/groups" 
        element={<ProtectedRoute><GroupsList /></ProtectedRoute>} 
      />
      <Route 
        path="/groups/:id" 
        element={<ProtectedRoute><GroupDetail /></ProtectedRoute>} 
      />
      <Route 
        path="/notifications/settings" 
        element={<ProtectedRoute><NotificationSettings /></ProtectedRoute>} 
      />
      
      {/* Super Admin routes */}
      <Route 
        path="/super-admin/*" 
        element={
          loading ? (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="text-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
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
