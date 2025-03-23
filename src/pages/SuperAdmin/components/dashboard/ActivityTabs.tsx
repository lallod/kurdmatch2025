
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserActivityChart from './UserActivityChart';
import EngagementChart from './EngagementChart';
import UserDistributionChart from './UserDistributionChart';
import { EngagementData } from '@/api/dashboard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ActivityTabs = () => {
  const [engagementData, setEngagementData] = useState<EngagementData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadEngagementData = async () => {
      try {
        setLoading(true);
        
        // Fetch engagement data from the database
        const { data, error } = await supabase
          .from('user_engagement')
          .select('*')
          .order('date', { ascending: true });
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
          setEngagementData([]);
          toast({
            title: 'No engagement data',
            description: 'There is no user engagement data available in the database.',
            variant: 'default',
          });
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
        toast({
          title: 'Error loading engagement data',
          description: 'Could not load user engagement data. Please try again.',
          variant: 'destructive',
        });
        setEngagementData([]);
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
