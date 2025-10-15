import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserPlus, Trash2, Search, Calendar, ExternalLink, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface Follower {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

const FollowersPage = () => {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const fetchFollowers = async () => {
    setLoading(true);
    try {
      const { data, error, count } = await supabase
        .from('followers')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setFollowers(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching followers:', error);
      toast.error('Failed to load followers');
    } finally {
      setLoading(false);
    }
  };

  const deleteFollower = async (id: string) => {
    if (!confirm('Are you sure you want to delete this follower relationship?')) return;

    try {
      const { error } = await supabase
        .from('followers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Follower relationship deleted successfully');
      fetchFollowers();
    } catch (error) {
      console.error('Error deleting follower:', error);
      toast.error('Failed to delete follower');
    }
  };

  useEffect(() => {
    fetchFollowers();
  }, []);

  const filteredFollowers = followers.filter(follower => {
    const search = searchTerm.toLowerCase();
    return follower.follower_id.toLowerCase().includes(search) || follower.following_id.toLowerCase().includes(search);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Followers Management</h1>
          <p className="text-white/60 mt-1">View all follower relationships ({totalCount} total)</p>
        </div>
        <Button onClick={fetchFollowers} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
          Refresh
        </Button>
      </div>

      <Card className="bg-[#1a1a1a] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-blue-500" />
            All Followers
          </CardTitle>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Search by user ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-white/60">Loading followers...</div>
          ) : filteredFollowers.length === 0 ? (
            <div className="text-center py-8 text-white/60">No followers found</div>
          ) : (
            <div className="space-y-3">
              {filteredFollowers.map((follower) => (
                <div
                  key={follower.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <p className="text-white font-medium text-sm">Follower</p>
                        <p className="text-white/60 text-xs font-mono">{follower.follower_id.substring(0, 8)}...</p>
                      </div>
                    </div>

                    <ArrowRight className="h-5 w-5 text-blue-500" />

                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <p className="text-white font-medium text-sm">Following</p>
                        <p className="text-white/60 text-xs font-mono">{follower.following_id.substring(0, 8)}...</p>
                      </div>
                    </div>

                    <div className="ml-auto">
                      <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(follower.created_at), 'MMM d, yyyy')}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`/profile/${follower.follower_id}`, '_blank')}
                      className="text-white/60 hover:text-white hover:bg-white/5"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteFollower(follower.id)}
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

export default FollowersPage;
