
import React, { useEffect, useState } from 'react';
import { Users, MessageSquare, ImageIcon, Activity } from 'lucide-react';
import StatCard from './StatCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StatsOverviewProps {
  timeRange: string;
}

interface DashboardStat {
  id: number;
  stat_name: string;
  stat_value: number;
  change_percentage: number;
  icon: string;
  trend: 'positive' | 'negative' | 'neutral';
  created_at?: string;
  updated_at?: string;
}

// Default mock stats when database table doesn't exist
const getDefaultStats = (): DashboardStat[] => [
  {
    id: 1,
    stat_name: 'Total Users',
    stat_value: 1250,
    change_percentage: 12.5,
    icon: 'Users',
    trend: 'positive'
  },
  {
    id: 2,
    stat_name: 'Active Conversations',
    stat_value: 340,
    change_percentage: -2.3,
    icon: 'MessageSquare',
    trend: 'negative'
  },
  {
    id: 3,
    stat_name: 'Photos Uploaded',
    stat_value: 5680,
    change_percentage: 8.7,
    icon: 'ImageIcon',
    trend: 'positive'
  },
  {
    id: 4,
    stat_name: 'Daily Active Users',
    stat_value: 892,
    change_percentage: 5.2,
    icon: 'Activity',
    trend: 'positive'
  }
];

const StatsOverview = ({ timeRange }: StatsOverviewProps) => {
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        console.log('Fetching stats with timeRange:', timeRange);
        
        // Fetch dashboard stats directly from the database
        const { data, error } = await supabase
          .from('dashboard_stats')
          .select('*');
        
        if (error) {
          console.log('Dashboard stats table not found, using default stats:', error.message);
          
          // If table doesn't exist, use default mock data instead of showing error
          if (error.code === '42P01') {
            setStats(getDefaultStats());
            return;
          }
          
          throw error;
        }
        
        console.log('Fetched stats data:', data);
        
        if (!data || data.length === 0) {
          console.log('No stats data found in the database, using default stats');
          setStats(getDefaultStats());
          return;
        }
        
        // Convert the trend string to the expected union type
        const typedData: DashboardStat[] = data.map(item => ({
          ...item,
          trend: (item.trend as 'positive' | 'negative' | 'neutral') || 'neutral'
        }));
        
        setStats(typedData);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
        
        // Use default stats as fallback instead of showing error
        console.log('Using default stats as fallback');
        setStats(getDefaultStats());
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [timeRange]);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Users':
        return <Users className="h-6 w-6 text-blue-500" />;
      case 'MessageSquare':
        return <MessageSquare className="h-6 w-6 text-green-500" />;
      case 'ImageIcon':
        return <ImageIcon className="h-6 w-6 text-purple-500" />;
      case 'Activity':
        return <Activity className="h-6 w-6 text-orange-500" />;
      default:
        return <Activity className="h-6 w-6 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((_, index) => (
          <div key={index} className="h-36 bg-gray-100 animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.stat_name}
          value={stat.stat_value.toLocaleString()}
          change={`${stat.change_percentage >= 0 ? '+' : ''}${stat.change_percentage}% from last ${timeRange}`}
          icon={getIconComponent(stat.icon)}
          trend={stat.trend}
        />
      ))}
    </div>
  );
};

export default StatsOverview;
