import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart, X, Filter, MessageCircle, ArrowLeft, Bot, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import ProfileDetails from "@/components/ProfileDetails";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import PhotoGallery from "@/components/PhotoGallery";
import { getProfilesWhoLikedMe } from '@/api/likes';
import { likeProfile } from '@/api/likes';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import SwipeActions from '@/components/swipe/SwipeActions';
import { toast } from 'sonner';
import SectionViewStats from '@/components/profile/SectionViewStats';
import { useTranslations } from '@/hooks/useTranslations';

const LikedMe = () => {
  const { user } = useSupabaseAuth();
  const { t } = useTranslations();
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
        toast.error('Failed to load profiles who liked you');
      } finally {
        setIsLoading(false);
      }
    };

    loadLikedProfiles();
  }, [user]);

  const handleLikeBack = async (profileId: string) => {
    try {
      const result = await likeProfile(profileId);
      if (result.match) {
        toast.success("It's a match! 🎉");
      } else {
        toast.success("Liked back!");
      }
      
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
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-foreground text-xl">{t('liked_me.loading', 'Loading profiles who liked you...')}</div>
        </div>
      </div>
    );
  }

  if (showFullProfile && selectedProfile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center gap-4 p-4 text-foreground">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowFullProfile(false)}
            className="text-foreground hover:bg-muted"
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
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 z-10 bg-background border-b border-border/30">
        <div className="max-w-lg mx-auto px-4 h-11 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/15 rounded-full flex items-center justify-center">
            <Heart className="h-4 w-4 text-primary" />
          </div>
          <h1 className="text-base font-semibold text-foreground">{t('liked_me.title', 'Liked You')}</h1>
          <Badge className="ml-auto bg-muted text-muted-foreground border-border text-xs">
            {likedProfiles.length}
          </Badge>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pt-4 pb-24">

        {likedProfiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
              <Heart className="h-10 w-10 text-muted-foreground" />
            </div>
             <h3 className="text-xl font-semibold text-foreground mb-2">{t('liked_me.no_likes', 'No likes yet')}</h3>
             <p className="text-muted-foreground max-w-sm">
               {t('liked_me.no_likes_desc', "When someone likes your profile, they'll appear here. Keep your profile active to get more likes!")}
             </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {likedProfiles.map((profile) => (
              <Card 
                key={profile.id} 
                className="overflow-hidden hover:bg-card/80 transition-all duration-200 cursor-pointer"
                onClick={() => handleProfileClick(profile)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-14 w-14 ring-2 ring-border">
                        <AvatarImage 
                          src={profile.profile_image || profile.photos?.[0]?.url} 
                          alt={profile.name} 
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {profile.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground text-base">{profile.name}</span>
                          <span className="text-muted-foreground">{profile.age}</span>
                          {profile.verified && (
                            <Badge className="bg-info/20 text-info border-info/30 text-xs">✓</Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm">{profile.location}</p>
                        <p className="text-muted-foreground text-sm">{profile.occupation}</p>
                        {profile.bio && (
                          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{profile.bio}</p>
                        )}
                        <div className="mt-2">
                          <SectionViewStats 
                            viewerId={profile.id}
                            viewedProfileId={user?.id || ''}
                            compact={true}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      {!profile.isLikedBack ? (
                        <>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="sm"
                                  onClick={(e) => { e.stopPropagation(); handleLikeBack(profile.id); }}
                                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 w-8 p-0"
                                >
                                  <Heart className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent><p>Like back</p></TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => { e.stopPropagation(); handlePass(profile.id); }}
                                  className="border-border text-foreground hover:bg-muted h-8 w-8 p-0"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent><p>Pass</p></TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <Badge className="bg-success/20 text-success border-success/30 text-xs">Mutual Like</Badge>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button size="sm" className="bg-info/20 text-info hover:bg-info/30 h-8 w-8 p-0">
                                  <MessageCircle className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent><p>Send message</p></TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {profile.interests && profile.interests.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {profile.interests.slice(0, 3).map((interest, index) => (
                        <Badge key={index} className="bg-primary/10 text-primary border-primary/20 text-xs">
                          {interest}
                        </Badge>
                      ))}
                      {profile.interests.length > 3 && (
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
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
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card backdrop-blur-md rounded-3xl max-w-sm w-full max-h-[80vh] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.3)] border border-border/20">
            <div className="aspect-[3/4] relative overflow-hidden">
              <img
                src={selectedProfile.profile_image}
                alt={selectedProfile.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent p-6">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-foreground">{selectedProfile.name}</h1>
                  <span className="text-xl text-foreground/80">{selectedProfile.age}</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/80 mb-3">
                  <span>{selectedProfile.location}</span>
                </div>
                {selectedProfile.occupation && (
                  <Badge className="bg-primary/80 text-primary-foreground text-sm">
                    {selectedProfile.occupation}
                  </Badge>
                )}
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
                onPass={() => { handlePass(selectedProfile.id); setShowSwipeActions(false); }}
                onLike={() => { handleLikeBack(selectedProfile.id); setShowSwipeActions(false); }}
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
