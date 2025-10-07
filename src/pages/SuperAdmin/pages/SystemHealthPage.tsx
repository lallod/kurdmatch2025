import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
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
  ResponsiveContainer 
} from 'recharts';
import { 
  Brain, 
  Bell, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  RefreshCw,
  Loader2,
  TrendingUp,
  TrendingDown
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
import { useAdminSystemHealth } from '@/hooks/useAdminSystemHealth';

const SystemHealthPage = () => {
  const [timeRange, setTimeRange] = useState('day');
  const { 
    metrics, 
    metricsLoading, 
    apiPerformance, 
    resourceUsage, 
    incidents, 
    systemStatus,
    userStats,
    dbStats 
  } = useAdminSystemHealth(timeRange);

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

  // Format API performance data for chart
  const chartData = apiPerformance.map(metric => ({
    time: new Date(metric.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    responseTime: metric.metric_data.responseTime,
    errorRate: metric.metric_data.errorRate,
    requests: metric.metric_data.requests
  }));

  if (metricsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
          <Button variant="outline" size="sm" className="gap-2">
            <Bell size={16} />
            Alerts
          </Button>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={systemStatus === 'healthy' ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200' : systemStatus === 'critical' ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-200' : 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200'}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium text-gray-800">Overall System</div>
                <div className="text-2xl font-bold text-gray-900 capitalize">{systemStatus}</div>
              </div>
              {systemStatus === 'healthy' ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <AlertCircle className="h-8 w-8 text-amber-600" />
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium text-blue-800">Active Users</div>
                <div className="text-2xl font-bold text-blue-900">
                  {userStats?.active || 0} / {userStats?.total || 0}
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium text-purple-800">Database Records</div>
                <div className="text-2xl font-bold text-purple-900">
                  {((dbStats?.profiles || 0) + (dbStats?.messages || 0) + (dbStats?.posts || 0)).toLocaleString()}
                </div>
              </div>
              <TrendingDown className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI banner */}
      <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-tinder-rose/5 to-tinder-orange/5 border border-tinder-rose/10 flex items-center">
        <Brain size={24} className="text-tinder-rose mr-3" />
        <div>
          <h3 className="font-semibold text-gray-800">AI-Powered System Monitoring</h3>
          <p className="text-sm text-gray-600">Real-time metrics collection via edge functions every 5 minutes</p>
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
          {chartData.length > 0 && (
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
                  <LineChart data={chartData}>
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
          )}

          {/* System Resources */}
          {resourceUsage.length > 0 && (
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
                      {resourceUsage.map((resource, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{resource.metric_data.resource}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getStatusBadge(resource.metric_data.status)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-40">{getResourceIndicator(resource.metric_data.cpu)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-40">{getResourceIndicator(resource.metric_data.memory)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-40">{getResourceIndicator(resource.metric_data.disk)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Incidents */}
          {incidents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Incidents</CardTitle>
                <CardDescription>System incidents and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {incidents.map((incident) => (
                    <div key={incident.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{incident.metric_data.title}</h4>
                            {getStatusBadge(incident.metric_data.status)}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">{new Date(incident.timestamp).toLocaleString()}</div>
                          <div className="text-sm mt-2">{incident.metric_data.impact}</div>
                        </div>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {chartData.length === 0 && resourceUsage.length === 0 && incidents.length === 0 && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <Brain className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Metrics Available</h3>
                  <p className="text-gray-600 mb-4">
                    System metrics are collected automatically every 5 minutes via the edge function.
                  </p>
                  <p className="text-sm text-gray-500">
                    Waiting for first metric collection...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Performance Details</CardTitle>
              <CardDescription>Detailed API performance metrics and logs</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Detailed API performance content will appear here.</p>
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
              <p className="text-muted-foreground">Detailed system resources content will appear here.</p>
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
              <p className="text-muted-foreground">Incident history content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemHealthPage;
