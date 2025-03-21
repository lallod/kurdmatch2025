
import React from 'react';
import { MapPin, Search } from 'lucide-react';
import LocationSearch from './LocationSearch';

interface ManualLocationTabProps {
  location: string;
  onLocationSelect: (location: any) => void;
}

const ManualLocationTab: React.FC<ManualLocationTabProps> = ({
  location,
  onLocationSelect
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Search Location</label>
        <LocationSearch 
          onLocationSelect={onLocationSelect}
          buttonLabel="Search City"
          searchPlaceholder="Search for a city or country..."
          emptyMessage="No locations found. Try a different search."
          icon={<Search />}
          width="300px"
        />
      </div>
      <div className="p-3 bg-muted rounded-md flex items-center">
        <MapPin size={16} className="mr-2 text-primary" />
        {location || "No location set"}
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Manually set your location to your actual city or region.
      </p>
    </div>
  );
};

export default ManualLocationTab;
