import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Hash, Trash2, Search, TrendingUp, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface Hashtag {
  id: string;
  name: string;
  usage_count: number;
  created_at: string;
  last_used_at: string;
}

const HashtagsPage = () => {
  const [hashtags, setHashtags] = useState<Hashtag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const fetchHashtags = async () => {
    setLoading(true);
    try {
      const { data, error, count } = await supabase
        .from('hashtags')
        .select('*', { count: 'exact' })
        .order('usage_count', { ascending: false })
        .limit(100);

      if (error) throw error;
      setHashtags(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching hashtags:', error);
      toast.error('Failed to load hashtags');
    } finally {
      setLoading(false);
    }
  };

  const deleteHashtag = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hashtag?')) return;

    try {
      const { error } = await supabase
        .from('hashtags')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Hashtag deleted successfully');
      fetchHashtags();
    } catch (error) {
      console.error('Error deleting hashtag:', error);
      toast.error('Failed to delete hashtag');
    }
  };

  useEffect(() => {
    fetchHashtags();
  }, []);

  const filteredHashtags = hashtags.filter(hashtag => {
    const search = searchTerm.toLowerCase();
    return hashtag.name.toLowerCase().includes(search);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Hashtags Management</h1>
          <p className="text-white/60 mt-1">Manage trending hashtags ({totalCount} total)</p>
        </div>
        <Button onClick={fetchHashtags} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
          Refresh
        </Button>
      </div>

      <Card className="bg-[#1a1a1a] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Hash className="h-5 w-5 text-purple-500" />
            All Hashtags
          </CardTitle>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Search hashtags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-white/60">Loading hashtags...</div>
          ) : filteredHashtags.length === 0 ? (
            <div className="text-center py-8 text-white/60">No hashtags found</div>
          ) : (
            <div className="space-y-3">
              {filteredHashtags.map((hashtag) => (
                <div
                  key={hashtag.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Hash className="h-5 w-5 text-purple-500" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-white font-medium text-lg">#{hashtag.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {hashtag.usage_count} uses
                        </Badge>
                        <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60">
                          <Calendar className="h-3 w-3 mr-1" />
                          Last used: {format(new Date(hashtag.last_used_at), 'MMM d, yyyy')}
                        </Badge>
                        <span className="text-white/40 text-sm">
                          Created: {format(new Date(hashtag.created_at), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteHashtag(hashtag.id)}
                    className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                  >
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

export default HashtagsPage;
