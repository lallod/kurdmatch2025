
import React, { useState } from 'react';
import { Globe, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from '@/hooks/useTranslations';
import LocationSearch from './LocationSearch';
import PassportLocationDisplay from './PassportLocationDisplay';
import LocationInfoBanner from './LocationInfoBanner';

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
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  const { toast } = useToast();
  const { t } = useTranslations();

  const handleSelectLocation = (result: any) => {
    onLocationSelect(result);
    
    if (!recentSearches.some(item => item.place_id === result.place_id)) {
      setRecentSearches(prev => [result, ...prev].slice(0, 5));
    }
    
    toast({
      title: t('toast.location.updated', 'Location updated'),
      description: t('toast.location.passport_set', `Your passport location is now set to ${formatLocationResult(result)}`, { location: formatLocationResult(result) })
    });
  };

  const formatLocationResult = (result: any) => {
    const address = result.address || {};
    const city = address.city || address.town || address.village || '';
    const state = address.state || address.county || address.region || '';
    const country = address.country || '';
    
    if (city && state && country) {
      return `${city}, ${state}, ${country}`;
    } else if (city && (state || country)) {
      return `${city}, ${state || country}`;
    } else if (state && country) {
      return `${state}, ${country}`;
    } else if (country) {
      return country;
    } else {
      return result.display_name.split(',').slice(0, 3).join(',');
    }
  };

  return (
    <div className="space-y-4">
      <LocationInfoBanner 
        icon={<Globe />}
        title={t('location.travel_mode', 'Travel Mode')}
        description={t('location.travel_mode_desc', 'Set your location anywhere in the world to match with people from different cities or countries.')}
        bgColor="bg-accent/10"
        borderColor="border border-accent/20"
        textColor="text-white"
        iconColor="text-accent"
      />
      
      <div className="space-y-2">
        <label className="text-sm font-medium">{t('location.explore', 'Explore Location')}</label>
        
        <LocationSearch 
          onLocationSelect={handleSelectLocation}
          buttonLabel={search => search || t('location.search_placeholder', 'Search any city in the world...')}
          searchPlaceholder={t('location.search_placeholder', 'Search any city in the world...')}
          emptyMessage={t('location.no_results', 'No locations found')}
          icon={<Globe />}
          width="300px"
          recentSearches={recentSearches}
        />
      </div>
      
      <PassportLocationDisplay 
        location={location}
        passportLocation={passportLocation}
        onClear={() => onLocationSelect({ display_name: "" })}
      />
    </div>
  );
};

export default PassportLocationTab;
