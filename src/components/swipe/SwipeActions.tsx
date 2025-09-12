import React from 'react';
import { RotateCcw, X, Heart, Star, Zap } from 'lucide-react';
import { SWIPE_CONFIG } from '@/config/swipe';

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
    <div className={`flex items-center justify-center ${SWIPE_CONFIG.actions.buttons.gap} ${SWIPE_CONFIG.actions.container.padding}`}>
      {/* Rewind */}
      <button
        onClick={onRewind}
        className={`${SWIPE_CONFIG.actions.buttons.small} bg-yellow-500 hover:bg-yellow-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-200 active:scale-95`}
      >
        <RotateCcw className={`${SWIPE_CONFIG.actions.buttons.iconSize.small} text-white`} />
      </button>

      {/* Pass */}
      <button
        onClick={onPass}
        className={`${SWIPE_CONFIG.actions.buttons.large} bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-200 active:scale-95`}
      >
        <X className={`${SWIPE_CONFIG.actions.buttons.iconSize.large} text-white`} strokeWidth={3} />
      </button>

      {/* Like */}
      <button
        onClick={onLike}
        className={`${SWIPE_CONFIG.actions.buttons.large} bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-200 active:scale-95`}
      >
        <Heart className={`${SWIPE_CONFIG.actions.buttons.iconSize.large} text-white`} fill="currentColor" />
      </button>

      {/* Super Like */}
      <button
        onClick={onSuperLike}
        className={`${SWIPE_CONFIG.actions.buttons.large} bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-200 active:scale-95`}
      >
        <Star className={`${SWIPE_CONFIG.actions.buttons.iconSize.large} text-white`} fill="currentColor" />
      </button>

      {/* Boost */}
      <button
        onClick={onBoost}
        className={`${SWIPE_CONFIG.actions.buttons.small} bg-purple-500 hover:bg-purple-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-200 active:scale-95`}
      >
        <Zap className={`${SWIPE_CONFIG.actions.buttons.iconSize.small} text-white`} fill="currentColor" />
      </button>
    </div>
  );
};

export default SwipeActions;