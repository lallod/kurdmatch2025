import React, { Suspense, lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import { Loader2 } from 'lucide-react';

const Groups = lazy(() => import('@/pages/Groups'));
const CreateGroup = lazy(() => import('@/pages/CreateGroup'));
const GroupDetailPage = lazy(() => import('@/pages/GroupDetail'));
const CreateStory = lazy(() => import('@/pages/CreateStory'));
const StoriesView = lazy(() => import('@/pages/StoriesView'));

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

export const groupRoutes = (
  <>
    <Route path="/groups" element={<P><L><Groups /></L></P>} />
    <Route path="/groups/create" element={<P><L><CreateGroup /></L></P>} />
    <Route path="/groups/:id" element={<P><L><GroupDetailPage /></L></P>} />
    <Route path="/stories/create" element={<P><L><CreateStory /></L></P>} />
    <Route path="/stories/:userId" element={<P><L><StoriesView /></L></P>} />
  </>
);
