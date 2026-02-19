import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AlertTriangle, Search, Calendar, CheckCircle, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useTranslations } from '@/hooks/useTranslations';
import { executeAdminAction } from '@/utils/admin/auditLogger';

const SafetyFlagsPage = () => {
  const { t } = useTranslations();
  const [flags, setFlags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [filter, setFilter] = useState<'all' | 'unreviewed' | 'reviewed'>('unreviewed');

  const fetchFlags = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('message_safety_flags')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(100);

      if (filter === 'unreviewed') query = query.eq('reviewed', false);
      if (filter === 'reviewed') query = query.eq('reviewed', true);

      const { data, error, count } = await query;
      if (error) throw error;
      setFlags(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching safety flags:', error);
      toast.error(t('toast.flags_load_failed', 'Failed to load safety flags'));
    } finally {
      setLoading(false);
    }
  };

  const markReviewed = async (id: string) => {
    try {
      await executeAdminAction({ action: 'update_record', table: 'message_safety_flags', recordId: id, data: { reviewed: true } });
      toast.success(t('toast.flag_reviewed', 'Flag marked as reviewed'));
      fetchFlags();
    } catch (error) {
      console.error('Error marking flag:', error);
      toast.error(t('toast.flag_review_failed', 'Failed to mark flag'));
    }
  };

  const takeAction = async (id: string, actionType: string) => {
    try {
      await executeAdminAction({ action: 'update_record', table: 'message_safety_flags', recordId: id, data: { reviewed: true, action_taken: actionType } });
      toast.success(t('toast.action_taken', 'Action recorded'));
      fetchFlags();
    } catch (error) {
      console.error('Error taking action:', error);
      toast.error(t('toast.action_failed', 'Failed to take action'));
    }
  };

  useEffect(() => { fetchFlags(); }, [filter]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default: return 'text-white/60 bg-white/5 border-white/10';
    }
  };

  const filtered = flags.filter(f => {
    const search = searchTerm.toLowerCase();
    return f.flag_type?.toLowerCase().includes(search) || f.sender_id?.toLowerCase().includes(search) || f.severity?.toLowerCase().includes(search);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('admin.safety_flags_management', 'Safety Flags')}</h1>
          <p className="text-white/60 mt-1">{t('admin.view_all_flags', 'Review flagged messages ({{count}} total)', { count: totalCount })}</p>
        </div>
        <Button onClick={fetchFlags} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">{t('common.refresh', 'Refresh')}</Button>
      </div>

      <div className="flex gap-2">
        {(['unreviewed', 'all', 'reviewed'] as const).map(f => (
          <Button key={f} variant={filter === f ? 'default' : 'outline'} size="sm" onClick={() => setFilter(f)}
            className={filter === f ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      <Card className="bg-[#1a1a1a] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            {t('admin.all_flags', 'Safety Flags')}
          </CardTitle>
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input placeholder={t('admin.search_flags', 'Search flags...')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-white/5 border-white/10 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-white/60">{t('admin.loading', 'Loading...')}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-white/60">{t('admin.no_flags_found', 'No safety flags found')}</div>
          ) : (
            <div className="space-y-3">
              {filtered.map((flag) => (
                <div key={flag.id} className="flex items-start justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{flag.flag_type}</p>
                      <div className="flex items-center gap-2 text-sm text-white/60 mt-1">
                        <span>Sender: {flag.sender_id?.substring(0, 12)}...</span>
                        <span>→</span>
                        <span>Recipient: {flag.recipient_id?.substring(0, 12)}...</span>
                      </div>
                      <div className="flex gap-2 flex-wrap mt-2">
                        <Badge variant="outline" className={getSeverityColor(flag.severity)}>{flag.severity}</Badge>
                        {flag.ai_detected && <Badge variant="outline" className="text-purple-400 bg-purple-500/10 border-purple-500/20">AI Detected</Badge>}
                        {flag.reviewed && <Badge variant="outline" className="text-green-400 bg-green-500/10 border-green-500/20"><CheckCircle className="h-3 w-3 mr-1" />Reviewed</Badge>}
                        {flag.action_taken && <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60">{flag.action_taken}</Badge>}
                        <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(flag.created_at), 'MMM d, yyyy HH:mm')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {!flag.reviewed && (
                    <div className="flex gap-2 ml-4">
                      <Button variant="ghost" size="sm" onClick={() => markReviewed(flag.id)} className="text-green-500 hover:text-green-400 hover:bg-green-500/10">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => takeAction(flag.id, 'warned')} className="text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10">
                        <Shield className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SafetyFlagsPage;
