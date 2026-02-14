import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Heart, Clock } from 'lucide-react';
import PremiumBenefitsList from '@/components/shared/PremiumBenefitsList';

interface LimitReachedModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: 'like';
  remaining: number;
  isPremium: boolean;
}

const LimitReachedModal: React.FC<LimitReachedModalProps> = ({
  isOpen,
  onClose,
  actionType,
  remaining,
  isPremium
}) => {
  const resetTime = new Date();
  resetTime.setHours(24, 0, 0, 0);
  const timeUntilReset = Math.ceil((resetTime.getTime() - Date.now()) / (1000 * 60 * 60));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border text-foreground max-h-[85vh] overflow-y-auto rounded-3xl max-w-[calc(100vw-2rem)]">
        <DialogHeader className="text-center space-y-2">
          <div className="w-14 h-14 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Heart className="w-7 h-7 text-destructive" />
          </div>
          <DialogTitle className="text-xl font-bold text-foreground">
            Daily Like Limit Reached
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            You've used all your free likes for today. Upgrade to premium for unlimited likes!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center p-3 bg-destructive/10 rounded-xl border border-destructive/20">
            <p className="text-destructive font-semibold text-sm">50/50 free likes used today</p>
            <p className="text-destructive/80 text-xs mt-1">
              <Clock className="w-3 h-3 inline mr-1" />
              Resets in {timeUntilReset} hours
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-2.5 bg-muted/50 rounded-xl">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">Free</span>
              </div>
              <Badge variant="outline" className="border-border text-muted-foreground text-xs">50 per day</Badge>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-primary/10 rounded-xl border border-primary/20">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-warning" />
                <span className="text-foreground font-semibold text-sm">Premium</span>
              </div>
              <Badge className="bg-primary text-primary-foreground text-xs">Unlimited</Badge>
            </div>
          </div>

          {!isPremium && <PremiumBenefitsList />}

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">Wait Until Tomorrow</Button>
            {!isPremium && (
              <Button onClick={() => onClose()} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Now
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LimitReachedModal;
