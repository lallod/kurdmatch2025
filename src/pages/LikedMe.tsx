import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart, X, Filter, MessageCircle, ArrowLeft, Bot, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import ProfileDetails from "@/components/ProfileDetails";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import PhotoGallery from "@/components/PhotoGallery";
import { getProfilesWhoLikedMe } from '@/api/likes';
import { likeProfile } from '@/api/likes';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import SwipeActions from '@/components/swipe/SwipeActions';
import { toast } from 'sonner';

const LikedMe = () => {
  const { toast: toastHook } = useToast();
  const { user } = useSupabaseAuth();
  const [likedProfiles, setLikedProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showFullProfile, setShowFullProfile] = useState(false);
  const [showSwipeActions, setShowSwipeActions] = useState(false);

  useEffect(() => {
    const loadLikedProfiles = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const profiles = await getProfilesWhoLikedMe();
        setLikedProfiles(profiles || []);
      } catch (error) {
        console.error('Failed to load liked profiles:', error);
        toastHook({
          title: "Error",
          description: "Failed to load profiles who liked you",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadLikedProfiles();
  }, [user, toastHook]);

  const handleLikeBack = async (profileId: string) => {
    try {
      const result = await likeProfile(profileId);
      if (result.match) {
        toast.success("It's a match! 🎉");
      } else {
        toast.success("Liked back!");
      }
      
      // Update the profile to show it's been liked back
      setLikedProfiles(profiles => 
        profiles.map(profile => 
          profile.id === profileId 
            ? { ...profile, isLikedBack: true }
            : profile
        )
      );
    } catch (error) {
      console.error('Error liking profile back:', error);
      toast.error("Failed to like profile. Please try again.");
    }
  };

  const handlePass = (profileId: string) => {
    // Remove profile from the list
    setLikedProfiles(profiles => 
      profiles.filter(profile => profile.id !== profileId)
    );
    
    toast.info("Profile passed");
  };

  const handleRewind = () => {
    toast.info("Rewind");
  };

  const handleSuperLike = () => {
    if (!selectedProfile) return;
    toast.info("Super liked!");
    setShowSwipeActions(false);
  };

  const handleBoost = () => {
    toast.info("Boosted!");
  };

  const handleProfileClick = (profile: any) => {
    setSelectedProfile(profile);
    setShowSwipeActions(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Loading profiles who liked you...</div>
        </div>
      </div>
    );
  }

  if (showFullProfile && selectedProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900">
        <div className="flex items-center gap-4 p-4 text-white">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowFullProfile(false)}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold">{selectedProfile.name}</h1>
        </div>
        
        <div className="px-4 pb-4">
          <PhotoGallery 
            photos={selectedProfile.photos?.map(p => p.url) || [selectedProfile.profile_image]} 
            name={selectedProfile.name} 
            age={selectedProfile.age}
          />
          
          <ProfileDetails details={{
            about: selectedProfile.bio || '',
            height: selectedProfile.height || '',
            bodyType: selectedProfile.body_type || '',
            ethnicity: selectedProfile.ethnicity || '',
            education: selectedProfile.education || '',
            occupation: selectedProfile.occupation || '',
            company: selectedProfile.company || '',
            religion: selectedProfile.religion || '',
            politicalViews: selectedProfile.political_views || '',
            drinking: selectedProfile.drinking || '',
            smoking: selectedProfile.smoking || '',
            relationshipGoals: selectedProfile.relationship_goals || '',
            wantChildren: selectedProfile.want_children || '',
            havePets: selectedProfile.have_pets || '',
            languages: selectedProfile.languages || [],
            interests: selectedProfile.interests || [],
            favoriteBooks: selectedProfile.favorite_books || [],
            favoriteMovies: selectedProfile.favorite_movies || [],
            favoriteMusic: selectedProfile.favorite_music || [],
            favoriteFoods: selectedProfile.favorite_foods || [],
            exerciseHabits: selectedProfile.exercise_habits || '',
            zodiacSign: selectedProfile.zodiac_sign || '',
            personalityType: selectedProfile.personality_type || '',
            sleepSchedule: selectedProfile.sleep_schedule || '',
            travelFrequency: selectedProfile.travel_frequency || '',
            communicationStyle: selectedProfile.communication_style || '',
            loveLanguage: selectedProfile.love_language || '',
            hobbies: selectedProfile.hobbies || [],
            values: selectedProfile.values || [],
          }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex flex-col">
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pt-8 pb-24">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Liked You</h1>
              <p className="text-purple-200 text-sm">People who liked your profile</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
              {likedProfiles.length} likes
            </Badge>
          </div>
        </div>

        {likedProfiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-6">
              <Heart className="h-10 w-10 text-purple-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No likes yet</h3>
            <p className="text-purple-200 max-w-sm">
              When someone likes your profile, they'll appear here. Keep your profile active to get more likes!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {likedProfiles.map((profile) => (
              <Card 
                key={profile.id} 
                className="overflow-hidden bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-200 cursor-pointer transform hover:scale-[1.02]"
                onClick={() => handleProfileClick(profile)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-16 w-16 ring-2 ring-white/30">
                        <AvatarImage 
                          src={profile.profile_image || profile.photos?.[0]?.url} 
                          alt={profile.name} 
                        />
                        <AvatarFallback className="bg-purple-600 text-white">
                          {profile.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-lg">{profile.name}</span>
                          <span className="text-purple-200">{profile.age}</span>
                          {profile.verified && (
                            <Badge className="bg-info/20 text-info border-info/30 text-xs">
                              ✓
                            </Badge>
                          )}
                        </div>
                        <p className="text-purple-200 text-sm">{profile.location}</p>
                        <p className="text-purple-300 text-sm">{profile.occupation}</p>
                        {profile.bio && (
                          <p className="text-purple-200 text-sm mt-1 line-clamp-2">
                            {profile.bio}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {!profile.isLikedBack ? (
                        <>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleLikeBack(profile.id);
                                  }}
                                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white h-8 w-8 p-0"
                                >
                                  <Heart className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Like back</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePass(profile.id);
                                  }}
                                  className="border-white/30 text-white hover:bg-white/10 h-8 w-8 p-0"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Pass</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <Badge className="bg-success/20 text-success border-success/30 text-xs">
                            Mutual Like
                          </Badge>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="sm"
                                  className="bg-info/20 text-info hover:bg-info/30 h-8 w-8 p-0"
                                >
                                  <MessageCircle className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Send message</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {profile.interests && profile.interests.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {profile.interests.slice(0, 3).map((interest, index) => (
                        <Badge 
                          key={index}
                          className="bg-purple-500/20 text-purple-300 border-purple-400/30 text-xs"
                        >
                          {interest}
                        </Badge>
                      ))}
                      {profile.interests.length > 3 && (
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30 text-xs">
                          +{profile.interests.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Profile Modal with Swipe Actions */}
      {showSwipeActions && selectedProfile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-purple-900/90 via-purple-800/90 to-pink-900/90 backdrop-blur-md rounded-3xl max-w-sm w-full max-h-[80vh] overflow-hidden shadow-2xl border border-white/20">
            {/* Profile Info */}
            <div className="aspect-[3/4] relative overflow-hidden">
              <img
                src={selectedProfile.profile_image}
                alt={selectedProfile.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-white">{selectedProfile.name}</h1>
                    <span className="text-xl text-white/90">{selectedProfile.age}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white/90 mb-3">
                  <span>{selectedProfile.location}</span>
                </div>
                {selectedProfile.occupation && (
                  <Badge className="bg-pink-500/80 text-white text-sm">
                    {selectedProfile.occupation}
                  </Badge>
                )}
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
                onPass={() => {
                  handlePass(selectedProfile.id);
                  setShowSwipeActions(false);
                }}
                onLike={() => {
                  handleLikeBack(selectedProfile.id);
                  setShowSwipeActions(false);
                }}
                onSuperLike={handleSuperLike}
                onBoost={handleBoost}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LikedMe;