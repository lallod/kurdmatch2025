
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
  const dragStartRef = useRef<TouchPosition | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    dragStartRef.current = { x: touch.clientX, y: touch.clientY };
    
    setGestureState(prev => ({
      ...prev,
      isDragging: true,
      scale: 0.98
    }));
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current || !gestureState.isDragging) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    
    // Calculate rotation based on horizontal movement
    const rotation = deltaX * 0.1;
    
    setGestureState(prev => ({
      ...prev,
      dragOffset: { x: deltaX, y: deltaY },
      rotation: Math.max(-15, Math.min(15, rotation))
    }));
  }, [gestureState.isDragging]);

  const handleTouchEnd = useCallback(() => {
    if (!gestureState.isDragging) return;

    const { x: deltaX, y: deltaY } = gestureState.dragOffset;
    
    // Determine swipe direction and execute action
    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX > 0) {
        onSwipeRight();
      } else {
        onSwipeLeft();
      }
    } else if (deltaY < -swipeThreshold) {
      onSwipeUp();
    } else {
      // Snap back to center
      setGestureState({
        isDragging: false,
        dragOffset: { x: 0, y: 0 },
        rotation: 0,
        scale: 1
      });
    }
  }, [gestureState, swipeThreshold, onSwipeLeft, onSwipeRight, onSwipeUp]);

  const resetGesture = useCallback(() => {
    setGestureState({
      isDragging: false,
      dragOffset: { x: 0, y: 0 },
      rotation: 0,
      scale: 1
    });
    touchStartRef.current = null;
    dragStartRef.current = null;
  }, []);

  return {
    gestureState,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    resetGesture
  };
};
