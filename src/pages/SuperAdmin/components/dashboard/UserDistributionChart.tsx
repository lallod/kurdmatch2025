
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
          .select('role');
        
        if (error) throw error;
        
        // Count the occurrences of each role
        const roleCounts: Record<string, number> = {};
        
        if (data && data.length > 0) {
          data.forEach(item => {
            const role = item.role;
            roleCounts[role] = (roleCounts[role] || 0) + 1;
          });
          
          // Transform into the format needed for the chart
          const chartData = Object.entries(roleCounts).map(([name, value]) => ({
            name: name === 'user' ? 'Free Users' : 
                  name === 'premium' ? 'Premium' :
                  name === 'moderator' ? 'Moderators' :
                  name === 'admin' || name === 'super_admin' ? 'Admins' : 
                  name.charAt(0).toUpperCase() + name.slice(1), // Capitalize other roles
            value
          }));
          
          setUserRoleData(chartData);
        } else {
          // If no data, provide some default data
          setUserRoleData([
            { name: 'Free Users', value: 0 },
            { name: 'Premium', value: 0 },
            { name: 'Moderators', value: 0 },
            { name: 'Admins', value: 1 },
          ]);
        }
      } catch (error) {
        console.error('Error fetching user distribution data:', error);
        toast({
          title: 'Error loading data',
          description: 'Could not load user distribution data',
          variant: 'destructive',
        });
        
        // Fallback to sample data
        setUserRoleData([
          { name: 'Free Users', value: 0 },
          { name: 'Premium', value: 0 },
          { name: 'Moderators', value: 0 },
          { name: 'Admins', value: 1 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserRoles();
  }, [toast]);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

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
        {userRoleData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No user data available
          </div>
        ) : (
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
              <Tooltip formatter={(value) => [`${value} users`, 'Count']} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default UserDistributionChart;
