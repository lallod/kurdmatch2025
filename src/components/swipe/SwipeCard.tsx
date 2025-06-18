import React from 'react';
import { Card } from "@/components/ui/card";
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
  return (
    <div className="w-full h-full">
      {/* Mobile & Tablet Layout (< 1024px) */}
      <div className="lg:hidden w-full h-full">
        <Card className="w-full h-full overflow-hidden backdrop-blur-md bg-white/10 border-0 shadow-2xl flex flex-col rounded-none">
          {/* Full Screen Photo with Essential Info Overlay */}
          <div className="relative flex-1 min-h-0">
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
            
            {/* Complete Bio Section - Mobile/Tablet Only */}
            {profile.bio && (
              <div className="absolute bottom-24 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent backdrop-blur-sm p-3 sm:p-4">
                <h3 className="text-white font-semibold text-sm mb-2">About {profile.name}</h3>
                <p className="text-white/95 text-sm leading-relaxed">
                  {profile.bio}
                </p>
              </div>
            )}
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white/70 animate-bounce">
            <span className="text-xs mb-1">Scroll for more</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </Card>
        
        {/* Scrollable Details Area - Mobile/Tablet */}
        <div className="w-full bg-gradient-to-br from-purple-900/90 via-purple-800/90 to-pink-900/90 backdrop-blur-md">
          <ProfileDetails
            profile={profile}
            isExpanded={isExpanded}
            onToggleExpanded={onToggleExpanded}
          />
        </div>
      </div>

      {/* Desktop Layout (≥ 1024px) - Keep Original Design */}
      <div className="hidden lg:block w-full h-full">
        <Card className="w-full h-full overflow-hidden backdrop-blur-md bg-white/10 border-0 shadow-2xl flex flex-col rounded-none">
          <div className="relative flex-[1.2] min-h-0 md:flex-[0.8]">
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
          <div className="flex-shrink-0 md:flex-[0.2]">
            <ProfileDetails
              profile={profile}
              isExpanded={isExpanded}
              onToggleExpanded={onToggleExpanded}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SwipeCard;
