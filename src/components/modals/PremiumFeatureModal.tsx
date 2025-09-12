import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, Zap, RotateCcw, Heart, Sparkles } from 'lucide-react';

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
        return {
          icon: Star,
          title: 'Super Like',
          color: 'text-blue-500',
          bgColor: 'bg-blue-500/10',
          description: 'Stand out from the crowd! Super Likes are 3x more likely to get a match.',
          freeLimit: '1 per day',
          premiumLimit: '10 per day'
        };
      case 'rewind':
        return {
          icon: RotateCcw,
          title: 'Rewind',
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/10',
          description: 'Made a mistake? Undo your last swipe and get a second chance.',
          freeLimit: 'Premium only',
          premiumLimit: '5 per day'
        };
      case 'boost':
        return {
          icon: Zap,
          title: 'Boost',
          color: 'text-purple-500',
          bgColor: 'bg-purple-500/10',
          description: 'Be one of the top profiles in your area for 30 minutes!',
          freeLimit: 'Premium only',
          premiumLimit: '3 per day'
        };
    }
  };

  const config = getFeatureConfig();
  const FeatureIcon = config.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-purple-900/95 via-purple-800/95 to-pink-900/95 backdrop-blur-md border border-white/20 text-white max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className={`w-20 h-20 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <FeatureIcon className={`w-10 h-10 ${config.color}`} />
          </div>
          
          <DialogTitle className="text-2xl font-bold text-white">
            {config.title}
          </DialogTitle>
          
          <DialogDescription className="text-purple-200 text-lg">
            {config.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Status */}
          {isPremium && remaining > 0 ? (
            <div className="text-center p-4 bg-green-500/20 rounded-lg border border-green-400/30">
              <p className="text-green-300 font-semibold">
                You have {remaining} {config.title.toLowerCase()}s remaining today!
              </p>
            </div>
          ) : !isPremium && feature === 'super_like' && remaining > 0 ? (
            <div className="text-center p-4 bg-blue-500/20 rounded-lg border border-blue-400/30">
              <p className="text-blue-300 font-semibold">
                You have {remaining} free super like remaining today!
              </p>
            </div>
          ) : (
            <div className="text-center p-4 bg-red-500/20 rounded-lg border border-red-400/30">
              <p className="text-red-300 font-semibold">
                {feature === 'super_like' && !isPremium 
                  ? "You've used your free Super Like for today!"
                  : `${config.title} is a premium feature!`
                }
              </p>
            </div>
          )}

          {/* Feature Comparison */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">Free</span>
              </div>
              <Badge variant="outline" className="border-gray-500 text-gray-300">
                {config.freeLimit}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-400/30">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-500" />
                <span className="text-white font-semibold">Premium</span>
              </div>
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                {config.premiumLimit}
              </Badge>
            </div>
          </div>

          {/* Premium Benefits */}
          {!isPremium && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                Premium Benefits
              </h4>
              <ul className="space-y-2 text-purple-200">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Unlimited likes per day
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  10 Super Likes daily
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  5 Rewinds daily
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  3 Boosts daily
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  See who liked you
                </li>
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-gray-600/50 border-gray-500 text-white hover:bg-gray-600/70"
            >
              Maybe Later
            </Button>
            {!isPremium && (
              <Button
                onClick={() => {
                  // TODO: Implement premium upgrade
                  onClose();
                }}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
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

export default PremiumFeatureModal;