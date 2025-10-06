import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 text-center",
      className
    )}>
      <div className="mb-4 rounded-full bg-purple-500/20 p-6">
        <Icon className="h-12 w-12 text-purple-300" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-purple-200 mb-6 max-w-md">{description}</p>
      {action && (
        <Button
          onClick={action.onClick}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
