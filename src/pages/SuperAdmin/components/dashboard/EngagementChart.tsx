
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const EngagementChart = () => {
  const engagementData = [
    { name: 'Mon', likes: 120, views: 240, matches: 20 },
    { name: 'Tue', likes: 150, views: 290, matches: 30 },
    { name: 'Wed', likes: 180, views: 320, matches: 25 },
    { name: 'Thu', likes: 130, views: 270, matches: 22 },
    { name: 'Fri', likes: 190, views: 350, matches: 35 },
    { name: 'Sat', likes: 210, views: 380, matches: 40 },
    { name: 'Sun', likes: 170, views: 320, matches: 32 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Engagement Metrics</CardTitle>
        <CardDescription>Likes, views, and matches over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={engagementData}
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
