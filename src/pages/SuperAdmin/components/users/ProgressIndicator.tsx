
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressIndicatorProps {
  progress: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ progress }) => {
  return (
    <div className="w-full space-y-2">
      <Progress value={progress} className="w-full" />
      <p className="text-xs text-center text-muted-foreground">{progress}% complete</p>
    </div>
  );
};

export default ProgressIndicator;
