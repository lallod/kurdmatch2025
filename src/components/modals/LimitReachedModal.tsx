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
  resetTime.setHours(24, 0, 0, 0); // Next midnight
  
  const timeUntilReset = Math.ceil((resetTime.getTime() - Date.now()) / (1000 * 60 * 60));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-purple-900/95 via-purple-800/95 to-pink-900/95 backdrop-blur-md border border-white/20 text-white max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-red-400" />
          </div>
          
          <DialogTitle className="text-2xl font-bold text-white">
            Daily Like Limit Reached
          </DialogTitle>
          
          <DialogDescription className="text-purple-200 text-lg">
            You've used all your free likes for today. Come back tomorrow or upgrade to premium for unlimited likes!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Status */}
          <div className="text-center p-4 bg-red-500/20 rounded-lg border border-red-400/30">
            <p className="text-red-300 font-semibold">
              50/50 free likes used today
            </p>
            <p className="text-red-200 text-sm mt-1">
              <Clock className="w-4 h-4 inline mr-1" />
              Resets in {timeUntilReset} hours
            </p>
          </div>

          {/* Feature Comparison */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">Free</span>
              </div>
              <Badge variant="outline" className="border-gray-500 text-gray-300">
                50 per day
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-400/30">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-500" />
                <span className="text-white font-semibold">Premium</span>
              </div>
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                Unlimited
              </Badge>
            </div>
          </div>

          {/* Premium Benefits */}
          {!isPremium && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                Why Upgrade?
              </h4>
              <ul className="space-y-2 text-purple-200">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Unlimited likes every day
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
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Priority support
                </li>
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              Wait Until Tomorrow
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

export default LimitReachedModal;