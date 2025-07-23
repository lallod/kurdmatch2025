
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
    <div className="fixed top-0 left-0 right-0 w-full bg-black/10 backdrop-blur-xl border-b border-white/10 z-20">
      <div className="flex items-center justify-between px-4 py-3">
        {/* App Logo/Title */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold text-lg hidden sm:block">Discover</span>
        </div>
        
        {/* Undo Button */}
        {lastAction && (
          <Button
            onClick={onUndo}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10 border border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105"
          >
            <Undo2 className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Undo</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default SwipeHeader;
