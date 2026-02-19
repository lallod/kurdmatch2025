import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BookOpen, Trash2, Search, Calendar, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useTranslations } from '@/hooks/useTranslations';
import { executeAdminAction } from '@/utils/admin/auditLogger';

const StoriesPage = () => {
  const { t } = useTranslations();
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const { data, error, count } = await (supabase as any)
        .from('stories')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setStories(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching stories:', error);
      toast.error(t('toast.stories_load_failed', 'Failed to load stories'));
    } finally {
      setLoading(false);
    }
  };

  const deleteStory = async (id: string) => {
    if (!confirm(t('admin.confirm_delete_story', 'Are you sure you want to delete this story?'))) return;
    try {
      await executeAdminAction({ action: 'delete_record', table: 'stories', recordId: id });
      toast.success(t('toast.story_deleted', 'Story deleted successfully'));
      fetchStories();
    } catch (error) {
      console.error('Error deleting story:', error);
      toast.error(t('toast.story_delete_failed', 'Failed to delete story'));
    }
  };

  useEffect(() => { fetchStories(); }, []);

  const filtered = stories.filter(s => {
    const search = searchTerm.toLowerCase();
    return s.user_id?.toLowerCase().includes(search) || s.media_url?.toLowerCase().includes(search);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('admin.stories_management', 'Stories Management')}</h1>
          <p className="text-white/60 mt-1">{t('admin.view_all_stories', 'View all stories ({{count}} total)', { count: totalCount })}</p>
        </div>
        <Button onClick={fetchStories} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
          {t('common.refresh', 'Refresh')}
        </Button>
      </div>

      <Card className="bg-[#1a1a1a] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-500" />
            {t('admin.all_stories', 'All Stories')}
          </CardTitle>
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input placeholder={t('admin.search_stories', 'Search stories...')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-white/5 border-white/10 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-white/60">{t('admin.loading', 'Loading...')}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-white/60">{t('admin.no_stories_found', 'No stories found')}</div>
          ) : (
            <div className="space-y-3">
              {filtered.map((story) => (
                <div key={story.id} className="flex items-start justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-purple-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-3 w-3 text-white/40" />
                        <span className="text-white font-mono text-sm">{story.user_id?.substring(0, 12)}...</span>
                      </div>
                      {story.media_url && (
                        <p className="text-white/60 text-sm truncate max-w-md">{story.media_url}</p>
                      )}
                      <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60 mt-2">
                        <Calendar className="h-3 w-3 mr-1" />
                        {story.created_at ? format(new Date(story.created_at), 'MMM d, yyyy HH:mm') : 'N/A'}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => deleteStory(story.id)} className="text-red-500 hover:text-red-400 hover:bg-red-500/10 ml-4">
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

export default StoriesPage;
