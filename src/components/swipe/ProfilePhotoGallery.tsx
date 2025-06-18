
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
    <div className="relative w-full h-full">
      {/* Image Container with Aspect Ratio Preservation */}
      <div className="relative w-full h-full aspect-[3/4] sm:aspect-[4/3] lg:aspect-[3/4]">
        <img
          src={profile.photos?.[currentPhotoIndex] || profile.avatar}
          alt={profile.name}
          className="w-full h-full object-cover object-center"
        />
        
        {/* Photo Navigation */}
        {profile.photos && profile.photos.length > 1 && (
          <>
            <button
              onClick={onPrevPhoto}
              className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white touch-manipulation transition-all duration-200 hover:bg-black/60 hover:backdrop-blur-md"
              disabled={currentPhotoIndex === 0}
            >
              <span className="text-lg sm:text-xl font-medium">‹</span>
            </button>
            <button
              onClick={onNextPhoto}
              className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white touch-manipulation transition-all duration-200 hover:bg-black/60 hover:backdrop-blur-md"
              disabled={currentPhotoIndex === profile.photos.length - 1}
            >
              <span className="text-lg sm:text-xl font-medium">›</span>
            </button>
            
            {/* Photo Indicators */}
            <div className="absolute top-3 sm:top-4 left-1/2 transform -translate-x-1/2 flex gap-1 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5">
              {profile.photos.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-200 ${
                    index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePhotoGallery;
