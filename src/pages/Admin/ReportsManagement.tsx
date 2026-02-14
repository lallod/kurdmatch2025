import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, AlertCircle, CheckCircle, Clock, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface Report {
  id: string;
  reporter_user_id: string;
  reported_user_id: string | null;
  content_id: string | null;
  content_type: string | null;
  reason: string;
  details: string | null;
  status: string;
  created_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
  admin_notes: string | null;
}

const ReportsManagement = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('pending');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (reports.length > 0) {
      fetchReports();
    }
  }, [filterStatus]);

  const checkAdminAccess = async () => {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user!.id)
      .eq('role', 'super_admin')
      .maybeSingle();

    if (!data) {
      toast.error('You do not have admin privileges');
      navigate('/discovery');
      return;
    }

    fetchReports();
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query.limit(100);

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveReport = async (reportId: string, newStatus: 'resolved' | 'dismissed') => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({
          status: newStatus,
          resolved_at: new Date().toISOString(),
          resolved_by: user!.id,
          admin_notes: adminNotes || null,
        })
        .eq('id', reportId);

      if (error) throw error;

      // Log admin activity
      await supabase.from('admin_activities').insert({
        user_id: user!.id,
        activity_type: 'report_resolved',
        description: `${newStatus === 'resolved' ? 'Resolved' : 'Dismissed'} report: ${reportId}`,
      });

      toast.success(`Report ${newStatus}`);

      setSelectedReport(null);
      setAdminNotes('');
      fetchReports();
    } catch (error) {
      console.error('Error resolving report:', error);
      toast.error('Failed to update report');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'resolved':
        return (
          <Badge variant="secondary" className="bg-green-500/20 text-green-300">
            <CheckCircle className="w-3 h-3 mr-1" />
            Resolved
          </Badge>
        );
      case 'dismissed':
        return (
          <Badge variant="secondary" className="bg-gray-500/20 text-gray-300">
            Dismissed
          </Badge>
        );
      default:
        return null;
    }
  };

  const getReasonBadge = (reason: string) => {
    const colors: Record<string, string> = {
      spam: 'bg-orange-500/20 text-orange-300',
      harassment: 'bg-red-500/20 text-red-300',
      inappropriate_content: 'bg-pink-500/20 text-pink-300',
      fake_profile: 'bg-purple-500/20 text-purple-300',
      other: 'bg-blue-500/20 text-blue-300',
    };

    return (
      <Badge variant="secondary" className={colors[reason] || colors.other}>
        {reason.replace(/_/g, ' ')}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/dashboard')}
              className="text-foreground hover:bg-accent/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Reports Management</h1>
              <p className="text-muted-foreground text-sm">{reports.length} reports</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-card backdrop-blur-md border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <span className="text-foreground text-sm">Status:</span>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48 bg-accent/10 border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="dismissed">Dismissed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        {loading ? (
          <Card className="bg-card backdrop-blur-md border-border">
            <CardContent className="py-12 text-center text-foreground">
              Loading reports...
            </CardContent>
          </Card>
        ) : reports.length === 0 ? (
          <Card className="bg-card backdrop-blur-md border-border">
            <CardContent className="py-12 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No reports found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {reports.map((report) => (
              <Card key={report.id} className="bg-card backdrop-blur-md border-border">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusBadge(report.status)}
                          {getReasonBadge(report.reason)}
                        </div>
                        <p className="text-foreground text-sm">
                          <strong>Content Type:</strong> {report.content_type || 'User Profile'}
                        </p>
                        {report.details && (
                          <p className="text-muted-foreground text-sm mt-1">{report.details}</p>
                        )}
                        <p className="text-muted-foreground/50 text-xs mt-2">
                          Reported {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      {report.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedReport(report)}
                            className="text-foreground border-border hover:bg-accent/10"
                          >
                            Review
                          </Button>
                        </div>
                      )}
                    </div>

                    {selectedReport?.id === report.id && (
                      <div className="border-t border-border/10 pt-3 mt-3 space-y-3">
                        <div>
                          <label className="text-foreground text-sm mb-2 block">Admin Notes</label>
                          <Textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            placeholder="Add notes about this resolution..."
                            className="bg-accent/10 border-border text-foreground placeholder:text-muted-foreground"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleResolveReport(report.id, 'resolved')}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Resolve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleResolveReport(report.id, 'dismissed')}
                            className="text-foreground border-border hover:bg-accent/10"
                          >
                            Dismiss
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedReport(null);
                              setAdminNotes('');
                            }}
                            className="text-foreground hover:bg-accent/10"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {report.admin_notes && report.status !== 'pending' && (
                      <div className="border-t border-border/10 pt-3 mt-3">
                        <p className="text-muted-foreground/50 text-xs mb-1">Admin Notes:</p>
                        <p className="text-muted-foreground text-sm">{report.admin_notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsManagement;
