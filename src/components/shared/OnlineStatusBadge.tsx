import React from 'react';
import { cn } from '@/lib/utils';
import { useUserOnlineStatus } from '@/hooks/useOnlinePresence';

interface OnlineStatusBadgeProps {
  userId: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const OnlineStatusBadge: React.FC<OnlineStatusBadgeProps> = ({
  userId,
  size = 'md',
  showText = false,
  className,
}) => {
  const { isOnline, formatLastActive, isLoading } = useUserOnlineStatus(userId);
  
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };

  const textSizeClasses = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  if (isLoading) {
    return null;
  }

  const statusText = formatLastActive();

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <span
        className={cn(
          'rounded-full flex-shrink-0 ring-2 ring-background',
          sizeClasses[size],
          isOnline 
            ? 'bg-success animate-pulse' 
            : 'bg-muted-foreground/50'
        )}
        aria-label={isOnline ? 'Online' : 'Offline'}
      />
      {showText && statusText && (
        <span 
          className={cn(
            'text-muted-foreground whitespace-nowrap',
            textSizeClasses[size]
          )}
        >
          {statusText}
        </span>
      )}
    </div>
  );
};

// Inline version for avatars - positioned absolutely
interface OnlineStatusDotProps {
  userId: string;
  size?: 'sm' | 'md' | 'lg';
  position?: 'bottom-right' | 'top-right' | 'bottom-left' | 'top-left';
  className?: string;
}

export const OnlineStatusDot: React.FC<OnlineStatusDotProps> = ({
  userId,
  size = 'md',
  position = 'bottom-right',
  className,
}) => {
  const { isOnline, isLoading } = useUserOnlineStatus(userId);
  
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3.5 h-3.5',
  };

  const positionClasses = {
    'bottom-right': 'bottom-0 right-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'top-left': 'top-0 left-0',
  };

  if (isLoading) {
    return null;
  }

  return (
    <span
      className={cn(
        'absolute rounded-full ring-2 ring-background',
        sizeClasses[size],
        positionClasses[position],
        isOnline 
          ? 'bg-success' 
          : 'bg-muted-foreground/50',
        className
      )}
      aria-label={isOnline ? 'Online' : 'Offline'}
    />
  );
};

// Static version that accepts isOnline directly (for performance when already fetched)
interface StaticOnlineStatusBadgeProps {
  isOnline: boolean;
  lastActiveText?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const StaticOnlineStatusBadge: React.FC<StaticOnlineStatusBadgeProps> = ({
  isOnline,
  lastActiveText,
  size = 'md',
  showText = false,
  className,
}) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };

  const textSizeClasses = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <span
        className={cn(
          'rounded-full flex-shrink-0 ring-2 ring-background',
          sizeClasses[size],
          isOnline 
            ? 'bg-success animate-pulse' 
            : 'bg-muted-foreground/50'
        )}
        aria-label={isOnline ? 'Online' : 'Offline'}
      />
      {showText && (
        <span 
          className={cn(
            'text-muted-foreground whitespace-nowrap',
            textSizeClasses[size]
          )}
        >
          {isOnline ? 'Online nå' : lastActiveText || 'Offline'}
        </span>
      )}
    </div>
  );
};
