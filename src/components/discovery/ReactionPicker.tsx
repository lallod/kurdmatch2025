import React, { useState } from 'react';
import { Heart, Laugh, Flame, HandHeart, Brain, Sparkles, Frown } from 'lucide-react';
import { ReactionType } from '@/api/reactions';
import { cn } from '@/lib/utils';

interface ReactionPickerProps {
  onReactionSelect: (reaction: ReactionType) => void;
  currentReaction?: ReactionType | null;
  className?: string;
}

const reactions = [
  { type: 'love' as ReactionType, icon: Heart, label: 'Love', color: 'text-pink-500' },
  { type: 'haha' as ReactionType, icon: Laugh, label: 'Haha', color: 'text-yellow-500' },
  { type: 'fire' as ReactionType, icon: Flame, label: 'Fire', color: 'text-orange-500' },
  { type: 'applause' as ReactionType, icon: HandHeart, label: 'Applause', color: 'text-green-500' },
  { type: 'thoughtful' as ReactionType, icon: Brain, label: 'Thoughtful', color: 'text-purple-500' },
  { type: 'wow' as ReactionType, icon: Sparkles, label: 'Wow', color: 'text-blue-500' },
  { type: 'sad' as ReactionType, icon: Frown, label: 'Sad', color: 'text-gray-500' },
];

const ReactionPicker: React.FC<ReactionPickerProps> = ({ 
  onReactionSelect, 
  currentReaction,
  className 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleReactionClick = (reaction: ReactionType) => {
    onReactionSelect(reaction);
    setIsOpen(false);
  };

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 hover:scale-110 transition-transform"
      >
        {currentReaction ? (
          <>
            {React.createElement(
              reactions.find(r => r.type === currentReaction)?.icon || Heart,
              { className: cn('w-5 h-5', reactions.find(r => r.type === currentReaction)?.color) }
            )}
          </>
        ) : (
          <Heart className="w-5 h-5 text-muted-foreground hover:text-primary" />
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 bg-background/95 backdrop-blur-sm border rounded-full px-2 py-2 flex gap-1 shadow-lg">
            {reactions.map(({ type, icon: Icon, label, color }) => (
              <button
                key={type}
                onClick={() => handleReactionClick(type)}
                className={cn(
                  'p-2 rounded-full hover:bg-accent transition-all hover:scale-125',
                  currentReaction === type && 'bg-accent scale-110'
                )}
                title={label}
              >
                <Icon className={cn('w-5 h-5', color)} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ReactionPicker;
