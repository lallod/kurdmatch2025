
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserActivityChart from './UserActivityChart';
import EngagementChart from './EngagementChart';
import UserDistributionChart from './UserDistributionChart';
import { EngagementData } from '@/api/dashboard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ActivityTabs = () => {
  const [engagementData, setEngagementData] = useState<EngagementData[]>([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const loadEngagementData = async () => {
      try {
        setLoading(true);
        console.log('Fetching engagement data...');
        
        // Fetch engagement data from the database
        const { data, error } = await supabase
          .from('user_engagement')
          .select('*')
          .order('date', { ascending: true });
        
        if (error) {
          console.error('Error fetching engagement data:', error.message);
          throw error;
        }
        
        console.log('Fetched engagement data:', data);
        
        if (!data || data.length === 0) {
          console.log('No engagement data found in the database');
          setEngagementData([]);
          toast.info('No user engagement data available');
          return;
        }
        
        // Map the data to the expected format
        const formattedData = data.map(item => ({
          date: item.date,
          users: item.users,
          conversations: item.conversations,
          likes: item.likes,
          views: item.views,
          matches: item.matches
        }));
        
        setEngagementData(formattedData);
      } catch (error) {
        console.error('Failed to load engagement data:', error);
        toast.error('Could not load user engagement data');
        setEngagementData([]);
      } finally {
        setLoading(false);
      }
    };

    loadEngagementData();
  }, []);

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
