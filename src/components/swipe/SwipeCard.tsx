
import React, { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
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
  const [showDetails, setShowDetails] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (cardRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = cardRef.current;
        const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
        
        // Show details after scrolling down 10% of the scrollable content
        setShowDetails(scrollPercentage > 0.1 || scrollTop > 30);
      }
    };

    const cardElement = cardRef.current;
    if (cardElement) {
      cardElement.addEventListener('scroll', handleScroll, { passive: true });
      // Also check initial scroll position
      handleScroll();
      
      return () => cardElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <Card 
      ref={cardRef}
      className="w-full h-full overflow-hidden backdrop-blur-md bg-white/10 border-0 shadow-2xl flex flex-col rounded-none overflow-y-auto"
    >
      <div className="relative h-[75%] min-h-0 flex-shrink-0">
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
      
      {/* ProfileDetails - Only show after scrolling */}
      <div className={`transition-all duration-500 ease-in-out ${
        showDetails 
          ? 'h-[25%] opacity-100 translate-y-0' 
          : 'h-0 opacity-0 translate-y-4'
      } flex-shrink-0 overflow-hidden`}>
        {showDetails && (
          <ProfileDetails
            profile={profile}
            isExpanded={isExpanded}
            onToggleExpanded={onToggleExpanded}
          />
        )}
      </div>
      
      {/* Scroll indicator when details are hidden */}
      {!showDetails && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white/60 animate-pulse z-10">
          <div className="text-xs mb-1">Scroll for more</div>
          <div className="w-1 h-8 bg-white/30 rounded-full">
            <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce"></div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default SwipeCard;
