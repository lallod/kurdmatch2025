
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
    <div className="bg-black/20 backdrop-blur shadow-sm border-b border-white/20 sticky top-0 z-10">
      <div className="w-full px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white">Find Your Match</h1>
          </div>
          {lastAction && (
            <Button
              onClick={onUndo}
              variant="outline"
              size="sm"
              className="gap-1 bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs sm:text-sm h-8 sm:h-9"
            >
              <Undo2 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Undo</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SwipeHeader;
