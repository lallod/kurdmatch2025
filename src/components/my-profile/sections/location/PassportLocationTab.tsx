
import React from 'react';
import { Globe } from 'lucide-react';
import LocationSearch from './LocationSearch';

interface PassportLocationTabProps {
  location: string;
  passportLocation: string;
  onLocationSelect: (location: any) => void;
}

const PassportLocationTab: React.FC<PassportLocationTabProps> = ({
  location,
  passportLocation,
  onLocationSelect
}) => {
  return (
    <div className="space-y-2">
      <div className="bg-amber-50 p-2 rounded-md border border-amber-200 mb-3">
        <div className="flex items-start gap-2">
          <Globe size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800">Travel Mode</p>
            <p className="text-xs text-amber-700">
              Set your location anywhere in the world to match with people from different cities or countries.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Explore Location</label>
        <LocationSearch 
          onLocationSelect={onLocationSelect}
          buttonLabel="Search Globally"
          searchPlaceholder="Search any city in the world..."
          emptyMessage="No locations found. Try a different search."
          icon={<Globe />}
          width="300px"
        />
      </div>
      <div className="p-3 bg-muted rounded-md flex items-center">
        <Globe size={16} className="mr-2 text-primary" />
        {passportLocation || location || "No passport location set"}
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Virtual location for exploring matches in other cities worldwide.
      </p>
    </div>
  );
};

export default PassportLocationTab;
