import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Heart, Trash2, Search, User, Calendar, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface Like {
  id: string;
  liker_id: string;
  likee_id: string;
  created_at: string;
  liker_profile?: {
    name: string;
    profile_image: string;
  };
  likee_profile?: {
    name: string;
    profile_image: string;
  };
}

const LikesPage = () => {
  const [likes, setLikes] = useState<Like[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const fetchLikes = async () => {
    setLoading(true);
    try {
      const { data, error, count } = await supabase
        .from('likes')
        .select(`
          id,
          liker_id,
          likee_id,
          created_at,
          liker_profile:profiles!likes_liker_id_fkey(name, profile_image),
          likee_profile:profiles!likes_likee_id_fkey(name, profile_image)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setLikes(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching likes:', error);
      toast.error('Failed to load likes');
    } finally {
      setLoading(false);
    }
  };

  const deleteLike = async (id: string) => {
    if (!confirm('Are you sure you want to delete this like?')) return;

    try {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Like deleted successfully');
      fetchLikes();
    } catch (error) {
      console.error('Error deleting like:', error);
      toast.error('Failed to delete like');
    }
  };

  useEffect(() => {
    fetchLikes();
  }, []);

  const filteredLikes = likes.filter(like => {
    const likerName = like.liker_profile?.name?.toLowerCase() || '';
    const likeeName = like.likee_profile?.name?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    return likerName.includes(search) || likeeName.includes(search);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Likes Management</h1>
          <p className="text-white/60 mt-1">View and manage all user likes ({totalCount} total)</p>
        </div>
        <Button onClick={fetchLikes} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
          Refresh
        </Button>
      </div>

      <Card className="bg-[#1a1a1a] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            All Likes
          </CardTitle>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Search by user name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-white/60">Loading likes...</div>
          ) : filteredLikes.length === 0 ? (
            <div className="text-center py-8 text-white/60">No likes found</div>
          ) : (
            <div className="space-y-3">
              {filteredLikes.map((like) => (
                <div
                  key={like.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center gap-3">
                      <img
                        src={like.liker_profile?.profile_image || '/placeholder.svg'}
                        alt={like.liker_profile?.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-white font-medium">{like.liker_profile?.name || 'Unknown'}</p>
                        <p className="text-white/40 text-sm">Liker</p>
                      </div>
                    </div>

                    <Heart className="h-5 w-5 text-red-500 mx-4" />

                    <div className="flex items-center gap-3">
                      <img
                        src={like.likee_profile?.profile_image || '/placeholder.svg'}
                        alt={like.likee_profile?.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-white font-medium">{like.likee_profile?.name || 'Unknown'}</p>
                        <p className="text-white/40 text-sm">Liked</p>
                      </div>
                    </div>

                    <div className="ml-auto flex items-center gap-4">
                      <div className="text-right">
                        <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(like.created_at), 'MMM d, yyyy')}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`/profile/${like.liker_id}`, '_blank')}
                      className="text-white/60 hover:text-white hover:bg-white/5"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteLike(like.id)}
                      className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

export default LikesPage;
