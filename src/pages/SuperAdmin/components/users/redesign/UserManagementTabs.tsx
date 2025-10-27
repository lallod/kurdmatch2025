
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
          <h1 className="text-2xl md:text-3xl font-bold text-white">Advanced User Management</h1>
          <p className="text-white/60 mt-1 text-sm md:text-base">Comprehensive user profile management and analytics</p>
        </div>
      </div>

      <Tabs defaultValue="profiles" className="space-y-6">
        <TabsList className="w-full grid grid-cols-3 md:grid-cols-6 gap-1 h-auto bg-white/5 p-1">
          <TabsTrigger value="profiles" className="flex items-center gap-2 text-xs md:text-sm whitespace-nowrap data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500/20 data-[state=active]:to-orange-500/20 data-[state=active]:text-red-500 text-white/80">
            <Users size={16} className="hidden md:inline" />
            <span className="md:hidden">Users</span>
            <span className="hidden md:inline">User Profiles</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2 text-xs md:text-sm whitespace-nowrap data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500/20 data-[state=active]:to-orange-500/20 data-[state=active]:text-red-500 text-white/80">
            <BarChart size={16} className="hidden md:inline" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center gap-2 text-xs md:text-sm whitespace-nowrap data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500/20 data-[state=active]:to-orange-500/20 data-[state=active]:text-red-500 text-white/80">
            <Settings size={16} className="hidden md:inline" />
            <span>Bulk</span>
            <span className="hidden md:inline">Actions</span>
          </TabsTrigger>
          <TabsTrigger value="moderation" className="flex items-center gap-2 text-xs md:text-sm whitespace-nowrap data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500/20 data-[state=active]:to-orange-500/20 data-[state=active]:text-red-500 text-white/80">
            <Shield size={16} className="hidden md:inline" />
            <span>Moderation</span>
          </TabsTrigger>
          <TabsTrigger value="journey" className="flex items-center gap-2 text-xs md:text-sm whitespace-nowrap data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500/20 data-[state=active]:to-orange-500/20 data-[state=active]:text-red-500 text-white/80">
            <Search size={16} className="hidden md:inline" />
            <span>Journey</span>
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2 text-xs md:text-sm whitespace-nowrap data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500/20 data-[state=active]:to-orange-500/20 data-[state=active]:text-red-500 text-white/80">
            <FileText size={16} className="hidden md:inline" />
            <span>Export</span>
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
