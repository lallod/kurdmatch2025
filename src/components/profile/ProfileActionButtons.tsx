import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Share2, UserPlus, UserCheck, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { getUserSubscription } from '@/api/usage';
import { createPremiumCheckout } from '@/api/payments';
import SuperLikeButton from '@/components/discovery/SuperLikeButton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ProfileActionButtonsProps {
  userId: string;
  userName: string;
  isFollowing?: boolean;
  onFollowToggle?: () => void;
}

const ProfileActionButtons: React.FC<ProfileActionButtonsProps> = ({
  userId,
  userName,
  isFollowing = false,
  onFollowToggle
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isPremium, setIsPremium] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    const subscription = await getUserSubscription();
    setIsPremium(subscription?.subscriptionType === 'premium' || subscription?.subscriptionType === 'gold');
  };

  const handleMessage = () => {
    if (!isPremium) {
      setShowUpgradeDialog(true);
      return;
    }
    navigate('/messages', { state: { userId } });
  };

  const handleShare = () => {
    const url = `${window.location.origin}/profile/${userId}`;
    navigator.clipboard.writeText(url);
      toast({
        title: 'Link copied!',
        description: 'Profile link copied to clipboard'
      });
  };

  const handleFollow = () => {
    if (onFollowToggle) {
      onFollowToggle();
    }
    toast({
      title: isFollowing ? 'Unfollowed' : 'Following',
      description: isFollowing 
        ? `You unfollowed ${userName}` 
        : `You are now following ${userName}`
    });
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
      <div className="flex gap-1.5 md:gap-2 items-center justify-center">
        {/* Follow/Following Button */}
        <Button
          onClick={handleFollow}
          variant={isFollowing ? 'outline' : 'default'}
          size="sm"
          className="flex-1 gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-4"
        >
          {isFollowing ? (
            <>
              <UserCheck className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Following</span>
            </>
          ) : (
            <>
              <UserPlus className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Follow</span>
            </>
          )}
        </Button>

        {/* Message Button - Premium Only */}
        <Button
          onClick={handleMessage}
          variant="outline"
          size="sm"
          className="flex-1 gap-1 md:gap-2 relative text-xs md:text-sm px-2 md:px-4 border-yellow-500/30"
        >
          <MessageCircle className="w-3 h-3 md:w-4 md:h-4" />
          <span className="hidden sm:inline">PM</span>
          {!isPremium && (
            <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[8px] px-1 py-0 rounded-full leading-tight font-bold">
              PRO
            </span>
          )}
        </Button>

        {/* Super Like Button - Premium Only */}
        <SuperLikeButton postId={userId} userId={userId} />

        {/* Share Button */}
        <Button
          onClick={handleShare}
          variant="outline"
          size="sm"
          className="p-1.5 md:p-2"
        >
          <Share2 className="w-3 h-3 md:w-4 md:h-4" />
        </Button>
      </div>

      {/* Message Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-pink-400" />
              PM - Premium Feature
            </DialogTitle>
            <DialogDescription className="text-white/70 space-y-4">
              <p>Send unlimited messages to Premium and Gold members!</p>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 space-y-2">
                <p className="font-semibold text-white">Premium Benefits:</p>
                <ul className="space-y-1 text-sm">
                  <li>✓ Send messages to anyone</li>
                  <li>✓ 10 Super Likes per day</li>
                  <li>✓ Unlimited regular likes</li>
                  <li>✓ See who liked you</li>
                  <li>✓ 5 Rewinds per day</li>
                </ul>
              </div>
              <Button
                onClick={handleUpgrade}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Upgrade to Premium
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileActionButtons;
