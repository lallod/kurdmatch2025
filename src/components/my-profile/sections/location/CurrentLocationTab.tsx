
import React from 'react';
import { Navigation, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CurrentLocationTabProps {
  location: string;
  isLoading: boolean;
  onDetectLocation: () => void;
}

const CurrentLocationTab: React.FC<CurrentLocationTabProps> = ({
  location,
  isLoading,
  onDetectLocation
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Device Location</label>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary h-7 px-2"
          onClick={onDetectLocation}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 size={16} className="mr-1 animate-spin" />
          ) : (
            <Navigation size={16} className="mr-1" />
          )}
          {isLoading ? "Updating..." : "Update"}
        </Button>
      </div>
      <div className="p-3 bg-muted rounded-md flex items-center">
        {isLoading ? (
          <Loader2 size={16} className="mr-2 text-primary animate-spin" />
        ) : (
          <Navigation size={16} className="mr-2 text-primary" />
        )}
        {isLoading ? "Detecting location..." : location}
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        This uses your device's GPS to determine your exact location.
      </p>
    </div>
  );
};

export default CurrentLocationTab;
