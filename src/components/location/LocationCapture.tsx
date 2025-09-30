import React, { useState, useEffect } from 'react';
import { MapPin, Loader2, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Coordinates, KURDISH_CITIES } from '@/types/location';
import {
  getCurrentLocation,
  getLocationFromIP,
  reverseGeocode,
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
  const { toast } = useToast();

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

  const handleCitySelect = async (cityName: string) => {
    const city = KURDISH_CITIES.find(c => c.name === cityName);
    if (!city) return;
    
    const coords = {
      latitude: city.latitude,
      longitude: city.longitude,
    };
    
    setCoordinates(coords);
    const displayName = `${city.name}, ${city.country}`;
    setLocationName(displayName);
    onLocationCapture(coords, displayName);
    
    toast({
      title: 'Location set',
      description: displayName,
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
              Or select a city
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="city-select">Select your city</Label>
          <Select onValueChange={handleCitySelect}>
            <SelectTrigger id="city-select">
              <SelectValue placeholder="Choose a city..." />
            </SelectTrigger>
            <SelectContent>
              {KURDISH_CITIES.map((city) => (
                <SelectItem key={city.name} value={city.name}>
                  {city.name}, {city.country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
