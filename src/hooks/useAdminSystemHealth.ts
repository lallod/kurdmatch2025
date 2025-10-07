import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SystemMetric {
  id: string;
  metric_type: 'api_performance' | 'resource_usage' | 'incident';
  metric_data: any;
  severity: 'info' | 'warning' | 'critical' | null;
  timestamp: string;
  created_at: string;
}

export const useAdminSystemHealth = (timeRange: string = 'day') => {
  const getTimeFilter = () => {
    const now = new Date();
    const filters: Record<string, Date> = {
      hour: new Date(now.getTime() - 60 * 60 * 1000),
      day: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      week: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      month: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    };
    return filters[timeRange] || filters.day;
  };

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['system-metrics', timeRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_metrics')
        .select('*')
        .gte('timestamp', getTimeFilter().toISOString())
        .order('timestamp', { ascending: true });

      if (error) throw error;
      return data as SystemMetric[];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Get API performance data
  const apiPerformance = metrics?.filter(m => m.metric_type === 'api_performance') || [];
  
  // Get resource usage data (latest for each resource)
  const resourceUsage = metrics?.filter(m => m.metric_type === 'resource_usage') || [];
  const latestResources = resourceUsage.reduce((acc, metric) => {
    const resourceName = metric.metric_data.resource;
    if (!acc[resourceName] || new Date(metric.timestamp) > new Date(acc[resourceName].timestamp)) {
      acc[resourceName] = metric;
    }
    return acc;
  }, {} as Record<string, SystemMetric>);

  // Get incidents
  const incidents = metrics?.filter(m => m.metric_type === 'incident') || [];

  // Calculate system status
  const getSystemStatus = () => {
    const criticalCount = metrics?.filter(m => m.severity === 'critical').length || 0;
    const warningCount = metrics?.filter(m => m.severity === 'warning').length || 0;

    if (criticalCount > 0) return 'critical';
    if (warningCount > 0) return 'warning';
    return 'healthy';
  };

  // Get current user stats from profiles table
  const { data: userStats } = useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { count: activeUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('last_active', oneDayAgo);

      return {
        total: totalUsers || 0,
        active: activeUsers || 0,
      };
    },
    refetchInterval: 60000, // Refetch every minute
  });

  // Get database stats
  const { data: dbStats } = useQuery({
    queryKey: ['db-stats'],
    queryFn: async () => {
      // Query count from various tables
      const [profiles, messages, posts] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*', { count: 'exact', head: true }),
      ]);

      return {
        profiles: profiles.count || 0,
        messages: messages.count || 0,
        posts: posts.count || 0,
      };
    },
  });

  return {
    metrics,
    metricsLoading,
    apiPerformance,
    resourceUsage: Object.values(latestResources),
    incidents,
    systemStatus: getSystemStatus(),
    userStats,
    dbStats,
  };
};
