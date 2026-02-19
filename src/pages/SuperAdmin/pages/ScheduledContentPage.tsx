import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Clock, Trash2, Search, Calendar, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useTranslations } from '@/hooks/useTranslations';
import { executeAdminAction } from '@/utils/admin/auditLogger';

const ScheduledContentPage = () => {
  const { t } = useTranslations();
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const { data, error, count } = await (supabase as any)
        .from('scheduled_content')
        .select('*', { count: 'exact' })
        .order('scheduled_for', { ascending: false })
        .limit(100);

      if (error) throw error;
      setContent(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching scheduled content:', error);
      toast.error(t('toast.scheduled_load_failed', 'Failed to load scheduled content'));
    } finally {
      setLoading(false);
    }
  };

  const deleteContent = async (id: string) => {
    if (!confirm(t('admin.confirm_delete_scheduled', 'Delete this scheduled content?'))) return;
    try {
      await executeAdminAction({ action: 'delete_record', table: 'scheduled_content', recordId: id });
      toast.success(t('toast.scheduled_deleted', 'Scheduled content deleted'));
      fetchContent();
    } catch (error) {
      console.error('Error deleting scheduled content:', error);
      toast.error(t('toast.scheduled_delete_failed', 'Failed to delete'));
    }
  };

  useEffect(() => { fetchContent(); }, []);

  const filtered = content.filter(c => {
    const search = searchTerm.toLowerCase();
    return c.content_type?.toLowerCase().includes(search) || c.status?.toLowerCase().includes(search) || c.user_id?.toLowerCase().includes(search);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('admin.scheduled_content_management', 'Scheduled Content')}</h1>
          <p className="text-white/60 mt-1">{t('admin.view_all_scheduled', 'View all scheduled content ({{count}} total)', { count: totalCount })}</p>
        </div>
        <Button onClick={fetchContent} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">{t('common.refresh', 'Refresh')}</Button>
      </div>

      <Card className="bg-[#1a1a1a] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            {t('admin.all_scheduled', 'All Scheduled Content')}
          </CardTitle>
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input placeholder={t('admin.search_scheduled', 'Search...')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-white/5 border-white/10 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-white/60">{t('admin.loading', 'Loading...')}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-white/60">{t('admin.no_scheduled_found', 'No scheduled content found')}</div>
          ) : (
            <div className="space-y-3">
              {filtered.map((item) => (
                <div key={item.id} className="flex items-start justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{item.content_type || 'Content'}</p>
                      <p className="text-white/60 text-sm font-mono">{item.user_id?.substring(0, 12)}...</p>
                      <div className="flex gap-2 flex-wrap mt-2">
                        <Badge variant="outline" className={item.status === 'published' ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'}>
                          {item.status === 'published' ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                          {item.status}
                        </Badge>
                        <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60">
                          <Calendar className="h-3 w-3 mr-1" />
                          {item.scheduled_for ? format(new Date(item.scheduled_for), 'MMM d, yyyy HH:mm') : 'N/A'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => deleteContent(item.id)} className="text-red-500 hover:text-red-400 hover:bg-red-500/10 ml-4">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduledContentPage;
