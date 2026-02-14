import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
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
  id: string;
  profileId: string;
  name: string;
  avatar: string;
  age: number;
  location: string;
  matchedAt: string;
  isNew: boolean;
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
        const [allMatches, recentMatches] = await Promise.all([
          getMatches(),
          getNewMatches(5)
        ]);
        
        setMatches(allMatches);
        setNewMatches(recentMatches);
      } catch (error) {
        toast.error('Failed to load matches');
      } finally {
        setIsLoading(false);
      }
    };

    loadMatches();
  }, [user]);

  const handleMessage = (profileId: string) => {
    navigate(`/messages?user=${profileId}`);
  };

  const handleViewProfile = (profileId: string) => {
    navigate(`/profile/${profileId}`);
  };

  const handleMatchClick = (match: Match) => {
    setSelectedMatch(match);
    setShowSwipeActions(true);
  };

  const handleLike = async () => {
    if (!selectedMatch) return;
    try {
      const result = await likeProfile(selectedMatch.profileId);
      if (result.success) {
        toast.success("Liked!");
        setShowSwipeActions(false);
      } else {
        toast.error(result.error || "Failed to like profile");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handlePass = () => {
    toast.info("Passed");
    setShowSwipeActions(false);
  };

  const handleRewind = () => {
    toast.info("Rewind");
  };

  const handleSuperLike = () => {
    toast.info("Super liked!");
    setShowSwipeActions(false);
  };

  const handleBoost = () => {
    toast.info("Boosted!");
  };

  const formatMatchTime = (date: string) => {
    const matchDate = new Date(date);
    const now = new Date();
    const diffInHours = (now.getTime() - matchDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`;
    if (diffInHours < 48) return 'Yesterday';
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  if (isLoading) {
    return (
      <div className="h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-surface-secondary" />
        <div className="h-full flex items-center justify-center">
          <div className="text-foreground text-xl font-semibold">Loading matches...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-surface-secondary pb-32">
      {/* Header */}
      <div className="bg-surface-secondary/80 backdrop-blur-xl shadow-sm border-b border-border/20 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Matches</h1>
                <p className="text-muted-foreground text-sm">Your perfect connections</p>
              </div>
            </div>
            {newMatches.length > 0 && (
              <Badge className="bg-primary text-primary-foreground">
                <Sparkles className="w-3 h-3 mr-1" />
                {newMatches.length} New
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* New Matches Section */}
          {newMatches.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3">New Matches</h2>
              <Carousel className="w-full">
                <CarouselContent className="-ml-2">
                  {newMatches.map((match) => (
                    <CarouselItem key={match.id} className="pl-2 basis-20">
                      <div 
                        className="relative flex flex-col items-center cursor-pointer"
                        onClick={() => handleMatchClick(match)}
                      >
                        <div className="relative">
                          <div className="absolute inset-0 rounded-full p-0.5 bg-gradient-to-br from-primary to-accent animate-pulse">
                            <div className="absolute inset-0.5 rounded-full bg-background"></div>
                          </div>
                          <Avatar className="h-16 w-16 border-2 border-transparent relative z-10">
                            <AvatarImage src={match.avatar} alt={match.name} />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {match.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full px-1.5 py-0.5 font-bold animate-bounce z-20">
                            NEW
                          </div>
                        </div>
                        <p className="text-xs text-foreground font-medium mt-1 text-center truncate w-full">
                          {match.name}
                        </p>
                        <p className="text-xs text-muted-foreground text-center">
                          {formatMatchTime(match.matchedAt)}
                        </p>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          )}

          {/* All Matches */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">All Matches</h2>
            
            {matches.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No matches yet</h3>
                <p className="text-muted-foreground mb-6">Start swiping to find your perfect match!</p>
                <Button
                  onClick={() => navigate('/swipe')}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Start Swiping
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {matches.map((match) => (
                  <Card 
                    key={match.id} 
                    className="overflow-hidden hover:bg-card/80 transition-all duration-200 cursor-pointer"
                    onClick={() => handleMatchClick(match)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <Avatar className="h-14 w-14 ring-2 ring-border">
                            <AvatarImage src={match.avatar} alt={match.name} />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {match.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {match.isNew && (
                            <div className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full px-1.5 py-0.5 font-bold">
                              NEW
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground text-base">
                            {match.name}, {match.age}
                          </h3>
                          <div className="flex items-center text-muted-foreground text-sm mt-0.5">
                            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{match.location}</span>
                          </div>
                          <p className="text-muted-foreground text-xs mt-0.5">
                            Matched {formatMatchTime(match.matchedAt)}
                          </p>
                          <div className="mt-1.5">
                            <SectionViewStats 
                              viewerId={match.profileId}
                              viewedProfileId={user?.id || ''}
                              compact={true}
                            />
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => { e.stopPropagation(); handleMessage(match.profileId); }}
                            className="text-foreground hover:bg-muted"
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Message
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => { e.stopPropagation(); handleViewProfile(match.profileId); }}
                            className="text-muted-foreground border-border hover:bg-muted"
                          >
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Modal with Swipe Actions */}
      {showSwipeActions && selectedMatch && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card backdrop-blur-md rounded-3xl max-w-sm w-full max-h-[80vh] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.3)] border border-border/20">
            <div className="aspect-[3/4] relative overflow-hidden">
              <img
                src={selectedMatch.avatar}
                alt={selectedMatch.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent p-6">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-foreground">{selectedMatch.name}</h1>
                  <span className="text-xl text-foreground/80">{selectedMatch.age}</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/80 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedMatch.location}</span>
                </div>
                <Badge className="bg-primary/80 text-primary-foreground text-sm">
                  Matched {formatMatchTime(selectedMatch.matchedAt)}
                </Badge>
              </div>
            </div>
            
            <button
              onClick={() => setShowSwipeActions(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-background/30 backdrop-blur-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="p-4">
              <SwipeActions
                onRewind={handleRewind}
                onPass={handlePass}
                onLike={handleLike}
                onSuperLike={handleSuperLike}
                onBoost={handleBoost}
              />
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default Matches;
