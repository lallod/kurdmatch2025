
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserActivityChart from './UserActivityChart';
import EngagementChart from './EngagementChart';
import UserDistributionChart from './UserDistributionChart';

const ActivityTabs = () => {
  return (
    <Tabs defaultValue="users" className="w-full">
      <TabsList className="w-full sm:w-auto mb-4 grid grid-cols-3 sm:inline-flex">
        <TabsTrigger value="users">User Activity</TabsTrigger>
        <TabsTrigger value="engagement">Engagement</TabsTrigger>
        <TabsTrigger value="distribution">Distribution</TabsTrigger>
      </TabsList>

      <TabsContent value="users" className="grid grid-cols-1 gap-6">
        <UserActivityChart />
      </TabsContent>

      <TabsContent value="engagement">
        <EngagementChart />
      </TabsContent>

      <TabsContent value="distribution">
        <UserDistributionChart />
      </TabsContent>
    </Tabs>
  );
};

export default ActivityTabs;
