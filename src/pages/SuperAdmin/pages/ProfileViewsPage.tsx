import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Eye, Search, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from '@/hooks/useTranslations';

const ProfileViewsPage = () => {
  const { t } = useTranslations();
  const [views, setViews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const fetchViews = async () => {
    setLoading(true);
    try {
      const { data, error, count } = await (supabase as any)
        .from('profile_section_views')
        .select('*', { count: 'exact' })
        .order('view_count', { ascending: false })
        .limit(100);

      if (error) throw error;
      setViews(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching profile views:', error);
      toast.error(t('toast.views_load_failed', 'Failed to load profile views'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchViews(); }, []);

  const filtered = views.filter(v => {
    const search = searchTerm.toLowerCase();
    return v.section_name?.toLowerCase().includes(search) || v.profile_id?.toLowerCase().includes(search);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('admin.profile_views_management', 'Profile Views Analytics')}</h1>
          <p className="text-white/60 mt-1">{t('admin.view_all_profile_views', 'Profile section engagement ({{count}} records)', { count: totalCount })}</p>
        </div>
        <Button onClick={fetchViews} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">{t('common.refresh', 'Refresh')}</Button>
      </div>

      <Card className="bg-[#1a1a1a] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Eye className="h-5 w-5 text-cyan-500" />
            {t('admin.all_profile_views', 'Profile Section Views')}
          </CardTitle>
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input placeholder={t('admin.search_views', 'Search...')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-white/5 border-white/10 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-white/60">{t('admin.loading', 'Loading...')}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-white/60">{t('admin.no_views_found', 'No profile views found')}</div>
          ) : (
            <div className="space-y-3">
              {filtered.map((view) => (
                <div key={view.id} className="flex items-start justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-cyan-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{view.section_name || 'Unknown Section'}</p>
                      <p className="text-white/60 text-sm font-mono">{view.profile_id?.substring(0, 12)}...</p>
                      <div className="flex gap-2 flex-wrap mt-2">
                        <Badge variant="outline" className="text-cyan-400 bg-cyan-500/10 border-cyan-500/20">
                          <Eye className="h-3 w-3 mr-1" />{view.view_count || 0} views
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileViewsPage;
