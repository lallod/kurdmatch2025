
import React, { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import LocationSearch from './LocationSearch';
import LocationMap from './LocationMap';
import { useTranslations } from '@/hooks/useTranslations';

interface ManualLocationTabProps {
  location: string;
  onLocationSelect: (location: any) => void;
}

const ManualLocationTab: React.FC<ManualLocationTabProps> = ({
  location,
  onLocationSelect
}) => {
  const { t } = useTranslations();
  const [position, setPosition] = useState<[number, number]>([20, 0]);
  
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'en', 'User-Agent': 'KurdMatch App' } }
      );
      
      if (!response.ok) throw new Error('Reverse geocoding failed');
      
      const data = await response.json();
      onLocationSelect({
        display_name: data.display_name,
        address: data.address,
        lat,
        lon: lng
      });
    } catch (error) {
      console.error("Error during reverse geocoding:", error);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    reverseGeocode(lat, lng);
  };

  return (
    <div className="space-y-4">
      <div className="bg-primary/10 p-2 rounded-md border border-primary/20 mb-3">
        <div className="flex items-start gap-2">
          <MapPin size={18} className="text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-white">{t('location.manual', 'Manual Location')}</p>
            <p className="text-xs text-purple-200">
              {t('location.manual_desc', 'Choose your location by clicking on the map or searching for a city.')}
            </p>
          </div>
        </div>
      </div>
      
      <LocationMap 
        position={position}
        onClick={handleMapClick}
      />

      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{t('location.search', 'Search Location')}</label>
        <LocationSearch 
          onLocationSelect={(selected) => {
            onLocationSelect(selected);
            if (selected.lat && selected.lon) {
              const lat = parseFloat(selected.lat);
              const lon = parseFloat(selected.lon);
              setPosition([lat, lon]);
            }
          }}
          buttonLabel={t('location.search_city', 'Search City')}
          searchPlaceholder={t('location.search_city_placeholder', 'Search for a city or country...')}
          emptyMessage={t('location.no_results_try', 'No locations found. Try a different search.')}
          icon={<Search />}
          width="300px"
        />
      </div>
      
      <div className="p-3 bg-muted rounded-md flex items-center">
        <MapPin size={16} className="mr-2 text-primary" />
        {location || t('location.no_location', 'No location set')}
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {t('location.click_map', 'Click on the map or search to set your location.')}
      </p>
    </div>
  );
};

export default ManualLocationTab;
