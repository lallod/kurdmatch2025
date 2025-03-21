
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import LocationSearch from './LocationSearch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ManualLocationTabProps {
  location: string;
  onLocationSelect: (location: any) => void;
}

const ManualLocationTab: React.FC<ManualLocationTabProps> = ({
  location,
  onLocationSelect
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const marker = useRef<any>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);

  // Initialize the map when the API key is provided
  useEffect(() => {
    if (!apiKey || !mapContainerRef.current || mapInitialized) return;
    
    const initializeMap = async () => {
      try {
        // Import mapboxgl dynamically
        const mapboxgl = (await import('mapbox-gl')).default;
        await import('mapbox-gl/dist/mapbox-gl.css');
        
        // Set access token
        mapboxgl.accessToken = apiKey;
        
        // Create new map
        map.current = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [0, 20], // Default to center of the world
          zoom: 1.5
        });
        
        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        // Add event listener for map clicks
        map.current.on('click', (e: any) => {
          const { lng, lat } = e.lngLat;
          
          // Update marker position
          if (marker.current) marker.current.remove();
          
          marker.current = new mapboxgl.Marker({ color: '#FF0000' })
            .setLngLat([lng, lat])
            .addTo(map.current);
          
          // Reverse geocode to get location info
          reverseGeocode(lng, lat);
        });
        
        setMapInitialized(true);
        setShowApiKeyInput(false);
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };
    
    initializeMap();
  }, [apiKey, mapInitialized]);

  // Reverse geocode coordinates to get location name
  const reverseGeocode = async (lng: number, lat: number) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${apiKey}&types=place,region,country`
      );
      
      if (!response.ok) throw new Error('Geocoding failed');
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const locationData = {
          display_name: data.features[0].place_name,
          address: {
            city: data.features.find((f: any) => f.place_type.includes('place'))?.text,
            state: data.features.find((f: any) => f.place_type.includes('region'))?.text,
            country: data.features.find((f: any) => f.place_type.includes('country'))?.text,
          },
          lat,
          lon: lng
        };
        
        onLocationSelect(locationData);
      }
    } catch (error) {
      console.error("Error during reverse geocoding:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-2 rounded-md border border-blue-200 mb-3">
        <div className="flex items-start gap-2">
          <MapPin size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-800">Manual Location</p>
            <p className="text-xs text-blue-700">
              Choose your location by clicking on the map or searching for a city.
            </p>
          </div>
        </div>
      </div>
      
      {showApiKeyInput && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm font-medium text-yellow-800 mb-2">Mapbox API Key Required</p>
          <p className="text-xs text-yellow-700 mb-3">
            To use the map feature, please enter your Mapbox public token. 
            You can get one from <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="underline">mapbox.com</a>.
          </p>
          <div className="flex gap-2">
            <Input 
              type="text" 
              placeholder="Enter Mapbox public token" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="h-8 text-xs"
            />
            <Button 
              size="sm" 
              onClick={() => apiKey && setShowApiKeyInput(false)}
              className="h-8"
            >
              Apply
            </Button>
          </div>
        </div>
      )}
      
      {/* Map container */}
      <div 
        ref={mapContainerRef} 
        className={`w-full h-[300px] rounded-md border border-input ${!mapInitialized ? 'bg-muted flex items-center justify-center' : ''}`}
      >
        {!mapInitialized && !showApiKeyInput && (
          <p className="text-muted-foreground text-sm">Loading map...</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Search Location</label>
        <LocationSearch 
          onLocationSelect={(selected) => {
            onLocationSelect(selected);
            
            // If map is initialized, update the marker and center the map
            if (mapInitialized && map.current) {
              const lon = parseFloat(selected.lon);
              const lat = parseFloat(selected.lat);
              
              // Center map on selected location
              map.current.flyTo({
                center: [lon, lat],
                zoom: 10
              });
              
              // Update marker
              if (marker.current) marker.current.remove();
              
              const mapboxgl = require('mapbox-gl');
              marker.current = new mapboxgl.Marker({ color: '#FF0000' })
                .setLngLat([lon, lat])
                .addTo(map.current);
            }
          }}
          buttonLabel="Search City"
          searchPlaceholder="Search for a city or country..."
          emptyMessage="No locations found. Try a different search."
          icon={<Search />}
          width="300px"
        />
      </div>
      
      <div className="p-3 bg-muted rounded-md flex items-center">
        <MapPin size={16} className="mr-2 text-primary" />
        {location || "No location set"}
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Click on the map or search to set your location.
      </p>
    </div>
  );
};

export default ManualLocationTab;
