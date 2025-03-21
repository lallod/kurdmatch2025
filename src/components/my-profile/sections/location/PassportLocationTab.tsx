
import React, { useState } from 'react';
import { Globe, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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

  const handleSelectLocation = (result: any) => {
    onLocationSelect(result);
    
    // Add to recent searches if not already there
    if (!recentSearches.some(item => item.place_id === result.place_id)) {
      setRecentSearches(prev => [result, ...prev].slice(0, 5));
    }
    
    toast({
      title: "Location updated",
      description: `Your passport location is now set to ${formatLocationResult(result)}`
    });
  };

  // Format the display text for a location search result
  const formatLocationResult = (result: any) => {
    const address = result.address || {};
    
    // Try to extract the most relevant location information
    const city = address.city || address.town || address.village || '';
    const state = address.state || address.county || address.region || '';
    const country = address.country || '';
    
    // Create a well-formatted location string
    if (city && state && country) {
      return `${city}, ${state}, ${country}`;
    } else if (city && (state || country)) {
      return `${city}, ${state || country}`;
    } else if (state && country) {
      return `${state}, ${country}`;
    } else if (country) {
      return country;
    } else {
      // Fallback to display name
      return result.display_name.split(',').slice(0, 3).join(',');
    }
  };

  return (
    <div className="space-y-4">
      <LocationInfoBanner 
        icon={<Globe />}
        title="Travel Mode"
        description="Set your location anywhere in the world to match with people from different cities or countries."
        bgColor="bg-amber-50"
        borderColor="border border-amber-200"
        textColor="text-amber-700"
        iconColor="text-amber-500"
      />
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Explore Location</label>
        
        <LocationSearch 
          onLocationSelect={handleSelectLocation}
          buttonLabel={search => search || "Search any city in the world..."}
          searchPlaceholder="Search any city in the world..."
          emptyMessage="No locations found"
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
