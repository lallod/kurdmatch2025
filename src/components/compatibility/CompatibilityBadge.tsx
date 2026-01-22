import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Heart, MessageCircle, Shield, Zap, Star, Users } from 'lucide-react';
import { useDynamicCompatibility } from '@/hooks/useDynamicCompatibility';
import { cn } from '@/lib/utils';

interface CompatibilityBadgeProps {
  targetUserId: string;
  initialScore?: number;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CompatibilityBadge = ({
  targetUserId,
  initialScore,
  showDetails = false,
  size = 'md',
  className
}: CompatibilityBadgeProps) => {
  const { calculateCompatibility, getCompatibilityBadge, isCalculating } = useDynamicCompatibility();
  const [score, setScore] = useState(initialScore || 0);
  const [factors, setFactors] = useState<any>(null);
  const [sharedInterests, setSharedInterests] = useState<string[]>([]);

  useEffect(() => {
    if (targetUserId && !initialScore) {
      calculateCompatibility(targetUserId, 'quick').then(result => {
        if (result) {
          setScore(result.score);
          setFactors(result.factors);
          setSharedInterests(result.sharedInterests || []);
        }
      });
    }
  }, [targetUserId, initialScore, calculateCompatibility]);

  const badge = getCompatibilityBadge(score);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  const detailsContent = (
    <div className="space-y-3 p-2 min-w-[200px]">
      <div className="flex items-center justify-between">
        <span className="font-semibold">Compatibility Score</span>
        <span className={cn('font-bold text-lg', badge.color)}>{score}%</span>
      </div>
      
      <Progress value={score} className="h-2" />
      
      {factors && (
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Heart className="w-3 h-3" /> Shared Interests
            </span>
            <span>+{factors.sharedInterests}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <MessageCircle className="w-3 h-3" /> Chat Engagement
            </span>
            <span>+{factors.chatEngagement}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Shield className="w-3 h-3" /> Verification
            </span>
            <span>+{factors.verificationBonus}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Zap className="w-3 h-3" /> Activity
            </span>
            <span>+{factors.activityScore}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="w-3 h-3" /> Lifestyle Match
            </span>
            <span>+{factors.lifestyleMatch}</span>
          </div>
        </div>
      )}
      
      {sharedInterests.length > 0 && (
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground mb-1">Shared interests:</p>
          <div className="flex flex-wrap gap-1">
            {sharedInterests.slice(0, 5).map((interest, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (isCalculating && !initialScore) {
    return (
      <Badge variant="outline" className={cn(sizeClasses[size], 'animate-pulse', className)}>
        <Star className="w-3 h-3 mr-1" />
        ...
      </Badge>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={cn(
              sizeClasses[size],
              'cursor-help border-transparent bg-gradient-to-r from-purple-500/20 to-pink-500/20',
              className
            )}
          >
            <span className="mr-1">{badge.emoji}</span>
            <span className={badge.color}>{score}%</span>
            {showDetails && (
              <span className="ml-1 text-muted-foreground">{badge.label}</span>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-background/95 backdrop-blur">
          {detailsContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
