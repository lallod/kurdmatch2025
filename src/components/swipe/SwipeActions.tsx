import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, X, Star, MessageCircle } from 'lucide-react';
import { SwipeAction } from '@/types/swipe';

interface SwipeActionsProps {
  onSwipeAction: (action: SwipeAction, profileId: string) => void;
  onMessage: (profileId: string) => void;
  profileId: string;
}

const SwipeActions: React.FC<SwipeActionsProps> = ({
  onSwipeAction,
  onMessage,
  profileId
}) => {
  return (
    <div className="fixed bottom-20 left-0 right-0 flex justify-center gap-4 px-4 z-30">
      <Button
        onClick={() => onSwipeAction('pass', profileId)}
        size="lg"
        variant="outline"
        className="h-14 w-14 rounded-full bg-white/90 border-red-300 hover:bg-red-50 shadow-lg"
      >
        <X size={24} className="text-red-500" />
      </Button>

      <Button
        onClick={() => onMessage(profileId)}
        size="lg" 
        variant="outline"
        className="h-12 w-12 rounded-full bg-white/90 border-blue-300 hover:bg-blue-50 shadow-lg"
      >
        <MessageCircle size={20} className="text-blue-500" />
      </Button>

      <Button
        onClick={() => onSwipeAction('superlike', profileId)}
        size="lg"
        variant="outline"
        className="h-12 w-12 rounded-full bg-white/90 border-yellow-300 hover:bg-yellow-50 shadow-lg"
      >
        <Star size={20} className="text-yellow-500" />
      </Button>

      <Button
        onClick={() => onSwipeAction('like', profileId)}
        size="lg"
        variant="outline"
        className="h-16 w-16 rounded-full bg-white/90 border-green-300 hover:bg-green-50 shadow-lg"
      >
        <Heart size={28} className="text-green-500" />
      </Button>
    </div>
  );
};

export default SwipeActions;