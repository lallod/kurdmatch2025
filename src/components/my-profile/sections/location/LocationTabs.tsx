import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CurrentLocationTab from './CurrentLocationTab';
import ManualLocationTab from './ManualLocationTab';
import PassportLocationTab from './PassportLocationTab';
import DetailEditor from '@/components/DetailEditor';
import { MapPin } from 'lucide-react';
import type { KurdistanRegion } from '@/types/profile';
import { useTranslations } from '@/hooks/useTranslations';

interface LocationTabsProps {
  activeTab: string;
  location: string;
  isLoading: boolean;
  passportLocation: string;
  kurdistanRegion: KurdistanRegion;
  onTabChange: (value: string) => void;
  onDetectLocation: () => void;
  onManualLocationSelect: (location: any) => void;
  onPassportLocationSelect: (location: any) => void;
}

const LocationTabs: React.FC<LocationTabsProps> = ({
  activeTab,
  location,
  isLoading,
  passportLocation,
  kurdistanRegion,
  onTabChange,
  onDetectLocation,
  onManualLocationSelect,
  onPassportLocationSelect
}) => {
  const { t } = useTranslations();
  return (
    <div className="space-y-4">
      <Tabs defaultValue="current" value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="w-full grid grid-cols-3 bg-white/10 backdrop-blur-sm border border-white/20">
          <TabsTrigger 
            value="current" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-dark data-[state=active]:to-primary data-[state=active]:text-white text-white/70"
          >
            {t('location.current', 'Current')}
          </TabsTrigger>
          <TabsTrigger 
            value="manual"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-dark data-[state=active]:to-primary data-[state=active]:text-white text-white/70"
          >
            {t('location.manual', 'Manual')}
          </TabsTrigger>
          <TabsTrigger 
            value="passport"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-dark data-[state=active]:to-primary data-[state=active]:text-white text-white/70"
          >
            {t('location.passport', 'Passport')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="space-y-4 mt-4">
          <CurrentLocationTab 
            location={location}
            isLoading={isLoading}
            onDetectLocation={onDetectLocation}
          />
        </TabsContent>
        
        <TabsContent value="manual" className="space-y-4 mt-4">
          <ManualLocationTab 
            location={location}
            onLocationSelect={onManualLocationSelect}
          />
        </TabsContent>
        
        <TabsContent value="passport" className="space-y-4 mt-4">
          <PassportLocationTab 
            location={location}
            passportLocation={passportLocation}
            onLocationSelect={onPassportLocationSelect}
          />
        </TabsContent>
      </Tabs>
      
      <DetailEditor
        icon={<MapPin size={18} />}
        title={t('profile.kurdistan_region', 'Kurdistan Region')}
        fields={[
          { 
            name: 'kurdistanRegion', 
            label: t('profile.kurdistan_region', 'Kurdistan Region'), 
            value: kurdistanRegion, 
            type: 'select', 
            options: ['West-Kurdistan', 'East-Kurdistan', 'North-Kurdistan', 'South-Kurdistan'] 
          }
        ]}
      />
    </div>
  );
};

export default LocationTabs;
