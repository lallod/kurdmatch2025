
import React from 'react';
import { Profile } from '@/types/swipe';

interface ProfilePhotoGalleryProps {
  profile: Profile;
  currentPhotoIndex: number;
  onNextPhoto: () => void;
  onPrevPhoto: () => void;
}

const ProfilePhotoGallery = ({ 
  profile, 
  currentPhotoIndex, 
  onNextPhoto, 
  onPrevPhoto 
}: ProfilePhotoGalleryProps) => {
  return (
    <div className="relative h-96 sm:h-[28rem] md:h-[32rem]">
      <img
        src={profile.photos?.[currentPhotoIndex] || profile.avatar}
        alt={profile.name}
        className="w-full h-full object-cover"
      />
      
      {/* Photo Navigation */}
      {profile.photos && profile.photos.length > 1 && (
        <>
          <button
            onClick={onPrevPhoto}
            className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 rounded-full flex items-center justify-center text-white touch-manipulation"
            disabled={currentPhotoIndex === 0}
          >
            <span className="text-lg sm:text-xl">‹</span>
          </button>
          <button
            onClick={onNextPhoto}
            className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 rounded-full flex items-center justify-center text-white touch-manipulation"
            disabled={currentPhotoIndex === profile.photos.length - 1}
          >
            <span className="text-lg sm:text-xl">›</span>
          </button>
          
          {/* Photo Indicators */}
          <div className="absolute top-3 sm:top-4 left-1/2 transform -translate-x-1/2 flex gap-1">
            {profile.photos.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                  index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePhotoGallery;
