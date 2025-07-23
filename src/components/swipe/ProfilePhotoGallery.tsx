
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
    <div className="relative w-full h-full group">
      {/* Enhanced Image Container */}
      <div className="relative w-full h-full overflow-hidden">
        <img 
          src={profile.photos?.[currentPhotoIndex] || profile.avatar} 
          alt={profile.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        
        {/* Enhanced Photo Navigation */}
        {profile.photos && profile.photos.length > 1 && (
          <>
            <button 
              onClick={onPrevPhoto} 
              className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/30 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white touch-manipulation transition-all duration-300 hover:bg-black/50 hover:scale-110 hover:border-white/40 disabled:opacity-30 disabled:cursor-not-allowed z-10" 
              disabled={currentPhotoIndex === 0}
            >
              <span className="text-lg sm:text-xl font-light">‹</span>
            </button>
            
            <button 
              onClick={onNextPhoto} 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/30 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white touch-manipulation transition-all duration-300 hover:bg-black/50 hover:scale-110 hover:border-white/40 disabled:opacity-30 disabled:cursor-not-allowed z-10" 
              disabled={currentPhotoIndex === profile.photos.length - 1}
            >
              <span className="text-lg sm:text-xl font-light">›</span>
            </button>
            
            {/* Enhanced Photo Indicators */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/20 backdrop-blur-md rounded-full px-3 py-2 border border-white/10">
              {profile.photos.map((_, index) => (
                <div 
                  key={index} 
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === currentPhotoIndex 
                      ? 'bg-white w-6 shadow-sm' 
                      : 'bg-white/40 w-1.5 hover:bg-white/60'
                  }`} 
                />
              ))}
            </div>
          </>
        )}
        
        {/* Subtle Vignette Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/10 pointer-events-none" />
      </div>
    </div>
  );
};
export default ProfilePhotoGallery;
