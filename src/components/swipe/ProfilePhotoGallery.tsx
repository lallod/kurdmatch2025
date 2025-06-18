
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
        
        {/* Photo Navigation - Enhanced for Mobile */}
        {profile.photos && profile.photos.length > 1 && (
          <>
            {/* Left tap area */}
            <button
              onClick={onPrevPhoto}
              className="absolute left-0 top-0 w-1/3 h-full bg-transparent flex items-center justify-start pl-2 sm:pl-3 touch-manipulation"
              disabled={currentPhotoIndex === 0}
              aria-label="Previous photo"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 hover:bg-black/60 hover:backdrop-blur-md opacity-0 hover:opacity-100 active:opacity-100">
                <span className="text-lg sm:text-xl font-medium">‹</span>
              </div>
            </button>

            {/* Right tap area */}
            <button
              onClick={onNextPhoto}
              className="absolute right-0 top-0 w-1/3 h-full bg-transparent flex items-center justify-end pr-2 sm:pr-3 touch-manipulation"
              disabled={currentPhotoIndex === profile.photos.length - 1}
              aria-label="Next photo"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 hover:bg-black/60 hover:backdrop-blur-md opacity-0 hover:opacity-100 active:opacity-100">
                <span className="text-lg sm:text-xl font-medium">›</span>
              </div>
            </button>
            
            {/* Photo Indicators - Enhanced for Mobile */}
            <div className="absolute top-3 sm:top-4 left-1/2 transform -translate-x-1/2 flex gap-1.5 bg-black/30 backdrop-blur-sm rounded-full px-3 py-2">
              {profile.photos.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-200 ${
                    index === currentPhotoIndex ? 'bg-white scale-110' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Mobile-friendly gradient overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none sm:h-24"></div>
      </div>
    </div>
  );
};

export default ProfilePhotoGallery;
