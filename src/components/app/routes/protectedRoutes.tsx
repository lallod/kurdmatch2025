import React, { Suspense, lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Loader2 } from 'lucide-react';

const CompleteProfile = lazy(() => import('@/pages/CompleteProfile').then(m => ({ default: m.CompleteProfile })));
const Swipe = lazy(() => import('@/pages/Swipe'));
const DiscoveryNearby = lazy(() => import('@/pages/DiscoveryNearby'));
const DiscoveryFeed = lazy(() => import('@/pages/DiscoveryFeed'));
const CreatePost = lazy(() => import('@/pages/CreatePost'));
const CreateEvent = lazy(() => import('@/pages/CreateEvent'));
const EventDetail = lazy(() => import('@/pages/EventDetail'));
const PostDetail = lazy(() => import('@/pages/PostDetail'));
const LikedMe = lazy(() => import('@/pages/LikedMe'));
const ViewedMe = lazy(() => import('@/pages/ViewedMe'));
const Messages = lazy(() => import('@/pages/Messages'));
const MyProfile = lazy(() => import('@/pages/MyProfile'));
const InstagramProfile = lazy(() => import('@/pages/InstagramProfile'));
const Profile = lazy(() => import('@/pages/Profile'));
const Subscription = lazy(() => import('@/pages/Subscription'));
const Verification = lazy(() => import('@/pages/Verification'));
const HashtagFeed = lazy(() => import('@/pages/HashtagFeed').then(m => ({ default: m.HashtagFeed })));
const CompatibilityInsights = lazy(() => import('@/pages/CompatibilityInsights'));
const AdvancedSearch = lazy(() => import('@/pages/AdvancedSearch'));
const SavedPosts = lazy(() => import('@/pages/SavedPosts'));
const Matches = lazy(() => import('@/pages/Matches'));
const Events = lazy(() => import('@/pages/Events'));
const Notifications = lazy(() => import('@/pages/Notifications'));
const GiftsAndDates = lazy(() => import('@/pages/GiftsAndDates'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const P: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

const L: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

export const protectedRoutes = (
  <>
    <Route path="/complete-profile" element={<P><L><CompleteProfile /></L></P>} />
    <Route path="/swipe" element={<P><L><ErrorBoundary><Swipe /></ErrorBoundary></L></P>} />
    <Route path="/discovery" element={<P><L><ErrorBoundary><DiscoveryFeed /></ErrorBoundary></L></P>} />
    <Route path="/discovery-nearby" element={<P><L><ErrorBoundary><DiscoveryNearby /></ErrorBoundary></L></P>} />
    <Route path="/create-post" element={<P><L><CreatePost /></L></P>} />
    <Route path="/search" element={<P><L><AdvancedSearch /></L></P>} />
    <Route path="/saved" element={<P><L><SavedPosts /></L></P>} />
    <Route path="/create-event" element={<P><L><CreateEvent /></L></P>} />
    <Route path="/event/:id" element={<P><L><EventDetail /></L></P>} />
    <Route path="/post/:id" element={<P><L><PostDetail /></L></P>} />
    <Route path="/liked-me" element={<P><L><LikedMe /></L></P>} />
    <Route path="/viewed-me" element={<P><L><ViewedMe /></L></P>} />
    <Route path="/messages" element={<P><L><ErrorBoundary><Messages /></ErrorBoundary></L></P>} />
    <Route path="/my-profile" element={<P><L><ErrorBoundary><MyProfile /></ErrorBoundary></L></P>} />
    <Route path="/profile/:id" element={<P><L><ErrorBoundary><InstagramProfile /></ErrorBoundary></L></P>} />
    <Route path="/profile" element={<P><L><ErrorBoundary><Profile /></ErrorBoundary></L></P>} />
    <Route path="/subscription" element={<P><L><Subscription /></L></P>} />
    <Route path="/verification" element={<P><L><Verification /></L></P>} />
    <Route path="/hashtag/:hashtag" element={<P><L><HashtagFeed /></L></P>} />
    <Route path="/compatibility/:userId" element={<P><L><CompatibilityInsights /></L></P>} />
    <Route path="/matches" element={<P><L><Matches /></L></P>} />
    <Route path="/events" element={<P><L><Events /></L></P>} />
    <Route path="/notifications" element={<P><L><Notifications /></L></P>} />
    <Route path="/gifts" element={<P><L><ErrorBoundary><GiftsAndDates /></ErrorBoundary></L></P>} />
  </>
);
