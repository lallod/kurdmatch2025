
import React from 'react';
import { MapPin } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import LocationTabs from './LocationTabs';

interface LocationSectionContentProps {
  location: string;
  activeTab: string;
  isLoading: boolean;
  passportLocation: string;
  kurdistanRegion: string;
  onTabChange: (value: string) => void;
  onDetectLocation: () => void;
  onManualLocationSelect: (location: any) => void;
  onPassportLocationSelect: (location: any) => void;
}

const LocationSectionContent: React.FC<LocationSectionContentProps> = ({
  location,
  activeTab,
  isLoading,
  passportLocation,
  kurdistanRegion,
  onTabChange,
  onDetectLocation,
  onManualLocationSelect,
  onPassportLocationSelect
}) => {
  return (
    <ScrollArea className="h-[calc(100vh-5rem)]">
      <div className="py-6 pr-6">
        <h3 className="text-lg font-semibold mb-6">Location Information</h3>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <MapPin size={20} className="text-primary" />
            </div>
            <h4 className="text-md font-medium">Your Location</h4>
          </div>
          
          <LocationTabs 
            activeTab={activeTab}
            location={location}
            isLoading={isLoading}
            passportLocation={passportLocation}
            kurdistanRegion={kurdistanRegion}
            onTabChange={onTabChange}
            onDetectLocation={onDetectLocation}
            onManualLocationSelect={onManualLocationSelect}
            onPassportLocationSelect={onPassportLocationSelect}
          />
        </div>
      </div>
    </ScrollArea>
  );
};

export default LocationSectionContent;
