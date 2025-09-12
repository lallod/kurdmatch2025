
import React from 'react';
import { Profile } from '@/types/swipe';
import { SWIPE_CONFIG } from '@/config/swipe';
interface ProfilePhotoGalleryProps {
  profile: Profile;
  currentPhotoIndex: number;
  onNextPhoto: () => void;
  onPrevPhoto: () => void;
  isBackground?: boolean;
}
const ProfilePhotoGallery = ({
  profile,
  currentPhotoIndex,
  onNextPhoto,
  onPrevPhoto,
  isBackground = false
}: ProfilePhotoGalleryProps) => {
  return (
    <div className="relative w-full h-full group">
      {/* Image Container with proper height fitting */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-muted/10">
        <img 
          src={profile.photos?.[currentPhotoIndex] || profile.avatar} 
          alt={`${profile.name}'s photo`} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" 
        />
        
        {/* Photo Navigation - Only show if multiple photos and not background */}
        {!isBackground && profile.photos && profile.photos.length > 1 && (
          <>
            {/* Invisible click zones for easier navigation */}
            <div 
              onClick={onPrevPhoto}
              className="absolute left-0 top-0 bottom-0 w-1/3 z-20 cursor-pointer"
            />
            <div 
              onClick={onNextPhoto}
              className="absolute right-0 top-0 bottom-0 w-1/3 z-20 cursor-pointer"
            />
            
            {/* Modern Photo Indicators */}
            <div className={`absolute ${SWIPE_CONFIG.gallery.indicators.top} left-1/2 transform -translate-x-1/2 flex ${SWIPE_CONFIG.gallery.indicators.gap} bg-black/40 backdrop-blur-xl rounded-full ${SWIPE_CONFIG.gallery.indicators.padding}`}>
              {profile.photos.map((_, index) => (
                <div 
                  key={index} 
                  className={`${SWIPE_CONFIG.gallery.indicators.size} rounded-full transition-all duration-300 ${
                    index === currentPhotoIndex 
                      ? `bg-white ${SWIPE_CONFIG.gallery.indicators.active} shadow-lg`
                      : `bg-white/50 ${SWIPE_CONFIG.gallery.indicators.inactive}`
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
