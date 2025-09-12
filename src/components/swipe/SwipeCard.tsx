
import React, { useState } from 'react';
import ProfilePhotoGallery from './ProfilePhotoGallery';
import ProfileInfo from './ProfileInfo';
import ProfileBioSection from './ProfileBioSection';
import { Profile } from '@/types/swipe';

interface SwipeCardProps {
  profile: Profile;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onMessage: () => void;
  onSuperLike: () => void;
  isBackground?: boolean;
  style?: React.CSSProperties;
}

const SwipeCard: React.FC<SwipeCardProps> = ({
  profile,
  onSwipeLeft,
  onSwipeRight,
  onMessage,
  onSuperLike,
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
      const threshold = 100;
      
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

  const cardRotation = dragPosition.x * 0.1;
  const cardOpacity = Math.max(0.7, 1 - Math.abs(dragPosition.x) * 0.001);

  return (
    <div 
      className="relative w-full max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none"
      style={{
        transform: `translateX(${dragPosition.x}px) translateY(${dragPosition.y}px) rotate(${cardRotation}deg)`,
        opacity: cardOpacity,
        height: '85vh',
        maxHeight: '700px',
        minHeight: '600px',
        transition: isDragging ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out',
        ...style
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Swipe Overlay */}
      {swipeDirection && !isBackground && (
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
          <div
            className={`text-6xl font-bold transform rotate-12 px-8 py-4 rounded-2xl border-4 ${
              swipeDirection === 'right'
                ? 'text-green-500 border-green-500 bg-green-500/10'
                : 'text-red-500 border-red-500 bg-red-500/10'
            }`}
            style={{
              opacity: Math.min(1, Math.abs(dragPosition.x) / 100)
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
        
        {/* Profile info overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent h-40">
          <div className="absolute bottom-6 left-6 right-6">
            <ProfileInfo profile={profile} minimal={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwipeCard;
