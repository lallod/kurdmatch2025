import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from '@/hooks/useTranslations';

interface CompatibilityInsightsLinkProps {
  userId: string;
  matchScore?: number;
  variant?: 'button' | 'inline' | 'compact';
  className?: string;
}

export const CompatibilityInsightsLink: React.FC<CompatibilityInsightsLinkProps> = ({
  userId,
  matchScore,
  variant = 'button',
  className,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslations();

  const handleClick = () => {
    navigate(`/compatibility/${userId}`);
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        className={cn(
          'flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors',
          className
        )}
      >
        <Sparkles className="w-3 h-3" />
        <span>{t('chat.see_compatibility', 'See compatibility')}</span>
      </button>
    );
  }

  if (variant === 'inline') {
    return (
      <div
        onClick={handleClick}
        className={cn(
          'flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20 cursor-pointer hover:bg-primary/20 transition-colors',
          className
        )}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">{t('chat.compatibility_insights', 'Compatibility Insights')}</p>
            <p className="text-xs text-muted-foreground">
              {matchScore ? `${matchScore}% match` : t('chat.see_detailed_analysis', 'See detailed analysis')}
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      className={cn(
        'gap-2 bg-gradient-to-r from-primary/10 to-pink-500/10 border-primary/30 hover:from-primary/20 hover:to-pink-500/20',
        className
      )}
    >
      <Sparkles className="w-4 h-4" />
      <span>{t('chat.see_compatibility', 'See compatibility')}</span>
      {matchScore && (
        <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-primary/20 text-primary">
          {matchScore}%
        </span>
      )}
    </Button>
  );
};