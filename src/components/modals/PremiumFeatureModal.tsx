import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, Zap, RotateCcw, Heart } from 'lucide-react';
import PremiumBenefitsList from '@/components/shared/PremiumBenefitsList';

interface PremiumFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: 'super_like' | 'rewind' | 'boost';
  remaining?: number;
  isPremium?: boolean;
}

const PremiumFeatureModal: React.FC<PremiumFeatureModalProps> = ({
  isOpen,
  onClose,
  feature,
  remaining = 0,
  isPremium = false
}) => {
  const getFeatureConfig = () => {
    switch (feature) {
      case 'super_like':
        return { icon: Star, title: 'Super Like', color: 'text-info', bgColor: 'bg-info/10', description: 'Stand out from the crowd! Super Likes are 3x more likely to get a match.', freeLimit: '1 per day', premiumLimit: '10 per day' };
      case 'rewind':
        return { icon: RotateCcw, title: 'Rewind', color: 'text-warning', bgColor: 'bg-warning/10', description: 'Made a mistake? Undo your last swipe and get a second chance.', freeLimit: 'Premium only', premiumLimit: '5 per day' };
      case 'boost':
        return { icon: Zap, title: 'Boost', color: 'text-primary', bgColor: 'bg-primary/10', description: 'Be one of the top profiles in your area for 30 minutes!', freeLimit: 'Premium only', premiumLimit: '3 per day' };
    }
  };

  const config = getFeatureConfig();
  const FeatureIcon = config.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border text-foreground max-h-[85vh] overflow-y-auto rounded-3xl max-w-[calc(100vw-2rem)]">
        <DialogHeader className="text-center space-y-2">
          <div className={`w-14 h-14 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-2`}>
            <FeatureIcon className={`w-7 h-7 ${config.color}`} />
          </div>
          <DialogTitle className="text-xl font-bold text-foreground">{config.title}</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">{config.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isPremium && remaining > 0 ? (
            <div className="text-center p-3 bg-success/10 rounded-xl border border-success/20">
              <p className="text-success font-semibold text-sm">You have {remaining} {config.title.toLowerCase()}s remaining today!</p>
            </div>
          ) : !isPremium && feature === 'super_like' && remaining > 0 ? (
            <div className="text-center p-3 bg-info/10 rounded-xl border border-info/20">
              <p className="text-info font-semibold text-sm">You have {remaining} free super like remaining today!</p>
            </div>
          ) : (
            <div className="text-center p-3 bg-destructive/10 rounded-xl border border-destructive/20">
              <p className="text-destructive font-semibold text-sm">
                {feature === 'super_like' && !isPremium ? "You've used your free Super Like for today!" : `${config.title} is a premium feature!`}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between p-2.5 bg-muted/50 rounded-xl">
              <div className="flex items-center gap-2"><Heart className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground text-sm">Free</span></div>
              <Badge variant="outline" className="border-border text-muted-foreground text-xs">{config.freeLimit}</Badge>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-primary/10 rounded-xl border border-primary/20">
              <div className="flex items-center gap-2"><Crown className="w-4 h-4 text-warning" /><span className="text-foreground font-semibold text-sm">Premium</span></div>
              <Badge className="bg-primary text-primary-foreground text-xs">{config.premiumLimit}</Badge>
            </div>
          </div>

          {!isPremium && <PremiumBenefitsList title="Premium Benefits" />}

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">Maybe Later</Button>
            {!isPremium && (
              <Button onClick={() => onClose()} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Crown className="w-4 h-4 mr-2" />Upgrade Now
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumFeatureModal;
