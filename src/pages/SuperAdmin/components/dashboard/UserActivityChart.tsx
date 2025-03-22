
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const UserActivityChart = () => {
  // Mock chart data
  const userActivityData = [
    { name: 'Jan', users: 4000, conversations: 2400 },
    { name: 'Feb', users: 3000, conversations: 1398 },
    { name: 'Mar', users: 2000, conversations: 9800 },
    { name: 'Apr', users: 2780, conversations: 3908 },
    { name: 'May', users: 1890, conversations: 4800 },
    { name: 'Jun', users: 2390, conversations: 3800 },
    { name: 'Jul', users: 3490, conversations: 4300 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Activity Trends</CardTitle>
        <CardDescription>Daily active users and conversations</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={userActivityData}
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
            <Line
              type="monotone"
              dataKey="users"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="conversations" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default UserActivityChart;
