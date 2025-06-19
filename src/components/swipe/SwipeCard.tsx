
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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const handleScroll = () => {
      const scrollTop = scrollElement.scrollTop;
      console.log('Scroll position:', scrollTop); // Debug log
      
      // Show details when user scrolls down more than 30px
      if (scrollTop > 30 && !showDetails) {
        console.log('Showing details'); // Debug log
        setShowDetails(true);
      } else if (scrollTop <= 30 && showDetails) {
        console.log('Hiding details'); // Debug log
        setShowDetails(false);
      }
    };

    scrollElement.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
    };
  }, [showDetails]);

  return (
    <Card className="w-full h-full overflow-hidden backdrop-blur-md bg-white/10 border-0 shadow-2xl flex flex-col rounded-none">
      <div className="flex-1 relative">
        <ScrollArea className="h-full" ref={scrollRef}>
          <div className="min-h-[200vh]"> {/* Ensure scrollable content */}
            {/* Main Content - Photo and Info */}
            <div className="relative h-screen">
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
              
              {/* Scroll Indicator - Always show if details are not visible */}
              {!showDetails && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
                  <div className="flex flex-col items-center text-white/80 bg-black/30 backdrop-blur-sm rounded-full px-3 py-2">
                    <span className="text-xs mb-1 font-medium">Scroll for more</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              )}
            </div>

            {/* Details Section - Show when scrolling */}
            <div className={`transition-all duration-300 ${showDetails ? 'opacity-100' : 'opacity-0'}`}>
              <div className="bg-gradient-to-b from-purple-900/95 via-purple-800/90 to-pink-900/90 backdrop-blur-lg min-h-screen">
                <ProfileDetails
                  profile={profile}
                  isExpanded={true}
                  onToggleExpanded={onToggleExpanded}
                />
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};

export default SwipeCard;
