
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SuperAdminLayout from './SuperAdminLayout';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/UsersPage';
import CategoriesPage from './pages/CategoriesPage';
import MessagesPage from './pages/MessagesPage';
import PhotosPage from './pages/PhotosPage';
import SettingsPage from './pages/SettingsPage';
import RegistrationQuestionsPage from './pages/RegistrationQuestionsPage';
import VerificationPage from './pages/VerificationPage';
import ModerationPage from './pages/ModerationPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ABTestingPage from './pages/ABTestingPage';
import SystemHealthPage from './pages/SystemHealthPage';
import EmailCampaignsPage from './pages/EmailCampaignsPage';
import ExportsPage from './pages/ExportsPage';
import AuditLogsPage from './pages/AuditLogsPage';
import RolesPage from './pages/RolesPage';
import BulkActionsPage from './pages/BulkActionsPage';
import SubscribersPage from './pages/SubscribersPage';
import PaymentsPage from './pages/PaymentsPage';
import SocialLoginPage from './pages/SocialLoginPage';
import LandingPageEditor from './pages/LandingPageEditor';

const SuperAdmin = () => {
  return (
    <SuperAdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/verification" element={<VerificationPage />} />
        <Route path="/moderation" element={<ModerationPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/ab-testing" element={<ABTestingPage />} />
        <Route path="/system-health" element={<SystemHealthPage />} />
        <Route path="/email-campaigns" element={<EmailCampaignsPage />} />
        <Route path="/exports" element={<ExportsPage />} />
        <Route path="/audit-logs" element={<AuditLogsPage />} />
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/bulk-actions" element={<BulkActionsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/registration-questions" element={<RegistrationQuestionsPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/photos" element={<PhotosPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/subscribers" element={<SubscribersPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/social-login" element={<SocialLoginPage />} />
        <Route path="/landing-page" element={<LandingPageEditor />} />
      </Routes>
    </SuperAdminLayout>
  );
};

export default SuperAdmin;
