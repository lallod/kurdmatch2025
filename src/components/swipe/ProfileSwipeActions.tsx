import React, { useState } from 'react';
import { X, Heart } from 'lucide-react';
import { SWIPE_CONFIG } from '@/config/swipe';
import { checkActionLimit, performAction } from '@/api/usage';
import { likeProfile } from '@/api/likes';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import LimitReachedModal from '@/components/modals/LimitReachedModal';
import MatchModal from '@/components/modals/MatchModal';

interface ProfileSwipeActionsProps {
  profileId: string;
  profileName: string;
  profileImage: string;
}

const ProfileSwipeActions: React.FC<ProfileSwipeActionsProps> = ({
  profileId,
  profileName,
  profileImage
}) => {
  const navigate = useNavigate();
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePass = () => {
    toast.info("Passed");
    navigate('/swipe');
  };

  const handleLike = async () => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      
      // Check if user can like
      const limit = await checkActionLimit('like');
      if (!limit.canPerform) {
        setShowLimitModal(true);
        return;
      }

      // Perform the like action and increment usage
      const [likeResult, usageSuccess] = await Promise.all([
        likeProfile(profileId),
        performAction('like')
      ]);

      if (!usageSuccess) {
        toast.error('Failed to process like. Please try again.');
        return;
      }

      if (likeResult.success) {
        if (likeResult.match) {
          // Show match popup
          setShowMatchModal(true);
        } else {
          // No match, go back to swipe page
          toast.success("Liked!");
          navigate('/swipe');
        }
      } else {
        toast.error(likeResult.error || "Failed to like profile");
      }
    } catch (error) {
      console.error('Error liking profile:', error);
      toast.error("Something went wrong");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewFullProfile = () => {
    setShowMatchModal(false);
    // Navigate to a more detailed profile view if available, or close modal
    navigate('/matches');
  };

  const handleContinueSwiping = () => {
    setShowMatchModal(false);
    navigate('/swipe');
  };

  return (
    <>
      <div className={`flex items-center justify-center gap-8 ${SWIPE_CONFIG.actions.container.padding}`}>
        {/* Pass */}
        <button
          onClick={handlePass}
          disabled={isProcessing}
          className={`${SWIPE_CONFIG.actions.buttons.large} bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-200 active:scale-95`}
        >
          <X className={`${SWIPE_CONFIG.actions.buttons.iconSize.large} text-white`} strokeWidth={3} />
        </button>

        {/* Like */}
        <button
          onClick={handleLike}
          disabled={isProcessing}
          className={`${SWIPE_CONFIG.actions.buttons.large} bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-200 active:scale-95`}
        >
          <Heart className={`${SWIPE_CONFIG.actions.buttons.iconSize.large} text-white`} fill="currentColor" />
        </button>
      </div>

      {/* Limit Reached Modal */}
      <LimitReachedModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        actionType="like"
        remaining={0}
        isPremium={false}
      />

      {/* Match Modal */}
      <MatchModal
        isOpen={showMatchModal}
        onClose={handleContinueSwiping}
        profileName={profileName}
        profileImage={profileImage}
        onViewProfile={handleViewFullProfile}
        onContinueSwiping={handleContinueSwiping}
      />
    </>
  );
};

export default ProfileSwipeActions;