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
import NotificationSettings from '@/pages/NotificationSettings';
import AdvancedSearch from '@/pages/AdvancedSearch';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UserManagement from '@/pages/admin/UserManagement';
import ReportsManagement from '@/pages/admin/ReportsManagement';
import ContentModeration from '@/pages/admin/ContentModeration';
import PlatformAnalytics from '@/pages/admin/PlatformAnalytics';
import SystemSettings from '@/pages/admin/SystemSettings';
import SavedPosts from '@/pages/SavedPosts';
import BlockedUsers from '@/pages/BlockedUsers';
import PrivacySettings from '@/pages/PrivacySettings';
import Groups from '@/pages/Groups';
import CreateGroup from '@/pages/CreateGroup';
import GroupDetailPage from '@/pages/GroupDetail';
import CreateStory from '@/pages/CreateStory';
import StoriesView from '@/pages/StoriesView';
import Notifications from '@/pages/Notifications';
import Settings from '@/pages/Settings';

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
        path="/search" 
        element={<ProtectedRoute><AdvancedSearch /></ProtectedRoute>} 
      />
      <Route 
        path="/saved" 
        element={<ProtectedRoute><SavedPosts /></ProtectedRoute>} 
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
        element={<ProtectedRoute><Groups /></ProtectedRoute>} 
      />
      <Route 
        path="/groups/create" 
        element={<ProtectedRoute><CreateGroup /></ProtectedRoute>} 
      />
      <Route 
        path="/groups/:id" 
        element={<ProtectedRoute><GroupDetailPage /></ProtectedRoute>} 
      />
      <Route 
        path="/stories/create" 
        element={<ProtectedRoute><CreateStory /></ProtectedRoute>} 
      />
      <Route 
        path="/stories/:userId" 
        element={<ProtectedRoute><StoriesView /></ProtectedRoute>} 
      />
      <Route 
        path="/notifications" 
        element={<ProtectedRoute><Notifications /></ProtectedRoute>} 
      />
      <Route 
        path="/notifications/settings" 
        element={<ProtectedRoute><NotificationSettings /></ProtectedRoute>} 
      />
      <Route 
        path="/settings/privacy" 
        element={<ProtectedRoute><PrivacySettings /></ProtectedRoute>} 
      />
      <Route 
        path="/settings/blocked" 
        element={<ProtectedRoute><BlockedUsers /></ProtectedRoute>} 
      />
      <Route 
        path="/settings" 
        element={<ProtectedRoute><Settings /></ProtectedRoute>} 
      />
      
      {/* Admin Dashboard routes */}
      <Route 
        path="/admin/dashboard" 
        element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} 
      />
      <Route 
        path="/admin/users" 
        element={<ProtectedRoute><UserManagement /></ProtectedRoute>} 
      />
      <Route 
        path="/admin/reports" 
        element={<ProtectedRoute><ReportsManagement /></ProtectedRoute>} 
      />
      <Route 
        path="/admin/content" 
        element={<ProtectedRoute><ContentModeration /></ProtectedRoute>} 
      />
      <Route 
        path="/admin/analytics" 
        element={<ProtectedRoute><PlatformAnalytics /></ProtectedRoute>} 
      />
      <Route 
        path="/admin/settings" 
        element={<ProtectedRoute><SystemSettings /></ProtectedRoute>} 
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
