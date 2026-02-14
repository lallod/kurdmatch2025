import React, { useState, useEffect } from 'react';
import { Star, Sparkles } from 'lucide-react';
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
        className={`gap-1 relative group transition-all duration-300 ${
          isPremium 
            ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 border border-yellow-500/30' 
            : 'hover:bg-white/10 border border-pink-500/30'
        } ${isPremium && canSuperLike ? 'hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/50' : ''} p-1.5 md:p-2`}
      >
        <div className="relative">
          <Star 
            className={`w-3 h-3 md:w-4 md:h-4 transition-all duration-300 ${
              isPremium 
                ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)] group-hover:drop-shadow-[0_0_12px_rgba(250,204,21,1)]' 
                : 'text-white/70 group-hover:text-yellow-400'
            }`} 
          />
          {isPremium && canSuperLike && (
            <Sparkles className="absolute -top-1 -right-1 w-2 h-2 text-yellow-300 animate-pulse" />
          )}
        </div>
        {isPremium && remainingCount > 0 && (
          <span className="text-[10px] text-yellow-400 font-semibold hidden md:inline">
            {remainingCount}
          </span>
        )}
        {!isPremium && (
          <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[8px] px-1 py-0 rounded-full leading-tight font-bold">
            PRO
          </span>
        )}
      </Button>

      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground text-2xl flex items-center gap-2">
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              Super Like - Premium Feature
            </DialogTitle>
            <DialogDescription className="text-muted-foreground space-y-4">
              <p>Super Likes are available to Premium and Gold members!</p>
              <div className="bg-accent/10 backdrop-blur-md rounded-lg p-4 space-y-2">
                <p className="font-semibold text-foreground">Premium Benefits:</p>
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
                className="w-full bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-600 text-primary-foreground"
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
