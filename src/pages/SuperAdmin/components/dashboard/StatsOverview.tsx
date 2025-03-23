
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

const StatsOverview = ({ timeRange }: StatsOverviewProps) => {
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard stats directly from the database
        const { data, error } = await supabase
          .from('dashboard_stats')
          .select('*');
        
        if (error) throw error;
        
        // Convert the trend string to the expected union type
        const typedData: DashboardStat[] = data.map(item => ({
          ...item,
          trend: (item.trend as 'positive' | 'negative' | 'neutral') || 'neutral'
        }));
        
        setStats(typedData);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
        toast({
          title: 'Error loading stats',
          description: 'Could not load dashboard statistics. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [timeRange, toast]);

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
          change={`${stat.change_percentage >= 0 ? '+' : ''}${stat.change_percentage}% from last month`}
          icon={getIconComponent(stat.icon)}
          trend={stat.trend}
        />
      ))}
    </div>
  );
};

export default StatsOverview;
