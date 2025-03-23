
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserActivityChart from './UserActivityChart';
import EngagementChart from './EngagementChart';
import UserDistributionChart from './UserDistributionChart';
import { fetchEngagementData, EngagementData } from '@/api/dashboard';
import { useToast } from '@/hooks/use-toast';

const ActivityTabs = () => {
  const [engagementData, setEngagementData] = useState<EngagementData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadEngagementData = async () => {
      try {
        setLoading(true);
        const data = await fetchEngagementData();
        setEngagementData(data);
      } catch (error) {
        console.error('Failed to load engagement data:', error);
        toast({
          title: 'Error loading engagement data',
          description: 'Could not load user engagement data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadEngagementData();
  }, [toast]);

  return (
    <Tabs defaultValue="users" className="w-full">
      <TabsList className="w-full sm:w-auto mb-4 grid grid-cols-3 sm:inline-flex">
        <TabsTrigger value="users">User Activity</TabsTrigger>
        <TabsTrigger value="engagement">Engagement</TabsTrigger>
        <TabsTrigger value="distribution">Distribution</TabsTrigger>
      </TabsList>

      <TabsContent value="users" className="grid grid-cols-1 gap-6">
        <UserActivityChart data={engagementData} loading={loading} />
      </TabsContent>

      <TabsContent value="engagement">
        <EngagementChart data={engagementData} loading={loading} />
      </TabsContent>

      <TabsContent value="distribution">
        <UserDistributionChart />
      </TabsContent>
    </Tabs>
  );
};

export default ActivityTabs;
