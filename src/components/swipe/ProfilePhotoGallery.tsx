
import React from 'react';
import { Profile } from '@/types/swipe';
import { useBioGeneration } from '@/hooks/useBioGeneration';
import { Sparkles, Heart } from 'lucide-react';

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
  const { generatedBio, isGenerating } = useBioGeneration(profile);

  return (
    <div className="relative w-full h-full">
      {/* Image Container with Full Screen Coverage */}
      <div className="relative w-full h-full">
        <img
          src={profile.photos?.[currentPhotoIndex] || profile.avatar}
          alt={profile.name}
          className="w-full h-full object-cover object-center"
        />
        
        {/* Photo Navigation - Edge to Edge */}
        {profile.photos && profile.photos.length > 1 && (
          <>
            <button
              onClick={onPrevPhoto}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 bg-black/40 backdrop-blur-sm flex items-center justify-center text-white touch-manipulation transition-all duration-200 hover:bg-black/60 hover:backdrop-blur-md"
              disabled={currentPhotoIndex === 0}
            >
              <span className="text-xl sm:text-2xl font-medium">‹</span>
            </button>
            <button
              onClick={onNextPhoto}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 bg-black/40 backdrop-blur-sm flex items-center justify-center text-white touch-manipulation transition-all duration-200 hover:bg-black/60 hover:backdrop-blur-md"
              disabled={currentPhotoIndex === profile.photos.length - 1}
            >
              <span className="text-xl sm:text-2xl font-medium">›</span>
            </button>
            
            {/* Photo Indicators - Minimal Top Spacing */}
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 flex gap-1 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
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

        {/* Auto-Generated Bio Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 sm:p-6">
          <div className="space-y-3">
            {/* Bio Header */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Sparkles size={16} className="text-purple-300 animate-pulse" />
                <span className="text-purple-300 text-sm font-medium">AI Generated Bio</span>
              </div>
              {profile.verified && (
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>

            {/* Bio Content */}
            <div className="space-y-2">
              {isGenerating ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-white/20 rounded-full w-3/4 mb-2"></div>
                  <div className="h-4 bg-white/20 rounded-full w-1/2"></div>
                </div>
              ) : (
                <p className="text-white text-sm sm:text-base leading-relaxed font-light">
                  {generatedBio}
                </p>
              )}
            </div>

            {/* Bio Footer with Interests */}
            {profile.interests && profile.interests.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {profile.interests.slice(0, 4).map((interest, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium border border-white/30"
                  >
                    {interest}
                  </span>
                ))}
                {profile.interests.length > 4 && (
                  <span className="px-2 py-1 bg-purple-500/30 backdrop-blur-sm rounded-full text-purple-200 text-xs font-medium border border-purple-400/30">
                    +{profile.interests.length - 4} more
                  </span>
                )}
              </div>
            )}

            {/* Compatibility Score */}
            {profile.compatibilityScore && (
              <div className="flex items-center gap-2 mt-2">
                <Heart size={14} className="text-pink-400 fill-pink-400" />
                <span className="text-pink-300 text-sm font-medium">
                  {profile.compatibilityScore}% Match
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePhotoGallery;
