
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
  PieChart, 
  Pie, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Cell 
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Brain, Download, Calendar, RefreshCw, ChevronDown } from 'lucide-react';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for charts
  const userGrowthData = [
    { month: 'Jan', users: 1500, premium: 120 },
    { month: 'Feb', users: 1800, premium: 150 },
    { month: 'Mar', users: 2200, premium: 185 },
    { month: 'Apr', users: 2600, premium: 230 },
    { month: 'May', users: 3100, premium: 290 },
    { month: 'Jun', users: 3800, premium: 370 },
  ];

  const retentionData = [
    { day: '1', retention: 100 },
    { day: '3', retention: 82 },
    { day: '7', retention: 68 },
    { day: '14', retention: 52 },
    { day: '30', retention: 41 },
    { day: '60', retention: 32 },
    { day: '90', retention: 25 },
  ];

  const engagementData = [
    { name: 'Messages', value: 45 },
    { name: 'Profile Views', value: 30 },
    { name: 'Likes', value: 15 },
    { name: 'Photo Uploads', value: 10 },
  ];

  const userTypeData = [
    { name: 'Free Users', value: 70 },
    { name: 'Premium Users', value: 25 },
    { name: 'Trial Users', value: 5 },
  ];

  const COLORS = ['#FF4B91', '#FF6B55', '#8075FF', '#2563EB'];

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate data reload
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Last 24 hours</SelectItem>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
                <SelectItem value="quarter">Last 90 days</SelectItem>
                <SelectItem value="year">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download size={16} />
            Export
          </Button>
        </div>
      </div>

      {/* AI banner */}
      <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-tinder-rose/5 to-tinder-orange/5 border border-tinder-rose/10 flex items-center">
        <Brain size={24} className="text-tinder-rose mr-3" />
        <div>
          <h3 className="font-semibold text-gray-800">AI-Powered Analytics</h3>
          <p className="text-sm text-gray-600">Our AI system identifies trends and provides insights to help you optimize user engagement and retention</p>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="acquisition">User Acquisition</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Total and premium user growth over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    users: { color: "#FF4B91" },
                    premium: { color: "#FF6B55" }
                  }}
                  className="h-80"
                >
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip 
                      content={
                        <ChartTooltipContent />
                      }
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      name="Total Users" 
                      stroke="var(--color-users)" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="premium" 
                      name="Premium Users" 
                      stroke="var(--color-premium)" 
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Retention Rate</CardTitle>
                <CardDescription>User retention over different periods</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    retention: { color: "#8075FF" }
                  }}
                  className="h-80"
                >
                  <BarChart data={retentionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <ChartTooltip 
                      content={
                        <ChartTooltipContent />
                      }
                    />
                    <Legend />
                    <Bar 
                      dataKey="retention" 
                      name="Retention %" 
                      fill="var(--color-retention)" 
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Distribution</CardTitle>
                <CardDescription>Breakdown of user engagement activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={engagementData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {engagementData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Type Distribution</CardTitle>
                <CardDescription>Breakdown of user types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={userTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {userTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>AI Insights</CardTitle>
              <CardDescription>AI-generated insights based on your analytics data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-blue-50">
                  <h4 className="font-semibold text-blue-800">User Growth Trend</h4>
                  <p className="text-blue-700">There's been a 22.5% increase in user growth month-over-month, which exceeds industry average of 15%. Continue your current acquisition strategy.</p>
                </div>
                <div className="p-4 border rounded-lg bg-amber-50">
                  <h4 className="font-semibold text-amber-800">Retention Alert</h4>
                  <p className="text-amber-700">The 30-day retention rate has decreased by 3% compared to last month. Consider implementing re-engagement campaigns for users who haven't been active for 2+ weeks.</p>
                </div>
                <div className="p-4 border rounded-lg bg-green-50">
                  <h4 className="font-semibold text-green-800">Conversion Opportunity</h4>
                  <p className="text-green-700">Users who view 5+ profiles in their first session have a 68% higher chance of converting to premium. Consider highlighting profile discovery in the onboarding flow.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="acquisition">
          <Card>
            <CardHeader>
              <CardTitle>User Acquisition</CardTitle>
              <CardDescription>Detailed user acquisition metrics and channels</CardDescription>
            </CardHeader>
            <CardContent>
              <p>User acquisition analytics will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement">
          <Card>
            <CardHeader>
              <CardTitle>User Engagement</CardTitle>
              <CardDescription>Detailed user engagement metrics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <p>User engagement analytics will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retention">
          <Card>
            <CardHeader>
              <CardTitle>User Retention</CardTitle>
              <CardDescription>Detailed user retention metrics and cohort analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <p>User retention analytics will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversion">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Metrics</CardTitle>
              <CardDescription>Detailed conversion metrics and funnel analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Conversion analytics will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;
