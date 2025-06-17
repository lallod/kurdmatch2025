
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { MapPin, Sparkles, Flag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Profile } from '@/types/swipe';

interface ProfileInfoProps {
  profile: Profile;
  onReport: (profileId: number) => void;
}

const ProfileInfo = ({ profile, onReport }: ProfileInfoProps) => {
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
