
import React, { useState } from 'react';
import { useAdminEmailCampaigns } from '../hooks/useAdminEmailCampaigns';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/useTranslations';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Mail, 
  CalendarClock, 
  Users, 
  Edit, 
  Trash, 
  Copy, 
  Plus, 
  Filter, 
  PlayCircle, 
  PauseCircle, 
  Eye, 
  Brain 
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';

const EmailCampaignsPage = () => {
  const { t } = useTranslations();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [newCampaignOpen, setNewCampaignOpen] = useState(false);
  const { campaigns: emailCampaigns, loading, createCampaign, updateCampaign, deleteCampaign } = useAdminEmailCampaigns();

  // Filter campaigns based on search term and status
  const filteredCampaigns = emailCampaigns.filter(campaign => {
    const matchesSearch = 
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (campaign.target_audience || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      campaign.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Status badge component
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">{t('admin.active', 'Active')}</Badge>;
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">{t('admin.scheduled', 'Scheduled')}</Badge>;
      case 'paused':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">{t('admin.paused_campaigns', 'Paused')}</Badge>;
      case 'draft':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">{t('admin.draft', 'Draft')}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleCampaignAction = async (campaignId: string, action: 'start' | 'pause' | 'duplicate' | 'delete') => {
    if (action === 'start') {
      await updateCampaign(campaignId, { status: 'active' });
      toast.success(t('admin.campaign_started', 'Campaign started'));
    } else if (action === 'pause') {
      await updateCampaign(campaignId, { status: 'paused' });
      toast.success(t('admin.campaign_paused', 'Campaign paused'));
    } else if (action === 'delete') {
      await deleteCampaign(campaignId);
      toast.success(t('admin.campaign_deleted', 'Campaign deleted'));
    }
  };

  const viewCampaignDetails = (campaign: any) => {
    setSelectedCampaign(campaign);
  };

  const COLORS = ['#FF4B91', '#FF6B55', '#8075FF', '#2563EB', '#10B981'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">{t('admin.email_campaigns_title', 'Email Campaigns')}</h1>
        <Button onClick={() => setNewCampaignOpen(true)} className="gap-2">
          <Plus size={16} />
          {t('admin.new_campaign', 'New Campaign')}
        </Button>
      </div>

      {/* AI banner */}
      <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-tinder-rose/5 to-tinder-orange/5 border border-tinder-rose/10 flex items-center">
        <Brain size={24} className="text-tinder-rose mr-3" />
        <div>
          <h3 className="font-semibold text-gray-800">{t('admin.ai_email_optimization', 'AI-Powered Email Optimization')}</h3>
          <p className="text-sm text-gray-600">{t('admin.ai_email_optimization_desc', 'Our AI system analyzes campaign performance and suggests optimizations for subject lines, content, and send times')}</p>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">{t('admin.all_campaigns', 'All Campaigns')}</TabsTrigger>
          <TabsTrigger value="active">{t('admin.active', 'Active')} (2)</TabsTrigger>
          <TabsTrigger value="scheduled">{t('admin.scheduled', 'Scheduled')} (1)</TabsTrigger>
          <TabsTrigger value="paused">{t('admin.paused_campaigns', 'Paused')} (1)</TabsTrigger>
          <TabsTrigger value="draft">{t('admin.draft', 'Draft')} (1)</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={t('admin.search_campaigns', 'Search campaigns...')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={t('admin.filter_by_status', 'Filter by status')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('admin.all_statuses', 'All Statuses')}</SelectItem>
                      <SelectItem value="active">{t('admin.active', 'Active')}</SelectItem>
                      <SelectItem value="scheduled">{t('admin.scheduled', 'Scheduled')}</SelectItem>
                      <SelectItem value="paused">{t('admin.paused_campaigns', 'Paused')}</SelectItem>
                      <SelectItem value="draft">{t('admin.draft', 'Draft')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter size={16} />
                  </Button>
                </div>
              </div>

              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('admin.campaign_name', 'Campaign Name')}</TableHead>
                      <TableHead>{t('admin.status', 'Status')}</TableHead>
                      <TableHead>{t('admin.audience', 'Audience')}</TableHead>
                      <TableHead>{t('admin.last_sent', 'Last Sent')}</TableHead>
                      <TableHead>{t('admin.next_send', 'Next Send')}</TableHead>
                      <TableHead>{t('admin.opens', 'Opens')}</TableHead>
                      <TableHead>{t('admin.clicks', 'Clicks')}</TableHead>
                      <TableHead className="text-right">{t('admin.actions', 'Actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCampaigns.length > 0 ? (
                      filteredCampaigns.map((campaign) => (
                        <TableRow key={campaign.id} onClick={() => viewCampaignDetails(campaign)} className="cursor-pointer">
                          <TableCell className="font-medium">{campaign.name}</TableCell>
                          <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                          <TableCell>{campaign.target_audience || t('admin.all_users', 'All users')}</TableCell>
                          <TableCell>{campaign.sent_date ? new Date(campaign.sent_date).toLocaleDateString() : '-'}</TableCell>
                          <TableCell>{campaign.scheduled_date ? new Date(campaign.scheduled_date).toLocaleDateString() : '-'}</TableCell>
                          <TableCell>
                            {campaign.status !== 'draft' && campaign.sent_count > 0 ? (
                              <span className="text-green-600">{((campaign.opened_count / campaign.sent_count) * 100).toFixed(1)}%</span>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell>
                            {campaign.status !== 'draft' && campaign.sent_count > 0 ? (
                              <span className="text-blue-600">{((campaign.clicked_count / campaign.sent_count) * 100).toFixed(1)}%</span>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={(e) => { e.stopPropagation(); }}
                              >
                                <Eye size={16} />
                              </Button>
                              {(campaign.status === 'draft' || campaign.status === 'paused') && (
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  className="text-green-600 hover:text-green-700 hover:border-green-300"
                                  onClick={(e) => { e.stopPropagation(); handleCampaignAction(campaign.id, 'start'); }}
                                >
                                  <PlayCircle size={16} />
                                </Button>
                              )}
                              {campaign.status === 'active' && (
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  className="text-amber-600 hover:text-amber-700 hover:border-amber-300"
                                  onClick={(e) => { e.stopPropagation(); handleCampaignAction(campaign.id, 'pause'); }}
                                >
                                  <PauseCircle size={16} />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6">
                          {t('admin.no_campaigns_found', 'No campaigns found')}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {selectedCampaign && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedCampaign.name}</CardTitle>
                    <CardDescription>
                      {t('admin.audience', 'Audience')}: {selectedCampaign.audience}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Copy size={16} />
                      {t('admin.duplicate', 'Duplicate')}
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit size={16} />
                      {t('admin.edit', 'Edit')}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {selectedCampaign.status !== 'draft' ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="p-4 border rounded-lg bg-white space-y-2">
                        <div className="text-sm text-gray-500">{t('admin.status', 'Status')}</div>
                        <div className="font-semibold flex items-center">
                          {getStatusBadge(selectedCampaign.status)}
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg bg-white space-y-2">
                        <div className="text-sm text-gray-500">{t('admin.last_sent', 'Last Sent')}</div>
                        <div className="font-semibold">{selectedCampaign.lastSent}</div>
                      </div>
                      <div className="p-4 border rounded-lg bg-white space-y-2">
                        <div className="text-sm text-gray-500">{t('admin.next_send', 'Next Send')}</div>
                        <div className="font-semibold">{selectedCampaign.nextSend || t('admin.not_scheduled', 'Not scheduled')}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">{t('admin.campaign_performance', 'Campaign Performance')}</h3>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: 'Opens', value: selectedCampaign.metrics.opens },
                                  { name: 'Clicks', value: selectedCampaign.metrics.clicks },
                                  { name: 'Unopened', value: selectedCampaign.metrics.sent - selectedCampaign.metrics.opens - selectedCampaign.metrics.bounced },
                                  { name: 'Bounced', value: selectedCampaign.metrics.bounced },
                                  { name: 'Unsubscribes', value: selectedCampaign.metrics.unsubscribes }
                                ]}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {[0, 1, 2, 3, 4].map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => `${value} emails`} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-4">{t('admin.daily_engagement', 'Daily Engagement')}</h3>
                        <ChartContainer
                          config={{
                            opens: { color: "#8075FF" },
                            clicks: { color: "#FF4B91" }
                          }}
                          className="h-80"
                        >
                          <BarChart data={selectedCampaign.engagementData}>
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
                              dataKey="opens" 
                              fill="var(--color-opens)" 
                              name="Opens" 
                            />
                            <Bar 
                              dataKey="clicks" 
                              fill="var(--color-clicks)" 
                              name="Clicks" 
                            />
                          </BarChart>
                        </ChartContainer>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg bg-blue-50">
                      <h4 className="font-semibold text-blue-800 mb-2">{t('admin.ai_recommendations', 'AI Recommendations')}</h4>
                      <p className="text-blue-700">
                        {t('admin.ai_recommendations_text', 'Based on engagement patterns, we recommend sending this campaign on Tuesdays or Wednesdays for optimal open rates. Testing a more direct subject line could improve click-through rates, as similar campaigns have seen 15% higher engagement with concise subject lines.')}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-10">
                    <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('admin.draft_campaign', 'Draft Campaign')}</h3>
                    <p className="text-gray-600 mb-6">{t('admin.draft_no_metrics', "This campaign hasn't been sent yet. No performance metrics available.")}</p>
                    <div className="flex justify-center gap-4">
                      <Button variant="outline" className="gap-2">
                        <Edit size={16} />
                        {t('admin.edit_campaign', 'Edit Campaign')}
                      </Button>
                      <Button className="gap-2">
                        <PlayCircle size={16} />
                        {t('admin.schedule_campaign', 'Schedule Campaign')}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
              {selectedCampaign.status === 'active' && (
                <CardFooter className="border-t p-4 bg-gray-50">
                  <div className="w-full flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {t('admin.next_send', 'Next Send')}: {selectedCampaign.nextSend}
                    </span>
                    <Button variant="outline" size="sm" className="gap-2 text-amber-600 hover:text-amber-700 border-amber-200 hover:border-amber-300">
                      <PauseCircle size={16} />
                      {t('admin.pause_campaign', 'Pause Campaign')}
                    </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          )}
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.active_campaigns', 'Active Campaigns')}</CardTitle>
              <CardDescription>{t('admin.active_campaigns_desc', 'Campaigns that are currently active')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{t('admin.active_campaigns_placeholder', 'Active campaigns content will appear here.')}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.scheduled_campaigns', 'Scheduled Campaigns')}</CardTitle>
              <CardDescription>{t('admin.scheduled_campaigns_desc', 'Campaigns that are scheduled to be sent')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{t('admin.scheduled_campaigns_placeholder', 'Scheduled campaigns content will appear here.')}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paused">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.paused_campaigns_title', 'Paused Campaigns')}</CardTitle>
              <CardDescription>{t('admin.paused_campaigns_desc', 'Campaigns that have been paused')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{t('admin.paused_campaigns_placeholder', 'Paused campaigns content will appear here.')}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="draft">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.draft_campaigns', 'Draft Campaigns')}</CardTitle>
              <CardDescription>{t('admin.draft_campaigns_desc', 'Campaigns in preparation')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{t('admin.draft_campaigns_placeholder', 'Draft campaigns content will appear here.')}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Campaign Dialog */}
      <Dialog open={newCampaignOpen} onOpenChange={setNewCampaignOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t('admin.create_campaign', 'Create New Email Campaign')}</DialogTitle>
            <DialogDescription>
              {t('admin.create_campaign_desc', 'Set up a new email campaign to engage with your users.')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="campaign-name" className="text-sm font-medium">{t('admin.campaign_name', 'Campaign Name')}</label>
              <Input id="campaign-name" placeholder={t('admin.campaign_name_placeholder', 'e.g., Summer Promotion')} />
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">{t('admin.target_audience', 'Target Audience')}</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder={t('admin.select_audience', 'Select audience')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('admin.all_users', 'All Users')}</SelectItem>
                  <SelectItem value="new">{t('admin.new_users', 'New Users')}</SelectItem>
                  <SelectItem value="inactive">{t('admin.inactive_users', 'Inactive Users')}</SelectItem>
                  <SelectItem value="premium">{t('admin.premium_users', 'Premium Users')}</SelectItem>
                  <SelectItem value="free">{t('admin.free_users', 'Free Users')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="subject-line" className="text-sm font-medium">{t('admin.subject_line', 'Subject Line')}</label>
              <Input id="subject-line" placeholder={t('admin.subject_placeholder', 'Enter email subject line')} />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="email-content" className="text-sm font-medium">{t('admin.email_content', 'Email Content')}</label>
              <Textarea 
                id="email-content" 
                placeholder={t('admin.email_content_placeholder', 'Enter email content...')} 
                className="min-h-[150px]"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">{t('admin.send_date', 'Send Date')}</label>
                <Input type="date" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">{t('admin.send_time', 'Send Time')}</label>
                <Input type="time" />
              </div>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">{t('admin.campaign_type', 'Campaign Type')}</label>
              <Select defaultValue="one-time">
                <SelectTrigger>
                  <SelectValue placeholder={t('admin.select_type', 'Select campaign type')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one-time">{t('admin.one_time', 'One-time Campaign')}</SelectItem>
                  <SelectItem value="recurring">{t('admin.recurring', 'Recurring Campaign')}</SelectItem>
                  <SelectItem value="automated">{t('admin.automated', 'Automated Trigger Campaign')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewCampaignOpen(false)}>{t('common.cancel', 'Cancel')}</Button>
            <Button variant="outline">{t('admin.save_draft', 'Save as Draft')}</Button>
            <Button>{t('admin.schedule_campaign', 'Schedule Campaign')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailCampaignsPage;
