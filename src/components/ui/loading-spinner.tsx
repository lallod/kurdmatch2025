
import React from 'react';
import { cn } from '@/lib/utils';

type SpinnerSize = 'small' | 'medium' | 'large';

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
}

export const LoadingSpinner = ({ 
  className, 
  size = 'medium', 
  ...props 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-3',
    large: 'h-12 w-12 border-4'
  };
  
  return (
    <div 
      className={cn(
        "animate-spin rounded-full border-b-transparent border-primary", 
        sizeClasses[size],
        className
      )} 
      {...props}
    />
  );
};
