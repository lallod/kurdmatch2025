import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Lightbulb } from 'lucide-react';

interface SuggestionBadgeProps {
  show: boolean;
  className?: string;
}

export const SuggestionBadge: React.FC<SuggestionBadgeProps> = ({ show, className = '' }) => {
  if (!show) return null;

  return (
    <Badge 
      variant="outline" 
      className={`bg-blue-500/20 text-blue-300 border-blue-400/30 text-xs ${className}`}
    >
      <Lightbulb className="w-3 h-3 mr-1" />
      Suggested
    </Badge>
  );
};