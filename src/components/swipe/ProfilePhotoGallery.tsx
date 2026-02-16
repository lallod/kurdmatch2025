
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
  const handleTapZone = (side: 'left' | 'right', e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (side === 'left') {
      onPrevPhoto();
    } else {
      onNextPhoto();
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Image Container */}
      <div className="relative w-full h-full overflow-hidden bg-muted/10">
        <img 
          src={profile.photos?.[currentPhotoIndex] || profile.avatar} 
          alt={`${profile.name}'s photo`} 
          className={`w-full h-full object-cover ${profile.blur_photos ? 'blur-xl' : ''}`}
        />
        
        {/* Photo Navigation - Only show if multiple photos and not background */}
        {!isBackground && profile.photos && profile.photos.length > 1 && (
          <>
            {/* Left Tap Zone with Visual Feedback */}
            <div 
              onClick={(e) => handleTapZone('left', e)}
              onTouchEnd={(e) => handleTapZone('left', e)}
              className="absolute left-0 top-0 bottom-0 w-2/5 z-20 cursor-pointer group/tap active:bg-black/10 transition-colors"
            >
              {/* Visual indicator on tap */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-active/tap:opacity-100 transition-opacity pointer-events-none">
                <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7"/>
                </svg>
              </div>
            </div>
            
            {/* Right Tap Zone with Visual Feedback */}
            <div 
              onClick={(e) => handleTapZone('right', e)}
              onTouchEnd={(e) => handleTapZone('right', e)}
              className="absolute right-0 top-0 bottom-0 w-2/5 z-20 cursor-pointer group/tap active:bg-black/10 transition-colors"
            >
              {/* Visual indicator on tap */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-active/tap:opacity-100 transition-opacity pointer-events-none">
                <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
            
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
