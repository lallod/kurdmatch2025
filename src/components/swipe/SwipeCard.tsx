
import React, { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown } from 'lucide-react';
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
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollTop = scrollRef.current.scrollTop;
      const scrollHeight = scrollRef.current.scrollHeight;
      const clientHeight = scrollRef.current.clientHeight;
      
      setScrollPosition(scrollTop);
      
      // Show details when user starts scrolling
      if (scrollTop > 50) {
        setShowDetails(true);
      } else {
        setShowDetails(false);
      }
    }
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <Card className="w-full h-full overflow-hidden backdrop-blur-md bg-white/10 border-0 shadow-2xl flex flex-col rounded-none">
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="h-full">
          {/* Main Content - Photo and Info */}
          <div className="relative min-h-screen">
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
            
            {/* Scroll Indicator */}
            {!showDetails && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="flex flex-col items-center text-white/70">
                  <span className="text-xs mb-1">Scroll for more</span>
                  <ChevronDown className="h-5 w-5" />
                </div>
              </div>
            )}
          </div>

          {/* Details Section - Only visible when scrolling */}
          {showDetails && (
            <div className="bg-gradient-to-b from-black/95 to-black/80 backdrop-blur-lg">
              <ProfileDetails
                profile={profile}
                isExpanded={true}
                onToggleExpanded={onToggleExpanded}
              />
            </div>
          )}
          
          {/* Extra spacing to allow full scroll */}
          <div className="h-20"></div>
        </div>
      </ScrollArea>
    </Card>
  );
};

export default SwipeCard;
