import React from 'react';
import { MapPin } from 'lucide-react';
import { formatDistance } from '@/utils/locationUtils';

interface DistanceBadgeProps {
  distanceKm: number;
  className?: string;
}

const DistanceBadge: React.FC<DistanceBadgeProps> = ({ distanceKm, className = '' }) => {
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full bg-background/90 backdrop-blur-sm border border-border text-xs font-medium ${className}`}>
      <MapPin className="w-3 h-3 text-primary" />
      <span>{formatDistance(distanceKm)}</span>
    </div>
  );
};

export default DistanceBadge;
