
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useLocationManager = (initialLocation: string) => {
  const [location, setLocation] = useState(initialLocation);
  const [isUsingCurrentLocation, setIsUsingCurrentLocation] = useState(true);
  const [locationMode, setLocationMode] = useState<'current' | 'manual' | 'passport'>('current');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('current');
  const [passportLocation, setPassportLocation] = useState("");

  // Function to handle real geolocation detection
  const handleLocationDetection = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation services.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Use OpenStreetMap Nominatim API for geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { 
              headers: { 
                'Accept-Language': 'en',
                'User-Agent': 'KurdMatch App' // Identify the app to the API service
              } 
            }
          );
          
          if (!response.ok) {
            throw new Error('Failed to get location information');
          }
          
          const data = await response.json();
          
          // Use a more concise format if available
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
            // Fallback to display name if structured data is incomplete
            formattedLocation = data.display_name.split(',').slice(0, 3).join(',');
          }
          
          setLocation(formattedLocation);
          setIsLoading(false);
          
          toast({
            title: "Location updated",
            description: "Your current location has been set."
          });
        } catch (error) {
          console.error("Error getting location:", error);
          setIsLoading(false);
          toast({
            title: "Location error",
            description: "Could not determine your location. Please try again.",
            variant: "destructive"
          });
        }
      },
      (error) => {
        setIsLoading(false);
        let errorMessage = "Could not determine your location.";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please enable location services in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        
        toast({
          title: "Location error",
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

  // Format the display text for a location search result
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
      title: "Location updated",
      description: "Your location has been manually set to " + formattedLocation
    });
  };

  const handlePassportLocationSelect = (selectedLocation: any) => {
    const formattedLocation = formatLocationResult(selectedLocation);
    setPassportLocation(formattedLocation);
    setLocation(formattedLocation); // Also update the main location
    setLocationMode('passport');
    setIsUsingCurrentLocation(false);
    
    toast({
      title: "Passport location set",
      description: "You're now browsing from " + formattedLocation,
      variant: "default"
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    if (value === 'current') {
      setLocationMode('current');
      setIsUsingCurrentLocation(true);
      handleLocationDetection();
    } else if (value === 'manual') {
      setLocationMode('manual');
      setIsUsingCurrentLocation(false);
    } else if (value === 'passport') {
      setLocationMode('passport');
      setIsUsingCurrentLocation(false);
      
      if (passportLocation) {
        setLocation(passportLocation);
      }
    }
  };

  // Try to get location on initial load if using current location
  useEffect(() => {
    if (isUsingCurrentLocation) {
      handleLocationDetection();
    }
  }, []);

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
