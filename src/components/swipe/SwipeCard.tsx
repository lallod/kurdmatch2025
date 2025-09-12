
import React, { useState } from 'react';
import ProfilePhotoGallery from './ProfilePhotoGallery';
import ProfileInfo from './ProfileInfo';
import ProfileBioSection from './ProfileBioSection';
import { Profile } from '@/types/swipe';

interface SwipeCardProps {
  profile: Profile;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onMessage: () => void;
  onSuperLike: () => void;
  style?: React.CSSProperties;
}

const SwipeCard: React.FC<SwipeCardProps> = ({
  profile,
  onSwipeLeft,
  onSwipeRight,
  onMessage,
  onSuperLike,
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
      className="w-full max-w-sm mx-auto bg-gray-100/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden"
      style={style}
    >
      {/* Action buttons at top */}
      <div className="absolute top-6 left-6 right-6 z-30 flex justify-between items-center">
        <button 
          onClick={onSwipeLeft}
          className="w-16 h-16 bg-red-400/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-red-500/80 transition-colors"
        >
          <span className="text-white text-2xl font-light">×</span>
        </button>
        
        <button className="w-14 h-14 bg-blue-400/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-blue-500/80 transition-colors"
          onClick={onMessage}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        
        <button 
          onClick={onSwipeRight}
          className="w-20 h-20 bg-pink-400/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-pink-500/80 transition-colors"
        >
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
        
        <button className="w-14 h-14 bg-yellow-500/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-yellow-600/80 transition-colors"
          onClick={onSuperLike}
        >
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </button>
      </div>

      {/* Main Photo Display */}
      <div className="relative w-full h-[400px]">
        <ProfilePhotoGallery
          profile={profile}
          currentPhotoIndex={currentPhotoIndex}
          onNextPhoto={handleNextPhoto}
          onPrevPhoto={handlePrevPhoto}
        />
        
        {/* Profile info overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent h-32">
          <div className="absolute bottom-4 left-6 right-6">
            <ProfileInfo profile={profile} />
          </div>
        </div>
      </div>
      
      {/* Bio and expandable sections */}
      <ProfileBioSection profile={profile} />
    </div>
  );
};

export default SwipeCard;
