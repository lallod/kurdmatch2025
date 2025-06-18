
import React from 'react';
import { Card } from "@/components/ui/card";
import ProfilePhotoGallery from './ProfilePhotoGallery';
import ProfileInfo from './ProfileInfo';
import ProfileDetails from './ProfileDetails';
import SwipeOverlays from './SwipeOverlays';
import { Profile, SwipeAction } from '@/types/swipe';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';

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
  onTap: () => void;
  isAnimating?: boolean;
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
  onMessage,
  onTap,
  isAnimating = false
}: SwipeCardProps) => {
  const { gestureState, handleTouchStart, handleTouchMove, handleTouchEnd, resetGesture } = useSwipeGesture({
    onSwipeLeft: () => {
      console.log('Executing swipe left action');
      onSwipeAction('pass', profile.id);
      resetGesture();
    },
    onSwipeRight: () => {
      console.log('Executing swipe right action');
      onSwipeAction('like', profile.id);
      resetGesture();
    },
    onSwipeUp: () => {
      console.log('Executing swipe up action');
      onSwipeAction('superlike', profile.id);
      resetGesture();
    }
  });

  const handleCardClick = (e: React.MouseEvent) => {
    console.log('Card clicked');
    // Only trigger tap if not dragging and click is on the card content
    if (!gestureState.isDragging && e.target === e.currentTarget) {
      onTap();
    }
  };

  const cardStyle = {
    transform: `translateX(${gestureState.dragOffset.x}px) translateY(${gestureState.dragOffset.y}px) rotate(${gestureState.rotation}deg) scale(${gestureState.scale})`,
    transition: gestureState.isDragging ? 'none' : 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    willChange: 'transform',
    zIndex: gestureState.isDragging ? 10 : 1
  };

  return (
    <Card 
      className={`w-full h-full overflow-hidden backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl flex flex-col cursor-pointer touch-none select-none ${
        isAnimating ? 'pointer-events-none' : ''
      }`}
      style={cardStyle}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleCardClick}
    >
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
        <SwipeOverlays 
          dragOffset={gestureState.dragOffset}
          isDragging={gestureState.isDragging}
        />
      </div>
      <div className="flex-shrink-0">
        <ProfileDetails
          profile={profile}
          isExpanded={isExpanded}
          onToggleExpanded={onToggleExpanded}
        />
      </div>
    </Card>
  );
};

export default SwipeCard;
