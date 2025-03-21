
import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { SheetContent } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import ProfileSectionButton from '../ProfileSectionButton';
import type { KurdistanRegion } from '@/types/profile';
import { useToast } from '@/hooks/use-toast';
import LocationTabs from './location/LocationTabs';
import { useLocationManager } from './location/useLocationManager';

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
                kurdistanRegion={profileData.kurdistanRegion}
                onTabChange={handleTabChange}
                onDetectLocation={handleLocationDetection}
                onManualLocationSelect={handleManualLocationSelect}
                onPassportLocationSelect={handlePassportLocationSelect}
              />
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </ProfileSectionButton>
  );
};

export default LocationSection;
