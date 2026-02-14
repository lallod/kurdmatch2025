import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Heart, Clock, Sparkles } from 'lucide-react';

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
      <DialogContent className="bg-card border-border text-foreground">
        <DialogHeader className="text-center space-y-4">
          <div className="w-20 h-20 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-destructive" />
          </div>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Daily Like Limit Reached
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-lg">
            You've used all your free likes for today. Come back tomorrow or upgrade to premium for unlimited likes!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center p-4 bg-destructive/10 rounded-lg border border-destructive/20">
            <p className="text-destructive font-semibold">50/50 free likes used today</p>
            <p className="text-destructive/80 text-sm mt-1">
              <Clock className="w-4 h-4 inline mr-1" />
              Resets in {timeUntilReset} hours
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Free</span>
              </div>
              <Badge variant="outline" className="border-border text-muted-foreground">50 per day</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-warning" />
                <span className="text-foreground font-semibold">Premium</span>
              </div>
              <Badge className="bg-primary text-primary-foreground">Unlimited</Badge>
            </div>
          </div>

          {!isPremium && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-warning" />
                Why Upgrade?
              </h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-primary rounded-full"></div>Unlimited likes every day</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-primary rounded-full"></div>10 Super Likes daily</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-primary rounded-full"></div>5 Rewinds daily</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-primary rounded-full"></div>3 Boosts daily</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-primary rounded-full"></div>See who liked you</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-primary rounded-full"></div>Priority support</li>
              </ul>
            </div>
          )}

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
