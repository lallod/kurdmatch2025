
import React from 'react';
import ProfilePhotoGallery from './ProfilePhotoGallery';
import ProfileInfo from './ProfileInfo';
import ExpandedProfile from './ExpandedProfile';
import { Profile, SwipeAction } from '@/types/swipe';

interface SwipeCardProps {
  profile: Profile;
  currentPhotoIndex: number;
  isExpanded: boolean;
  onNextPhoto: () => void;
  onPrevPhoto: () => void;
  onToggleExpanded: () => void;
  onReport: (profileId: number) => void;
  onSwipeAction: (action: SwipeAction, profileId: number) => void;
  onMessage: (profileId: number) => void;
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
    <div className="w-full h-full overflow-auto backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl">
      {/* Photo Section - Takes full viewport height */}
      <div className="relative min-h-screen flex flex-col">
        <div className="relative flex-1">
          <ProfilePhotoGallery
            profile={profile}
            currentPhotoIndex={currentPhotoIndex}
            onNextPhoto={onNextPhoto}
            onPrevPhoto={onPrevPhoto}
          />
          <ProfileInfo 
            profile={profile} 
            onReport={onReport}
            onSwipeAction={onSwipeAction}
            onMessage={onMessage}
          />
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs">Scroll for more</span>
            <div className="w-1 h-6 bg-white/40 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Expanded Profile Section */}
      <ExpandedProfile profile={profile} />
    </div>
  );
};

export default SwipeCard;
