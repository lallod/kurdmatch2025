import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart, Undo2 } from 'lucide-react';
import { LastAction } from '@/types/swipe';
interface SwipeHeaderProps {
  lastAction: LastAction | null;
  onUndo: () => void;
}
const SwipeHeader = ({
  lastAction,
  onUndo
}: SwipeHeaderProps) => {
  return <div className="fixed top-0 left-0 right-0 w-full bg-black/10 backdrop-blur-xl border-b border-white/10 z-20">
      
    </div>;
};
export default SwipeHeader;