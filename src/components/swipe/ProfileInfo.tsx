import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Sparkles, Flag, X, MessageCircle, Heart, Star } from 'lucide-react';
import { Profile, SwipeAction } from '@/types/swipe';
import { useBioGeneration } from '@/hooks/useBioGeneration';
interface ProfileInfoProps {
  profile: Profile;
  onReport: (profileId: string) => void;
  onSwipeAction: (action: SwipeAction, profileId: string) => void;
  onMessage: (profileId: string) => void;
}
const ProfileInfo = ({
  profile,
  onReport,
  onSwipeAction,
  onMessage
}: ProfileInfoProps) => {
  const {
    generatedBio,
    isGenerating
  } = useBioGeneration(profile);

  // Mock current user interests for matching (in real app, this would come from auth context)
  const currentUserInterests = ["Language", "Culture", "Travel", "Reading", "Technology", "Sports"];

  // Find matching interests between current user and viewed profile
  const matchingInterests = profile.interests?.filter(interest => currentUserInterests.includes(interest)) || [];
  return <>
      {/* Profile Info Overlay - Reduced Blur */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent backdrop-blur-sm p-2 sm:p-3">
        {/* Action Buttons - Moved to Top */}
        <div className="flex justify-center items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
          <Button onClick={() => onSwipeAction('pass', profile.id)} variant="outline" className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-red-500/30 backdrop-blur-md border-red-400/40 text-red-300 hover:bg-red-500/40 hover:backdrop-blur-lg touch-manipulation shadow-lg transition-all duration-200">
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>

          <Button onClick={() => onMessage(profile.id)} variant="outline" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500/30 backdrop-blur-md border-blue-400/40 text-blue-300 hover:bg-blue-500/40 hover:backdrop-blur-lg touch-manipulation shadow-lg transition-all duration-200">
            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          <Button onClick={() => onSwipeAction('like', profile.id)} variant="outline" className="w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 backdrop-blur-md border-purple-400/40 text-purple-300 hover:from-purple-500/40 hover:to-pink-500/40 hover:backdrop-blur-lg touch-manipulation shadow-lg transition-all duration-200">
            
          </Button>

          <Button onClick={() => onSwipeAction('superlike', profile.id)} variant="outline" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-yellow-500/30 backdrop-blur-md border-yellow-400/40 text-yellow-300 hover:bg-yellow-500/40 hover:backdrop-blur-lg touch-manipulation shadow-lg transition-all duration-200">
            <Star className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
              <h2 className="text-xl sm:text-2xl font-bold drop-shadow-lg text-yellow-50">{profile.name}</h2>
              <span className="text-lg sm:text-xl text-white drop-shadow-lg">{profile.age}</span>
              {profile.verified && <Badge className="bg-blue-500 text-white text-xs shadow-lg">✓</Badge>}
            </div>
            <div className="flex items-center gap-1 text-xs sm:text-sm text-white/95 mb-1 drop-shadow-md">
              <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
              <span className="truncate">{profile.location}</span>
              <span>• {profile.distance}km away</span>
            </div>
            {profile.kurdistanRegion && <Badge variant="outline" className="text-xs bg-purple-500/30 backdrop-blur-sm text-white border-purple-400/40 mb-1 shadow-lg">
                {profile.kurdistanRegion}
              </Badge>}
            {profile.relationshipGoals && <div className="text-xs sm:text-sm text-white/90 drop-shadow-md mb-1">
                Looking for: {profile.relationshipGoals}
              </div>}
            
            {/* Quick Info Badges - Moved here from ProfilePhotoGallery */}
            <div className="flex flex-wrap gap-1 mb-1">
              {profile.occupation && <Badge variant="secondary" className="text-xs backdrop-blur-sm text-white border-white/20 px-1.5 py-0.5 bg-purple-800">
                  {profile.occupation}
                </Badge>}
              {profile.height && <Badge variant="secondary" className="text-xs bg-black/40 backdrop-blur-sm text-white border-white/20 px-1.5 py-0.5">
                  {profile.height}cm
                </Badge>}
              {profile.languages && <Badge variant="secondary" className="text-xs bg-black/40 backdrop-blur-sm text-white border-white/20 px-1.5 py-0.5">
                  {profile.languages[0]}{profile.languages.length > 1 ? ` +${profile.languages.length - 1}` : ''}
                </Badge>}
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-green-500/90 to-emerald-500/90 backdrop-blur-sm text-white text-xs sm:text-sm flex-shrink-0 shadow-lg">
            <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
            {profile.compatibilityScore}%
          </Badge>
        </div>

        {/* Auto-Generated Bio Section - Moved inside main overlay to prevent overlap */}
        <div className="mt-4 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-3 sm:p-4 shadow-2xl animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
            <h3 className="text-white font-semibold text-xs sm:text-sm">About {profile.name}</h3>
          </div>
          
          {isGenerating ? <div className="flex items-center gap-2 text-white/80 text-xs sm:text-sm">
              <div className="animate-pulse">Generating bio...</div>
            </div> : <div className="space-y-2">
              <p className="text-white/95 text-xs sm:text-sm leading-relaxed">
                {generatedBio}
              </p>
              
              {/* Matching Interest Tags - Only show interests that both users have */}
              {matchingInterests.length > 0 && <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs bg-green-500/20 backdrop-blur-sm text-green-200 border-green-400/30 px-1.5 py-0.5 mb-1">
                    🤝 {matchingInterests.length} common interests
                  </Badge>
                  {matchingInterests.slice(0, 3).map((interest, index) => <Badge key={index} className="text-xs bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm text-green-200 border-green-400/30 px-1.5 py-0.5">
                      {interest}
                    </Badge>)}
                  {matchingInterests.length > 3 && <Badge className="text-xs bg-white/10 backdrop-blur-sm text-white/70 border-white/20 px-1.5 py-0.5">
                      +{matchingInterests.length - 3} more
                    </Badge>}
                </div>}
              
              {matchingInterests.length === 0 && profile.interests && <div className="text-xs text-white/60">
                  No common interests found
                </div>}
            </div>}
        </div>
      </div>

      {/* Safety Actions - Edge Positioning */}
      <div className="absolute top-1 right-1 flex gap-2">
        <Button onClick={() => onReport(profile.id)} variant="outline" size="sm" className="bg-black/40 backdrop-blur-md border-white/30 text-white hover:bg-red-500/60 hover:backdrop-blur-lg h-8 w-8 sm:h-9 sm:w-9 p-0 shadow-lg transition-all duration-200">
          <Flag className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </>;
};
export default ProfileInfo;