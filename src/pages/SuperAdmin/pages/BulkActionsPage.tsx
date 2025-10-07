
import React, { useState } from 'react';
import { useAdminBulkActions } from '../hooks/useAdminBulkActions';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  User, 
  Upload, 
  Download, 
  Search, 
  Filter, 
  FileSpreadsheet, 
  Play, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  RefreshCw, 
  Brain 
} from 'lucide-react';
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
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const BulkActionsPage = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedJobType, setSelectedJobType] = useState<string | null>(null);
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');
  const { executeBulkAction, loading: bulkActionLoading } = useAdminBulkActions();

  // Mock data for bulk action jobs
  const bulkActionJobs = [
    {
      id: 'BULK-1001',
      name: 'May 2023 Status Update',
      type: 'status-update',
      status: 'completed',
      affectedUsers: 125,
      createdBy: 'admin@example.com',
      timestamp: '2023-05-15 09:30',
      completedAt: '2023-05-15 09:32'
    },
    {
      id: 'BULK-1002',
      name: 'Profile Verification Reminder',
      type: 'email-notification',
      status: 'completed',
      affectedUsers: 543,
      createdBy: 'marketing@example.com',
      timestamp: '2023-05-10 15:45',
      completedAt: '2023-05-10 15:48'
    },
    {
      id: 'BULK-1003',
      name: 'Inactive Users Suspension',
      type: 'account-suspension',
      status: 'processing',
      affectedUsers: 78,
      createdBy: 'admin@example.com',
      timestamp: '2023-05-18 11:20',
      completedAt: null
    },
    {
      id: 'BULK-1004',
      name: 'Premium Trial Offer',
      type: 'role-update',
      status: 'scheduled',
      affectedUsers: 250,
      createdBy: 'marketing@example.com',
      timestamp: '2023-05-17 16:30',
      completedAt: null
    },
    {
      id: 'BULK-1005',
      name: 'Data Migration',
      type: 'data-update',
      status: 'failed',
      affectedUsers: 1250,
      createdBy: 'system@example.com',
      timestamp: '2023-05-16 03:15',
      completedAt: '2023-05-16 03:18'
    }
  ];

  // Mock data for user profiles (for bulk selection)
  const userProfiles = [
    { id: 'user-001', name: 'John Smith', email: 'john.smith@example.com', status: 'active', role: 'premium' },
    { id: 'user-002', name: 'Emma Johnson', email: 'emma.johnson@example.com', status: 'active', role: 'standard' },
    { id: 'user-003', name: 'Michael Brown', email: 'michael.brown@example.com', status: 'inactive', role: 'standard' },
    { id: 'user-004', name: 'Olivia Davis', email: 'olivia.davis@example.com', status: 'active', role: 'premium' },
    { id: 'user-005', name: 'William Wilson', email: 'william.wilson@example.com', status: 'suspended', role: 'standard' },
    { id: 'user-006', name: 'Sophia Martinez', email: 'sophia.martinez@example.com', status: 'active', role: 'standard' },
    { id: 'user-007', name: 'James Jones', email: 'james.jones@example.com', status: 'active', role: 'standard' },
    { id: 'user-008', name: 'Charlotte Garcia', email: 'charlotte.garcia@example.com', status: 'active', role: 'premium' },
    { id: 'user-009', name: 'Benjamin Miller', email: 'benjamin.miller@example.com', status: 'inactive', role: 'standard' },
    { id: 'user-010', name: 'Amelia Rodriguez', email: 'amelia.rodriguez@example.com', status: 'active', role: 'standard' }
  ];

  // Filter jobs based on search term and status
  const filteredJobs = bulkActionJobs.filter(job => {
    const matchesSearch = 
      job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      job.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Status badge component
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Processing</Badge>;
      case 'scheduled':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">Scheduled</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>;
      case 'active':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>;
      case 'suspended':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Suspended</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Type icon component
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'status-update':
        return <RefreshCw size={16} className="text-blue-500" />;
      case 'email-notification':
        return <Download size={16} className="text-purple-500" />;
      case 'account-suspension':
        return <XCircle size={16} className="text-red-500" />;
      case 'role-update':
        return <User size={16} className="text-amber-500" />;
      case 'data-update':
        return <FileSpreadsheet size={16} className="text-green-500" />;
      default:
        return <FileSpreadsheet size={16} />;
    }
  };

  // Mock functions
  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate data reload
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleSelectJobType = (type: string) => {
    setSelectedJobType(type);
    setSelectedProfiles([]);
  };

  const handleSelectProfile = (profileId: string) => {
    if (selectedProfiles.includes(profileId)) {
      setSelectedProfiles(selectedProfiles.filter(id => id !== profileId));
    } else {
      setSelectedProfiles([...selectedProfiles, profileId]);
    }
  };

  const handleSelectAllProfiles = () => {
    if (selectedProfiles.length === userProfiles.length) {
      setSelectedProfiles([]);
    } else {
      setSelectedProfiles(userProfiles.map(profile => profile.id));
    }
  };

  const handleStartBulkAction = () => {
    setConfirmDialog(true);
  };

  const handleConfirmBulkAction = async () => {
    if (!selectedJobType) return;
    
    await executeBulkAction({
      action: selectedJobType,
      userIds: selectedProfiles,
      data: {}
    });
    
    setConfirmDialog(false);
    setSelectedJobType(null);
    setSelectedProfiles([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Bulk User Actions</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setBulkImportOpen(true)}
          >
            <Upload size={16} />
            Import Users
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* AI banner */}
      <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-tinder-rose/5 to-tinder-orange/5 border border-tinder-rose/10 flex items-center">
        <Brain size={24} className="text-tinder-rose mr-3" />
        <div>
          <h3 className="font-semibold text-gray-800">AI-Powered User Segmentation</h3>
          <p className="text-sm text-gray-600">Our AI system analyzes user behavior patterns to suggest optimal user segments for targeted actions</p>
        </div>
      </div>

      <Tabs defaultValue="history">
        <TabsList className="mb-4">
          <TabsTrigger value="history">Action History</TabsTrigger>
          <TabsTrigger value="new">New Bulk Action</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search bulk actions..."
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
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
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
                      <TableHead>Job Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Affected Users</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredJobs.length > 0 ? (
                      filteredJobs.map((job) => (
                        <TableRow key={job.id}>
                          <TableCell>
                            <div className="font-medium">{job.name}</div>
                            <div className="text-xs text-gray-500">{job.id}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getTypeIcon(job.type)}
                              <span className="ml-2 capitalize">{job.type.replace('-', ' ')}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(job.status)}</TableCell>
                          <TableCell>{job.affectedUsers.toLocaleString()}</TableCell>
                          <TableCell>{job.createdBy}</TableCell>
                          <TableCell>
                            <div>{job.timestamp}</div>
                            {job.completedAt && <div className="text-xs text-gray-500">Completed: {job.completedAt}</div>}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          No bulk action jobs found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          {!selectedJobType ? (
            <Card>
              <CardHeader>
                <CardTitle>Select Bulk Action Type</CardTitle>
                <CardDescription>Choose the type of bulk action you want to perform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div 
                    className="p-4 border rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
                    onClick={() => handleSelectJobType('status-update')}
                  >
                    <div className="flex items-center mb-2">
                      <RefreshCw size={20} className="text-blue-500 mr-2" />
                      <h3 className="font-medium">Status Update</h3>
                    </div>
                    <p className="text-sm text-gray-600">Update the status of multiple user accounts</p>
                  </div>
                  <div 
                    className="p-4 border rounded-lg hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-colors"
                    onClick={() => handleSelectJobType('email-notification')}
                  >
                    <div className="flex items-center mb-2">
                      <Download size={20} className="text-purple-500 mr-2" />
                      <h3 className="font-medium">Email Notification</h3>
                    </div>
                    <p className="text-sm text-gray-600">Send an email to multiple users</p>
                  </div>
                  <div 
                    className="p-4 border rounded-lg hover:border-red-300 hover:bg-red-50 cursor-pointer transition-colors"
                    onClick={() => handleSelectJobType('account-suspension')}
                  >
                    <div className="flex items-center mb-2">
                      <XCircle size={20} className="text-red-500 mr-2" />
                      <h3 className="font-medium">Account Suspension</h3>
                    </div>
                    <p className="text-sm text-gray-600">Suspend multiple user accounts</p>
                  </div>
                  <div 
                    className="p-4 border rounded-lg hover:border-amber-300 hover:bg-amber-50 cursor-pointer transition-colors"
                    onClick={() => handleSelectJobType('role-update')}
                  >
                    <div className="flex items-center mb-2">
                      <User size={20} className="text-amber-500 mr-2" />
                      <h3 className="font-medium">Role Update</h3>
                    </div>
                    <p className="text-sm text-gray-600">Change the role of multiple users</p>
                  </div>
                  <div 
                    className="p-4 border rounded-lg hover:border-green-300 hover:bg-green-50 cursor-pointer transition-colors"
                    onClick={() => handleSelectJobType('data-update')}
                  >
                    <div className="flex items-center mb-2">
                      <FileSpreadsheet size={20} className="text-green-500 mr-2" />
                      <h3 className="font-medium">Data Update</h3>
                    </div>
                    <p className="text-sm text-gray-600">Update specific data fields for multiple users</p>
                  </div>
                  <div 
                    className="p-4 border rounded-lg hover:border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleSelectJobType('custom-action')}
                  >
                    <div className="flex items-center mb-2">
                      <Play size={20} className="text-gray-500 mr-2" />
                      <h3 className="font-medium">Custom Action</h3>
                    </div>
                    <p className="text-sm text-gray-600">Define a custom action for multiple users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center">
                        {getTypeIcon(selectedJobType)}
                        <span className="ml-2 capitalize">{selectedJobType.replace('-', ' ')}</span>
                      </CardTitle>
                      <CardDescription>Configure your bulk action settings</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setSelectedJobType(null)}>
                      Change Action Type
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid gap-2">
                      <label htmlFor="action-name" className="text-sm font-medium">Action Name</label>
                      <Input id="action-name" placeholder={`${selectedJobType.replace('-', ' ')} - ${new Date().toLocaleDateString()}`} />
                    </div>
                    
                    {selectedJobType === 'status-update' && (
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">New Status</label>
                        <RadioGroup defaultValue="active">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="active" id="status-active" />
                            <Label htmlFor="status-active">Active</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="inactive" id="status-inactive" />
                            <Label htmlFor="status-inactive">Inactive</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="suspended" id="status-suspended" />
                            <Label htmlFor="status-suspended">Suspended</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    )}
                    
                    {selectedJobType === 'email-notification' && (
                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <label htmlFor="email-subject" className="text-sm font-medium">Email Subject</label>
                          <Input id="email-subject" placeholder="Enter email subject" />
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="email-content" className="text-sm font-medium">Email Content</label>
                          <Textarea 
                            id="email-content" 
                            placeholder="Enter email content..." 
                            className="min-h-[150px]"
                          />
                        </div>
                      </div>
                    )}
                    
                    {selectedJobType === 'role-update' && (
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">New Role</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select new role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard User</SelectItem>
                            <SelectItem value="premium">Premium User</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Schedule</label>
                      <RadioGroup defaultValue="now">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="now" id="schedule-now" />
                          <Label htmlFor="schedule-now">Execute immediately</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="later" id="schedule-later" />
                          <Label htmlFor="schedule-later">Schedule for later</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Select Users</CardTitle>
                  <CardDescription>Choose which users to apply this action to</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">
                            <Checkbox 
                              checked={selectedProfiles.length === userProfiles.length}
                              onCheckedChange={handleSelectAllProfiles}
                            />
                          </TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Role</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userProfiles.map((profile) => (
                          <TableRow key={profile.id} className="cursor-pointer">
                            <TableCell>
                              <Checkbox 
                                checked={selectedProfiles.includes(profile.id)}
                                onCheckedChange={() => handleSelectProfile(profile.id)}
                              />
                            </TableCell>
                            <TableCell className="font-medium">{profile.name}</TableCell>
                            <TableCell>{profile.email}</TableCell>
                            <TableCell>{getStatusBadge(profile.status)}</TableCell>
                            <TableCell>
                              <Badge variant={profile.role === 'premium' ? 'default' : 'outline'}>
                                {profile.role}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm">
                      {selectedProfiles.length} users selected
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setSelectedJobType(null)}>Cancel</Button>
                      <Button 
                        onClick={handleStartBulkAction}
                        disabled={selectedProfiles.length === 0}
                      >
                        Start Bulk Action
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Actions</CardTitle>
              <CardDescription>Actions scheduled to run in the future</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Scheduled actions content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Bulk Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to perform this action on {selectedProfiles.length} users?
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md mb-4">
              <div className="flex items-start">
                <AlertTriangle className="text-amber-500 mr-2 h-5 w-5 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800">Warning</h4>
                  <p className="text-sm text-amber-700">
                    This action cannot be undone. It will affect {selectedProfiles.length} user accounts.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="confirmation" className="text-sm font-medium">Type "CONFIRM" to proceed</label>
              <Input id="confirmation" placeholder="CONFIRM" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog(false)}>Cancel</Button>
            <Button onClick={handleConfirmBulkAction}>Confirm Action</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Import Dialog */}
      <Dialog open={bulkImportOpen} onOpenChange={setBulkImportOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Bulk Import Users</DialogTitle>
            <DialogDescription>
              Upload a file to import multiple users at once
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Import Type</label>
              <Select defaultValue="new">
                <SelectTrigger>
                  <SelectValue placeholder="Select import type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Create New Users</SelectItem>
                  <SelectItem value="update">Update Existing Users</SelectItem>
                  <SelectItem value="both">Create and Update Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">File Format</label>
              <Select defaultValue="csv">
                <SelectTrigger>
                  <SelectValue placeholder="Select file format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xlsx">XLSX</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <div className="text-sm font-medium">Click to upload or drag and drop</div>
              <div className="text-xs text-gray-500 mt-1">Support for CSV, XLSX, JSON</div>
              <div className="mt-4">
                <Button size="sm" variant="outline">Select File</Button>
              </div>
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="send-email" />
                <label htmlFor="send-email" className="text-sm">Send welcome email to new users</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="override" />
                <label htmlFor="override" className="text-sm">Override existing data for duplicate users</label>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Button className="w-full" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkImportOpen(false)}>Cancel</Button>
            <Button>Upload and Start Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BulkActionsPage;
