
import React, { useState, useEffect } from 'react';
import { MapPin, Search, Navigation, MapPinOff, Loader2 } from 'lucide-react';
import { SheetContent } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import DetailEditor from '@/components/DetailEditor';
import ProfileSectionButton from '../ProfileSectionButton';
import type { KurdistanRegion } from '@/types/profile';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface LocationSectionProps {
  profileData: {
    location: string;
    kurdistanRegion: KurdistanRegion;
  };
}

const LocationSection: React.FC<LocationSectionProps> = ({ profileData }) => {
  const [location, setLocation] = useState(profileData.location);
  const [isUsingCurrentLocation, setIsUsingCurrentLocation] = useState(true);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const { toast } = useToast();

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
          // Use OpenStreetMap Nominatim API for geocoding (free to use with appropriate attribution)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
          );
          
          if (!response.ok) {
            throw new Error('Failed to get location information');
          }
          
          const data = await response.json();
          const formattedAddress = data.display_name;
          
          // Use a more concise format if available
          const city = data.address.city || data.address.town || data.address.village || '';
          const state = data.address.state || '';
          const country = data.address.country || '';
          
          let formattedLocation = '';
          if (city && (state || country)) {
            formattedLocation = `${city}, ${state || country}`;
          } else {
            // Fallback to display name if structured data is incomplete
            formattedLocation = formattedAddress;
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

  // Function to search locations using Nominatim API
  const searchLocation = async (query: string) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    
    try {
      // Use OpenStreetMap Nominatim API for location search
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=7`,
        { headers: { 'Accept-Language': 'en' } }
      );
      
      if (!response.ok) {
        throw new Error('Failed to search locations');
      }
      
      const data = await response.json();
      setSearchResults(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error searching locations:", error);
      setIsLoading(false);
      setSearchResults([]);
      toast({
        title: "Search error",
        description: "Could not search for locations. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Format the display text for a location search result
  const formatLocationResult = (result: any) => {
    const address = result.address;
    
    if (!address) return result.display_name;
    
    const city = address.city || address.town || address.village || '';
    const state = address.state || '';
    const country = address.country || '';
    
    if (city && state && country) {
      return `${city}, ${state}, ${country}`;
    } else if (city && (state || country)) {
      return `${city}, ${state || country}`;
    } else if (state && country) {
      return `${state}, ${country}`;
    } else {
      return result.display_name.split(',').slice(0, 3).join(',');
    }
  };

  const handleManualLocationSelect = (selectedLocation: any) => {
    const formattedLocation = formatLocationResult(selectedLocation);
    setLocation(formattedLocation);
    setIsUsingCurrentLocation(false);
    setOpen(false);
  };

  const toggleLocationMode = (checked: boolean) => {
    setIsUsingCurrentLocation(checked);
    if (checked) {
      handleLocationDetection();
    }
  };

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      searchLocation(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Try to get location on initial load if using current location
  useEffect(() => {
    if (isUsingCurrentLocation) {
      handleLocationDetection();
    }
  }, []);

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
              
              <div className="space-y-4">
                {/* Current/Manual Location Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="use-current-location" className="text-sm">Use my current location</Label>
                    <Switch 
                      id="use-current-location" 
                      checked={isUsingCurrentLocation} 
                      onCheckedChange={toggleLocationMode}
                    />
                  </div>
                </div>
                
                {/* Location Display & Edit */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="location" className="text-sm font-medium">
                      {isUsingCurrentLocation ? "Current Location" : "City & Country"}
                    </label>
                    {!isUsingCurrentLocation && (
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-primary h-7 px-2"
                          >
                            Edit
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0" align="end" side="top" width="300px">
                          <Command className="rounded-lg border shadow-md">
                            <CommandInput 
                              placeholder="Search for a city or country..." 
                              value={search}
                              onValueChange={setSearch}
                              className="h-9"
                            />
                            <CommandList>
                              {isLoading && (
                                <div className="py-6 text-center">
                                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                  <p className="text-sm text-muted-foreground mt-2">Searching locations...</p>
                                </div>
                              )}
                              <CommandEmpty>No locations found. Try a different search.</CommandEmpty>
                              <CommandGroup heading="Locations">
                                {searchResults.map((result) => (
                                  <CommandItem
                                    key={result.place_id}
                                    value={result.display_name}
                                    onSelect={() => handleManualLocationSelect(result)}
                                  >
                                    <MapPin className="mr-2 h-4 w-4" />
                                    {formatLocationResult(result)}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    )}
                    {isUsingCurrentLocation && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-primary h-7 px-2"
                        onClick={handleLocationDetection}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 size={16} className="mr-1 animate-spin" />
                        ) : (
                          <Navigation size={16} className="mr-1" />
                        )}
                        {isLoading ? "Updating..." : "Update"}
                      </Button>
                    )}
                  </div>
                  <div className="p-3 bg-muted rounded-md flex items-center">
                    {isLoading ? (
                      <Loader2 size={16} className="mr-2 text-primary animate-spin" />
                    ) : isUsingCurrentLocation ? (
                      <Navigation size={16} className="mr-2 text-primary" />
                    ) : (
                      <MapPin size={16} className="mr-2 text-primary" />
                    )}
                    {isLoading ? "Detecting location..." : location}
                  </div>
                </div>
                
                <DetailEditor
                  icon={<MapPin size={18} />}
                  title="Kurdistan Region"
                  fields={[
                    { 
                      name: 'kurdistanRegion', 
                      label: 'Kurdistan Region', 
                      value: profileData.kurdistanRegion, 
                      type: 'select', 
                      options: ['West-Kurdistan', 'East-Kurdistan', 'North-Kurdistan', 'South-Kurdistan'] 
                    }
                  ]}
                />
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </ProfileSectionButton>
  );
};

export default LocationSection;
