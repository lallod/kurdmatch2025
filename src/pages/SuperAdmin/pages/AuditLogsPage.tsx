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
  Download, 
  RefreshCw,
  Eye,
  Shield,
  Activity
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
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
import { format } from 'date-fns';
import { useAdminAuditLogs } from '../hooks/useAdminAuditLogs';

const AuditLogsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activityTypeFilter, setActivityTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const { logs, loading, totalCount, fetchLogs } = useAdminAuditLogs();

  React.useEffect(() => {
    fetchLogs(currentPage, 20, activityTypeFilter);
  }, [currentPage, activityTypeFilter]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchLogs(1, 20, activityTypeFilter);
  };

  const handleRefresh = () => {
    fetchLogs(currentPage, 20, activityTypeFilter);
  };

  const filteredLogs = logs.filter(log => {
    if (!searchTerm) return true;
    return (
      log.activity_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(totalCount / 20);

  const getActivityBadge = (activityType: string) => {
    const lowerType = activityType.toLowerCase();
    
    if (lowerType.includes('create') || lowerType.includes('add')) {
      return <Badge className="bg-green-500/20 text-green-300">{activityType}</Badge>;
    } else if (lowerType.includes('delete') || lowerType.includes('remove')) {
      return <Badge className="bg-red-500/20 text-red-300">{activityType}</Badge>;
    } else if (lowerType.includes('update') || lowerType.includes('edit')) {
      return <Badge className="bg-blue-500/20 text-blue-300">{activityType}</Badge>;
    } else if (lowerType.includes('login') || lowerType.includes('auth')) {
      return <Badge className="bg-purple-500/20 text-purple-300">{activityType}</Badge>;
    } else {
      return <Badge className="bg-white/10 text-white/80">{activityType}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Audit Logs</h1>
          <p className="text-white/60 mt-1">Track all administrative actions</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#141414] border-white/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Total Activities</p>
                <p className="text-2xl font-bold text-white">{totalCount}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#141414] border-white/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Today's Activities</p>
                <p className="text-2xl font-bold text-white">
                  {logs.filter(log => {
                    const today = new Date().toISOString().split('T')[0];
                    const logDate = new Date(log.created_at).toISOString().split('T')[0];
                    return today === logDate;
                  }).length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#141414] border-white/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Active Admins</p>
                <p className="text-2xl font-bold text-white">
                  {new Set(logs.map(log => log.user_id).filter(Boolean)).size}
                </p>
              </div>
              <Shield className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#141414] border-white/5">
        <CardHeader>
          <CardTitle className="text-white">Activity Log</CardTitle>
          <CardDescription className="text-white/60">Complete history of administrative actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-white/60">Loading audit logs...</div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-white/60">No audit logs found</div>
          ) : (
            <>
              <div className="rounded-md border border-white/5">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-white/5">
                      <TableHead className="text-white/80">Activity</TableHead>
                      <TableHead className="text-white/80">User</TableHead>
                      <TableHead className="text-white/80">Description</TableHead>
                      <TableHead className="text-white/80">Timestamp</TableHead>
                      <TableHead className="text-right text-white/80">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id} className="border-white/5 hover:bg-white/5">
                        <TableCell>
                          {getActivityBadge(log.activity_type)}
                        </TableCell>
                        <TableCell className="text-white">
                          {log.user?.name || 'System'}
                        </TableCell>
                        <TableCell className="text-white/60 max-w-md truncate">
                          {log.description || 'No description'}
                        </TableCell>
                        <TableCell className="text-white/60">
                          {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm:ss')}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedLog(log)}
                            className="text-white/80 hover:text-white hover:bg-white/10"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-white/60">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1 || loading}
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages || loading}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* View Log Details Dialog */}
      {selectedLog && (
        <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
          <DialogContent className="bg-[#141414] border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Activity Details</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-white/60">Activity Type</p>
                {getActivityBadge(selectedLog.activity_type)}
              </div>
              <div>
                <p className="text-sm font-medium text-white/60">Performed By</p>
                <p className="text-white mt-1">{selectedLog.user?.name || 'System'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-white/60">Timestamp</p>
                <p className="text-white mt-1">
                  {format(new Date(selectedLog.created_at), 'MMMM dd, yyyy HH:mm:ss')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-white/60">Description</p>
                <p className="text-white mt-1">{selectedLog.description || 'No description'}</p>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedLog(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AuditLogsPage;
