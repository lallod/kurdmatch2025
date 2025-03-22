
import React from 'react';
import { Users, MessageSquare, ImageIcon, Activity } from 'lucide-react';
import StatCard from './StatCard';

interface StatsOverviewProps {
  timeRange: string;
}

const StatsOverview = ({ timeRange }: StatsOverviewProps) => {
  // Mock data - in a real app, these would come from API calls with the timeRange
  const stats = [
    { 
      title: 'Total Users', 
      value: '12,345', 
      change: '+12% from last month', 
      icon: <Users className="h-6 w-6 text-blue-500" />,
      trend: 'positive' as const
    },
    { 
      title: 'Active Conversations', 
      value: '843', 
      change: '+5% from last week', 
      icon: <MessageSquare className="h-6 w-6 text-green-500" />,
      trend: 'positive' as const
    },
    { 
      title: 'Photos Uploaded', 
      value: '32,567', 
      change: '+8% from last month', 
      icon: <ImageIcon className="h-6 w-6 text-purple-500" />,
      trend: 'positive' as const
    },
    { 
      title: 'User Activity', 
      value: '7,891', 
      change: '-3% from yesterday', 
      icon: <Activity className="h-6 w-6 text-orange-500" />,
      trend: 'negative' as const
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
          trend={stat.trend}
        />
      ))}
    </div>
  );
};

export default StatsOverview;
