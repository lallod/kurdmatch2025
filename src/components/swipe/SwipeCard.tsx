
import React, { useState } from 'react';
import ProfilePhotoGallery from './ProfilePhotoGallery';
import ProfileInfo from './ProfileInfo';
import DistanceBadge from '@/components/location/DistanceBadge';
import { Profile } from '@/types/swipe';
import { SWIPE_CONFIG } from '@/config/swipe';

interface SwipeCardProps {
  profile: Profile;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onMessage: () => void;
  onSuperLike: () => void;
  onProfileClick?: () => void;
  isBackground?: boolean;
  style?: React.CSSProperties;
}

const SwipeCard: React.FC<SwipeCardProps> = ({
  profile,
  onSwipeLeft,
  onSwipeRight,
  onMessage,
  onSuperLike,
  onProfileClick,
  isBackground = false,
  style
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const handleNextPhoto = () => {
    if (isBackground) return;
    const photoCount = profile.photos?.length || 1;
    setCurrentPhotoIndex((prev) => (prev + 1) % photoCount);
  };

  const handlePrevPhoto = () => {
    if (isBackground) return;
    const photoCount = profile.photos?.length || 1;
    setCurrentPhotoIndex((prev) => (prev - 1 + photoCount) % photoCount);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isBackground) return;
    setIsDragging(true);
    const startX = e.clientX;
    const startY = e.clientY;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      setDragPosition({ x: deltaX, y: deltaY });
      
      // Determine swipe direction
      if (Math.abs(deltaX) > 50) {
        setSwipeDirection(deltaX > 0 ? 'right' : 'left');
      } else {
        setSwipeDirection(null);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      const threshold = SWIPE_CONFIG.animations.threshold;
      
      if (Math.abs(dragPosition.x) > threshold) {
        if (dragPosition.x > 0) {
          onSwipeRight();
        } else {
          onSwipeLeft();
        }
      }
      
      // Reset position
      setDragPosition({ x: 0, y: 0 });
      setSwipeDirection(null);
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isBackground) return;
    setIsDragging(true);
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      const touch = moveEvent.touches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      
      setDragPosition({ x: deltaX, y: deltaY });
      
      // Determine swipe direction
      if (Math.abs(deltaX) > 50) {
        setSwipeDirection(deltaX > 0 ? 'right' : 'left');
      } else {
        setSwipeDirection(null);
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      const threshold = SWIPE_CONFIG.animations.threshold;
      
      if (Math.abs(dragPosition.x) > threshold) {
        if (dragPosition.x > 0) {
          onSwipeRight();
        } else {
          onSwipeLeft();
        }
      }
      
      // Reset position
      setDragPosition({ x: 0, y: 0 });
      setSwipeDirection(null);
      
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const cardRotation = dragPosition.x * SWIPE_CONFIG.animations.dragRotation;
  const cardOpacity = Math.max(SWIPE_CONFIG.animations.minOpacity, 1 - Math.abs(dragPosition.x) * SWIPE_CONFIG.animations.opacityMultiplier);

  return (
    <div 
      className={`relative mx-auto bg-card ${SWIPE_CONFIG.card.borderRadius} shadow-[0_4px_24px_rgba(0,0,0,0.3)] overflow-hidden cursor-grab active:cursor-grabbing select-none ${SWIPE_CONFIG.card.maxWidth.mobile} sm:${SWIPE_CONFIG.card.maxWidth.tablet} lg:${SWIPE_CONFIG.card.maxWidth.desktop} ${SWIPE_CONFIG.card.height.mobile} sm:${SWIPE_CONFIG.card.height.tablet} lg:${SWIPE_CONFIG.card.height.desktop} ${SWIPE_CONFIG.card.minHeight} ${SWIPE_CONFIG.card.maxHeight}`}
      style={{
        transform: `translateX(${dragPosition.x}px) translateY(${dragPosition.y}px) rotate(${cardRotation}deg)`,
        opacity: cardOpacity,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out',
        ...style
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Swipe Overlay */}
      {swipeDirection && !isBackground && (
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
          <div
            className={`${SWIPE_CONFIG.overlay.textSize} font-bold transform rotate-12 ${SWIPE_CONFIG.overlay.padding} ${SWIPE_CONFIG.overlay.borderRadius} ${SWIPE_CONFIG.overlay.borderWidth} ${
              swipeDirection === 'right'
                ? 'text-green-500 border-green-500 bg-green-500/10'
                : 'text-red-500 border-red-500 bg-red-500/10'
            }`}
            style={{
              opacity: Math.min(1, Math.abs(dragPosition.x) / SWIPE_CONFIG.animations.threshold)
            }}
          >
            {swipeDirection === 'right' ? 'LIKE' : 'NOPE'}
          </div>
        </div>
      )}

      {/* Main Photo Display - Full Card */}
      <div className="relative w-full h-full">
        <ProfilePhotoGallery
          profile={profile}
          currentPhotoIndex={currentPhotoIndex}
          onNextPhoto={handleNextPhoto}
          onPrevPhoto={handlePrevPhoto}
          isBackground={isBackground}
        />
        
        {/* Distance Badge - Top Right */}
        {!isBackground && profile.distance_km !== undefined && (
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30">
            <DistanceBadge distanceKm={profile.distance_km} />
          </div>
        )}
        
        {/* Profile info overlay at bottom - Transparent and clickable */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-background/30 backdrop-blur-md border-t border-border/20 ${SWIPE_CONFIG.info.overlay.height} ${onProfileClick ? 'cursor-pointer hover:bg-background/40 transition-all duration-200' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            if (onProfileClick && !isBackground) {
              onProfileClick();
            }
          }}
        >
          <div className={`absolute ${SWIPE_CONFIG.info.overlay.padding}`}>
            <ProfileInfo profile={profile} minimal={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwipeCard;
