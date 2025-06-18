
import React, { useState, useEffect, useRef } from 'react';
import ProfilePhotoGallery from './ProfilePhotoGallery';
import ProfileInfo from './ProfileInfo';
import ExpandedProfile from './ExpandedProfile';
import { Profile, SwipeAction } from '@/types/swipe';
import { ChevronDown } from 'lucide-react';

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
  const [scrollY, setScrollY] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop;
        setScrollY(scrollTop);
        
        // Hide scroll hint after user starts scrolling
        if (scrollTop > 50) {
          setShowScrollHint(false);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToExpanded = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
      setShowScrollHint(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="w-full h-full overflow-auto backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl scroll-smooth"
    >
      {/* Photo Section - Takes full viewport height */}
      <div className="relative min-h-screen flex flex-col">
        <div className="relative flex-1">
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
        
        {/* Enhanced Scroll Indicator with Animation */}
        {showScrollHint && (
          <div className="absolute bottom-16 sm:bottom-20 left-1/2 transform -translate-x-1/2 text-white/80 animate-bounce cursor-pointer z-10">
            <div 
              className="flex flex-col items-center gap-2 p-3 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/40 transition-all duration-300"
              onClick={scrollToExpanded}
            >
              <span className="text-xs sm:text-sm font-medium">View Profile</span>
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
            </div>
          </div>
        )}

        {/* Pull-down indicator for mobile */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white/40 rounded-full opacity-60"></div>
      </div>

      {/* Expanded Profile Section with Enhanced Styling */}
      <div className="relative">
        {/* Gradient transition between sections */}
        <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-black/60 pointer-events-none"></div>
        
        <ExpandedProfile profile={profile} />
      </div>
    </div>
  );
};

export default SwipeCard;
