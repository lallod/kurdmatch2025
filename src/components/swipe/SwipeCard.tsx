
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
      className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden"
      style={style}
    >
      {/* Photo Gallery with 16:9 aspect ratio */}
      <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
        <ProfilePhotoGallery
          profile={profile}
          currentPhotoIndex={currentPhotoIndex}
          onNextPhoto={handleNextPhoto}
          onPrevPhoto={handlePrevPhoto}
        />
        
        {/* Profile Info overlay at bottom - max 25% height */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent" style={{ height: '25%' }}>
          <div className="absolute bottom-4 left-4 right-4">
            <ProfileInfo profile={profile} />
          </div>
        </div>
      </div>
      
      {/* Bio section appears after photo */}
      <ProfileBioSection profile={profile} />
    </div>
  );
};

export default SwipeCard;
