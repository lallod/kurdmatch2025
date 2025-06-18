
import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart, Undo2 } from 'lucide-react';
import { LastAction } from '@/types/swipe';

interface SwipeHeaderProps {
  lastAction: LastAction | null;
  onUndo: () => void;
}

const SwipeHeader = ({ lastAction, onUndo }: SwipeHeaderProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 w-full bg-black/20 backdrop-blur shadow-sm border-b border-white/20 z-20">
      <div className="w-full px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
            </div>
          </div>
          {lastAction && (
            <Button
              onClick={onUndo}
              variant="outline"
              size="sm"
              className="gap-1 bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3"
            >
              <Undo2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span className="hidden xs:inline">Undo</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SwipeHeader;
