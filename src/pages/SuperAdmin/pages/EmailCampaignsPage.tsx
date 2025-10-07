
import React, { useState } from 'react';
import { useAdminEmailCampaigns } from '../hooks/useAdminEmailCampaigns';
import { useToast } from '@/hooks/use-toast';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [newCampaignOpen, setNewCampaignOpen] = useState(false);
  const { campaigns: emailCampaigns, loading, createCampaign, updateCampaign, deleteCampaign } = useAdminEmailCampaigns();
  const { toast } = useToast();
    {
      id: '1',
      name: 'Welcome Series',
      status: 'active',
      audience: 'New Users',
      lastSent: '2023-05-18',
      nextSend: '2023-05-25',
      opens: 68.4,
      clicks: 24.2,
      unsubscribes: 0.8,
      metrics: {
        opens: 1243,
        clicks: 439,
        unsubscribes: 15,
        sent: 1817,
        bounced: 12
      },
      engagementData: [
        { day: 'Mon', opens: 180, clicks: 65 },
        { day: 'Tue', opens: 195, clicks: 73 },
        { day: 'Wed', opens: 210, clicks: 78 },
        { day: 'Thu', opens: 190, clicks: 68 },
        { day: 'Fri', opens: 175, clicks: 59 },
        { day: 'Sat', opens: 160, clicks: 52 },
        { day: 'Sun', opens: 133, clicks: 44 },
      ]
    },
    {
      id: '2',
      name: 'Monthly Newsletter',
      status: 'scheduled',
      audience: 'All Subscribers',
      lastSent: '2023-04-15',
      nextSend: '2023-05-20',
      opens: 54.1,
      clicks: 18.5,
      unsubscribes: 1.2,
      metrics: {
        opens: 4532,
        clicks: 1532,
        unsubscribes: 98,
        sent: 8372,
        bounced: 43
      },
      engagementData: [
        { day: 'Mon', opens: 580, clicks: 210 },
        { day: 'Tue', opens: 620, clicks: 230 },
        { day: 'Wed', opens: 690, clicks: 245 },
        { day: 'Thu', opens: 710, clicks: 260 },
        { day: 'Fri', opens: 640, clicks: 235 },
        { day: 'Sat', opens: 520, clicks: 180 },
        { day: 'Sun', opens: 430, clicks: 145 },
      ]
    },
    {
      id: '3',
      name: 'Re-engagement Campaign',
      status: 'draft',
      audience: 'Inactive Users',
      lastSent: '-',
      nextSend: '-',
      opens: 0,
      clicks: 0,
      unsubscribes: 0,
      metrics: {
        opens: 0,
        clicks: 0,
        unsubscribes: 0,
        sent: 0,
        bounced: 0
      },
      engagementData: []
    },
    {
      id: '4',
      name: 'Premium Upgrade Promotion',
      status: 'active',
      audience: 'Free Users',
      lastSent: '2023-05-10',
      nextSend: '2023-05-17',
      opens: 61.8,
      clicks: 29.4,
      unsubscribes: 0.5,
      metrics: {
        opens: 3254,
        clicks: 1547,
        unsubscribes: 26,
        sent: 5267,
        bounced: 31
      },
      engagementData: [
        { day: 'Mon', opens: 480, clicks: 230 },
        { day: 'Tue', opens: 510, clicks: 245 },
        { day: 'Wed', opens: 545, clicks: 265 },
        { day: 'Thu', opens: 520, clicks: 250 },
        { day: 'Fri', opens: 490, clicks: 235 },
        { day: 'Sat', opens: 410, clicks: 195 },
        { day: 'Sun', opens: 380, clicks: 180 },
      ]
    },
    {
      id: '5',
      name: 'Feature Announcement',
      status: 'paused',
      audience: 'All Users',
      lastSent: '2023-05-05',
      nextSend: '-',
      opens: 72.3,
      clicks: 35.8,
      unsubscribes: 0.3,
      metrics: {
        opens: 5843,
        clicks: 2891,
        unsubscribes: 24,
        sent: 8083,
        bounced: 45
      },
      engagementData: [
        { day: 'Mon', opens: 780, clicks: 390 },
        { day: 'Tue', opens: 820, clicks: 410 },
        { day: 'Wed', opens: 890, clicks: 440 },
        { day: 'Thu', opens: 960, clicks: 470 },
        { day: 'Fri', opens: 840, clicks: 415 },
        { day: 'Sat', opens: 750, clicks: 370 },
        { day: 'Sun', opens: 630, clicks: 310 },
      ]
    }
  ];

  // Filter campaigns based on search term and status
  const filteredCampaigns = emailCampaigns.filter(campaign => {
    const matchesSearch = 
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.audience.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      campaign.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Status badge component
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Scheduled</Badge>;
      case 'paused':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Paused</Badge>;
      case 'draft':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Draft</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleCampaignAction = async (campaignId: string, action: 'start' | 'pause' | 'duplicate' | 'delete') => {
    if (action === 'start') {
      await updateCampaign(campaignId, { status: 'active' });
      toast({ title: "Campaign started" });
    } else if (action === 'pause') {
      await updateCampaign(campaignId, { status: 'paused' });
      toast({ title: "Campaign paused" });
    } else if (action === 'delete') {
      await deleteCampaign(campaignId);
      toast({ title: "Campaign deleted" });
    }
  };

  const viewCampaignDetails = (campaign: any) => {
    setSelectedCampaign(campaign);
  };

  const COLORS = ['#FF4B91', '#FF6B55', '#8075FF', '#2563EB', '#10B981'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Email Campaigns</h1>
        <Button onClick={() => setNewCampaignOpen(true)} className="gap-2">
          <Plus size={16} />
          New Campaign
        </Button>
      </div>

      {/* AI banner */}
      <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-tinder-rose/5 to-tinder-orange/5 border border-tinder-rose/10 flex items-center">
        <Brain size={24} className="text-tinder-rose mr-3" />
        <div>
          <h3 className="font-semibold text-gray-800">AI-Powered Email Optimization</h3>
          <p className="text-sm text-gray-600">Our AI system analyzes campaign performance and suggests optimizations for subject lines, content, and send times</p>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Campaigns</TabsTrigger>
          <TabsTrigger value="active">Active (2)</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled (1)</TabsTrigger>
          <TabsTrigger value="paused">Paused (1)</TabsTrigger>
          <TabsTrigger value="draft">Draft (1)</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search campaigns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
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
                      <TableHead>Campaign Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Audience</TableHead>
                      <TableHead>Last Sent</TableHead>
                      <TableHead>Next Send</TableHead>
                      <TableHead>Opens</TableHead>
                      <TableHead>Clicks</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCampaigns.length > 0 ? (
                      filteredCampaigns.map((campaign) => (
                        <TableRow key={campaign.id} onClick={() => viewCampaignDetails(campaign)} className="cursor-pointer">
                          <TableCell className="font-medium">{campaign.name}</TableCell>
                          <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                          <TableCell>{campaign.audience}</TableCell>
                          <TableCell>{campaign.lastSent}</TableCell>
                          <TableCell>{campaign.nextSend}</TableCell>
                          <TableCell>
                            {campaign.status !== 'draft' ? (
                              <span className="text-green-600">{campaign.opens}%</span>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell>
                            {campaign.status !== 'draft' ? (
                              <span className="text-blue-600">{campaign.clicks}%</span>
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
                          No campaigns found
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
                      Audience: {selectedCampaign.audience}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Copy size={16} />
                      Duplicate
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit size={16} />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {selectedCampaign.status !== 'draft' ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="p-4 border rounded-lg bg-white space-y-2">
                        <div className="text-sm text-gray-500">Status</div>
                        <div className="font-semibold flex items-center">
                          {getStatusBadge(selectedCampaign.status)}
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg bg-white space-y-2">
                        <div className="text-sm text-gray-500">Last Sent</div>
                        <div className="font-semibold">{selectedCampaign.lastSent}</div>
                      </div>
                      <div className="p-4 border rounded-lg bg-white space-y-2">
                        <div className="text-sm text-gray-500">Next Send</div>
                        <div className="font-semibold">{selectedCampaign.nextSend || 'Not scheduled'}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Campaign Performance</h3>
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
                        <h3 className="text-lg font-semibold mb-4">Daily Engagement</h3>
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
                      <h4 className="font-semibold text-blue-800 mb-2">AI Recommendations</h4>
                      <p className="text-blue-700">
                        Based on engagement patterns, we recommend sending this campaign on Tuesdays or Wednesdays 
                        for optimal open rates. Testing a more direct subject line could improve click-through rates, 
                        as similar campaigns have seen 15% higher engagement with concise subject lines.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-10">
                    <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Draft Campaign</h3>
                    <p className="text-gray-600 mb-6">This campaign hasn't been sent yet. No performance metrics available.</p>
                    <div className="flex justify-center gap-4">
                      <Button variant="outline" className="gap-2">
                        <Edit size={16} />
                        Edit Campaign
                      </Button>
                      <Button className="gap-2">
                        <PlayCircle size={16} />
                        Schedule Campaign
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
              {selectedCampaign.status === 'active' && (
                <CardFooter className="border-t p-4 bg-gray-50">
                  <div className="w-full flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Next send: {selectedCampaign.nextSend}
                    </span>
                    <Button variant="outline" size="sm" className="gap-2 text-amber-600 hover:text-amber-700 border-amber-200 hover:border-amber-300">
                      <PauseCircle size={16} />
                      Pause Campaign
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
              <CardTitle>Active Campaigns</CardTitle>
              <CardDescription>Campaigns that are currently active</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Active campaigns content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Campaigns</CardTitle>
              <CardDescription>Campaigns that are scheduled to be sent</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Scheduled campaigns content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paused">
          <Card>
            <CardHeader>
              <CardTitle>Paused Campaigns</CardTitle>
              <CardDescription>Campaigns that have been paused</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Paused campaigns content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="draft">
          <Card>
            <CardHeader>
              <CardTitle>Draft Campaigns</CardTitle>
              <CardDescription>Campaigns in preparation</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Draft campaigns content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Campaign Dialog */}
      <Dialog open={newCampaignOpen} onOpenChange={setNewCampaignOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Email Campaign</DialogTitle>
            <DialogDescription>
              Set up a new email campaign to engage with your users.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="campaign-name" className="text-sm font-medium">Campaign Name</label>
              <Input id="campaign-name" placeholder="e.g., Summer Promotion" />
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Target Audience</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="new">New Users</SelectItem>
                  <SelectItem value="inactive">Inactive Users</SelectItem>
                  <SelectItem value="premium">Premium Users</SelectItem>
                  <SelectItem value="free">Free Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="subject-line" className="text-sm font-medium">Subject Line</label>
              <Input id="subject-line" placeholder="Enter email subject line" />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="email-content" className="text-sm font-medium">Email Content</label>
              <Textarea 
                id="email-content" 
                placeholder="Enter email content..." 
                className="min-h-[150px]"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Send Date</label>
                <Input type="date" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Send Time</label>
                <Input type="time" />
              </div>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Campaign Type</label>
              <Select defaultValue="one-time">
                <SelectTrigger>
                  <SelectValue placeholder="Select campaign type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one-time">One-time Campaign</SelectItem>
                  <SelectItem value="recurring">Recurring Campaign</SelectItem>
                  <SelectItem value="automated">Automated Trigger Campaign</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewCampaignOpen(false)}>Cancel</Button>
            <Button variant="outline">Save as Draft</Button>
            <Button>Schedule Campaign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailCampaignsPage;
