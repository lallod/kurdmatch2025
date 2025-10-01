import React from 'react';
import { Heart, Laugh, Flame, HandHeart, Brain, Sparkles, Frown } from 'lucide-react';
import { ReactionType } from '@/api/reactions';
import { cn } from '@/lib/utils';

interface ReactionsSummaryProps {
  reactions: {
    love_count: number;
    haha_count: number;
    fire_count: number;
    applause_count: number;
    thoughtful_count: number;
    wow_count: number;
    sad_count: number;
    total_reactions: number;
  };
  className?: string;
}

const reactionIcons = {
  love: { icon: Heart, color: 'text-pink-500' },
  haha: { icon: Laugh, color: 'text-yellow-500' },
  fire: { icon: Flame, color: 'text-orange-500' },
  applause: { icon: HandHeart, color: 'text-green-500' },
  thoughtful: { icon: Brain, color: 'text-purple-500' },
  wow: { icon: Sparkles, color: 'text-blue-500' },
  sad: { icon: Frown, color: 'text-gray-500' },
};

const ReactionsSummary: React.FC<ReactionsSummaryProps> = ({ reactions, className }) => {
  // Get top 3 reactions
  const topReactions = Object.entries(reactions)
    .filter(([key]) => key.endsWith('_count') && key !== 'total_reactions')
    .map(([key, count]) => ({
      type: key.replace('_count', '') as ReactionType,
      count: count as number,
    }))
    .filter(r => r.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  if (reactions.total_reactions === 0) return null;

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex -space-x-1">
        {topReactions.map(({ type }) => {
          const { icon: Icon, color } = reactionIcons[type];
          return (
            <div
              key={type}
              className="w-5 h-5 rounded-full bg-background flex items-center justify-center border"
            >
              <Icon className={cn('w-3 h-3', color)} />
            </div>
          );
        })}
      </div>
      <span className="text-sm text-muted-foreground">
        {reactions.total_reactions}
      </span>
    </div>
  );
};

export default ReactionsSummary;
