import React, { useState } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Brain, Bell, AlertCircle, CheckCircle, Clock, RefreshCw, Loader2, TrendingUp, TrendingDown
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useAdminSystemHealth } from '@/hooks/useAdminSystemHealth';
import { useTranslations } from '@/hooks/useTranslations';

const SystemHealthPage = () => {
  const { t } = useTranslations();
  const [timeRange, setTimeRange] = useState('day');
  const { 
    metrics, metricsLoading, apiPerformance, resourceUsage, incidents, systemStatus, userStats, dbStats 
  } = useAdminSystemHealth(timeRange);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">{t('admin.healthy', 'Healthy')}</Badge>;
      case 'warning':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">{t('admin.warning', 'Warning')}</Badge>;
      case 'critical':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">{t('admin.critical', 'Critical')}</Badge>;
      case 'investigating':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">{t('admin.investigating', 'Investigating')}</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">{t('admin.resolved', 'Resolved')}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getResourceIndicator = (usage: number) => {
    let color = 'bg-green-500';
    if (usage > 80) color = 'bg-red-500';
    else if (usage > 60) color = 'bg-amber-500';
    return (
      <div className="w-full">
        <div className="flex justify-between mb-1">
          <span className="text-xs font-medium">{usage}%</span>
        </div>
        <Progress value={usage} className={color} />
      </div>
    );
  };

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
        <h1 className="text-3xl font-bold text-gray-900">{t('admin.system_health', 'System Health')}</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('admin.select_time_range', 'Select time range')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hour">{t('admin.last_hour', 'Last hour')}</SelectItem>
                <SelectItem value="day">{t('admin.last_24_hours', 'Last 24 hours')}</SelectItem>
                <SelectItem value="week">{t('admin.last_7_days', 'Last 7 days')}</SelectItem>
                <SelectItem value="month">{t('admin.last_30_days', 'Last 30 days')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Bell size={16} />
            {t('admin.alerts', 'Alerts')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={systemStatus === 'healthy' ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200' : systemStatus === 'critical' ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-200' : 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200'}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium text-gray-800">{t('admin.overall_system', 'Overall System')}</div>
                <div className="text-2xl font-bold text-gray-900 capitalize">{systemStatus}</div>
              </div>
              {systemStatus === 'healthy' ? <CheckCircle className="h-8 w-8 text-green-600" /> : <AlertCircle className="h-8 w-8 text-amber-600" />}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium text-blue-800">{t('admin.active_users', 'Active Users')}</div>
                <div className="text-2xl font-bold text-blue-900">{userStats?.active || 0} / {userStats?.total || 0}</div>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium text-purple-800">{t('admin.database_records', 'Database Records')}</div>
                <div className="text-2xl font-bold text-purple-900">
                  {((dbStats?.profiles || 0) + (dbStats?.messages || 0) + (dbStats?.posts || 0)).toLocaleString()}
                </div>
              </div>
              <TrendingDown className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-tinder-rose/5 to-tinder-orange/5 border border-tinder-rose/10 flex items-center">
        <Brain size={24} className="text-tinder-rose mr-3" />
        <div>
          <h3 className="font-semibold text-gray-800">{t('admin.ai_system_monitoring', 'AI-Powered System Monitoring')}</h3>
          <p className="text-sm text-gray-600">{t('admin.ai_system_monitoring_desc', 'Real-time metrics collection via edge functions every 5 minutes')}</p>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">{t('admin.overview', 'Overview')}</TabsTrigger>
          <TabsTrigger value="api">{t('admin.api_performance', 'API Performance')}</TabsTrigger>
          <TabsTrigger value="resources">{t('admin.system_resources', 'System Resources')}</TabsTrigger>
          <TabsTrigger value="incidents">{t('admin.incidents', 'Incidents')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {chartData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.api_performance', 'API Performance')}</CardTitle>
                <CardDescription>{t('admin.response_time_error_rate', 'Response time and error rate over time')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ responseTime: { color: "#8075FF" }, errorRate: { color: "#FF4B91" } }} className="h-80">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="responseTime" name="Response Time (ms)" stroke="var(--color-responseTime)" activeDot={{ r: 8 }} />
                    <Line yAxisId="right" type="monotone" dataKey="errorRate" name="Error Rate (%)" stroke="var(--color-errorRate)" />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          )}

          {resourceUsage.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.system_resources', 'System Resources')}</CardTitle>
                <CardDescription>{t('admin.current_resource_usage', 'Current resource usage across systems')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.system', 'System')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.status', 'Status')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.cpu', 'CPU')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.memory', 'Memory')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.disk', 'Disk')}</th>
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

          {incidents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.recent_incidents', 'Recent Incidents')}</CardTitle>
                <CardDescription>{t('admin.incidents_status', 'System incidents and their status')}</CardDescription>
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
                        <Button variant="outline" size="sm">{t('admin.view_details', 'View Details')}</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {chartData.length === 0 && resourceUsage.length === 0 && incidents.length === 0 && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <Brain className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('admin.no_metrics', 'No Metrics Available')}</h3>
                  <p className="text-gray-600 mb-4">{t('admin.metrics_collected_auto', 'System metrics are collected automatically every 5 minutes via the edge function.')}</p>
                  <p className="text-sm text-gray-500">{t('admin.waiting_first_metric', 'Waiting for first metric collection...')}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.api_performance_details', 'API Performance Details')}</CardTitle>
              <CardDescription>{t('admin.detailed_api_metrics', 'Detailed API performance metrics and logs')}</CardDescription>
            </CardHeader>
            <CardContent><p className="text-muted-foreground">{t('admin.api_content_placeholder', 'Detailed API performance content will appear here.')}</p></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.system_resources_details', 'System Resources Details')}</CardTitle>
              <CardDescription>{t('admin.detailed_resource_metrics', 'Detailed system resource metrics')}</CardDescription>
            </CardHeader>
            <CardContent><p className="text-muted-foreground">{t('admin.resources_content_placeholder', 'Detailed system resources content will appear here.')}</p></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.incident_history', 'Incident History')}</CardTitle>
              <CardDescription>{t('admin.complete_incident_history', 'Complete incident history and resolutions')}</CardDescription>
            </CardHeader>
            <CardContent><p className="text-muted-foreground">{t('admin.incidents_content_placeholder', 'Incident history content will appear here.')}</p></CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemHealthPage;
