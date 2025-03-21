
import React from 'react';
import { MapPin } from 'lucide-react';
import { SheetContent } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import DetailEditor from '@/components/DetailEditor';
import ProfileSectionButton from '../ProfileSectionButton';
import type { KurdistanRegion } from '@/types/profile';

interface LocationSectionProps {
  profileData: {
    location: string;
    kurdistanRegion: KurdistanRegion;
  };
}

const LocationSection: React.FC<LocationSectionProps> = ({ profileData }) => {
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
            <DetailEditor
              icon={<MapPin size={18} />}
              title="Your Location"
              fields={[
                { name: 'location', label: 'City & State', value: profileData.location },
                { name: 'kurdistanRegion', label: 'Kurdistan Region', value: profileData.kurdistanRegion, type: 'select', 
                  options: ['West-Kurdistan', 'East-Kurdistan', 'North-Kurdistan', 'South-Kurdistan'] }
              ]}
            />
          </div>
        </ScrollArea>
      </SheetContent>
    </ProfileSectionButton>
  );
};

export default LocationSection;
