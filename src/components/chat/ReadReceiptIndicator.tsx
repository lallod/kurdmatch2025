import React from 'react';
import { Check, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReadReceiptIndicatorProps {
  sent: boolean;
  read: boolean;
  className?: string;
}

export const ReadReceiptIndicator: React.FC<ReadReceiptIndicatorProps> = ({
  sent,
  read,
  className
}) => {
  if (!sent) return null;
  
  return (
    <span className={cn("inline-flex items-center ml-1", className)}>
      {read ? (
        <CheckCheck className="h-3.5 w-3.5 text-blue-400" />
      ) : (
        <Check className="h-3.5 w-3.5 text-white/70" />
      )}
    </span>
  );
};

export default ReadReceiptIndicator;
