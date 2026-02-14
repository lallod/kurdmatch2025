
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
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-primary transition-all hover:shadow-lg hover:from-primary/30 hover:to-accent/30">
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
