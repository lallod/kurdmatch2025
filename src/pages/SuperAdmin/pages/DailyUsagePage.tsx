import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BarChart3, Search, Calendar, TrendingUp, Heart, Star, RotateCcw, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useTranslations } from '@/hooks/useTranslations';

interface DailyUsage {
  id: string;
  user_id: string;
  date: string;
  likes_count: number;
  super_likes_count: number;
  rewinds_count: number;
  boosts_count: number;
  created_at: string;
  updated_at: string;
}

const DailyUsagePage = () => {
  const { t } = useTranslations();
  const [usageData, setUsageData] = useState<DailyUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const fetchUsageData = async () => {
    setLoading(true);
    try {
      const { data, error, count } = await supabase.from('daily_usage').select('*', { count: 'exact' }).order('date', { ascending: false }).limit(100);
      if (error) throw error;
      setUsageData(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching usage data:', error);
      toast.error(t('admin.failed_load_usage', 'Failed to load usage data'));
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsageData(); }, []);

  const filteredUsage = usageData.filter(usage => usage.user_id.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('admin.daily_usage_analytics', 'Daily Usage Analytics')}</h1>
          <p className="text-white/60 mt-1">{t('admin.track_usage_per_day', 'Track user feature usage per day ({{count}} records)', { count: totalCount })}</p>
        </div>
        <Button onClick={fetchUsageData} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">{t('common.refresh', 'Refresh')}</Button>
      </div>

      <Card className="bg-[#1a1a1a] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2"><BarChart3 className="h-5 w-5 text-blue-500" />{t('admin.daily_usage_statistics', 'Daily Usage Statistics')}</CardTitle>
          <div className="mt-4"><div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" /><Input placeholder={t('admin.search_by_user_id', 'Search by user ID...')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-white/5 border-white/10 text-white" /></div></div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-white/60">{t('admin.loading_usage_data', 'Loading usage data...')}</div>
          ) : filteredUsage.length === 0 ? (
            <div className="text-center py-8 text-white/60">{t('admin.no_usage_data', 'No usage data found')}</div>
          ) : (
            <div className="space-y-3">
              {filteredUsage.map((usage) => {
                const totalActivity = usage.likes_count + usage.super_likes_count + usage.rewinds_count + usage.boosts_count;
                return (
                  <div key={usage.id} className="p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-white font-mono text-sm">{t('common.user', 'User')}: {usage.user_id.substring(0, 16)}...</p>
                        <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60 mt-2"><Calendar className="h-3 w-3 mr-1" />{format(new Date(usage.date), 'MMMM d, yyyy')}</Badge>
                      </div>
                      <Badge variant="outline" className={totalActivity > 20 ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-white/5 border-white/10 text-white/60'}>
                        <TrendingUp className="h-3 w-3 mr-1" />{t('admin.total_actions', '{{count}} total actions', { count: totalActivity })}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="p-3 bg-white/5 rounded-lg"><div className="flex items-center gap-2 mb-1"><Heart className="h-4 w-4 text-red-500" /><span className="text-white/60 text-sm">{t('admin.likes', 'Likes')}</span></div><p className="text-white font-semibold text-lg">{usage.likes_count}</p></div>
                      <div className="p-3 bg-white/5 rounded-lg"><div className="flex items-center gap-2 mb-1"><Star className="h-4 w-4 text-yellow-500" /><span className="text-white/60 text-sm">{t('admin.super_likes', 'Super Likes')}</span></div><p className="text-white font-semibold text-lg">{usage.super_likes_count}</p></div>
                      <div className="p-3 bg-white/5 rounded-lg"><div className="flex items-center gap-2 mb-1"><RotateCcw className="h-4 w-4 text-blue-500" /><span className="text-white/60 text-sm">{t('admin.rewinds', 'Rewinds')}</span></div><p className="text-white font-semibold text-lg">{usage.rewinds_count}</p></div>
                      <div className="p-3 bg-white/5 rounded-lg"><div className="flex items-center gap-2 mb-1"><Zap className="h-4 w-4 text-purple-500" /><span className="text-white/60 text-sm">{t('admin.boosts', 'Boosts')}</span></div><p className="text-white font-semibold text-lg">{usage.boosts_count}</p></div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <p className="text-white/40 text-xs">{t('admin.last_updated', 'Last updated: {{date}}', { date: format(new Date(usage.updated_at), 'MMM d, yyyy HH:mm') })}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyUsagePage;
