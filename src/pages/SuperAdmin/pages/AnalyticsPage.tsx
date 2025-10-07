import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Brain, Download, RefreshCw, TrendingUp, Users, MessageSquare, Heart } from 'lucide-react';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { useAdminAnalytics } from '../hooks/useAdminAnalytics';

const AnalyticsPage = () => {
  const { analytics, loading, refetch } = useAdminAnalytics();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Advanced Analytics</h1>
          <p className="text-white/60 mt-1">Real-time insights from your platform</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleRefresh} 
            disabled={refreshing || loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing || loading ? 'animate-spin' : ''}`} />
            {refreshing || loading ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* AI banner */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-white/10 flex items-center">
        <Brain size={24} className="text-primary mr-3" />
        <div>
          <h3 className="font-semibold text-white">AI-Powered Analytics</h3>
          <p className="text-sm text-white/60">Our AI system identifies trends and provides insights to optimize user engagement</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#141414] border-white/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Total Users</p>
                <p className="text-2xl font-bold text-white">{analytics.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-green-400 mt-1">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  {analytics.newUsersThisMonth} new this month
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#141414] border-white/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Active Users</p>
                <p className="text-2xl font-bold text-white">{analytics.activeUsers.toLocaleString()}</p>
                <p className="text-xs text-white/40 mt-1">Last 7 days</p>
              </div>
              <Users className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#141414] border-white/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Total Messages</p>
                <p className="text-2xl font-bold text-white">{analytics.totalMessages.toLocaleString()}</p>
                <p className="text-xs text-white/40 mt-1">{analytics.totalMatches} matches made</p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#141414] border-white/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Premium Users</p>
                <p className="text-2xl font-bold text-white">{analytics.premiumSubscribers.toLocaleString()}</p>
                <p className="text-xs text-green-400 mt-1">
                  {formatCurrency(analytics.totalRevenue)} revenue
                </p>
              </div>
              <Heart className="h-8 w-8 text-pink-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-white/5 border-white/10">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white/10">Overview</TabsTrigger>
          <TabsTrigger value="growth" className="data-[state=active]:bg-white/10">User Growth</TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-white/10">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-[#141414] border-white/5">
              <CardHeader>
                <CardTitle className="text-white">User Growth (Last 30 Days)</CardTitle>
                <CardDescription className="text-white/60">New user registrations over time</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.userGrowthData.length > 0 ? (
                  <ChartContainer
                    config={{
                      count: { color: "#3b82f6" }
                    }}
                    className="h-80"
                  >
                    <LineChart data={analytics.userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="date" 
                        stroke="rgba(255,255,255,0.5)"
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis stroke="rgba(255,255,255,0.5)" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="count" 
                        name="New Users" 
                        stroke="var(--color-count)" 
                        strokeWidth={2}
                        dot={{ fill: 'var(--color-count)' }}
                      />
                    </LineChart>
                  </ChartContainer>
                ) : (
                  <div className="h-80 flex items-center justify-center text-white/40">
                    No user growth data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#141414] border-white/5">
              <CardHeader>
                <CardTitle className="text-white">Message Activity (Last 30 Days)</CardTitle>
                <CardDescription className="text-white/60">Messages sent over time</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.messageActivityData.length > 0 ? (
                  <ChartContainer
                    config={{
                      count: { color: "#8b5cf6" }
                    }}
                    className="h-80"
                  >
                    <BarChart data={analytics.messageActivityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="date" 
                        stroke="rgba(255,255,255,0.5)"
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis stroke="rgba(255,255,255,0.5)" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar 
                        dataKey="count" 
                        name="Messages" 
                        fill="var(--color-count)" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <div className="h-80 flex items-center justify-center text-white/40">
                    No message activity data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-[#141414] border-white/5">
            <CardHeader>
              <CardTitle className="text-white">Platform Summary</CardTitle>
              <CardDescription className="text-white/60">Key metrics at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-sm text-white/60">Total Photos</p>
                  <p className="text-xl font-bold text-white mt-1">{analytics.totalPhotos.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-sm text-white/60">Verified Users</p>
                  <p className="text-xl font-bold text-white mt-1">{analytics.verifiedUsers.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-sm text-white/60">Total Matches</p>
                  <p className="text-xl font-bold text-white mt-1">{analytics.totalMatches.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-sm text-white/60">Conversion Rate</p>
                  <p className="text-xl font-bold text-white mt-1">
                    {analytics.totalUsers > 0 
                      ? ((analytics.premiumSubscribers / analytics.totalUsers) * 100).toFixed(1)
                      : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="growth" className="space-y-4">
          <Card className="bg-[#141414] border-white/5">
            <CardHeader>
              <CardTitle className="text-white">Detailed User Growth Analysis</CardTitle>
              <CardDescription className="text-white/60">Track user acquisition trends</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/60">Detailed growth analytics will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card className="bg-[#141414] border-white/5">
            <CardHeader>
              <CardTitle className="text-white">Platform Activity Metrics</CardTitle>
              <CardDescription className="text-white/60">Monitor user engagement and activity</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/60">Activity metrics will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;
