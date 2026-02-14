import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import LandingV2 from '@/pages/LandingV2';
import Auth from '@/pages/Auth';
import Register from '@/pages/Register';
import AuthCallback from '@/components/auth/AuthCallback';
import SuperAdminLogin from '@/components/auth/SuperAdminLogin';
import SuperAdminSetup from '@/components/auth/SuperAdminSetup';
import CreateSuperAdmin from '@/pages/CreateSuperAdmin';
import HelpSupport from '@/pages/HelpSupport';
import CommunityGuidelines from '@/pages/CommunityGuidelines';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import NotFound from '@/pages/NotFound';

export const getPublicRoutes = (user: User | null) => (
  <>
    <Route path="/" element={user ? <Navigate to="/discovery" replace /> : <LandingV2 />} />
    <Route path="/auth" element={user ? <Navigate to="/discovery" replace /> : <Auth />} />
    <Route path="/register" element={user ? <Navigate to="/discovery" replace /> : <Register />} />
    <Route path="/auth/callback" element={<AuthCallback />} />
    <Route path="/admin-login" element={<SuperAdminLogin />} />
    <Route path="/admin-setup" element={<SuperAdminSetup />} />
    <Route path="/create-admin" element={<CreateSuperAdmin />} />
    <Route path="/help" element={<HelpSupport />} />
    <Route path="/community-guidelines" element={<CommunityGuidelines />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/terms" element={<TermsOfService />} />
    <Route path="*" element={<NotFound />} />
  </>
);
