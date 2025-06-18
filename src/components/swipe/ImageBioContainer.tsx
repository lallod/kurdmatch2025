
import React from 'react';
import { Profile } from '@/types/swipe';
import ProfilePhotoGallery from './ProfilePhotoGallery';

interface ImageBioContainerProps {
  profile: Profile;
  currentPhotoIndex: number;
  onNextPhoto: () => void;
  onPrevPhoto: () => void;
}

const ImageBioContainer = ({
  profile,
  currentPhotoIndex,
  onNextPhoto,
  onPrevPhoto
}: ImageBioContainerProps) => {
  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Image Section - Takes most of the space */}
      <div className="relative flex-1 min-h-0">
        <ProfilePhotoGallery
          profile={profile}
          currentPhotoIndex={currentPhotoIndex}
          onNextPhoto={onNextPhoto}
          onPrevPhoto={onPrevPhoto}
        />
      </div>
      
      {/* Bio Section - Overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-4 pb-6">
        <div className="text-white">
          <h2 className="text-2xl font-bold mb-2">
            {profile.name}, {profile.age}
          </h2>
          {profile.bio && (
            <p className="text-sm leading-relaxed text-white/90 line-clamp-3">
              {profile.bio}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2 text-xs text-white/80">
            <span>{profile.location}</span>
            <span>•</span>
            <span>{profile.distance}km away</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageBioContainer;
