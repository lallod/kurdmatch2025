import React, { useState, useEffect } from 'react';
import { MapPin, Loader2, Navigation, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Coordinates, LocationResult } from '@/types/location';
import {
  getCurrentLocation,
  getLocationFromIP,
  reverseGeocode,
  searchLocations,
} from '@/utils/locationUtils';

interface LocationCaptureProps {
  onLocationCapture: (coords: Coordinates, locationName: string) => void;
  initialLocation?: string;
}

const LocationCapture: React.FC<LocationCaptureProps> = ({
  onLocationCapture,
  initialLocation,
}) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [locationName, setLocationName] = useState<string>(initialLocation || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  // Debounced search
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      const results = await searchLocations(searchQuery);
      setSearchResults(results);
      setShowResults(true);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleUseCurrentLocation = async () => {
    setIsDetecting(true);
    
    try {
      // Try browser geolocation first
      const coords = await getCurrentLocation();
      setCoordinates(coords);
      
      // Get location name
      const location = await reverseGeocode(coords.latitude, coords.longitude);
      setLocationName(location.display_name);
      onLocationCapture(coords, location.display_name);
      
      toast({
        title: 'Location detected',
        description: `Your location: ${location.display_name}`,
      });
    } catch (error) {
      // Fallback to IP-based location
      try {
        const coords = await getLocationFromIP();
        setCoordinates(coords);
        
        const location = await reverseGeocode(coords.latitude, coords.longitude);
        setLocationName(location.display_name);
        onLocationCapture(coords, location.display_name);
        
        toast({
          title: 'Location detected (approximate)',
          description: `Based on your IP: ${location.display_name}`,
        });
      } catch (ipError) {
        toast({
          title: 'Location detection failed',
          description: 'Please select a city from the list',
          variant: 'destructive',
        });
      }
    } finally {
      setIsDetecting(false);
    }
  };

  const handleLocationSelect = (location: LocationResult) => {
    const coords = {
      latitude: location.latitude,
      longitude: location.longitude,
    };
    
    setCoordinates(coords);
    setLocationName(location.display_name);
    setSearchQuery(location.display_name);
    setShowResults(false);
    onLocationCapture(coords, location.display_name);
    
    toast({
      title: 'Location set',
      description: location.display_name,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Your Location</h2>
        <p className="text-muted-foreground">
          Help us find matches near you
        </p>
      </div>

      <div className="space-y-4">
        <Button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isDetecting}
          className="w-full"
          size="lg"
        >
          {isDetecting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Detecting location...
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4 mr-2" />
              Use My Current Location
            </>
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or search for your city
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="city-search">Search for any city worldwide</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              id="city-search"
              type="text"
              placeholder="Type city name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
              className="pl-9"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
            )}
          </div>
          
          {showResults && searchResults.length > 0 && (
            <div className="absolute z-50 w-full max-w-md mt-1 bg-background border rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((location, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleLocationSelect(location)}
                  className="w-full px-4 py-2 text-left hover:bg-accent transition-colors flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm">{location.display_name}</span>
                </button>
              ))}
            </div>
          )}
          
          {searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
            <p className="text-sm text-muted-foreground">No locations found. Try a different search.</p>
          )}
        </div>

        {locationName && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-medium">Selected location:</span>
              <span className="text-muted-foreground">{locationName}</span>
            </div>
            {coordinates && (
              <div className="mt-2 text-xs text-muted-foreground">
                Coordinates: {coordinates.latitude.toFixed(4)}, {coordinates.longitude.toFixed(4)}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground text-center">
        Your location is used to find matches near you. You can change this anytime in settings.
      </div>
    </div>
  );
};

export default LocationCapture;
