import { Shield, ShieldCheck, ShieldAlert, ShieldQuestion } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useTranslations } from '@/hooks/useTranslations';

interface VideoVerifiedBadgeProps {
  isVerified?: boolean;
  isPending?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  className?: string;
}

export const VideoVerifiedBadge = ({
  isVerified = false,
  isPending = false,
  size = 'md',
  showTooltip = true,
  className
}: VideoVerifiedBadgeProps) => {
  const { t } = useTranslations();
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const getIcon = () => {
    if (isVerified) {
      return <ShieldCheck className={cn(sizeClasses[size], 'text-green-400')} />;
    }
    if (isPending) {
      return <ShieldQuestion className={cn(sizeClasses[size], 'text-yellow-400')} />;
    }
    return null;
  };

  const getTooltipContent = () => {
    if (isVerified) {
      return (
        <div className="text-center">
          <p className="font-medium text-green-400">{t('verification.video_verified', 'Video Verified')} ✓</p>
          <p className="text-xs text-muted-foreground">{t('verification.identity_confirmed', 'Identity confirmed via video selfie')}</p>
        </div>
      );
    }
    if (isPending) {
      return (
        <div className="text-center">
          <p className="font-medium text-yellow-400">{t('verification.pending', 'Verification Pending')}</p>
          <p className="text-xs text-muted-foreground">{t('verification.being_reviewed', 'Video is being reviewed')}</p>
        </div>
      );
    }
    return null;
  };

  const icon = getIcon();
  
  if (!icon) return null;

  if (!showTooltip) {
    return <span className={className}>{icon}</span>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn('cursor-help', className)}>{icon}</span>
        </TooltipTrigger>
        <TooltipContent>
          {getTooltipContent()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
