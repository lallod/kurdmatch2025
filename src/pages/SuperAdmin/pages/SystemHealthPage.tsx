
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { 
  Brain, 
  ServerCrash, 
  BarChart, 
  Bell, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  RefreshCw 
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';

const SystemHealthPage = () => {
  const [timeRange, setTimeRange] = useState('day');
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for system health metrics
  const apiPerformanceData = [
    { time: '00:00', responseTime: 245, errorRate: 0.2, requests: 1250 },
    { time: '02:00', responseTime: 230, errorRate: 0.1, requests: 980 },
    { time: '04:00', responseTime: 210, errorRate: 0.3, requests: 750 },
    { time: '06:00', responseTime: 290, errorRate: 0.2, requests: 890 },
    { time: '08:00', responseTime: 350, errorRate: 0.5, requests: 1420 },
    { time: '10:00', responseTime: 410, errorRate: 0.8, requests: 2100 },
    { time: '12:00', responseTime: 380, errorRate: 0.3, requests: 2350 },
    { time: '14:00', responseTime: 320, errorRate: 0.2, requests: 2200 },
    { time: '16:00', responseTime: 290, errorRate: 0.3, requests: 2050 },
    { time: '18:00', responseTime: 350, errorRate: 0.4, requests: 1850 },
    { time: '20:00', responseTime: 310, errorRate: 0.2, requests: 1650 },
    { time: '22:00', responseTime: 270, errorRate: 0.3, requests: 1380 },
  ];

  const systemResources = [
    { name: 'API Server Cluster', status: 'healthy', cpu: 45, memory: 62, disk: 38 },
    { name: 'Database Cluster', status: 'healthy', cpu: 68, memory: 74, disk: 52 },
    { name: 'Cache Servers', status: 'warning', cpu: 82, memory: 78, disk: 41 },
    { name: 'AI Processing Cluster', status: 'healthy', cpu: 75, memory: 61, disk: 35 },
    { name: 'Storage Servers', status: 'critical', cpu: 32, memory: 45, disk: 93 },
  ];

  const recentIncidents = [
    { 
      id: 'INC-2023-05-18-001', 
      title: 'High database latency', 
      status: 'investigating', 
      time: '18 May 2023, 14:32', 
      impact: 'Minor impact on user profile loading times', 
      updates: 3 
    },
    { 
      id: 'INC-2023-05-15-002', 
      title: 'API rate limiting triggered', 
      status: 'resolved', 
      time: '15 May 2023, 10:15', 
      impact: 'Brief slowdown in messaging functionality', 
      updates: 5 
    },
    { 
      id: 'INC-2023-05-10-003', 
      title: 'CDN outage', 
      status: 'resolved', 
      time: '10 May 2023, 08:45', 
      impact: 'Images loading slowly for 35 minutes', 
      updates: 4 
    },
  ];

  // Status badge component
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Healthy</Badge>;
      case 'warning':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Warning</Badge>;
      case 'critical':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Critical</Badge>;
      case 'investigating':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Investigating</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Resolved</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Resource usage indicator component
  const getResourceIndicator = (usage: number) => {
    let color = 'bg-green-500';
    if (usage > 80) {
      color = 'bg-red-500';
    } else if (usage > 60) {
      color = 'bg-amber-500';
    }
    return (
      <div className="w-full">
        <div className="flex justify-between mb-1">
          <span className="text-xs font-medium">{usage}%</span>
        </div>
        <Progress value={usage} className={color} />
      </div>
    );
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate data reload
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">System Health</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hour">Last hour</SelectItem>
                <SelectItem value="day">Last 24 hours</SelectItem>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
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
            <Bell size={16} />
            Alerts
          </Button>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium text-green-800">API Services</div>
                <div className="text-2xl font-bold text-green-900">Operational</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium text-amber-800">Databases</div>
                <div className="text-2xl font-bold text-amber-900">Performance Degraded</div>
              </div>
              <AlertCircle className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium text-green-800">Storage Services</div>
                <div className="text-2xl font-bold text-green-900">Operational</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI banner */}
      <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-tinder-rose/5 to-tinder-orange/5 border border-tinder-rose/10 flex items-center">
        <Brain size={24} className="text-tinder-rose mr-3" />
        <div>
          <h3 className="font-semibold text-gray-800">AI-Powered System Monitoring</h3>
          <p className="text-sm text-gray-600">Our AI system continuously monitors performance metrics and predicts potential issues before they affect users</p>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="api">API Performance</TabsTrigger>
          <TabsTrigger value="resources">System Resources</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* API Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>API Performance</CardTitle>
              <CardDescription>Response time and error rate over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  responseTime: { color: "#8075FF" },
                  errorRate: { color: "#FF4B91" }
                }}
                className="h-80"
              >
                <LineChart data={apiPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip 
                    content={
                      <ChartTooltipContent />
                    }
                  />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="responseTime" 
                    name="Response Time (ms)" 
                    stroke="var(--color-responseTime)" 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="errorRate" 
                    name="Error Rate (%)" 
                    stroke="var(--color-errorRate)" 
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* System Resources */}
          <Card>
            <CardHeader>
              <CardTitle>System Resources</CardTitle>
              <CardDescription>Current resource usage across systems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">System</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPU</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Memory</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disk</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {systemResources.map((resource, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{resource.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getStatusBadge(resource.status)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-40">{getResourceIndicator(resource.cpu)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-40">{getResourceIndicator(resource.memory)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-40">{getResourceIndicator(resource.disk)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Recent Incidents */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Incidents</CardTitle>
              <CardDescription>System incidents and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentIncidents.map((incident) => (
                  <div key={incident.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{incident.title}</h4>
                          {getStatusBadge(incident.status)}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">{incident.time}</div>
                        <div className="text-sm mt-2">{incident.impact}</div>
                      </div>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle>AI Insights</CardTitle>
              <CardDescription>AI-generated insights based on system health data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-blue-50">
                  <h4 className="font-semibold text-blue-800 mb-2">Database Performance</h4>
                  <p className="text-blue-700">
                    Our AI system has detected increased latency in the database cluster over the past 6 hours. 
                    The pattern suggests potential index fragmentation. Consider running optimization routines 
                    during the next low-traffic window.
                  </p>
                </div>
                <div className="p-4 border rounded-lg bg-amber-50">
                  <h4 className="font-semibold text-amber-800 mb-2">Resource Usage Alert</h4>
                  <p className="text-amber-700">
                    Storage servers are approaching critical capacity (93% usage). Based on current growth 
                    patterns, available space will be exhausted in approximately 9 days. Consider adding 
                    additional storage or implementing cleanup procedures.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Performance Details</CardTitle>
              <CardDescription>Detailed API performance metrics and logs</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Detailed API performance content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>System Resources Details</CardTitle>
              <CardDescription>Detailed system resource metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Detailed system resources content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents">
          <Card>
            <CardHeader>
              <CardTitle>Incident History</CardTitle>
              <CardDescription>Complete incident history and resolutions</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Incident history content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemHealthPage;
