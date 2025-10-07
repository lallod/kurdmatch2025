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
  CheckCircle, 
  XCircle,
  MessageSquare,
  Image,
  User,
  Brain,
  RefreshCw
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { useAdminReports } from '../hooks/useAdminReports';
import { useToast } from '@/hooks/use-toast';

const ModerationPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'resolved' | 'dismissed'>('pending');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionType, setActionType] = useState<'dismiss' | 'action_taken'>('dismiss');
  const { reports, loading, totalCount, fetchReports, resolveReport } = useAdminReports();
  const { toast } = useToast();

  React.useEffect(() => {
    fetchReports(currentPage, 10, statusFilter);
  }, [currentPage, statusFilter]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchReports(1, 10, statusFilter);
  };

  const handleResolve = async () => {
    if (!selectedReport) return;

    const success = await resolveReport(selectedReport.id, adminNotes, actionType);
    if (success) {
      toast({
        title: "Report resolved",
        description: "The report has been successfully resolved.",
      });
      setSelectedReport(null);
      setAdminNotes('');
    } else {
      toast({
        title: "Error",
        description: "Failed to resolve report.",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = () => {
    fetchReports(currentPage, 10, statusFilter);
  };

  const filteredReports = reports.filter(report => {
    if (!searchTerm) return true;
    return (
      report.reporter?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reported_user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(totalCount / 10);

  const getContentTypeIcon = (type: string | null) => {
    switch (type) {
      case 'message':
        return <MessageSquare size={16} className="text-blue-400" />;
      case 'photo':
        return <Image size={16} className="text-purple-400" />;
      case 'profile':
        return <User size={16} className="text-green-400" />;
      default:
        return <User size={16} className="text-white/40" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Content Moderation</h1>
          <p className="text-white/60 mt-1">Review and moderate reported content</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* AI banner */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-white/10 flex items-center">
        <Brain size={24} className="text-primary mr-3" />
        <div>
          <h3 className="font-semibold text-white">AI-Powered Content Moderation</h3>
          <p className="text-sm text-white/60">Our AI system pre-screens content and assigns risk levels to help prioritize your review</p>
        </div>
      </div>

      <Card className="bg-[#141414] border-white/5">
        <CardHeader>
          <CardTitle className="text-white">Reported Content ({totalCount})</CardTitle>
          <CardDescription className="text-white/60">Review and take action on user reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Search by reporter, reported user, or reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
              <Button onClick={handleSearch} disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={(value: any) => { setStatusFilter(value); setCurrentPage(1); }}>
                <SelectTrigger className="w-[150px] bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10">
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="dismissed">Dismissed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-white/60">Loading reports...</div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-12 text-white/60">No reports found</div>
          ) : (
            <>
              <div className="rounded-md border border-white/5">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-white/5">
                      <TableHead className="text-white/80">Type</TableHead>
                      <TableHead className="text-white/80">Reported User</TableHead>
                      <TableHead className="text-white/80">Reporter</TableHead>
                      <TableHead className="text-white/80">Reason</TableHead>
                      <TableHead className="text-white/80">Date</TableHead>
                      <TableHead className="text-white/80">Status</TableHead>
                      <TableHead className="text-right text-white/80">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id} className="border-white/5 hover:bg-white/5">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getContentTypeIcon(report.content_type)}
                            <span className="text-white/80 capitalize">{report.content_type || 'user'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-white">
                          {report.reported_user?.name || 'Unknown'}
                        </TableCell>
                        <TableCell className="text-white/80">
                          {report.reporter?.name || 'Unknown'}
                        </TableCell>
                        <TableCell className="text-white/60">
                          {report.reason}
                        </TableCell>
                        <TableCell className="text-white/60">
                          {format(new Date(report.created_at), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              report.status === 'pending' 
                                ? 'bg-yellow-500/20 text-yellow-300'
                                : report.status === 'resolved'
                                ? 'bg-green-500/20 text-green-300'
                                : 'bg-white/10 text-white/80'
                            }
                          >
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {report.status === 'pending' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedReport(report);
                                setAdminNotes('');
                              }}
                              className="text-white/80 hover:text-white hover:bg-white/10"
                            >
                              Review
                            </Button>
                          )}
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

      {/* Review Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="bg-[#141414] border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Review Report</DialogTitle>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-white/60">Reported User</p>
                  <p className="text-white">{selectedReport.reported_user?.name || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-white/60">Reporter</p>
                  <p className="text-white">{selectedReport.reporter?.name || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-white/60">Content Type</p>
                  <p className="text-white capitalize">{selectedReport.content_type || 'User'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-white/60">Date</p>
                  <p className="text-white">{format(new Date(selectedReport.created_at), 'MMM dd, yyyy HH:mm')}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-white/60">Reason</p>
                <p className="text-white mt-1">{selectedReport.reason}</p>
              </div>

              {selectedReport.details && (
                <div>
                  <p className="text-sm font-medium text-white/60">Additional Details</p>
                  <p className="text-white mt-1">{selectedReport.details}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-white/60 mb-2">Action</p>
                <Select value={actionType} onValueChange={(value: any) => setActionType(value)}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10">
                    <SelectItem value="dismiss">Dismiss Report</SelectItem>
                    <SelectItem value="action_taken">Action Taken</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <p className="text-sm font-medium text-white/60 mb-2">Admin Notes</p>
                <Textarea
                  placeholder="Add your notes about this report..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  rows={4}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedReport(null)}>
              Cancel
            </Button>
            <Button onClick={handleResolve} disabled={loading}>
              {actionType === 'dismiss' ? 'Dismiss Report' : 'Mark as Resolved'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModerationPage;
