import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, Sparkles, MapPin, X } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import BottomNavigation from '@/components/BottomNavigation';
import { getMatches, getNewMatches } from '@/api/matches';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { toast } from 'sonner';
import SwipeActions from '@/components/swipe/SwipeActions';
import { likeProfile } from '@/api/likes';
import SectionViewStats from '@/components/profile/SectionViewStats';

interface Match {
  id: string; profileId: string; name: string; avatar: string; age: number;
  location: string; matchedAt: string; isNew: boolean;
}

const Matches = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
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
      } catch (error) { toast.error('Failed to load matches'); }
      finally { setIsLoading(false); }
    };
    loadMatches();
  }, [user]);

  const handleMessage = (profileId: string) => navigate(`/messages?user=${profileId}`);
  const handleViewProfile = (profileId: string) => navigate(`/profile/${profileId}`);
  const handleMatchClick = (match: Match) => { setSelectedMatch(match); setShowSwipeActions(true); };

  const handleLike = async () => {
    if (!selectedMatch) return;
    try {
      const result = await likeProfile(selectedMatch.profileId);
      if (result.success) { toast.success("Liked!"); setShowSwipeActions(false); }
      else toast.error(result.error || "Failed to like profile");
    } catch (error) { toast.error("Something went wrong"); }
  };
  const handlePass = () => { toast.info("Passed"); setShowSwipeActions(false); };
  const handleRewind = () => toast.info("Rewind");
  const handleSuperLike = () => { toast.info("Super liked!"); setShowSwipeActions(false); };
  const handleBoost = () => toast.info("Boosted!");

  const formatMatchTime = (date: string) => {
    const matchDate = new Date(date); const now = new Date();
    const diffInHours = (now.getTime() - matchDate.getTime()) / (1000 * 60 * 60);
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading matches...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Slim header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border/30">
        <div className="max-w-lg mx-auto px-4 h-11 flex items-center justify-between">
          <h1 className="text-base font-semibold text-foreground">Matches</h1>
          {newMatches.length > 0 && (
            <Badge className="bg-primary/15 text-primary text-xs">{newMatches.length} New</Badge>
          )}
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        {/* New Matches — horizontal story-style scroll */}
        {newMatches.length > 0 && (
          <div className="px-4 py-3 border-b border-border/10">
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">New Matches</p>
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
              <h3 className="text-base font-semibold text-foreground mb-1">No matches yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Start swiping to find your match!</p>
              <Button onClick={() => navigate('/swipe')} size="sm">Start Swiping</Button>
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

      {/* Profile Modal with Swipe Actions */}
      {showSwipeActions && selectedMatch && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl max-w-sm w-full max-h-[80vh] overflow-hidden border border-border/20">
            <div className="aspect-[3/4] relative overflow-hidden">
              <img src={selectedMatch.avatar} alt={selectedMatch.name} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent p-5">
                <h1 className="text-xl font-bold text-foreground">{selectedMatch.name}, {selectedMatch.age}</h1>
                <p className="text-sm text-muted-foreground">{selectedMatch.location}</p>
              </div>
            </div>
            <button onClick={() => setShowSwipeActions(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-background/30 backdrop-blur-sm text-foreground/80 hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
            <div className="p-4">
              <SwipeActions onRewind={handleRewind} onPass={handlePass} onLike={handleLike} onSuperLike={handleSuperLike} onBoost={handleBoost} />
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default Matches;
