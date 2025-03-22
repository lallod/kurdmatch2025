
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
  UserCheck, 
  UserX, 
  Eye, 
  Clock, 
  Filter 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const VerificationPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for verification requests
  const verificationRequests = [
    {
      id: '1',
      userId: 'user-123',
      userName: 'John Smith',
      email: 'john.smith@example.com',
      documentType: 'Driver License',
      submittedDate: '2023-05-15',
      status: 'pending',
      priority: 'high'
    },
    {
      id: '2',
      userId: 'user-456',
      userName: 'Emma Johnson',
      email: 'emma.johnson@example.com',
      documentType: 'Passport',
      submittedDate: '2023-05-14',
      status: 'pending',
      priority: 'medium'
    },
    {
      id: '3',
      userId: 'user-789',
      userName: 'Michael Brown',
      email: 'michael.brown@example.com',
      documentType: 'ID Card',
      submittedDate: '2023-05-13',
      status: 'verified',
      priority: 'normal'
    },
    {
      id: '4',
      userId: 'user-101',
      userName: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      documentType: 'Driver License',
      submittedDate: '2023-05-12',
      status: 'rejected',
      priority: 'normal'
    },
    {
      id: '5',
      userId: 'user-112',
      userName: 'James Davis',
      email: 'james.davis@example.com',
      documentType: 'Passport',
      submittedDate: '2023-05-12',
      status: 'pending',
      priority: 'high'
    }
  ];

  // Filter requests based on search term and status
  const filteredRequests = verificationRequests.filter(request => {
    const matchesSearch = 
      request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Mock function for user verification actions
  const handleUserVerification = (userId: string, action: 'verify' | 'reject') => {
    console.log(`User ${userId} ${action === 'verify' ? 'verified' : 'rejected'}`);
    // In a real app, this would call an API to update the user's verification status
  };

  // Status badge component
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending Review</Badge>;
      case 'verified':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Verified</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Priority badge component
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="ai">High</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>;
      case 'normal':
        return <Badge variant="outline">Normal</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">User Verification</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Clock size={16} />
            History
          </Button>
          <Button className="gap-2">
            <UserCheck size={16} />
            Verification Settings
          </Button>
        </div>
      </div>

      {/* AI banner */}
      <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-tinder-rose/5 to-tinder-orange/5 border border-tinder-rose/10 flex items-center">
        <Brain size={24} className="text-tinder-rose mr-3" />
        <div>
          <h3 className="font-semibold text-gray-800">AI-Enhanced Verification</h3>
          <p className="text-sm text-gray-600">Our AI system pre-validates documents and flags potential issues for your review</p>
        </div>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending Review (3)</TabsTrigger>
          <TabsTrigger value="verified">Verified (1)</TabsTrigger>
          <TabsTrigger value="rejected">Rejected (1)</TabsTrigger>
          <TabsTrigger value="flagged">AI Flagged (2)</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name or email..."
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
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
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
                      <TableHead>User</TableHead>
                      <TableHead>Document Type</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.length > 0 ? (
                      filteredRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>
                            <div className="font-medium">{request.userName}</div>
                            <div className="text-sm text-gray-500">{request.email}</div>
                          </TableCell>
                          <TableCell>{request.documentType}</TableCell>
                          <TableCell>{request.submittedDate}</TableCell>
                          <TableCell>{getStatusBadge(request.status)}</TableCell>
                          <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm">
                                <Eye size={16} />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-300"
                                onClick={() => handleUserVerification(request.userId, 'verify')}
                              >
                                <UserCheck size={16} />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                                onClick={() => handleUserVerification(request.userId, 'reject')}
                              >
                                <UserX size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6">
                          No verification requests found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verified">
          <Card>
            <CardHeader>
              <CardTitle>Verified Users</CardTitle>
              <CardDescription>Users who have completed the verification process</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Verified users content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Verifications</CardTitle>
              <CardDescription>Users whose verification was rejected</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Rejected verifications content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flagged">
          <Card>
            <CardHeader>
              <CardTitle>AI Flagged Requests</CardTitle>
              <CardDescription>Verification requests flagged by our AI system for potential issues</CardDescription>
            </CardHeader>
            <CardContent>
              <p>AI flagged requests content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VerificationPage;
