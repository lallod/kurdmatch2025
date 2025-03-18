
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex items-start gap-3 py-3 group">
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-tinder-rose/20 to-tinder-orange/20 text-tinder-rose transition-all hover:shadow-lg hover:from-tinder-rose/30 hover:to-tinder-orange/30">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground font-medium">
          {label}
        </p>
        <div className="font-medium mt-1 text-foreground">
          {value}
        </div>
      </div>
    </div>
  );
};

export default DetailItem;
