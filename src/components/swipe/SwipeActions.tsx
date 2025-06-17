
import React from 'react';
import { Button } from "@/components/ui/button";
import { X, MessageCircle, Heart, Star } from 'lucide-react';
import { SwipeAction } from '@/types/swipe';

interface SwipeActionsProps {
  profileId: number;
  onSwipeAction: (action: SwipeAction, profileId: number) => void;
  onMessage: (profileId: number) => void;
}

const SwipeActions = ({ profileId, onSwipeAction, onMessage }: SwipeActionsProps) => {
  return (
    <div className="flex justify-center items-center gap-3 sm:gap-4 mt-4 sm:mt-6 px-2">
      <Button
        onClick={() => onSwipeAction('pass', profileId)}
        variant="outline"
        className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-red-500/20 border-red-400/30 text-red-400 hover:bg-red-500/30 touch-manipulation"
      >
        <X className="h-5 w-5 sm:h-6 sm:w-6" />
      </Button>

      <Button
        onClick={() => onMessage(profileId)}
        variant="outline"
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500/20 border-blue-400/30 text-blue-400 hover:bg-blue-500/30 touch-manipulation"
      >
        <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>

      <Button
        onClick={() => onSwipeAction('like', profileId)}
        variant="outline"
        className="w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/30 text-purple-400 hover:from-purple-500/30 hover:to-pink-500/30 touch-manipulation"
      >
        <Heart className="h-6 w-6 sm:h-7 sm:w-7" />
      </Button>

      <Button
        onClick={() => onSwipeAction('superlike', profileId)}
        variant="outline"
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-yellow-500/20 border-yellow-400/30 text-yellow-400 hover:bg-yellow-500/30 touch-manipulation"
      >
        <Star className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
    </div>
  );
};

export default SwipeActions;
