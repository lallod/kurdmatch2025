import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, X } from 'lucide-react';


import { getMatches, getNewMatches } from '@/api/matches';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/useTranslations';

interface Match {
  id: string; profileId: string; name: string; avatar: string; age: number;
  location: string; matchedAt: string; isNew: boolean;
}

const Matches = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const { t } = useTranslations();
  const [matches, setMatches] = useState<Match[]>([]);
  const [newMatches, setNewMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [showSwipeActions, setShowSwipeActions] = useState(false);

  useEffect(() => {
    const loadMatches = async () => {
      if (!user) return;
      try {
        setIsLoading(true);
        const [allMatches, recentMatches] = await Promise.all([getMatches(), getNewMatches(5)]);
        setMatches(allMatches); setNewMatches(recentMatches);
      } catch (error) { toast.error(t('toast.matches.load_failed', 'Failed to load matches')); }
      finally { setIsLoading(false); }
    };
    loadMatches();
  }, [user]);

  const handleMessage = (profileId: string) => navigate(`/messages?user=${profileId}`);
  const handleViewProfile = (profileId: string) => navigate(`/profile/${profileId}`);
  const handleMatchClick = (match: Match) => { setSelectedMatch(match); setShowSwipeActions(true); };


  const formatMatchTime = (date: string) => {
    const matchDate = new Date(date); const now = new Date();
    const diffInHours = (now.getTime() - matchDate.getTime()) / (1000 * 60 * 60);
    if (diffInHours < 1) return t('matches.just_now', 'Just now');
    if (diffInHours < 24) return t('matches.hours_ago', `{{count}}h ago`, { count: Math.floor(diffInHours) });
    if (diffInHours < 48) return t('matches.yesterday', 'Yesterday');
    return t('matches.days_ago', `{{count}}d ago`, { count: Math.floor(diffInHours / 24) });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-sm">{t('matches.loading', 'Loading matches...')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Slim header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border/30">
        <div className="max-w-lg mx-auto px-4 h-11 flex items-center justify-between">
          <h1 className="text-base font-semibold text-foreground">{t('matches.title', 'Matches')}</h1>
          {newMatches.length > 0 && (
            <Badge className="bg-primary/15 text-primary text-xs">{newMatches.length} {t('matches.new', 'New')}</Badge>
          )}
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        {/* New Matches — horizontal story-style scroll */}
        {newMatches.length > 0 && (
          <div className="px-4 py-3 border-b border-border/10">
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">{t('matches.new_matches', 'New Matches')}</p>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide">
              {newMatches.map(match => (
                <div key={match.id} className="flex flex-col items-center cursor-pointer flex-shrink-0" onClick={() => handleMatchClick(match)}>
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent p-[2px]">
                      <div className="absolute inset-[2px] rounded-full bg-background" />
                    </div>
                    <Avatar className="h-16 w-16 relative z-10">
                      <AvatarImage src={match.avatar} alt={match.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">{match.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <span className="text-xs text-foreground mt-1.5 truncate w-16 text-center">{match.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Matches — 2-column photo grid */}
        <div className="px-4 py-4">
          {matches.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
               <h3 className="text-base font-semibold text-foreground mb-1">{t('matches.no_matches', 'No matches yet')}</h3>
               <p className="text-sm text-muted-foreground mb-4">{t('matches.start_swiping', 'Start swiping to find your match!')}</p>
               <Button onClick={() => navigate('/swipe')} size="sm">{t('matches.start_swiping_btn', 'Start Swiping')}</Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {matches.map(match => (
                <div
                  key={match.id}
                  className="relative rounded-lg overflow-hidden aspect-[3/4] cursor-pointer group"
                  onClick={() => handleMatchClick(match)}
                >
                  <img src={match.avatar} alt={match.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2.5">
                    <p className="text-sm font-semibold text-foreground">{match.name}, {match.age}</p>
                    <p className="text-xs text-muted-foreground truncate">{match.location}</p>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleMessage(match.profileId); }}
                      className="h-7 w-7 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-foreground" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Profile Modal - Message & View actions */}
      {showSwipeActions && selectedMatch && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end justify-center" onClick={() => setShowSwipeActions(false)}>
          <div className="bg-card rounded-t-3xl w-full max-w-lg overflow-hidden border-t border-border/20 animate-in slide-in-from-bottom" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 p-5">
              <Avatar className="h-16 w-16 ring-2 ring-border">
                <AvatarImage src={selectedMatch.avatar} alt={selectedMatch.name} />
                <AvatarFallback className="bg-primary text-primary-foreground">{selectedMatch.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-foreground">{selectedMatch.name}, {selectedMatch.age}</h2>
                <p className="text-sm text-muted-foreground truncate">{selectedMatch.location}</p>
              </div>
              <button onClick={() => setShowSwipeActions(false)} className="p-2 rounded-full hover:bg-muted">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="flex gap-3 px-5 pb-6" style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}>
              <Button className="flex-1 gap-2" onClick={() => { setShowSwipeActions(false); handleMessage(selectedMatch.profileId); }}>
                <MessageCircle className="w-4 h-4" />{t('matches.message', 'Message')}
              </Button>
              <Button variant="outline" className="flex-1 gap-2" onClick={() => { setShowSwipeActions(false); handleViewProfile(selectedMatch.profileId); }}>
                {t('matches.view_profile', 'View Profile')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Matches;
