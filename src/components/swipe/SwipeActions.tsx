import React from 'react';
import { RotateCcw, X, Heart, Star, Zap } from 'lucide-react';

interface SwipeActionsProps {
  onRewind: () => void;
  onPass: () => void;
  onLike: () => void;
  onSuperLike: () => void;
  onBoost: () => void;
}

const SwipeActions: React.FC<SwipeActionsProps> = ({
  onRewind,
  onPass,
  onLike,
  onSuperLike,
  onBoost
}) => {
  return (
    <div className="flex items-center justify-center gap-4 px-8">
      {/* Rewind */}
      <button
        onClick={onRewind}
        className="w-14 h-14 bg-yellow-500 hover:bg-yellow-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-200 active:scale-95"
      >
        <RotateCcw className="w-6 h-6 text-white" />
      </button>

      {/* Pass */}
      <button
        onClick={onPass}
        className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-200 active:scale-95"
      >
        <X className="w-8 h-8 text-white" strokeWidth={3} />
      </button>

      {/* Like */}
      <button
        onClick={onLike}
        className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-200 active:scale-95"
      >
        <Heart className="w-8 h-8 text-white" fill="currentColor" />
      </button>

      {/* Super Like */}
      <button
        onClick={onSuperLike}
        className="w-16 h-16 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-200 active:scale-95"
      >
        <Star className="w-8 h-8 text-white" fill="currentColor" />
      </button>

      {/* Boost */}
      <button
        onClick={onBoost}
        className="w-14 h-14 bg-purple-500 hover:bg-purple-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-200 active:scale-95"
      >
        <Zap className="w-6 h-6 text-white" fill="currentColor" />
      </button>
    </div>
  );
};

export default SwipeActions;