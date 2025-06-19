
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
        const maxScroll = scrollHeight - clientHeight;
        
        // More sensitive scroll detection for mobile/tablet
        const isMobile = window.innerWidth < 768;
        const scrollThreshold = isMobile ? 20 : 30; // Lower threshold for mobile
        const percentageThreshold = isMobile ? 0.05 : 0.08; // 5% for mobile, 8% for desktop
        
        // Show details if scrolled more than threshold pixels OR percentage
        const scrollPercentage = maxScroll > 0 ? scrollTop / maxScroll : 0;
        setShowDetails(scrollTop > scrollThreshold || scrollPercentage > percentageThreshold);
      }
    };

    const cardElement = cardRef.current;
    if (cardElement) {
      cardElement.addEventListener('scroll', handleScroll, { passive: true });
      // Check initial state
      handleScroll();
      
      return () => cardElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <Card 
      ref={cardRef}
      className="w-full h-full overflow-hidden backdrop-blur-md bg-white/10 border-0 shadow-2xl flex flex-col rounded-none overflow-y-auto"
    >
      {/* Main Content Area - Responsive height based on screen size */}
      <div className="relative flex-1 min-h-0" style={{ 
        height: showDetails ? 'auto' : '100%',
        minHeight: showDetails ? '60vh' : '100vh'
      }}>
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
      
      {/* ProfileDetails Section - Shows after scrolling */}
      <div className={`transition-all duration-500 ease-in-out bg-black/20 backdrop-blur-lg ${
        showDetails 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4 h-0'
      } overflow-hidden`}>
        {showDetails && (
          <div className="h-auto min-h-[40vh] max-h-[60vh]">
            <ProfileDetails
              profile={profile}
              isExpanded={isExpanded}
              onToggleExpanded={onToggleExpanded}
            />
          </div>
        )}
      </div>
      
      {/* Scroll Indicator - More prominent on mobile */}
      {!showDetails && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white/70 animate-pulse z-20">
          <div className="text-xs sm:text-sm mb-2 font-medium">Scroll for more</div>
          <div className="w-1 h-6 sm:h-8 bg-white/40 rounded-full relative overflow-hidden">
            <div className="w-1 h-3 bg-white/80 rounded-full animate-bounce absolute top-0"></div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default SwipeCard;
