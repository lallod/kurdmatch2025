import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdminReport {
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
  reporter?: {
    name: string;
    profile_image: string;
  };
  reported_user?: {
    name: string;
    profile_image: string;
  };
}

export const useAdminReports = () => {
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchReports = async (page: number = 1, limit: number = 10, statusFilter: string = 'all') => {
    try {
      setLoading(true);

      // Build count query
      let countQuery = supabase
        .from('reports')
        .select('*', { count: 'exact', head: true });

      if (statusFilter !== 'all') {
        countQuery = countQuery.eq('status', statusFilter);
      }

      const { count } = await countQuery;
      setTotalCount(count || 0);

      // Build main query
      let query = supabase
        .from('reports')
        .select(`
          id,
          reporter_user_id,
          reported_user_id,
          content_id,
          content_type,
          reason,
          details,
          status,
          created_at,
          resolved_at,
          resolved_by,
          admin_notes,
          reporter:profiles!reports_reporter_user_id_fkey(name, profile_image),
          reported_user:profiles!reports_reported_user_id_fkey(name, profile_image)
        `)
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform data
      const transformedReports = (data || []).map((report: any) => ({
        id: report.id,
        reporter_user_id: report.reporter_user_id,
        reported_user_id: report.reported_user_id,
        content_id: report.content_id,
        content_type: report.content_type,
        reason: report.reason,
        details: report.details,
        status: report.status,
        created_at: report.created_at,
        resolved_at: report.resolved_at,
        resolved_by: report.resolved_by,
        admin_notes: report.admin_notes,
        reporter: Array.isArray(report.reporter) ? report.reporter[0] : report.reporter,
        reported_user: Array.isArray(report.reported_user) ? report.reported_user[0] : report.reported_user,
      }));

      setReports(transformedReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const resolveReport = async (reportId: string, adminNotes: string, action: 'dismiss' | 'action_taken') => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({
          status: action === 'dismiss' ? 'dismissed' : 'resolved',
          resolved_at: new Date().toISOString(),
          admin_notes: adminNotes,
        })
        .eq('id', reportId);

      if (error) throw error;

      // Refresh reports
      await fetchReports();
      return true;
    } catch (error) {
      console.error('Error resolving report:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return {
    reports,
    loading,
    totalCount,
    fetchReports,
    resolveReport,
  };
};
