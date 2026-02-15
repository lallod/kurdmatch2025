import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import ErrorBoundary from '@/components/ErrorBoundary';
import { CompleteProfile } from '@/pages/CompleteProfile';
import Swipe from '@/pages/Swipe';
import DiscoveryNearby from '@/pages/DiscoveryNearby';
import DiscoveryFeed from '@/pages/DiscoveryFeed';
import CreatePost from '@/pages/CreatePost';
import CreateEvent from '@/pages/CreateEvent';
import EventDetail from '@/pages/EventDetail';
import PostDetail from '@/pages/PostDetail';
import LikedMe from '@/pages/LikedMe';
import ViewedMe from '@/pages/ViewedMe';
import Messages from '@/pages/Messages';
import MyProfile from '@/pages/MyProfile';

import InstagramProfile from '@/pages/InstagramProfile';
import Profile from '@/pages/Profile';
import Subscription from '@/pages/Subscription';
import Verification from '@/pages/Verification';
import { HashtagFeed } from '@/pages/HashtagFeed';
import CompatibilityInsights from '@/pages/CompatibilityInsights';
import AdvancedSearch from '@/pages/AdvancedSearch';
import SavedPosts from '@/pages/SavedPosts';
import Matches from '@/pages/Matches';
import Events from '@/pages/Events';
import Notifications from '@/pages/Notifications';

const P: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

export const protectedRoutes = (
  <>
    <Route path="/complete-profile" element={<P><CompleteProfile /></P>} />
    <Route path="/swipe" element={<P><ErrorBoundary><Swipe /></ErrorBoundary></P>} />
    <Route path="/discovery" element={<P><ErrorBoundary><DiscoveryFeed /></ErrorBoundary></P>} />
    <Route path="/discovery-nearby" element={<P><ErrorBoundary><DiscoveryNearby /></ErrorBoundary></P>} />
    <Route path="/create-post" element={<P><CreatePost /></P>} />
    <Route path="/search" element={<P><AdvancedSearch /></P>} />
    <Route path="/saved" element={<P><SavedPosts /></P>} />
    <Route path="/create-event" element={<P><CreateEvent /></P>} />
    <Route path="/event/:id" element={<P><EventDetail /></P>} />
    <Route path="/post/:id" element={<P><PostDetail /></P>} />
    <Route path="/liked-me" element={<P><LikedMe /></P>} />
    <Route path="/viewed-me" element={<P><ViewedMe /></P>} />
    <Route path="/messages" element={<P><ErrorBoundary><Messages /></ErrorBoundary></P>} />
    <Route path="/my-profile" element={<P><ErrorBoundary><MyProfile /></ErrorBoundary></P>} />
    
    <Route path="/profile/:id" element={<P><ErrorBoundary><InstagramProfile /></ErrorBoundary></P>} />
    <Route path="/profile" element={<P><ErrorBoundary><Profile /></ErrorBoundary></P>} />
    <Route path="/subscription" element={<P><Subscription /></P>} />
    <Route path="/verification" element={<P><Verification /></P>} />
    <Route path="/hashtag/:hashtag" element={<P><HashtagFeed /></P>} />
    <Route path="/compatibility/:userId" element={<P><CompatibilityInsights /></P>} />
    <Route path="/matches" element={<P><Matches /></P>} />
    <Route path="/events" element={<P><Events /></P>} />
    <Route path="/notifications" element={<P><Notifications /></P>} />
  </>
);
