import React from 'react';
import { Card } from "@/components/ui/card";
import ProfilePhotoGallery from './ProfilePhotoGallery';
import ProfileInfo from './ProfileInfo';
import MobileProfileDetails from './MobileProfileDetails';
import ProfileDetails from './ProfileDetails';
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
    <Card className="w-full h-full overflow-hidden backdrop-blur-md bg-white/10 border-0 shadow-2xl flex flex-col rounded-none">
      {/* Mobile/Tablet Layout */}
      <div className="md:hidden h-full flex flex-col">
        {/* Photo Gallery - Takes most of the screen */}
        <div className="relative flex-[0.6] min-h-0">
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
            isMobileMinimal={true}
          />
        </div>
        
        {/* Scrollable Details Section */}
        <div className="flex-[0.4] overflow-y-auto bg-gradient-to-t from-black/95 via-black/80 to-transparent">
          <MobileProfileDetails
            profile={profile}
          />
        </div>
      </div>

      {/* Desktop Layout - Keep existing */}
      <div className="hidden md:flex md:flex-col md:h-full">
        <div className="relative flex-[0.8] min-h-0">
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
            isMobileMinimal={false}
          />
        </div>
        <div className="flex-shrink-0 flex-[0.2]">
          <ProfileDetails
            profile={profile}
            isExpanded={isExpanded}
            onToggleExpanded={onToggleExpanded}
          />
        </div>
      </div>
    </Card>
  );
};

export default SwipeCard;
