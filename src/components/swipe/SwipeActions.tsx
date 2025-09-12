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
    <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-6 px-8 z-30">
      {/* Pass Button */}
      <Button
        onClick={() => onSwipeAction('pass', profileId)}
        size="lg"
        variant="outline"
        className="h-16 w-16 rounded-full bg-card/95 backdrop-blur-sm border-destructive/20 hover:bg-destructive/5 hover:border-destructive/40 shadow-xl transition-all duration-200 hover:scale-110"
      >
        <X size={28} className="text-destructive" />
      </Button>

      {/* Message Button */}
      <Button
        onClick={() => onMessage(profileId)}
        size="lg" 
        variant="outline"
        className="h-14 w-14 rounded-full bg-card/95 backdrop-blur-sm border-blue-500/20 hover:bg-blue-500/5 hover:border-blue-500/40 shadow-xl transition-all duration-200 hover:scale-110"
      >
        <MessageCircle size={22} className="text-blue-500" />
      </Button>

      {/* Super Like Button */}
      <Button
        onClick={() => onSwipeAction('superlike', profileId)}
        size="lg"
        variant="outline"
        className="h-14 w-14 rounded-full bg-card/95 backdrop-blur-sm border-yellow-500/20 hover:bg-yellow-500/5 hover:border-yellow-500/40 shadow-xl transition-all duration-200 hover:scale-110"
      >
        <Star size={22} className="text-yellow-500 fill-current" />
      </Button>

      {/* Like Button - Largest */}
      <Button
        onClick={() => onSwipeAction('like', profileId)}
        size="lg"
        variant="outline"
        className="h-16 w-16 rounded-full bg-gradient-to-r from-primary/5 to-primary/10 backdrop-blur-sm border-primary/30 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/15 hover:border-primary/50 shadow-xl transition-all duration-200 hover:scale-110"
      >
        <Heart size={32} className="text-primary fill-current" />
      </Button>
    </div>
  );
};

export default SwipeActions;