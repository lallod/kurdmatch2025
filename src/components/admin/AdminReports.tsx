import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, User, MessageSquare, Image, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Report {
  id: string;
  reporter_user_id: string;
  reported_user_id?: string;
  content_id?: string;
  content_type?: string;
  reason: string;
  details?: string;
  status: string;
  created_at: string;
  context?: any;
}

export default function AdminReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (reportId: string) => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({ 
          status: 'resolved',
          resolved_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (error) throw error;
      toast.success('Report resolved');
      loadReports();
    } catch (error) {
      toast.error('Failed to resolve report');
    }
  };

  const handleDismiss = async (reportId: string) => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({ 
          status: 'dismissed',
          resolved_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (error) throw error;
      toast.success('Report dismissed');
      loadReports();
    } catch (error) {
      toast.error('Failed to dismiss report');
    }
  };

  const getContentIcon = (type?: string) => {
    switch (type) {
      case 'profile':
        return <User className="w-4 h-4" />;
      case 'message':
        return <MessageSquare className="w-4 h-4" />;
      case 'post':
        return <Image className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return <div className="text-white">Loading reports...</div>;
  }

  return (
    <div className="space-y-4">
      {reports.length === 0 ? (
        <Card className="bg-white/10 backdrop-blur border-white/20">
          <CardContent className="p-8 text-center text-white">
            No reports to review
          </CardContent>
        </Card>
      ) : (
        reports.map((report) => (
          <Card key={report.id} className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    {getContentIcon(report.content_type)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">
                          {report.reason}
                        </span>
                        <Badge variant={report.status === 'pending' ? 'destructive' : 'secondary'}>
                          {report.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-purple-200">
                        {format(new Date(report.created_at), 'PPp')}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  {report.details && (
                    <p className="text-white text-sm">{report.details}</p>
                  )}

                  {/* Meta */}
                  <div className="text-xs text-purple-200 space-y-1">
                    <div>Reporter ID: {report.reporter_user_id}</div>
                    {report.reported_user_id && (
                      <div>Reported User: {report.reported_user_id}</div>
                    )}
                    {report.content_id && (
                      <div>Content ID: {report.content_id}</div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {report.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleResolve(report.id)}
                      className="gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Resolve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDismiss(report.id)}
                      className="gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Dismiss
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
