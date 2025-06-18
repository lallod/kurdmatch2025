
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import ProfilePhotoGallery from './ProfilePhotoGallery';
import ProfileInfo from './ProfileInfo';
import ProfileDetails from './ProfileDetails';
import { Profile, SwipeAction } from '@/types/swipe';

interface SwipeCardProps {
  profile: Profile;
  currentPhotoIndex: number;
  isExpanded: boolean;
  onNextPhoto: () => void;
  onPrevPhoto: () => void;
  onToggleExpanded: () => void;
  onReport: (profileId: number) => void;
  onSwipeAction: (action: SwipeAction, profileId: number) => void;
  onMessage: (profileId: number) => void;
}

const SwipeCard = ({
  profile,
  currentPhotoIndex,
  isExpanded,
  onNextPhoto,
  onPrevPhoto,
  onToggleExpanded,
  onReport,
  onSwipeAction,
  onMessage
}: SwipeCardProps) => {
  const [hasViewedProfile, setHasViewedProfile] = useState(false);
  const profileDetailsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasViewedProfile) {
            setHasViewedProfile(true);
            toast(`You viewed ${profile.name}'s profile`, {
              icon: "👁️",
              duration: 2000,
            });
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the profile details are visible
      }
    );

    if (profileDetailsRef.current) {
      observer.observe(profileDetailsRef.current);
    }

    return () => {
      if (profileDetailsRef.current) {
        observer.unobserve(profileDetailsRef.current);
      }
    };
  }, [profile.name, hasViewedProfile]);

  // Reset view tracking when profile changes
  useEffect(() => {
    setHasViewedProfile(false);
  }, [profile.id]);

  return (
    <div 
      ref={containerRef}
      className="h-full w-full overflow-y-auto scroll-smooth"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {/* Hide scrollbar for webkit browsers */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      {/* Full Screen Photo Section */}
      <div className="relative h-screen w-full">
        <ProfilePhotoGallery
          profile={profile}
          currentPhotoIndex={currentPhotoIndex}
          onNextPhoto={onNextPhoto}
          onPrevPhoto={onPrevPhoto}
        />
        <ProfileInfo 
          profile={profile} 
          onReport={onReport}
          onSwipeAction={onSwipeAction}
          onMessage={onMessage}
        />
      </div>

      {/* Profile Details Section - Revealed on Scroll */}
      <div 
        ref={profileDetailsRef}
        className="bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 min-h-screen"
      >
        <ProfileDetails
          profile={profile}
          isExpanded={isExpanded}
          onToggleExpanded={onToggleExpanded}
        />
        
        {/* Additional spacing and scroll indicator */}
        <div className="p-4 text-center">
          <div className="text-white/60 text-sm">
            Scroll up to see photos again
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwipeCard;
