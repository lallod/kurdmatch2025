import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Heart, Search, Calendar, Eye, EyeOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useTranslations } from '@/hooks/useTranslations';
import { executeAdminAction } from '@/utils/admin/auditLogger';

const MarriageIntentionsPage = () => {
  const { t } = useTranslations();
  const [intentions, setIntentions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const fetchIntentions = async () => {
    setLoading(true);
    try {
      const { data, error, count } = await supabase
        .from('marriage_intentions')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setIntentions(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching marriage intentions:', error);
      toast.error(t('toast.intentions_load_failed', 'Failed to load marriage intentions'));
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (id: string, currentVisibility: boolean) => {
    try {
      await executeAdminAction({ action: 'update_record', table: 'marriage_intentions', recordId: id, data: { visible_on_profile: !currentVisibility } });
      toast.success(t('toast.visibility_toggled', 'Visibility updated'));
      fetchIntentions();
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast.error(t('toast.visibility_toggle_failed', 'Failed to update visibility'));
    }
  };

  useEffect(() => { fetchIntentions(); }, []);

  const filtered = intentions.filter(i => {
    const search = searchTerm.toLowerCase();
    return i.intention?.toLowerCase().includes(search) || i.timeline?.toLowerCase().includes(search) || i.user_id?.toLowerCase().includes(search);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('admin.marriage_intentions_management', 'Marriage Intentions')}</h1>
          <p className="text-white/60 mt-1">{t('admin.view_all_intentions', 'View all intentions ({{count}} total)', { count: totalCount })}</p>
        </div>
        <Button onClick={fetchIntentions} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">{t('common.refresh', 'Refresh')}</Button>
      </div>

      <Card className="bg-[#1a1a1a] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500" />
            {t('admin.all_intentions', 'All Marriage Intentions')}
          </CardTitle>
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input placeholder={t('admin.search_intentions', 'Search intentions...')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-white/5 border-white/10 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-white/60">{t('admin.loading', 'Loading...')}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-white/60">{t('admin.no_intentions_found', 'No marriage intentions found')}</div>
          ) : (
            <div className="space-y-3">
              {filtered.map((intention) => (
                <div key={intention.id} className="flex items-start justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
                      <Heart className="h-5 w-5 text-rose-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium capitalize">{intention.intention}</p>
                      <p className="text-white font-mono text-xs mt-1">{intention.user_id?.substring(0, 12)}...</p>
                      <div className="flex gap-2 flex-wrap mt-2">
                        {intention.timeline && <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60">{intention.timeline}</Badge>}
                        {intention.family_plans && <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60">{intention.family_plans}</Badge>}
                        <Badge variant="outline" className={intention.visible_on_profile ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-white/40 bg-white/5 border-white/10'}>
                          {intention.visible_on_profile ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                          {intention.visible_on_profile ? 'Visible' : 'Hidden'}
                        </Badge>
                        <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(intention.created_at), 'MMM d, yyyy')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => toggleVisibility(intention.id, intention.visible_on_profile)} className="text-white/60 hover:text-white hover:bg-white/10 ml-4">
                    {intention.visible_on_profile ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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

export default MarriageIntentionsPage;
