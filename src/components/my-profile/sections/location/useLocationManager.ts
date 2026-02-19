
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from '@/hooks/useTranslations';
import { updateTravelMode } from '@/api/profiles';
import { supabase } from '@/integrations/supabase/client';

export const useLocationManager = (initialLocation: string) => {
  const [location, setLocation] = useState(initialLocation);
  const [isUsingCurrentLocation, setIsUsingCurrentLocation] = useState(true);
  const [locationMode, setLocationMode] = useState<'current' | 'manual' | 'passport'>('current');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslations();
  const [activeTab, setActiveTab] = useState('current');
  const [passportLocation, setPassportLocation] = useState("");

  // Load travel mode from database on mount (only for authenticated users)
  useEffect(() => {
    const loadTravelMode = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsUsingCurrentLocation(false);
        return;
      }
      const { data } = await supabase
        .from('profiles')
        .select('travel_location, travel_mode_active')
        .eq('id', user.id)
        .single();
      if (data?.travel_mode_active && data?.travel_location) {
        setPassportLocation(data.travel_location);
        setLocation(data.travel_location);
        setLocationMode('passport');
        setActiveTab('passport');
        setIsUsingCurrentLocation(false);
      }
    };
    loadTravelMode();
  }, []);

  const handleLocationDetection = () => {
    if (!navigator.geolocation) {
      toast({
        title: t('location.geolocation_not_supported', 'Geolocation not supported'),
        description: t('location.browser_no_geolocation', "Your browser doesn't support geolocation services."),
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { 
              headers: { 
                'Accept-Language': 'en',
                'User-Agent': 'KurdMatch App'
              } 
            }
          );
          
          if (!response.ok) {
            throw new Error('Failed to get location information');
          }
          
          const data = await response.json();
          
          const address = data.address || {};
          const city = address.city || address.town || address.village || '';
          const state = address.state || address.county || '';
          const country = address.country || '';
          
          let formattedLocation = '';
          if (city && state && country) {
            formattedLocation = `${city}, ${state}, ${country}`;
          } else if (city && (state || country)) {
            formattedLocation = `${city}, ${state || country}`;
          } else if (state && country) {
            formattedLocation = `${state}, ${country}`;
          } else {
            formattedLocation = data.display_name.split(',').slice(0, 3).join(',');
          }
          
          setLocation(formattedLocation);
          setIsLoading(false);
          
          toast({
            title: t('location.location_updated', 'Location updated'),
            description: t('location.current_location_set', 'Your current location has been set.')
          });
        } catch (error) {
          console.error("Error getting location:", error);
          setIsLoading(false);
          toast({
            title: t('location.location_error', 'Location error'),
            description: t('location.could_not_determine', 'Could not determine your location. Please try again.'),
            variant: "destructive"
          });
        }
      },
      (error) => {
        setIsLoading(false);
        let errorMessage = t('location.could_not_determine', 'Could not determine your location.');
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = t('location.permission_denied', 'Location permission denied. Please enable location services in your browser settings.');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = t('location.position_unavailable', 'Location information is unavailable.');
            break;
          case error.TIMEOUT:
            errorMessage = t('location.request_timeout', 'Location request timed out.');
            break;
        }
        
        toast({
          title: t('location.location_error', 'Location error'),
          description: errorMessage,
          variant: "destructive"
        });
      },
      { 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
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

  const handleManualLocationSelect = (selectedLocation: any) => {
    const formattedLocation = formatLocationResult(selectedLocation);
    setLocation(formattedLocation);
    setLocationMode('manual');
    setIsUsingCurrentLocation(false);
    
    toast({
      title: t('location.location_updated', 'Location updated'),
      description: t('location.manually_set_to', 'Your location has been manually set to {{location}}', { location: formattedLocation })
    });
  };

  const handlePassportLocationSelect = async (selectedLocation: any) => {
    const formattedLocation = formatLocationResult(selectedLocation);
    setPassportLocation(formattedLocation);
    setLocation(formattedLocation);
    setLocationMode('passport');
    setIsUsingCurrentLocation(false);

    try {
      const isClearing = !formattedLocation;
      await updateTravelMode(isClearing ? null : formattedLocation, !isClearing);
    } catch (error) {
      console.error('Failed to save travel mode:', error);
    }
    
    toast({
      title: formattedLocation 
        ? t('location.passport_location_set', 'Passport location set') 
        : t('location.passport_location_cleared', 'Passport location cleared'),
      description: formattedLocation 
        ? t('location.browsing_from', "You're now browsing from {{location}}", { location: formattedLocation }) 
        : t('location.travel_mode_deactivated', 'Travel mode deactivated'),
      variant: "default"
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    if (value === 'current') {
      setLocationMode('current');
      setIsUsingCurrentLocation(true);
      handleLocationDetection();
      updateTravelMode(null, false).catch(console.error);
    } else if (value === 'manual') {
      setLocationMode('manual');
      setIsUsingCurrentLocation(false);
      updateTravelMode(null, false).catch(console.error);
    } else if (value === 'passport') {
      setLocationMode('passport');
      setIsUsingCurrentLocation(false);
      
      if (passportLocation) {
        setLocation(passportLocation);
      }
    }
  };

  return {
    location,
    activeTab,
    isLoading,
    passportLocation,
    handleLocationDetection,
    handleManualLocationSelect,
    handlePassportLocationSelect,
    handleTabChange
  };
};
