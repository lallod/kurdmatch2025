import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdminAuditLog {
  id: string;
  user_id: string | null;
  activity_type: string;
  description: string | null;
  created_at: string;
  user?: {
    name: string;
    profile_image: string;
  };
}

export const useAdminAuditLogs = () => {
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchLogs = async (page: number = 1, limit: number = 20, activityTypeFilter: string = 'all') => {
    try {
      setLoading(true);

      // Build count query
      let countQuery = supabase
        .from('admin_activities')
        .select('*', { count: 'exact', head: true });

      if (activityTypeFilter !== 'all') {
        countQuery = countQuery.eq('activity_type', activityTypeFilter);
      }

      const { count } = await countQuery;
      setTotalCount(count || 0);

      // Build main query
      let query = supabase
        .from('admin_activities')
        .select(`
          id,
          user_id,
          activity_type,
          description,
          created_at
        `)
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (activityTypeFilter !== 'all') {
        query = query.eq('activity_type', activityTypeFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Fetch user details for each log
      const logsWithUsers = await Promise.all(
        (data || []).map(async (log: any) => {
          if (log.user_id) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('name, profile_image')
              .eq('id', log.user_id)
              .single();

            return {
              ...log,
              user: profile,
            };
          }
          return {
            ...log,
            user: null,
          };
        })
      );

      setLogs(logsWithUsers);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const logActivity = async (activityType: string, description: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return false;

      const { error } = await supabase
        .from('admin_activities')
        .insert({
          user_id: user.id,
          activity_type: activityType,
          description: description,
        });

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error logging activity:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return {
    logs,
    loading,
    totalCount,
    fetchLogs,
    logActivity,
  };
};
