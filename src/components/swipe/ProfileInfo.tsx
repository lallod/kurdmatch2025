
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Sparkles, Flag, X, MessageCircle, Heart, Star } from 'lucide-react';
import { Profile, SwipeAction } from '@/types/swipe';

interface ProfileInfoProps {
  profile: Profile;
  onReport: (profileId: number) => void;
  onSwipeAction: (action: SwipeAction, profileId: number) => void;
  onMessage: (profileId: number) => void;
}

const ProfileInfo = ({ profile, onReport, onSwipeAction, onMessage }: ProfileInfoProps) => {
  return (
    <>
      {/* Profile Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white">{profile.name}</h2>
              <span className="text-lg sm:text-xl text-white">{profile.age}</span>
              {profile.verified && (
                <Badge className="bg-blue-500 text-white text-xs">✓</Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs sm:text-sm text-white/90 mb-1">
              <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
              <span className="truncate">{profile.location}</span>
              <span>• {profile.distance}km away</span>
            </div>
            {profile.kurdistanRegion && (
              <Badge variant="outline" className="text-xs bg-purple-500/20 text-white border-purple-400/30 mb-1">
                {profile.kurdistanRegion}
              </Badge>
            )}
            {profile.relationshipGoals && (
              <div className="text-xs sm:text-sm text-white/80">
                Looking for: {profile.relationshipGoals}
              </div>
            )}
          </div>
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs sm:text-sm flex-shrink-0">
            <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
            {profile.compatibilityScore}%
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center items-center gap-3 sm:gap-4 mt-4 sm:mt-6 px-2">
          <Button
            onClick={() => onSwipeAction('pass', profile.id)}
            variant="outline"
            className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-red-500/20 border-red-400/30 text-red-400 hover:bg-red-500/30 touch-manipulation"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>

          <Button
            onClick={() => onMessage(profile.id)}
            variant="outline"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500/20 border-blue-400/30 text-blue-400 hover:bg-blue-500/30 touch-manipulation"
          >
            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          <Button
            onClick={() => onSwipeAction('like', profile.id)}
            variant="outline"
            className="w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/30 text-purple-400 hover:from-purple-500/30 hover:to-pink-500/30 touch-manipulation"
          >
            <Heart className="h-6 w-6 sm:h-7 sm:w-7" />
          </Button>

          <Button
            onClick={() => onSwipeAction('superlike', profile.id)}
            variant="outline"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-yellow-500/20 border-yellow-400/30 text-yellow-400 hover:bg-yellow-500/30 touch-manipulation"
          >
            <Star className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>

      {/* Safety Actions */}
      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex gap-2">
        <Button
          onClick={() => onReport(profile.id)}
          variant="outline"
          size="sm"
          className="bg-black/50 border-white/20 text-white hover:bg-red-500/50 h-8 w-8 sm:h-9 sm:w-9 p-0"
        >
          <Flag className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </>
  );
};

export default ProfileInfo;
