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
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-purple-900/30" />
        </div>
        <div className="h-full flex items-center justify-center">
          <div className="text-white text-xl font-semibold">Loading matches...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 pb-32">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur shadow-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 relative">
              <Heart className="w-8 h-8 text-white" />
              {newMatches.length > 0 && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
                  {newMatches.length}
                </div>
              )}
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-300 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Matches
            </h1>
            <p className="text-purple-200">Your perfect connections await</p>
            
            {newMatches.length > 0 && (
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-pulse">
                <Sparkles className="w-3 h-3 mr-1" />
                {newMatches.length} New Match{newMatches.length > 1 ? 'es' : ''}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="backdrop-blur-md bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 animate-pulse"></div>
          
          <div className="relative z-10">
            {/* New Matches Section */}
            {newMatches.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">New Matches</h2>
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-pulse">
                    {newMatches.length} New
                  </Badge>
                </div>
                
                <Carousel className="w-full">
                  <CarouselContent className="-ml-2">
                     {newMatches.map((match) => (
                       <CarouselItem key={match.id} className="pl-2 basis-20">
                         <div 
                           className="relative flex flex-col items-center cursor-pointer"
                           onClick={() => handleMatchClick(match)}
                         >
                          <div className="relative">
                            <div className="absolute inset-0 rounded-full p-0.5 bg-gradient-to-br from-red-500 to-pink-500 animate-pulse">
                              <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900"></div>
                            </div>
                            <Avatar className="h-16 w-16 border-2 border-transparent relative z-10">
                              <AvatarImage src={match.avatar} alt={match.name} />
                              <AvatarFallback className="bg-purple-500 text-white">
                                {match.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold animate-bounce">
                              NEW
                            </div>
                          </div>
                          <p className="text-xs text-white font-medium mt-1 text-center truncate w-full">
                            {match.name}
                          </p>
                          <p className="text-xs text-purple-200 text-center">
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
              <h2 className="text-xl font-semibold text-white mb-4">All Matches</h2>
              
              {matches.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-purple-300/50 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-purple-200 mb-2">No matches yet</h3>
                  <p className="text-purple-300/70 mb-6">Start swiping to find your perfect match!</p>
                  <Button
                    onClick={() => navigate('/swipe')}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    Start Swiping
                  </Button>
                </div>
              ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {matches.map((match) => (
                     <Card 
                       key={match.id} 
                       className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                       onClick={() => handleMatchClick(match)}
                     >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={match.avatar} alt={match.name} />
                              <AvatarFallback className="bg-purple-500 text-white">
                                {match.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            {match.isNew && (
                              <div className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                                NEW
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="font-semibold text-white text-lg">
                              {match.name}, {match.age}
                            </h3>
                            <div className="flex items-center text-purple-200 text-sm mt-1">
                              <MapPin className="w-3 h-3 mr-1" />
                              {match.location}
                            </div>
                            <p className="text-purple-300 text-sm mt-1">
                              Matched {formatMatchTime(match.matchedAt)}
                            </p>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleMessage(match.profileId)}
                              className="text-white hover:bg-white/10"
                            >
                              <MessageCircle className="w-4 h-4 mr-1" />
                              Message
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewProfile(match.profileId)}
                              className="text-purple-200 border-purple-400/30 hover:bg-purple-500/20"
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
      </div>

      {/* Profile Modal with Swipe Actions */}
      {showSwipeActions && selectedMatch && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-purple-900/90 via-purple-800/90 to-pink-900/90 backdrop-blur-md rounded-3xl max-w-sm w-full max-h-[80vh] overflow-hidden shadow-2xl border border-white/20">
            {/* Profile Info */}
            <div className="aspect-[3/4] relative overflow-hidden">
              <img
                src={selectedMatch.avatar}
                alt={selectedMatch.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-white">{selectedMatch.name}</h1>
                    <span className="text-xl text-white/90">{selectedMatch.age}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white/90 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedMatch.location}</span>
                </div>
                <Badge className="bg-pink-500/80 text-white text-sm">
                  Matched {formatMatchTime(selectedMatch.matchedAt)}
                </Badge>
              </div>
            </div>
            
            {/* Close Button */}
            <button
              onClick={() => setShowSwipeActions(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/20 backdrop-blur-sm text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Swipe Actions */}
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