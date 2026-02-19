
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EngagementData } from '@/api/dashboard';
import { useTranslations } from '@/hooks/useTranslations';

interface UserActivityChartProps {
  data: EngagementData[];
  loading?: boolean;
}

const UserActivityChart = ({ data, loading = false }: UserActivityChartProps) => {
  const { t } = useTranslations();
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const processedData = data.map(item => ({
    ...item,
    name: formatDate(item.date)
  }));

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.activity_trends', 'User Activity Trends')}</CardTitle>
          <CardDescription>{t('admin.activity_trends_description', 'Daily active users and conversations')}</CardDescription>
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
        <CardTitle>{t('admin.activity_trends', 'User Activity Trends')}</CardTitle>
        <CardDescription>{t('admin.activity_trends_description', 'Daily active users and conversations')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={processedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="conversations" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default UserActivityChart;
