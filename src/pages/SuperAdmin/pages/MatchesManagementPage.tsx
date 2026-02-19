import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Users, Trash2, Search, Calendar, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useTranslations } from '@/hooks/useTranslations';

interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  matched_at: string;
  user1_profile?: { name: string; profile_image: string; };
  user2_profile?: { name: string; profile_image: string; };
}

const MatchesManagementPage = () => {
  const { t } = useTranslations();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const { data, error, count } = await supabase
        .from('matches')
        .select(`
          id, user1_id, user2_id, matched_at,
          user1_profile:profiles!matches_user1_id_fkey(name, profile_image),
          user2_profile:profiles!matches_user2_id_fkey(name, profile_image)
        `, { count: 'exact' })
        .order('matched_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setMatches(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast.error('Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const deleteMatch = async (id: string) => {
    if (!confirm('Are you sure you want to delete this match?')) return;
    try {
      const { error } = await supabase.from('matches').delete().eq('id', id);
      if (error) throw error;
      toast.success('Match deleted successfully');
      fetchMatches();
    } catch (error) {
      console.error('Error deleting match:', error);
      toast.error('Failed to delete match');
    }
  };

  useEffect(() => { fetchMatches(); }, []);

  const filteredMatches = matches.filter(match => {
    const user1Name = match.user1_profile?.name?.toLowerCase() || '';
    const user2Name = match.user2_profile?.name?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    return user1Name.includes(search) || user2Name.includes(search);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('admin.matches_management', 'Matches Management')}</h1>
          <p className="text-white/60 mt-1">{t('admin.matches_desc', 'View and monitor all user matches ({{count}} total)', { count: totalCount })}</p>
        </div>
        <Button onClick={fetchMatches} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
          {t('admin.refresh', 'Refresh')}
        </Button>
      </div>

      <Card className="bg-[#1a1a1a] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-green-500" />
            {t('admin.all_matches', 'All Matches')}
          </CardTitle>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder={t('admin.search_by_user', 'Search by user name...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-white/60">{t('admin.loading_matches', 'Loading matches...')}</div>
          ) : filteredMatches.length === 0 ? (
            <div className="text-center py-8 text-white/60">{t('admin.no_matches_found', 'No matches found')}</div>
          ) : (
            <div className="space-y-3">
              {filteredMatches.map((match) => (
                <div key={match.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center gap-3">
                      <img src={match.user1_profile?.profile_image || '/placeholder.svg'} alt={match.user1_profile?.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="text-white font-medium">{match.user1_profile?.name || t('admin.unknown', 'Unknown')}</p>
                        <p className="text-white/40 text-sm">{t('admin.user_1', 'User 1')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mx-4">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Users className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <img src={match.user2_profile?.profile_image || '/placeholder.svg'} alt={match.user2_profile?.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="text-white font-medium">{match.user2_profile?.name || t('admin.unknown', 'Unknown')}</p>
                        <p className="text-white/40 text-sm">{t('admin.user_2', 'User 2')}</p>
                      </div>
                    </div>
                    <div className="ml-auto flex items-center gap-4">
                      <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(match.matched_at), 'MMM d, yyyy HH:mm')}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="ghost" size="sm" onClick={() => window.open(`/profile/${match.user1_id}`, '_blank')} className="text-white/60 hover:text-white hover:bg-white/5">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteMatch(match.id)} className="text-red-500 hover:text-red-400 hover:bg-red-500/10">
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

export default MatchesManagementPage;
