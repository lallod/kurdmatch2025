import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  fullScreen = false,
  className
}) => {
  const content = (
    <div className={cn(
      "flex flex-col items-center justify-center gap-4",
      className
    )}>
      <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      <p className="text-sm text-purple-200">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingState;
