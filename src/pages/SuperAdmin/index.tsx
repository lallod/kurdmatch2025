
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SuperAdminLayout from './SuperAdminLayout';
import Dashboard from './pages/DashboardNew';
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
import TranslationsPage from './pages/TranslationsPage';
import LikesPage from './pages/LikesPage';
import MatchesManagementPage from './pages/MatchesManagementPage';
import CommentsPage from './pages/CommentsPage';
import GroupsManagementPage from './pages/GroupsManagementPage';
import EventsManagementPage from './pages/EventsManagementPage';
import FollowersPage from './pages/FollowersPage';
import NotificationsPage from './pages/NotificationsPage';
import HashtagsPage from './pages/HashtagsPage';
import BlockedUsersPage from './pages/BlockedUsersPage';
import ConversationsPage from './pages/ConversationsPage';
import RateLimitsPage from './pages/RateLimitsPage';
import DailyUsagePage from './pages/DailyUsagePage';
import AIInsightsPage from './pages/AIInsightsPage';
import InterestsPage from './pages/InterestsPage';
import SupportTicketsPage from './pages/SupportTicketsPage';
import ApiKeysPage from './pages/ApiKeysPage';
import VirtualGiftsPage from './pages/VirtualGiftsPage';

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
        <Route path="/translations" element={<TranslationsPage />} />
        <Route path="/likes" element={<LikesPage />} />
        <Route path="/matches" element={<MatchesManagementPage />} />
        <Route path="/comments" element={<CommentsPage />} />
        <Route path="/groups" element={<GroupsManagementPage />} />
        <Route path="/events" element={<EventsManagementPage />} />
        <Route path="/followers" element={<FollowersPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/hashtags" element={<HashtagsPage />} />
        <Route path="/blocked-users" element={<BlockedUsersPage />} />
        <Route path="/conversations" element={<ConversationsPage />} />
        <Route path="/rate-limits" element={<RateLimitsPage />} />
        <Route path="/daily-usage" element={<DailyUsagePage />} />
        <Route path="/ai-insights" element={<AIInsightsPage />} />
        <Route path="/interests" element={<InterestsPage />} />
        <Route path="/support-tickets" element={<SupportTicketsPage />} />
        <Route path="/api-keys" element={<ApiKeysPage />} />
        <Route path="/virtual-gifts" element={<VirtualGiftsPage />} />
      </Routes>
    </SuperAdminLayout>
  );
};

export default SuperAdmin;
