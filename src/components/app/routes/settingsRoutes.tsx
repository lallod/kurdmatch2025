import React, { Suspense, lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import { Loader2 } from 'lucide-react';

const Settings = lazy(() => import('@/pages/Settings'));
const NotificationSettings = lazy(() => import('@/pages/NotificationSettings'));
const PrivacySettings = lazy(() => import('@/pages/PrivacySettings'));
const BlockedUsers = lazy(() => import('@/pages/BlockedUsers'));
const PhoneVerification = lazy(() => import('@/pages/PhoneVerification'));
const RelationshipSettings = lazy(() => import('@/pages/RelationshipSettings'));

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

export const settingsRoutes = (
  <>
    <Route path="/settings" element={<P><L><Settings /></L></P>} />
    <Route path="/settings/privacy" element={<P><L><PrivacySettings /></L></P>} />
    <Route path="/settings/blocked" element={<P><L><BlockedUsers /></L></P>} />
    <Route path="/settings/phone-verification" element={<P><L><PhoneVerification /></L></P>} />
    <Route path="/settings/relationship" element={<P><L><RelationshipSettings /></L></P>} />
    <Route path="/notifications/settings" element={<P><L><NotificationSettings /></L></P>} />
  </>
);
