import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import Groups from '@/pages/Groups';
import CreateGroup from '@/pages/CreateGroup';
import GroupDetailPage from '@/pages/GroupDetail';
import CreateStory from '@/pages/CreateStory';
import StoriesView from '@/pages/StoriesView';

const P: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

export const groupRoutes = (
  <>
    <Route path="/groups" element={<P><Groups /></P>} />
    <Route path="/groups/create" element={<P><CreateGroup /></P>} />
    <Route path="/groups/:id" element={<P><GroupDetailPage /></P>} />
    <Route path="/stories/create" element={<P><CreateStory /></P>} />
    <Route path="/stories/:userId" element={<P><StoriesView /></P>} />
  </>
);
