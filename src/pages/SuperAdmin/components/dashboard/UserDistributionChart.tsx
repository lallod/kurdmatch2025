
import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const UserDistributionChart = () => {
  const [loading, setLoading] = useState(true);
  const [userRoleData, setUserRoleData] = useState<{ name: string; value: number }[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        setLoading(true);
        
        // Get user roles from the database
        const { data, error } = await supabase
          .from('user_roles')
          .select('role, count')
          .select('role');
        
        if (error) throw error;
        
        // Count the occurrences of each role
        const roleCounts: Record<string, number> = {};
        data.forEach(item => {
          const role = item.role;
          roleCounts[role] = (roleCounts[role] || 0) + 1;
        });
        
        // Transform into the format needed for the chart
        const chartData = Object.entries(roleCounts).map(([name, value]) => ({
          name: name === 'user' ? 'Free Users' : 
                name === 'premium' ? 'Premium' :
                name === 'moderator' ? 'Moderators' :
                name === 'admin' || name === 'super_admin' ? 'Admins' : name,
          value
        }));
        
        setUserRoleData(chartData);
      } catch (error) {
        console.error('Error fetching user distribution data:', error);
        toast({
          title: 'Error loading data',
          description: 'Could not load user distribution data',
          variant: 'destructive',
        });
        
        // Fallback to sample data
        setUserRoleData([
          { name: 'Free Users', value: 8543 },
          { name: 'Premium', value: 2789 },
          { name: 'Moderators', value: 113 },
          { name: 'Admins', value: 12 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserRoles();
  }, [toast]);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Distribution</CardTitle>
          <CardDescription>Breakdown of user types</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded-md"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Distribution</CardTitle>
        <CardDescription>Breakdown of user types</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={userRoleData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {userRoleData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default UserDistributionChart;
