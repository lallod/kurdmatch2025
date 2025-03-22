
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Calendar, 
  Download, 
  Eye, 
  RefreshCw, 
  User, 
  FileText, 
  Trash, 
  Edit, 
  Lock, 
  Unlock, 
  Plus, 
  Settings, 
  UserPlus,
  UserCheck,
  UserX,
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

const AuditLogsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLog, setSelectedLog] = useState<any>(null);

  // Mock data for audit logs
  const auditLogs = [
    {
      id: 'LOG-10045',
      action: 'user.create',
      user: 'admin@example.com',
      userRole: 'Admin',
      timestamp: '2023-05-18 14:32:45',
      ipAddress: '192.168.1.101',
      details: {
        userId: 'user-789',
        userName: 'John Smith',
        userEmail: 'john.smith@example.com'
      },
      status: 'success'
    },
    {
      id: 'LOG-10044',
      action: 'user.update',
      user: 'moderator@example.com',
      userRole: 'Moderator',
      timestamp: '2023-05-18 13:21:18',
      ipAddress: '192.168.1.105',
      details: {
        userId: 'user-456',
        field: 'status',
        oldValue: 'active',
        newValue: 'suspended',
        reason: 'Violation of terms'
      },
      status: 'success'
    },
    {
      id: 'LOG-10043',
      action: 'content.delete',
      user: 'moderator@example.com',
      userRole: 'Moderator',
      timestamp: '2023-05-18 11:45:22',
      ipAddress: '192.168.1.105',
      details: {
        contentType: 'photo',
        contentId: 'photo-12345',
        userId: 'user-234',
        reason: 'Inappropriate content'
      },
      status: 'success'
    },
    {
      id: 'LOG-10042',
      action: 'settings.update',
      user: 'admin@example.com',
      userRole: 'Admin',
      timestamp: '2023-05-17 16:38:09',
      ipAddress: '192.168.1.101',
      details: {
        setting: 'privacy.policy',
        oldValue: 'v1.2',
        newValue: 'v1.3'
      },
      status: 'success'
    },
    {
      id: 'LOG-10041',
      action: 'user.authentication',
      user: 'admin@example.com',
      userRole: 'Admin',
      timestamp: '2023-05-17 09:02:55',
      ipAddress: '192.168.1.120',
      details: {
        method: '2FA',
        device: 'Web Browser - Chrome 113.0.5672.93',
        location: 'New York, US'
      },
      status: 'failed'
    },
    {
      id: 'LOG-10040',
      action: 'user.authentication',
      user: 'admin@example.com',
      userRole: 'Admin',
      timestamp: '2023-05-17 09:04:10',
      ipAddress: '192.168.1.101',
      details: {
        method: '2FA',
        device: 'Web Browser - Chrome 113.0.5672.93',
        location: 'New York, US'
      },
      status: 'success'
    },
    {
      id: 'LOG-10039',
      action: 'role.update',
      user: 'admin@example.com',
      userRole: 'Admin',
      timestamp: '2023-05-16 15:22:30',
      ipAddress: '192.168.1.101',
      details: {
        userId: 'user-345',
        userName: 'Sarah Williams',
        oldRole: 'User',
        newRole: 'Moderator'
      },
      status: 'success'
    }
  ];

  // Filter logs based on search term, action type, and user
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = 
      actionFilter === 'all' || 
      log.action.split('.')[0] === actionFilter;
    
    const matchesUser = 
      userFilter === 'all' || 
      log.user === userFilter;
    
    return matchesSearch && matchesAction && matchesUser;
  });

  // Get unique users for filter
  const uniqueUsers = Array.from(new Set(auditLogs.map(log => log.user)));

  // Status badge component
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Success</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>;
      case 'warning':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Warning</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Action icon component
  const getActionIcon = (action: string) => {
    const actionType = action.split('.')[0];
    switch (actionType) {
      case 'user':
        if (action === 'user.create') return <UserPlus size={16} className="text-green-500" />;
        if (action === 'user.update') return <Edit size={16} className="text-blue-500" />;
        if (action === 'user.delete') return <UserX size={16} className="text-red-500" />;
        if (action === 'user.authentication') return <User size={16} className="text-purple-500" />;
        return <User size={16} className="text-gray-500" />;
      case 'content':
        if (action === 'content.create') return <Plus size={16} className="text-green-500" />;
        if (action === 'content.update') return <Edit size={16} className="text-blue-500" />;
        if (action === 'content.delete') return <Trash size={16} className="text-red-500" />;
        return <FileText size={16} className="text-gray-500" />;
      case 'settings':
        return <Settings size={16} className="text-blue-500" />;
      case 'role':
        return <UserCheck size={16} className="text-amber-500" />;
      case 'security':
        if (action === 'security.lock') return <Lock size={16} className="text-red-500" />;
        if (action === 'security.unlock') return <Unlock size={16} className="text-green-500" />;
        return <Lock size={16} className="text-gray-500" />;
      default:
        return <FileText size={16} className="text-gray-500" />;
    }
  };

  // Handle functions
  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate data reload
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleViewDetails = (log: any) => {
    setSelectedLog(log);
  };

  const handleExportLogs = () => {
    console.log('Exporting audit logs...');
    // In a real app, this would generate and download a file
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleExportLogs}
          >
            <Download size={16} />
            Export Logs
          </Button>
        </div>
      </div>

      {/* AI banner */}
      <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-tinder-rose/5 to-tinder-orange/5 border border-tinder-rose/10 flex items-center">
        <Brain size={24} className="text-tinder-rose mr-3" />
        <div>
          <h3 className="font-semibold text-gray-800">AI-Enhanced Audit Analysis</h3>
          <p className="text-sm text-gray-600">Our AI system detects unusual patterns in user and admin actions to help identify potential security issues</p>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Logs</TabsTrigger>
          <TabsTrigger value="user">User Actions</TabsTrigger>
          <TabsTrigger value="content">Content Actions</TabsTrigger>
          <TabsTrigger value="system">System Actions</TabsTrigger>
          <TabsTrigger value="security">Security Events</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search logs by ID, user, or action..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={actionFilter} onValueChange={setActionFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="content">Content</SelectItem>
                      <SelectItem value="settings">Settings</SelectItem>
                      <SelectItem value="role">Role</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={userFilter} onValueChange={setUserFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by user" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      {uniqueUsers.map((user, index) => (
                        <SelectItem key={index} value={user}>{user}</SelectItem>
                      ))}
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
                      <TableHead>Log ID</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.length > 0 ? (
                      filteredLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">{log.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getActionIcon(log.action)}
                              <span className="ml-2">{log.action}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>{log.user}</div>
                            <div className="text-xs text-gray-500">{log.userRole}</div>
                          </TableCell>
                          <TableCell>{log.timestamp}</TableCell>
                          <TableCell>{log.ipAddress}</TableCell>
                          <TableCell>{getStatusBadge(log.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="gap-2"
                              onClick={() => handleViewDetails(log)}
                            >
                              <Eye size={16} />
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          No audit logs found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Security Insights Card */}
          <Card>
            <CardHeader>
              <CardTitle>Security Insights</CardTitle>
              <CardDescription>AI-detected patterns and security recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-yellow-50">
                  <h4 className="font-semibold text-amber-800 mb-2">Unusual Admin Activity</h4>
                  <p className="text-amber-700">
                    We've detected a failed authentication attempt for admin@example.com from an unusual location, 
                    followed by a successful login 2 minutes later. This could indicate a potential security concern.
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg bg-blue-50">
                  <h4 className="font-semibold text-blue-800 mb-2">Access Pattern Analysis</h4>
                  <p className="text-blue-700">
                    There's been a 43% increase in user role changes over the past week compared to the previous 30-day average. 
                    Consider reviewing recent role modifications for appropriate authorization.
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg bg-green-50">
                  <h4 className="font-semibold text-green-800 mb-2">System Security</h4>
                  <p className="text-green-700">
                    All system settings modifications in the past 30 days have been properly authorized and documented.
                    No suspicious pattern detected.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user">
          <Card>
            <CardHeader>
              <CardTitle>User Action Logs</CardTitle>
              <CardDescription>Logs for user-related actions</CardDescription>
            </CardHeader>
            <CardContent>
              <p>User action logs will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Content Action Logs</CardTitle>
              <CardDescription>Logs for content-related actions</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Content action logs will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Action Logs</CardTitle>
              <CardDescription>Logs for system-related actions</CardDescription>
            </CardHeader>
            <CardContent>
              <p>System action logs will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Event Logs</CardTitle>
              <CardDescription>Logs for security-related events</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Security event logs will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Log Details Dialog */}
      {selectedLog && (
        <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Audit Log Details</DialogTitle>
              <DialogDescription>
                Detailed information for log ID: {selectedLog.id}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-500">Action</div>
                  <div className="font-medium flex items-center mt-1">
                    {getActionIcon(selectedLog.action)}
                    <span className="ml-2">{selectedLog.action}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Status</div>
                  <div className="mt-1">{getStatusBadge(selectedLog.status)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Timestamp</div>
                  <div className="font-medium mt-1">{selectedLog.timestamp}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-500">User</div>
                  <div className="font-medium mt-1">{selectedLog.user}</div>
                  <div className="text-xs text-gray-500">{selectedLog.userRole}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">IP Address</div>
                  <div className="font-medium mt-1">{selectedLog.ipAddress}</div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-2">Details</div>
                <div className="p-4 bg-gray-50 rounded-md">
                  <pre className="text-xs whitespace-pre-wrap">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedLog(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AuditLogsPage;
