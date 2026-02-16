import React, { Suspense, lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import SharedPageLoader from '@/components/app/SharedPageLoader';

const LandingV2 = lazy(() => import('@/pages/LandingV2'));
const Auth = lazy(() => import('@/pages/Auth'));
const Register = lazy(() => import('@/pages/Register'));
const AuthCallback = lazy(() => import('@/components/auth/AuthCallback'));
const SuperAdminLogin = lazy(() => import('@/components/auth/SuperAdminLogin'));
const SuperAdminSetup = lazy(() => import('@/components/auth/SuperAdminSetup'));
const CreateSuperAdmin = lazy(() => import('@/pages/CreateSuperAdmin'));
const HelpSupport = lazy(() => import('@/pages/HelpSupport'));
const CommunityGuidelines = lazy(() => import('@/pages/CommunityGuidelines'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('@/pages/TermsOfService'));
const AboutUs = lazy(() => import('@/pages/AboutUs'));
const ContactUs = lazy(() => import('@/pages/ContactUs'));
const CookiePolicy = lazy(() => import('@/pages/CookiePolicy'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const L: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<SharedPageLoader />}>{children}</Suspense>
);

export const getPublicRoutes = (user: User | null) => (
  <>
    <Route path="/" element={user ? <Navigate to="/discovery" replace /> : <L><LandingV2 /></L>} />
    <Route path="/auth" element={user ? <Navigate to="/discovery" replace /> : <L><Auth /></L>} />
    <Route path="/register" element={user ? <Navigate to="/discovery" replace /> : <L><Register /></L>} />
    <Route path="/auth/callback" element={<L><AuthCallback /></L>} />
    <Route path="/admin-login" element={<L><SuperAdminLogin /></L>} />
    <Route path="/admin-setup" element={<L><SuperAdminSetup /></L>} />
    <Route path="/create-admin" element={<L><CreateSuperAdmin /></L>} />
    <Route path="/help" element={<L><HelpSupport /></L>} />
    <Route path="/community-guidelines" element={<L><CommunityGuidelines /></L>} />
    <Route path="/privacy-policy" element={<L><PrivacyPolicy /></L>} />
    <Route path="/terms" element={<L><TermsOfService /></L>} />
    <Route path="/about" element={<L><AboutUs /></L>} />
    <Route path="/contact" element={<L><ContactUs /></L>} />
    <Route path="/cookie-policy" element={<L><CookiePolicy /></L>} />
    <Route path="/reset-password" element={<L><ResetPassword /></L>} />
    <Route path="*" element={<L><NotFound /></L>} />
  </>
);
