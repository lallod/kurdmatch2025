
import React from 'react';
import { MapPin } from 'lucide-react';
import { SheetContent } from '@/components/ui/sheet';
import ProfileSectionButton from '../ProfileSectionButton';
import type { KurdistanRegion } from '@/types/profile';
import { useLocationManager } from './location/useLocationManager';
import LocationSectionContent from './location/LocationSectionContent';

interface LocationSectionProps {
  profileData: {
    location: string;
    kurdistanRegion: KurdistanRegion;
  };
}

const LocationSection: React.FC<LocationSectionProps> = ({ profileData }) => {
  const { 
    location, 
    activeTab, 
    isLoading, 
    passportLocation,
    handleLocationDetection,
    handleManualLocationSelect, 
    handlePassportLocationSelect,
    handleTabChange
  } = useLocationManager(profileData.location);

  return (
    <ProfileSectionButton
      icon={<MapPin />}
      title="Location"
      description="Where you're from"
    >
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <LocationSectionContent
          location={location}
          activeTab={activeTab}
          isLoading={isLoading}
          passportLocation={passportLocation}
          kurdistanRegion={profileData.kurdistanRegion}
          onTabChange={handleTabChange}
          onDetectLocation={handleLocationDetection}
          onManualLocationSelect={handleManualLocationSelect}
          onPassportLocationSelect={handlePassportLocationSelect}
        />
      </SheetContent>
    </ProfileSectionButton>
  );
};

export default LocationSection;
