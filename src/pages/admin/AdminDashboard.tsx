import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Users,
  MessageSquare,
  Heart,
  Eye,
  TrendingUp,
  AlertCircle,
  ShieldCheck,
  Settings,
  BarChart3,
  Calendar
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalPosts: number;
  totalMessages: number;
  totalReports: number;
  pendingReports: number;
}

interface EngagementData {
  date: string;
  users: number;
  conversations: number;
  likes: number;
  views: number;
  matches: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalPosts: 0,
    totalMessages: 0,
    totalReports: 0,
    pendingReports: 0,
  });
  const [engagementData, setEngagementData] = useState<EngagementData[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      checkAdminAccess();
    }
  }, [user]);

  const checkAdminAccess = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user!.id)
        .eq('role', 'super_admin')
        .single();

      if (error || !data) {
        toast({
          title: 'Access Denied',
          description: 'You do not have admin privileges',
          variant: 'destructive',
        });
        navigate('/discovery');
        return;
      }

      setIsAdmin(true);
      fetchDashboardData();
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/discovery');
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch stats in parallel
      const [
        { count: totalUsers },
        { count: totalPosts },
        { count: totalMessages },
        { count: totalReports },
        { count: pendingReports },
        { data: engagement },
        { data: activities },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }),
        supabase.from('reports').select('*', { count: 'exact', head: true }),
        supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('user_engagement').select('*').order('date', { ascending: false }).limit(30),
        supabase.from('admin_activities').select('*').order('created_at', { ascending: false }).limit(10),
      ]);

      // Calculate active users (last 24 hours)
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { count: activeUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('last_active', yesterday);

      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalPosts: totalPosts || 0,
        totalMessages: totalMessages || 0,
        totalReports: totalReports || 0,
        pendingReports: pendingReports || 0,
      });

      setEngagementData(engagement || []);
      setRecentActivities(activities || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_banned':
        return <ShieldCheck className="w-4 h-4 text-red-500" />;
      case 'report_resolved':
        return <AlertCircle className="w-4 h-4 text-green-500" />;
      case 'settings_updated':
        return <Settings className="w-4 h-4 text-blue-500" />;
      default:
        return <BarChart3 className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading admin dashboard...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 pb-24">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-white/70 mt-1">Platform overview and management</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/admin/settings')}
            className="text-white border-white/20 hover:bg-white/10"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/70">Total Users</CardTitle>
              <Users className="w-4 h-4 text-white/50" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-white/50 mt-1">
                {stats.activeUsers} active in last 24h
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/70">Total Posts</CardTitle>
              <MessageSquare className="w-4 h-4 text-white/50" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalPosts.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/70">Messages</CardTitle>
              <Heart className="w-4 h-4 text-white/50" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalMessages.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/70">Pending Reports</CardTitle>
              <AlertCircle className="w-4 h-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.pendingReports}</div>
              <p className="text-xs text-white/50 mt-1">
                {stats.totalReports} total reports
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Recent Activity */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Recent Admin Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivities.length === 0 ? (
                  <p className="text-white/70 text-center py-8">No recent activity</p>
                ) : (
                  <div className="space-y-3">
                    {recentActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        {getActivityIcon(activity.activity_type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm">{activity.description}</p>
                          <p className="text-white/50 text-xs mt-1">
                            {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/admin/users')}
                  className="text-white border-white/20 hover:bg-white/10"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/admin/reports')}
                  className="text-white border-white/20 hover:bg-white/10"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  View Reports
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/admin/content')}
                  className="text-white border-white/20 hover:bg-white/10"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Content Moderation
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/admin/analytics')}
                  className="text-white border-white/20 hover:bg-white/10"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="py-12 text-center">
                <Users className="w-12 h-12 text-white/30 mx-auto mb-3" />
                <p className="text-white/70">User management interface</p>
                <Button
                  onClick={() => navigate('/admin/users')}
                  className="mt-4"
                  variant="outline"
                >
                  Go to User Management
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="py-12 text-center">
                <AlertCircle className="w-12 h-12 text-white/30 mx-auto mb-3" />
                <p className="text-white/70">Content reports and moderation</p>
                <Button
                  onClick={() => navigate('/admin/reports')}
                  className="mt-4"
                  variant="outline"
                >
                  View All Reports
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">User Engagement Trends</CardTitle>
              </CardHeader>
              <CardContent>
                {engagementData.length === 0 ? (
                  <p className="text-white/70 text-center py-8">No engagement data available</p>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-5 gap-2 text-xs text-white/50 font-medium pb-2 border-b border-white/10">
                      <div>Date</div>
                      <div className="text-right">Users</div>
                      <div className="text-right">Messages</div>
                      <div className="text-right">Likes</div>
                      <div className="text-right">Matches</div>
                    </div>
                    {engagementData.slice(0, 10).map((data) => (
                      <div key={data.date} className="grid grid-cols-5 gap-2 text-sm text-white">
                        <div>{new Date(data.date).toLocaleDateString()}</div>
                        <div className="text-right">{data.users}</div>
                        <div className="text-right">{data.conversations}</div>
                        <div className="text-right">{data.likes}</div>
                        <div className="text-right">{data.matches}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
