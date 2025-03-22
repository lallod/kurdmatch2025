
import React, { useState } from 'react';
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
  CardDescription 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Flag, 
  CheckCircle, 
  XCircle,
  MessageSquare,
  Image,
  User,
  AlertTriangle,
  Brain
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const ModerationPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for moderation queue
  const moderationItems = [
    {
      id: '1',
      contentType: 'message',
      content: 'Hey, want to take this conversation off the app?',
      reporterId: 'user-789',
      reporterName: 'Emily Wilson',
      reportedUserId: 'user-456',
      reportedUserName: 'Jake Miller',
      reportDate: '2023-05-15',
      status: 'pending',
      aiRisk: 'high'
    },
    {
      id: '2',
      contentType: 'photo',
      content: 'profile_image_3.jpg',
      reporterId: 'user-345',
      reporterName: 'Michael Thompson',
      reportedUserId: 'user-678',
      reportedUserName: 'Sophia Rodriguez',
      reportDate: '2023-05-14',
      status: 'pending',
      aiRisk: 'high'
    },
    {
      id: '3',
      contentType: 'profile',
      content: 'Potentially misleading information in profile description',
      reporterId: 'user-123',
      reporterName: 'David Johnson',
      reportedUserId: 'user-234',
      reportedUserName: 'Olivia Davis',
      reportDate: '2023-05-14',
      status: 'pending',
      aiRisk: 'medium'
    },
    {
      id: '4',
      contentType: 'message',
      content: 'Multiple messages asking for financial information',
      reporterId: 'user-567',
      reporterName: 'Sarah Brown',
      reportedUserId: 'user-890',
      reportedUserName: 'Robert Wilson',
      reportDate: '2023-05-13',
      status: 'reviewed',
      aiRisk: 'medium'
    },
    {
      id: '5',
      contentType: 'photo',
      content: 'group_photo_2.jpg',
      reporterId: 'user-234',
      reporterName: 'Jennifer Taylor',
      reportedUserId: 'user-345',
      reportedUserName: 'Daniel Martinez',
      reportDate: '2023-05-12',
      status: 'reviewed',
      aiRisk: 'low'
    }
  ];

  // Filter items based on search term, content type and status
  const filteredItems = moderationItems.filter(item => {
    const matchesSearch = 
      item.reportedUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = 
      typeFilter === 'all' || 
      item.contentType === typeFilter;
    
    const matchesStatus = 
      statusFilter === 'all' || 
      item.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Mock function for moderation actions
  const handleModeration = (itemId: string, action: 'approve' | 'reject') => {
    console.log(`Content ${itemId} ${action === 'approve' ? 'approved' : 'rejected'}`);
    // In a real app, this would call an API to update the content's moderation status
  };

  // Content type icon component
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare size={16} className="text-blue-500" />;
      case 'photo':
        return <Image size={16} className="text-purple-500" />;
      case 'profile':
        return <User size={16} className="text-green-500" />;
      default:
        return <Flag size={16} />;
    }
  };

  // Risk level badge component
  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'high':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">High Risk</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Medium Risk</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Low Risk</Badge>;
      default:
        return <Badge>{risk}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Content Moderation</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <AlertTriangle size={16} />
            Flagged Content
          </Button>
          <Button className="gap-2">
            <Flag size={16} />
            Moderation Settings
          </Button>
        </div>
      </div>

      {/* AI banner */}
      <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-tinder-rose/5 to-tinder-orange/5 border border-tinder-rose/10 flex items-center">
        <Brain size={24} className="text-tinder-rose mr-3" />
        <div>
          <h3 className="font-semibold text-gray-800">AI-Powered Content Moderation</h3>
          <p className="text-sm text-gray-600">Our AI system pre-screens content and assigns risk levels to help prioritize your review</p>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Content (5)</TabsTrigger>
          <TabsTrigger value="messages">Messages (2)</TabsTrigger>
          <TabsTrigger value="photos">Photos (2)</TabsTrigger>
          <TabsTrigger value="profiles">Profiles (1)</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by user or content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="message">Messages</SelectItem>
                      <SelectItem value="photo">Photos</SelectItem>
                      <SelectItem value="profile">Profiles</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
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
                      <TableHead>Type</TableHead>
                      <TableHead>Content</TableHead>
                      <TableHead>Reported User</TableHead>
                      <TableHead>Reported By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>AI Risk Level</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center">
                              {getContentTypeIcon(item.contentType)}
                              <span className="ml-2 capitalize">{item.contentType}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate">{item.content}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{item.reportedUserName}</div>
                            <div className="text-xs text-gray-500">{item.reportedUserId}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{item.reporterName}</div>
                            <div className="text-xs text-gray-500">{item.reporterId}</div>
                          </TableCell>
                          <TableCell>{item.reportDate}</TableCell>
                          <TableCell>{getRiskBadge(item.aiRisk)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="icon" className="text-green-600 hover:text-green-700 hover:border-green-300">
                                <CheckCircle size={16} />
                              </Button>
                              <Button variant="outline" size="icon" className="text-red-600 hover:text-red-700 hover:border-red-300">
                                <XCircle size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          No moderation items found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Message Moderation</CardTitle>
              <CardDescription>Review and moderate reported messages</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Message moderation content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photos">
          <Card>
            <CardHeader>
              <CardTitle>Photo Moderation</CardTitle>
              <CardDescription>Review and moderate reported photos</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Photo moderation content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profiles">
          <Card>
            <CardHeader>
              <CardTitle>Profile Moderation</CardTitle>
              <CardDescription>Review and moderate reported profiles</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Profile moderation content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModerationPage;
