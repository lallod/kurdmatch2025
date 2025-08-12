
import React from 'react';
import { Card } from "@/components/ui/card";
import ProfilePhotoGallery from './ProfilePhotoGallery';
import ProfileInfo from './ProfileInfo';
import ProfileDetails from './ProfileDetails';
import { Profile, SwipeAction } from '@/types/swipe';

interface SwipeCardProps {
  profile: Profile;
  currentPhotoIndex: number;
  isExpanded: boolean;
  onNextPhoto: () => void;
  onPrevPhoto: () => void;
  onToggleExpanded: () => void;
  onReport: (profileId: string) => void;
  onSwipeAction: (action: SwipeAction, profileId: string) => void;
  onMessage: (profileId: string) => void;
}

const SwipeCard = ({
  profile,
  currentPhotoIndex,
  isExpanded,
  onNextPhoto,
  onPrevPhoto,
  onToggleExpanded,
  onReport,
  onSwipeAction,
  onMessage
}: SwipeCardProps) => {
  return (
    <Card className="w-full overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.3)] flex flex-col rounded-3xl group transition-all duration-500 hover:shadow-[0_25px_50px_rgba(147,51,234,0.2)]">
      {/* Photo Section with Enhanced Styling */}
      <div className="relative aspect-[3/4] rounded-t-3xl overflow-hidden">
        <ProfilePhotoGallery
          profile={profile}
          currentPhotoIndex={currentPhotoIndex}
          onNextPhoto={onNextPhoto}
          onPrevPhoto={onPrevPhoto}
        />
        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
        <ProfileInfo 
          profile={profile} 
          onReport={onReport}
          onSwipeAction={onSwipeAction}
          onMessage={onMessage}
        />
      </div>
      {/* Details Section with Glass Effect */}
      <div className="bg-black/20 backdrop-blur-sm border-t border-white/10">
        <ProfileDetails
          profile={profile}
          isExpanded={isExpanded}
          onToggleExpanded={onToggleExpanded}
        />
      </div>
    </Card>
  );
};

export default SwipeCard;
