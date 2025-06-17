
import React from 'react';
import { Card } from "@/components/ui/card";
import ProfilePhotoGallery from './ProfilePhotoGallery';
import ProfileInfo from './ProfileInfo';
import ProfileDetails from './ProfileDetails';
import { Profile } from '@/types/swipe';

interface SwipeCardProps {
  profile: Profile;
  currentPhotoIndex: number;
  isExpanded: boolean;
  onNextPhoto: () => void;
  onPrevPhoto: () => void;
  onToggleExpanded: () => void;
  onReport: (profileId: number) => void;
}

const SwipeCard = ({
  profile,
  currentPhotoIndex,
  isExpanded,
  onNextPhoto,
  onPrevPhoto,
  onToggleExpanded,
  onReport
}: SwipeCardProps) => {
  return (
    <Card className="overflow-hidden backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl">
      <div className="relative">
        <ProfilePhotoGallery
          profile={profile}
          currentPhotoIndex={currentPhotoIndex}
          onNextPhoto={onNextPhoto}
          onPrevPhoto={onPrevPhoto}
        />
        <ProfileInfo profile={profile} onReport={onReport} />
      </div>
      <ProfileDetails
        profile={profile}
        isExpanded={isExpanded}
        onToggleExpanded={onToggleExpanded}
      />
    </Card>
  );
};

export default SwipeCard;
