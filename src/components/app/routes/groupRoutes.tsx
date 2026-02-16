import React, { Suspense, lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import SharedPageLoader from '@/components/app/SharedPageLoader';

const Groups = lazy(() => import('@/pages/Groups'));
const CreateGroup = lazy(() => import('@/pages/CreateGroup'));
const GroupDetailPage = lazy(() => import('@/pages/GroupDetail'));
const CreateStory = lazy(() => import('@/pages/CreateStory'));
const StoriesView = lazy(() => import('@/pages/StoriesView'));

const P: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

const L: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<SharedPageLoader />}>{children}</Suspense>
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
