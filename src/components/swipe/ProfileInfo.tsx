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
  return (
    <div className="p-4 space-y-4">
      {/* Action Buttons */}
      <div className="flex justify-center items-center gap-3 sm:gap-4">
        <Button 
          onClick={() => onSwipeAction('pass', profile.id)} 
          variant="outline" 
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-500/20 border-red-400/40 text-red-600 hover:bg-red-500/30 touch-manipulation shadow-lg transition-all duration-200"
        >
          <X className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>

        <Button 
          onClick={() => onMessage(profile.id)} 
          variant="outline" 
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500/20 border-blue-400/40 text-blue-600 hover:bg-blue-500/30 touch-manipulation shadow-lg transition-all duration-200"
        >
          <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>

        <Button 
          onClick={() => onSwipeAction('like', profile.id)} 
          variant="outline" 
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/40 text-purple-600 hover:from-purple-500/30 hover:to-pink-500/30 touch-manipulation shadow-lg transition-all duration-200"
        >
          <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>

        <Button 
          onClick={() => onSwipeAction('superlike', profile.id)} 
          variant="outline" 
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-yellow-500/20 border-yellow-400/40 text-yellow-600 hover:bg-yellow-500/30 touch-manipulation shadow-lg transition-all duration-200"
        >
          <Star className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>

        {/* Safety Actions */}
        <Button 
          onClick={() => onReport(profile.id)} 
          variant="outline" 
          size="sm" 
          className="bg-gray-500/20 border-gray-400/40 text-gray-600 hover:bg-red-500/30 h-8 w-8 sm:h-9 sm:w-9 p-0 shadow-lg transition-all duration-200 ml-2"
        >
          <Flag className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>

      {/* Profile Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{profile.name}</h2>
            <span className="text-xl sm:text-2xl text-gray-700">{profile.age}</span>
            {profile.verified && <Badge className="bg-blue-500 text-white text-xs">✓</Badge>}
          </div>
          
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{profile.location}</span>
            <span>• {profile.distance}km away</span>
          </div>
          
          {profile.kurdistanRegion && (
            <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700 border-purple-300 mb-2">
              {profile.kurdistanRegion}
            </Badge>
          )}
          
          {profile.relationshipGoals && (
            <div className="text-sm text-gray-600 mb-2">
              Looking for: {profile.relationshipGoals}
            </div>
          )}
          
          {/* Quick Info Badges */}
          <div className="flex flex-wrap gap-2 mb-2">
            {profile.occupation && (
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 px-2 py-1">
                {profile.occupation}
              </Badge>
            )}
            {profile.height && (
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 px-2 py-1">
                {profile.height}
              </Badge>
            )}
            {profile.languages && profile.languages.length > 0 && (
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 px-2 py-1">
                {profile.languages[0]}{profile.languages.length > 1 ? ` +${profile.languages.length - 1}` : ''}
              </Badge>
            )}
          </div>
        </div>
        
        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm flex-shrink-0 shadow-lg">
          <Sparkles className="h-3 w-3 mr-1" />
          {profile.compatibilityScore}%
        </Badge>
      </div>
    </div>
  );
};
export default ProfileInfo;