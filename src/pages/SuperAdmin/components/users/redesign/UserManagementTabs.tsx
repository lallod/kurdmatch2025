
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, BarChart, Settings, FileText, Search, Shield } from 'lucide-react';
import UserProfileTab from './tabs/UserProfileTab';
import AnalyticsTab from './tabs/AnalyticsTab';
import BulkActionsTab from './tabs/BulkActionsTab';
import ContentModerationTab from './tabs/ContentModerationTab';
import UserJourneyTab from './tabs/UserJourneyTab';
import ExportTab from './tabs/ExportTab';

const UserManagementTabs: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced User Management</h1>
          <p className="text-gray-600 mt-1">Comprehensive user profile management and analytics</p>
        </div>
      </div>

      <Tabs defaultValue="profiles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profiles" className="flex items-center gap-2">
            <Users size={16} />
            User Profiles
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart size={16} />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center gap-2">
            <Settings size={16} />
            Bulk Actions
          </TabsTrigger>
          <TabsTrigger value="moderation" className="flex items-center gap-2">
            <Shield size={16} />
            Moderation
          </TabsTrigger>
          <TabsTrigger value="journey" className="flex items-center gap-2">
            <Search size={16} />
            User Journey
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2">
            <FileText size={16} />
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profiles">
          <UserProfileTab />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsTab />
        </TabsContent>

        <TabsContent value="bulk">
          <BulkActionsTab />
        </TabsContent>

        <TabsContent value="moderation">
          <ContentModerationTab />
        </TabsContent>

        <TabsContent value="journey">
          <UserJourneyTab />
        </TabsContent>

        <TabsContent value="export">
          <ExportTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagementTabs;
