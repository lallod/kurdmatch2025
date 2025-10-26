import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, UserPlus, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { getUserSubscription } from '@/api/usage';
import { createPremiumCheckout } from '@/api/payments';
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
      <div className="flex items-center justify-center gap-4 py-6">
        <Button
          size="lg"
          variant="outline"
          onClick={handleFollow}
          className="flex-1 max-w-[180px]"
        >
          {isFollowing ? (
            <>
              <UserCheck className="h-5 w-5 mr-2" />
              Following
            </>
          ) : (
            <>
              <UserPlus className="h-5 w-5 mr-2" />
              Follow
            </>
          )}
        </Button>

        <Button
          size="lg"
          onClick={handleMessage}
          className="flex-1 max-w-[180px] bg-gradient-to-r from-primary to-primary-glow relative"
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          Message
          {!isPremium && (
            <span className="absolute -top-1 -right-1 bg-accent text-white text-xs px-1.5 py-0.5 rounded-full">
              PRO
            </span>
          )}
        </Button>
      </div>

      {/* Message Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground text-2xl flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-primary" />
              PM - Premium Feature
            </DialogTitle>
            <DialogDescription className="text-muted-foreground space-y-4">
              <p>Send unlimited messages to Premium and Gold members!</p>
              <div className="bg-accent/10 backdrop-blur-md rounded-lg p-4 space-y-2">
                <p className="font-semibold text-foreground">Premium Benefits:</p>
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
                className="w-full bg-gradient-to-r from-primary to-primary-glow text-white"
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

export default ProfileActionButtons;

