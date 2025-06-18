
import { useState, useRef, useCallback } from 'react';

interface TouchPosition {
  x: number;
  y: number;
}

interface SwipeGestureState {
  isDragging: boolean;
  dragOffset: { x: number; y: number };
  rotation: number;
  scale: number;
}

interface UseSwipeGestureProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeUp: () => void;
  swipeThreshold?: number;
}

export const useSwipeGesture = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  swipeThreshold = 100
}: UseSwipeGestureProps) => {
  const [gestureState, setGestureState] = useState<SwipeGestureState>({
    isDragging: false,
    dragOffset: { x: 0, y: 0 },
    rotation: 0,
    scale: 1
  });

  const touchStartRef = useRef<TouchPosition | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    console.log('Touch start detected');
    e.preventDefault();
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    
    setGestureState(prev => ({
      ...prev,
      isDragging: true,
      scale: 0.98
    }));
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    
    console.log('Touch move:', { deltaX, deltaY });
    
    // Calculate rotation based on horizontal movement
    const rotation = deltaX * 0.1;
    
    setGestureState(prev => ({
      ...prev,
      dragOffset: { x: deltaX, y: deltaY },
      rotation: Math.max(-15, Math.min(15, rotation))
    }));
  }, []);

  const handleTouchEnd = useCallback(() => {
    console.log('Touch end detected');
    if (!touchStartRef.current) return;

    const { x: deltaX, y: deltaY } = gestureState.dragOffset;
    console.log('Final delta:', { deltaX, deltaY });
    
    // Determine swipe direction and execute action
    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX > 0) {
        console.log('Swiping right');
        onSwipeRight();
      } else {
        console.log('Swiping left');
        onSwipeLeft();
      }
    } else if (deltaY < -swipeThreshold) {
      console.log('Swiping up');
      onSwipeUp();
    } else {
      console.log('Snapping back to center');
      // Snap back to center
      setGestureState({
        isDragging: false,
        dragOffset: { x: 0, y: 0 },
        rotation: 0,
        scale: 1
      });
    }

    touchStartRef.current = null;
  }, [gestureState.dragOffset, swipeThreshold, onSwipeLeft, onSwipeRight, onSwipeUp]);

  const resetGesture = useCallback(() => {
    console.log('Resetting gesture');
    setGestureState({
      isDragging: false,
      dragOffset: { x: 0, y: 0 },
      rotation: 0,
      scale: 1
    });
    touchStartRef.current = null;
  }, []);

  return {
    gestureState,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    resetGesture
  };
};
