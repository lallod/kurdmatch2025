import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { checkActionLimit, performAction } from '@/api/usage';
import { getUserSubscription } from '@/api/usage';
import { useToast } from '@/hooks/use-toast';
import { createPremiumCheckout } from '@/api/payments';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SuperLikeButtonProps {
  postId: string;
  userId: string;
  onSuperLike?: () => void;
}

const SuperLikeButton: React.FC<SuperLikeButtonProps> = ({ postId, userId, onSuperLike }) => {
  const { toast } = useToast();
  const [canSuperLike, setCanSuperLike] = useState(false);
  const [remainingCount, setRemainingCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkSuperLikeLimit();
  }, []);

  const checkSuperLikeLimit = async () => {
    const limit = await checkActionLimit('super_like');
    setCanSuperLike(limit.canPerform);
    setRemainingCount(limit.remainingCount);
    setIsPremium(limit.isPremium);
  };

  const handleSuperLike = async () => {
    if (!isPremium) {
      setShowUpgradeDialog(true);
      return;
    }

    if (!canSuperLike) {
      toast({
        title: 'Daily limit reached',
        description: 'You have used all your super likes for today',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const success = await performAction('super_like');
      if (success) {
        toast({
          title: 'Super Like sent!',
          description: 'They will know you really like them ❤️'
        });
        await checkSuperLikeLimit();
        onSuperLike?.();
      }
    } catch (error) {
      console.error('Error sending super like:', error);
      toast({
        title: 'Error',
        description: 'Failed to send super like',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      await createPremiumCheckout('premium');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start checkout',
        variant: 'destructive'
      });
    }
  };

  return (
    <>
      <Button
        onClick={handleSuperLike}
        disabled={loading || (!isPremium && false) || (isPremium && !canSuperLike)}
        variant="ghost"
        size="sm"
        className="gap-2 text-white/70 hover:text-pink-400 hover:bg-white/10 transition-colors relative"
      >
        <Heart className={`w-5 h-5 ${isPremium ? 'fill-pink-400 text-pink-400' : ''}`} />
        {isPremium && remainingCount > 0 && (
          <span className="text-xs">({remainingCount})</span>
        )}
        {!isPremium && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs px-1.5 py-0.5 rounded-full">
            PRO
          </span>
        )}
      </Button>

      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl flex items-center gap-2">
              <Heart className="w-6 h-6 fill-pink-400 text-pink-400" />
              Super Like - Premium Feature
            </DialogTitle>
            <DialogDescription className="text-white/70 space-y-4">
              <p>Super Likes are available to Premium and Gold members!</p>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 space-y-2">
                <p className="font-semibold text-white">Premium Benefits:</p>
                <ul className="space-y-1 text-sm">
                  <li>✓ 10 Super Likes per day</li>
                  <li>✓ Unlimited regular likes</li>
                  <li>✓ Send messages to anyone</li>
                  <li>✓ See who liked you</li>
                  <li>✓ 5 Rewinds per day</li>
                </ul>
              </div>
              <Button
                onClick={handleUpgrade}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
              >
                Upgrade to Premium
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SuperLikeButton;
