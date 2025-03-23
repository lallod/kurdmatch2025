
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EngagementData } from '@/api/dashboard';

interface EngagementChartProps {
  data: EngagementData[];
  loading?: boolean;
}

const EngagementChart = ({ data, loading = false }: EngagementChartProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const processedData = data.map(item => ({
    ...item,
    name: formatDate(item.date)
  }));

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Engagement Metrics</CardTitle>
          <CardDescription>Likes, views, and matches over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded-md"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Engagement Metrics</CardTitle>
        <CardDescription>Likes, views, and matches over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={processedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="likes" fill="#8884d8" />
            <Bar dataKey="views" fill="#82ca9d" />
            <Bar dataKey="matches" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EngagementChart;
