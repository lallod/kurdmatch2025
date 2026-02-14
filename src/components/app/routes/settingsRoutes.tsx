import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import Settings from '@/pages/Settings';
import NotificationSettings from '@/pages/NotificationSettings';
import PrivacySettings from '@/pages/PrivacySettings';
import BlockedUsers from '@/pages/BlockedUsers';
import PhoneVerification from '@/pages/PhoneVerification';
import RelationshipSettings from '@/pages/RelationshipSettings';

const P: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

export const settingsRoutes = (
  <>
    <Route path="/settings" element={<P><Settings /></P>} />
    <Route path="/settings/privacy" element={<P><PrivacySettings /></P>} />
    <Route path="/settings/blocked" element={<P><BlockedUsers /></P>} />
    <Route path="/settings/phone-verification" element={<P><PhoneVerification /></P>} />
    <Route path="/settings/relationship" element={<P><RelationshipSettings /></P>} />
    <Route path="/notifications/settings" element={<P><NotificationSettings /></P>} />
  </>
);
