
import React, { useState } from 'react';
import ProfilePhotoGallery from './ProfilePhotoGallery';
import ProfileInfo from './ProfileInfo';
import ProfileBioSection from './ProfileBioSection';
import { Profile } from '@/types/swipe';

interface SwipeCardProps {
  profile: Profile;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  style?: React.CSSProperties;
}

const SwipeCard: React.FC<SwipeCardProps> = ({
  profile,
  onSwipeLeft,
  onSwipeRight,
  style
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const handleNextPhoto = () => {
    const photoCount = profile.photos?.length || 1;
    setCurrentPhotoIndex((prev) => (prev + 1) % photoCount);
  };

  const handlePrevPhoto = () => {
    const photoCount = profile.photos?.length || 1;
    setCurrentPhotoIndex((prev) => (prev - 1 + photoCount) % photoCount);
  };

  return (
    <div 
      className="w-full max-w-sm mx-auto bg-card rounded-3xl shadow-2xl overflow-hidden border border-border/20"
      style={style}
    >
      {/* Main Photo Display */}
      <div className="relative w-full h-[600px]">
        <ProfilePhotoGallery
          profile={profile}
          currentPhotoIndex={currentPhotoIndex}
          onNextPhoto={handleNextPhoto}
          onPrevPhoto={handlePrevPhoto}
        />
        
        {/* Modern gradient overlay with profile info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent h-48">
          <div className="absolute bottom-6 left-6 right-6">
            <ProfileInfo profile={profile} />
          </div>
        </div>
      </div>
      
      {/* Compact bio section */}
      <ProfileBioSection profile={profile} />
    </div>
  );
};

export default SwipeCard;
