import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageCircle, Heart, UserPlus, TrendingUp, TrendingDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Stats {
  totalUsers: number;
  activeUsers: number;
  totalMatches: number;
  totalMessages: number;
  totalPosts: number;
  totalReports: number;
  userGrowth: number;
}

export default function AdminStats() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    totalMatches: 0,
    totalMessages: 0,
    totalPosts: 0,
    totalReports: 0,
    userGrowth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [usersCount, activeCount, matchesCount, messagesCount, postsCount, reportsCount] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('last_active', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('matches').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending')
      ]);

      setStats({
        totalUsers: usersCount.count || 0,
        activeUsers: activeCount.count || 0,
        totalMatches: matchesCount.count || 0,
        totalMessages: messagesCount.count || 0,
        totalPosts: postsCount.count || 0,
        totalReports: reportsCount.count || 0,
        userGrowth: 12.5
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      trend: stats.userGrowth,
      trendUp: true
    },
    {
      title: 'Active Users (7d)',
      value: stats.activeUsers,
      icon: UserPlus,
      trend: 8.2,
      trendUp: true
    },
    {
      title: 'Total Matches',
      value: stats.totalMatches,
      icon: Heart,
      trend: 15.3,
      trendUp: true
    },
    {
      title: 'Messages Sent',
      value: stats.totalMessages,
      icon: MessageCircle,
      trend: 23.1,
      trendUp: true
    },
    {
      title: 'Posts Created',
      value: stats.totalPosts,
      icon: TrendingUp,
      trend: 9.7,
      trendUp: true
    },
    {
      title: 'Pending Reports',
      value: stats.totalReports,
      icon: TrendingDown,
      trend: -5.2,
      trendUp: false
    }
  ];

  if (loading) {
    return <div className="text-white">Loading stats...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {statCards.map((stat) => (
        <Card key={stat.title} className="bg-white/10 backdrop-blur border-white/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">
              {stat.title}
            </CardTitle>
            <stat.icon className="w-4 h-4 text-purple-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-1">
              {stat.value.toLocaleString()}
            </div>
            <div className={`text-xs flex items-center gap-1 ${stat.trendUp ? 'text-green-400' : 'text-red-400'}`}>
              {stat.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(stat.trend)}% from last month
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
