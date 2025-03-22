
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserActivityChart from './UserActivityChart';
import EngagementChart from './EngagementChart';
import UserDistributionChart from './UserDistributionChart';

const ActivityTabs = () => {
  return (
    <Tabs defaultValue="users" className="w-full">
      <TabsList className="grid grid-cols-3 w-[400px] mb-4">
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
