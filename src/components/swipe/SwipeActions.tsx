import React, { useState, useEffect } from 'react';
import { RotateCcw, X, Heart, Star, Zap } from 'lucide-react';
import { SWIPE_CONFIG } from '@/config/swipe';
import { checkActionLimit, performAction } from '@/api/usage';
import { toast } from 'sonner';
import PremiumFeatureModal from '@/components/modals/PremiumFeatureModal';
import LimitReachedModal from '@/components/modals/LimitReachedModal';

interface SwipeActionsProps {
  onRewind: () => void;
  onPass: () => void;
  onLike: () => void;
  onSuperLike: () => void;
  onBoost: () => void;
  isRewinding?: boolean;
  remainingRewinds?: number | null;
}

const SwipeActions: React.FC<SwipeActionsProps> = ({
  onRewind,
  onPass,
  onLike,
  onSuperLike,
  onBoost,
  isRewinding = false,
  remainingRewinds
}) => {
  const [showPremiumModal, setShowPremiumModal] = useState<'super_like' | 'rewind' | 'boost' | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [userLimits, setUserLimits] = useState({
    likes: { canPerform: true, remainingCount: 50, isPremium: false },
    superLikes: { canPerform: true, remainingCount: 1, isPremium: false },
    rewinds: { canPerform: false, remainingCount: 0, isPremium: false },
    boosts: { canPerform: false, remainingCount: 0, isPremium: false }
  });

  useEffect(() => {
    loadUserLimits();
  }, []);

  const loadUserLimits = async () => {
    try {
      const [likes, superLikes, rewinds, boosts] = await Promise.all([
        checkActionLimit('like'),
        checkActionLimit('super_like'),
        checkActionLimit('rewind'),
        checkActionLimit('boost')
      ]);

      setUserLimits({
        likes,
        superLikes,
        rewinds,
        boosts
      });
    } catch (error) {
      console.error('Error loading user limits:', error);
    }
  };

  const handleActionWithLimit = async (
    actionType: 'like' | 'super_like' | 'rewind' | 'boost',
    callback: () => void
  ) => {
    const limit = userLimits[actionType === 'like' ? 'likes' : 
                            actionType === 'super_like' ? 'superLikes' :
                            actionType === 'rewind' ? 'rewinds' : 'boosts'];

    // Check if action is allowed
    if (!limit.canPerform) {
      if (actionType === 'like') {
        setShowLimitModal(true);
      } else {
        setShowPremiumModal(actionType);
      }
      return;
    }

    // Perform the action
    const success = await performAction(actionType);
    if (success) {
      callback();
      // Reload limits after successful action
      await loadUserLimits();
    } else {
      toast.error('Action failed. Please try again.');
    }
  };

  return (
    <>
      <div className={`flex items-center justify-center ${SWIPE_CONFIG.actions.buttons.gap} ${SWIPE_CONFIG.actions.container.padding} py-2 sm:py-3`}>
        {/* Rewind */}
        <button
          onClick={() => handleActionWithLimit('rewind', onRewind)}
          disabled={isRewinding}
          className={`${SWIPE_CONFIG.actions.buttons.small} ${
            userLimits.rewinds.canPerform && !isRewinding
              ? 'bg-yellow-500 hover:bg-yellow-600' 
              : 'bg-gray-500 hover:bg-gray-600'
          } rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-200 active:scale-95 relative disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <RotateCcw className={`${SWIPE_CONFIG.actions.buttons.iconSize.small} text-white ${isRewinding ? 'animate-spin' : ''}`} />
          {!userLimits.rewinds.isPremium && !isRewinding && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">P</span>
            </div>
          )}
          {remainingRewinds !== null && remainingRewinds !== undefined && userLimits.rewinds.isPremium && (
            <div className="absolute -top-2 -right-2 bg-yellow-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {remainingRewinds}
            </div>
          )}
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
          onClick={() => handleActionWithLimit('like', onLike)}
          className={`${SWIPE_CONFIG.actions.buttons.large} ${
            userLimits.likes.canPerform 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-gray-500 hover:bg-gray-600'
          } rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-200 active:scale-95 relative`}
        >
          <Heart className={`${SWIPE_CONFIG.actions.buttons.iconSize.large} text-white`} fill="currentColor" />
          {userLimits.likes.remainingCount <= 5 && !userLimits.likes.isPremium && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {userLimits.likes.remainingCount}
            </div>
          )}
        </button>

        {/* Super Like */}
        <button
          onClick={() => handleActionWithLimit('super_like', onSuperLike)}
          className={`${SWIPE_CONFIG.actions.buttons.large} ${
            userLimits.superLikes.canPerform 
              ? 'bg-blue-500 hover:bg-blue-600' 
              : 'bg-gray-500 hover:bg-gray-600'
          } rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-200 active:scale-95 relative`}
        >
          <Star className={`${SWIPE_CONFIG.actions.buttons.iconSize.large} text-white`} fill="currentColor" />
          {userLimits.superLikes.remainingCount === 0 && !userLimits.superLikes.isPremium && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">P</span>
            </div>
          )}
          {userLimits.superLikes.remainingCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {userLimits.superLikes.remainingCount}
            </div>
          )}
        </button>

        {/* Boost */}
        <button
          onClick={() => handleActionWithLimit('boost', onBoost)}
          className={`${SWIPE_CONFIG.actions.buttons.small} ${
            userLimits.boosts.canPerform 
              ? 'bg-purple-500 hover:bg-purple-600' 
              : 'bg-gray-500 hover:bg-gray-600'
          } rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-200 active:scale-95 relative`}
        >
          <Zap className={`${SWIPE_CONFIG.actions.buttons.iconSize.small} text-white`} fill="currentColor" />
          {!userLimits.boosts.isPremium && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">P</span>
            </div>
          )}
        </button>
      </div>

      {/* Premium Feature Modal */}
      {showPremiumModal && (
        <PremiumFeatureModal
          isOpen={true}
          onClose={() => setShowPremiumModal(null)}
          feature={showPremiumModal}
          remaining={
            showPremiumModal === 'super_like' ? userLimits.superLikes.remainingCount :
            showPremiumModal === 'rewind' ? userLimits.rewinds.remainingCount :
            userLimits.boosts.remainingCount
          }
          isPremium={
            showPremiumModal === 'super_like' ? userLimits.superLikes.isPremium :
            showPremiumModal === 'rewind' ? userLimits.rewinds.isPremium :
            userLimits.boosts.isPremium
          }
        />
      )}

      {/* Limit Reached Modal */}
      <LimitReachedModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        actionType="like"
        remaining={userLimits.likes.remainingCount}
        isPremium={userLimits.likes.isPremium}
      />
    </>
  );
};

export default SwipeActions;