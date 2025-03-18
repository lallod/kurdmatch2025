
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value }) => {
  // This will be replaced by the actual isMobile value from the parent component
  const isMobile = false;
  
  if (isMobile) {
    return (
      <div className="flex items-start gap-3 py-3">
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-tinder-rose to-tinder-orange text-white">
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-400">{label}</p>
          <div className="font-medium text-white mt-1">{value}</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-secondary text-primary">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="font-medium mt-1">{value}</div>
      </div>
    </div>
  );
};

export default DetailItem;
