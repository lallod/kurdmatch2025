import React, { useState } from 'react';
import { X, Heart, Sparkles } from 'lucide-react';
import { SWIPE_CONFIG } from '@/config/swipe';
import { checkActionLimit, performAction } from '@/api/usage';
import { likeProfile } from '@/api/likes';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useTranslations } from '@/hooks/useTranslations';
import LimitReachedModal from '@/components/modals/LimitReachedModal';
import MatchModal from '@/components/modals/MatchModal';
import { rpcUntyped } from '@/integrations/supabase/untypedClient';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

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
  const { user } = useSupabaseAuth();
  const { t } = useTranslations();
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showSuperLikeModal, setShowSuperLikeModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePass = () => {
    toast.info(t('toast.swipe.passed', 'Passed'));
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
        toast.error(t('toast.swipe.like_failed', 'Failed to process like. Please try again.'));
        return;
      }

      if (likeResult.success) {
        if (likeResult.match) {
          setShowMatchModal(true);
        } else {
          toast.success(t('toast.swipe.liked', 'Liked!'));
          navigate('/swipe');
        }
      } else {
        toast.error(likeResult.error || t('toast.swipe.like_profile_failed', 'Failed to like profile'));
      }
    } catch (error) {
      console.error('Error liking profile:', error);
      toast.error(t('toast.swipe.something_wrong', 'Something went wrong'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuperLike = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const { data: limitCheck } = await rpcUntyped('check_action_limit', {
        p_user_id: user?.id,
        p_action_type: 'super_likes'
      });

      if (!limitCheck) {
        setShowSuperLikeModal(true);
        return;
      }

      const { error } = await rpcUntyped('perform_super_like', {
        p_liker_id: user?.id,
        p_likee_id: profileId
      });

      if (error) throw error;

      toast.success(t('toast.swipe.super_like_sent', 'Super Like sent! ⭐'));
      navigate('/swipe');
    } catch (error: any) {
      toast.error(error.message || t('toast.swipe.super_like_failed', 'Failed to send Super Like'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewFullProfile = () => {
    setShowMatchModal(false);
    navigate('/matches');
  };

  const handleContinueSwiping = () => {
    setShowMatchModal(false);
    navigate('/swipe');
  };

  return (
    <>
      <div className="flex items-center justify-center gap-4 py-6">
        {/* Pass */}
        <button
          onClick={handlePass}
          disabled={isProcessing}
          className="h-16 w-16 bg-destructive/10 hover:bg-destructive/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-200 active:scale-95 border-2 border-destructive/30"
        >
          <X className="h-8 w-8 text-destructive" strokeWidth={3} />
        </button>

        {/* Super Like */}
        <button
          onClick={handleSuperLike}
          disabled={isProcessing}
          className="h-16 w-16 bg-accent/10 hover:bg-accent/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-200 active:scale-95 border-2 border-accent/30"
        >
          <Sparkles className="h-8 w-8 text-accent" />
        </button>

        {/* Like */}
        <button
          onClick={handleLike}
          disabled={isProcessing}
          className="h-20 w-20 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center shadow-glow transform hover:scale-110 transition-all duration-200 active:scale-95"
        >
          <Heart className="h-10 w-10 text-white" fill="currentColor" />
        </button>
      </div>

      <LimitReachedModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        actionType="like"
        remaining={0}
        isPremium={false}
      />

      <LimitReachedModal
        isOpen={showSuperLikeModal}
        onClose={() => setShowSuperLikeModal(false)}
        actionType="like"
        remaining={0}
        isPremium={false}
      />

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
