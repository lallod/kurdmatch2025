
import React from 'react';
import { Heart, X, Star } from 'lucide-react';

interface SwipeOverlaysProps {
  dragOffset: { x: number; y: number };
  isDragging: boolean;
}

const SwipeOverlays = ({ dragOffset, isDragging }: SwipeOverlaysProps) => {
  const { x, y } = dragOffset;
  const showLikeOverlay = isDragging && x > 50;
  const showPassOverlay = isDragging && x < -50;
  const showSuperLikeOverlay = isDragging && y < -50 && Math.abs(x) < 50;

  return (
    <>
      {/* Like Overlay */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
          showLikeOverlay ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="bg-green-500 text-white px-6 py-3 rounded-full font-bold text-lg flex items-center gap-2 rotate-12 animate-pulse-heart">
          <Heart className="h-6 w-6 fill-current" />
          LIKE
        </div>
      </div>

      {/* Pass Overlay */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
          showPassOverlay ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="bg-red-500 text-white px-6 py-3 rounded-full font-bold text-lg flex items-center gap-2 -rotate-12 animate-pulse">
          <X className="h-6 w-6" />
          PASS
        </div>
      </div>

      {/* Super Like Overlay */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
          showSuperLikeOverlay ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="bg-blue-500 text-white px-6 py-3 rounded-full font-bold text-lg flex items-center gap-2 animate-bounce-in">
          <Star className="h-6 w-6 fill-current" />
          SUPER LIKE
        </div>
      </div>
    </>
  );
};

export default SwipeOverlays;
