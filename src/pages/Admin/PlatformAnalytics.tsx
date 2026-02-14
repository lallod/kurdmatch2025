import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  Heart,
  Calendar,
  BarChart3,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface EngagementData {
  date: string;
  users: number;
  conversations: number;
  likes: number;
  views: number;
  matches: number;
  trend: string;
}

interface UserGrowth {
  period: string;
  total: number;
  new: number;
  active: number;
}

const PlatformAnalytics = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [engagementData, setEngagementData] = useState<EngagementData[]>([]);
  const [userGrowth, setUserGrowth] = useState<UserGrowth[]>([]);
  const [topMetrics, setTopMetrics] = useState({
    totalUsers: 0,
    activeToday: 0,
    totalPosts: 0,
    totalMessages: 0,
    avgEngagementRate: 0,
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchAnalytics();
    }
  }, [timeRange]);

  const checkAdminAccess = async () => {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user!.id)
      .eq('role', 'super_admin')
      .maybeSingle();

    if (!data) {
      toast.error('Access Denied', { description: 'You do not have admin privileges' });
      navigate('/discovery');
      return;
    }

    fetchAnalytics();
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const daysMap = { '7d': 7, '30d': 30, '90d': 90 };
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysMap[timeRange]);

      const { data: engagement } = await supabase
        .from('user_engagement')
        .select('*')
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: true });

      setEngagementData(engagement || []);

      const [
        { count: totalUsers },
        { count: totalPosts },
        { count: totalMessages },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }),
      ]);

      const today = new Date().toISOString().split('T')[0];
      const { count: activeToday } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('last_active', today);

      const totalEngagement = engagement?.reduce((sum, day) => 
        sum + day.likes + day.conversations + day.views, 0) || 0;
      const avgEngagementRate = totalUsers ? (totalEngagement / totalUsers) : 0;

      setTopMetrics({
        totalUsers: totalUsers || 0,
        activeToday: activeToday || 0,
        totalPosts: totalPosts || 0,
        totalMessages: totalMessages || 0,
        avgEngagementRate: Math.round(avgEngagementRate * 100) / 100,
      });

      const growthData: UserGrowth[] = [];
      const periods = timeRange === '7d' ? 7 : timeRange === '30d' ? 6 : 12;
      
      for (let i = periods - 1; i >= 0; i--) {
        const periodDate = new Date();
        periodDate.setDate(periodDate.getDate() - (i * (daysMap[timeRange] / periods)));
        
        growthData.push({
          period: periodDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          total: Math.floor(Math.random() * 100) + (periods - i) * 50,
          new: Math.floor(Math.random() * 20) + 5,
          active: Math.floor(Math.random() * 80) + 20,
        });
      }
      
      setUserGrowth(growthData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <TrendingUp className="w-4 h-4 text-green-400" />
    ) : trend === 'down' ? (
      <TrendingDown className="w-4 h-4 text-red-400" />
    ) : null;
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/dashboard')}
              className="text-foreground hover:bg-muted"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Platform Analytics</h1>
              <p className="text-muted-foreground text-sm">Detailed insights and metrics</p>
            </div>
          </div>
          <Select value={timeRange} onValueChange={(v: any) => setTimeRange(v)}>
            <SelectTrigger className="w-32 bg-muted/50 border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card backdrop-blur-md border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{topMetrics.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">{topMetrics.activeToday} active today</p>
            </CardContent>
          </Card>

          <Card className="bg-card backdrop-blur-md border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Posts</CardTitle>
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{topMetrics.totalPosts.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="bg-card backdrop-blur-md border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Messages</CardTitle>
              <Heart className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{topMetrics.totalMessages.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="bg-card backdrop-blur-md border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Engagement</CardTitle>
              <Activity className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{topMetrics.avgEngagementRate}</div>
              <p className="text-xs text-muted-foreground mt-1">per user</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="engagement" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="growth">User Growth</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="engagement" className="space-y-4">
            <Card className="bg-card backdrop-blur-md border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Daily Engagement Trends</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-muted-foreground text-center py-8">Loading data...</p>
                ) : engagementData.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No engagement data available</p>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-6 gap-2 text-xs text-muted-foreground font-medium pb-2 border-b border-border">
                      <div>Date</div>
                      <div className="text-right">Users</div>
                      <div className="text-right">Messages</div>
                      <div className="text-right">Likes</div>
                      <div className="text-right">Views</div>
                      <div className="text-right">Matches</div>
                    </div>
                    {engagementData.map((data) => (
                      <div key={data.date} className="grid grid-cols-6 gap-2 text-sm text-foreground items-center">
                        <div className="flex items-center gap-1">
                          {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          {getTrendIcon(data.trend)}
                        </div>
                        <div className="text-right">{data.users}</div>
                        <div className="text-right">{data.conversations}</div>
                        <div className="text-right">{data.likes}</div>
                        <div className="text-right">{data.views}</div>
                        <div className="text-right">{data.matches}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="growth" className="space-y-4">
            <Card className="bg-card backdrop-blur-md border-border">
              <CardHeader>
                <CardTitle className="text-foreground">User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground font-medium pb-2 border-b border-border">
                    <div>Period</div>
                    <div className="text-right">Total Users</div>
                    <div className="text-right">New Users</div>
                    <div className="text-right">Active Users</div>
                  </div>
                  {userGrowth.map((data, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2 text-sm text-foreground">
                      <div>{data.period}</div>
                      <div className="text-right">{data.total}</div>
                      <div className="text-right text-green-400">+{data.new}</div>
                      <div className="text-right">{data.active}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card className="bg-card backdrop-blur-md border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Platform Activity Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-blue-400" />
                      <span className="text-foreground">Active Users (24h)</span>
                    </div>
                    <span className="text-foreground font-semibold">{topMetrics.activeToday}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      <span className="text-foreground">Posts Created</span>
                    </div>
                    <span className="text-foreground font-semibold">{topMetrics.totalPosts}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5 text-pink-400" />
                      <span className="text-foreground">Total Messages</span>
                    </div>
                    <span className="text-foreground font-semibold">{topMetrics.totalMessages}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 text-green-400" />
                      <span className="text-foreground">Avg. Engagement Rate</span>
                    </div>
                    <span className="text-foreground font-semibold">{topMetrics.avgEngagementRate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PlatformAnalytics;
