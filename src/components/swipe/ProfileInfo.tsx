
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Sparkles, Flag, X, MessageCircle, Heart, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Profile, SwipeAction } from '@/types/swipe';
import { useBioGeneration } from '@/hooks/useBioGeneration';

interface ProfileInfoProps {
  profile: Profile;
  onReport: (profileId: number) => void;
  onSwipeAction: (action: SwipeAction, profileId: number) => void;
  onMessage: (profileId: number) => void;
}

const ProfileInfo = ({ profile, onReport, onSwipeAction, onMessage }: ProfileInfoProps) => {
  const { generatedBio, isGenerating } = useBioGeneration(profile);
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  // Mock current user interests for matching (in real app, this would come from auth context)
  const currentUserInterests = ["Language", "Culture", "Travel", "Reading", "Technology", "Sports"];
  
  // Find matching interests between current user and viewed profile
  const matchingInterests = profile.interests?.filter(interest => 
    currentUserInterests.includes(interest)
  ) || [];

  // Function to truncate bio to 3 lines
  const truncateBio = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const displayBio = isBioExpanded ? generatedBio : truncateBio(generatedBio);
  const shouldShowReadMore = generatedBio.length > 120;

  return (
    <>
      {/* Profile Info Overlay - Positioned to fit screen */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent backdrop-blur-sm p-3 pb-6">
        {/* Action Buttons - Moved to Top */}
        <div className="flex justify-center items-center gap-3 mb-4">
          <Button
            onClick={() => onSwipeAction('pass', profile.id)}
            variant="outline"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-500/30 backdrop-blur-md border-red-400/40 text-red-300 hover:bg-red-500/40 hover:backdrop-blur-lg touch-manipulation shadow-lg transition-all duration-200"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>

          <Button
            onClick={() => onMessage(profile.id)}
            variant="outline"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500/30 backdrop-blur-md border-blue-400/40 text-blue-300 hover:bg-blue-500/40 hover:backdrop-blur-lg touch-manipulation shadow-lg transition-all duration-200"
          >
            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          <Button
            onClick={() => onSwipeAction('like', profile.id)}
            variant="outline"
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 backdrop-blur-md border-purple-400/40 text-purple-300 hover:from-purple-500/40 hover:to-pink-500/40 hover:backdrop-blur-lg touch-manipulation shadow-lg transition-all duration-200"
          >
            <Heart className="h-6 w-6 sm:h-7 sm:w-7" />
          </Button>

          <Button
            onClick={() => onSwipeAction('superlike', profile.id)}
            variant="outline"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-yellow-500/30 backdrop-blur-md border-yellow-400/40 text-yellow-300 hover:bg-yellow-500/40 hover:backdrop-blur-lg touch-manipulation shadow-lg transition-all duration-200"
          >
            <Star className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>

        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">{profile.name}</h2>
              <span className="text-lg sm:text-xl text-white drop-shadow-lg">{profile.age}</span>
              {profile.verified && (
                <Badge className="bg-blue-500 text-white text-xs shadow-lg">✓</Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs sm:text-sm text-white/95 mb-1 drop-shadow-md">
              <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
              <span className="truncate">{profile.location}</span>
              <span>• {profile.distance}km away</span>
            </div>
            {profile.kurdistanRegion && (
              <Badge variant="outline" className="text-xs bg-purple-500/30 backdrop-blur-sm text-white border-purple-400/40 mb-1 shadow-lg">
                {profile.kurdistanRegion}
              </Badge>
            )}
            {profile.relationshipGoals && (
              <div className="text-xs sm:text-sm text-white/90 drop-shadow-md mb-1">
                Looking for: {profile.relationshipGoals}
              </div>
            )}
            
            {/* Quick Info Badges */}
            <div className="flex flex-wrap gap-1 mb-2">
              {profile.occupation && (
                <Badge variant="secondary" className="text-xs bg-black/40 backdrop-blur-sm text-white border-white/20 px-1.5 py-0.5">
                  {profile.occupation}
                </Badge>
              )}
              {profile.height && (
                <Badge variant="secondary" className="text-xs bg-black/40 backdrop-blur-sm text-white border-white/20 px-1.5 py-0.5">
                  {profile.height}cm
                </Badge>
              )}
              {profile.languages && (
                <Badge variant="secondary" className="text-xs bg-black/40 backdrop-blur-sm text-white border-white/20 px-1.5 py-0.5">
                  {profile.languages[0]}{profile.languages.length > 1 ? ` +${profile.languages.length - 1}` : ''}
                </Badge>
              )}
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-green-500/90 to-emerald-500/90 backdrop-blur-sm text-white text-xs sm:text-sm flex-shrink-0 shadow-lg">
            <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
            {profile.compatibilityScore}%
          </Badge>
        </div>

        {/* Auto-Generated Bio Section - Compact with Read More */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-3 shadow-2xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
            <h3 className="text-white font-semibold text-sm">About {profile.name}</h3>
          </div>
          
          {isGenerating ? (
            <div className="flex items-center gap-2 text-white/80 text-xs sm:text-sm">
              <div className="animate-pulse">Generating bio...</div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-white/95 text-xs sm:text-sm leading-relaxed">
                {displayBio}
                {shouldShowReadMore && (
                  <button
                    onClick={() => setIsBioExpanded(!isBioExpanded)}
                    className="ml-2 text-purple-300 hover:text-purple-200 font-medium inline-flex items-center gap-1 transition-colors"
                  >
                    {isBioExpanded ? (
                      <>
                        Read Less <ChevronUp className="h-3 w-3" />
                      </>
                    ) : (
                      <>
                        Read More <ChevronDown className="h-3 w-3" />
                      </>
                    )}
                  </button>
                )}
              </div>
              
              {/* Matching Interest Tags - Only show interests that both users have */}
              {matchingInterests.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs bg-green-500/20 backdrop-blur-sm text-green-200 border-green-400/30 px-1.5 py-0.5">
                    🤝 {matchingInterests.length} common interests
                  </Badge>
                  {matchingInterests.slice(0, 2).map((interest, index) => (
                    <Badge 
                      key={index}
                      className="text-xs bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm text-green-200 border-green-400/30 px-1.5 py-0.5"
                    >
                      {interest}
                    </Badge>
                  ))}
                  {matchingInterests.length > 2 && (
                    <Badge className="text-xs bg-white/10 backdrop-blur-sm text-white/70 border-white/20 px-1.5 py-0.5">
                      +{matchingInterests.length - 2} more
                    </Badge>
                  )}
                </div>
              )}
              
              {matchingInterests.length === 0 && profile.interests && (
                <div className="text-xs text-white/60">
                  No common interests found
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Safety Actions - Edge Positioning */}
      <div className="absolute top-1 right-1 flex gap-2">
        <Button
          onClick={() => onReport(profile.id)}
          variant="outline"
          size="sm"
          className="bg-black/40 backdrop-blur-md border-white/30 text-white hover:bg-red-500/60 hover:backdrop-blur-lg h-8 w-8 sm:h-9 sm:w-9 p-0 shadow-lg transition-all duration-200"
        >
          <Flag className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </>
  );
};

export default ProfileInfo;
