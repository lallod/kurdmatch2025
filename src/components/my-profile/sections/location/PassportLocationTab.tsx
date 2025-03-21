
import React, { useState } from 'react';
import { Globe, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

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
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);
  const { toast } = useToast();

  // Function to search locations using Mapbox API
  const searchLocation = async (query: string) => {
    if (!query || query.length < 2 || !apiKey) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    
    try {
      // Use Mapbox Geocoding API for better results
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${apiKey}&types=place,region,country&limit=10`
      );
      
      if (!response.ok) {
        throw new Error('Failed to search locations');
      }
      
      const data = await response.json();
      
      // Format the results to match our expected structure
      const formattedResults = data.features.map((feature: any) => {
        // Extract place parts (city, state, country)
        const placeParts = feature.place_name.split(', ');
        const city = feature.place_type.includes('place') ? feature.text : '';
        const country = placeParts[placeParts.length - 1];
        const state = placeParts.length > 2 ? placeParts[placeParts.length - 2] : '';
        
        return {
          place_id: feature.id,
          display_name: feature.place_name,
          address: {
            city,
            state,
            country
          },
          lat: feature.center[1],
          lon: feature.center[0]
        };
      });
      
      setSearchResults(formattedResults);
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
    const address = result.address || {};
    
    // Try to extract the most relevant location information
    const city = address.city || '';
    const state = address.state || '';
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
      return result.display_name;
    }
  };

  const handleSelectLocation = (result: any) => {
    onLocationSelect(result);
    setOpen(false);
    
    // Add to recent searches if not already there
    if (!recentSearches.some(item => item.place_id === result.place_id)) {
      setRecentSearches(prev => [result, ...prev].slice(0, 5));
    }
    
    toast({
      title: "Location updated",
      description: `Your passport location is now set to ${formatLocationResult(result)}`
    });
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearch(value);
    searchLocation(value);
  };

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 p-2 rounded-md border border-amber-200 mb-3">
        <div className="flex items-start gap-2">
          <Globe size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800">Travel Mode</p>
            <p className="text-xs text-amber-700">
              Set your location anywhere in the world to match with people from different cities or countries.
            </p>
          </div>
        </div>
      </div>

      {showApiKeyInput && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm font-medium text-yellow-800 mb-2">Mapbox API Key Required</p>
          <p className="text-xs text-yellow-700 mb-3">
            To use the global location search, please enter your Mapbox public token. 
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
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Explore Location</label>
        
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-between h-10 px-3 gap-1"
            >
              <div className="flex items-center gap-2">
                <Globe size={14} className="text-muted-foreground" />
                <span className="truncate">{search || "Search any city in the world..."}</span>
              </div>
              <Search size={14} className="text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[300px]" align="start">
            <Command>
              <CommandInput 
                placeholder="Search any city in the world..." 
                value={search}
                onValueChange={handleSearchChange}
                className="h-9"
              />
              <CommandList>
                {isLoading ? (
                  <div className="py-6 text-center">
                    <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent mb-2" />
                    <p className="text-sm text-muted-foreground">Searching locations...</p>
                  </div>
                ) : (
                  <>
                    <CommandEmpty>No locations found</CommandEmpty>
                    
                    {searchResults.length > 0 && (
                      <CommandGroup heading="Search Results">
                        {searchResults.map((result) => (
                          <CommandItem
                            key={result.place_id}
                            value={result.display_name}
                            onSelect={() => handleSelectLocation(result)}
                          >
                            <Globe className="mr-2 h-4 w-4" />
                            <span className="truncate">{formatLocationResult(result)}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                    
                    {recentSearches.length > 0 && searchResults.length === 0 && !search && (
                      <CommandGroup heading="Recent Searches">
                        {recentSearches.map((result) => (
                          <CommandItem
                            key={result.place_id}
                            value={result.display_name}
                            onSelect={() => handleSelectLocation(result)}
                          >
                            <Globe className="mr-2 h-4 w-4" />
                            <span className="truncate">{formatLocationResult(result)}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="p-3 bg-muted rounded-md flex items-center">
        <Globe size={16} className="mr-2 text-primary" />
        {passportLocation || location || "No passport location set"}
      </div>
      
      {passportLocation && (
        <Badge variant="outline" className="gap-1 px-2 py-1">
          <Globe size={12} />
          {passportLocation}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-4 w-4 p-0 ml-1" 
            onClick={() => {
              onLocationSelect({ display_name: "" });
              toast({
                title: "Passport location removed",
                description: "Your passport location has been reset."
              });
            }}
          >
            <X size={10} />
            <span className="sr-only">Remove</span>
          </Button>
        </Badge>
      )}
      
      <p className="text-xs text-muted-foreground mt-1">
        Virtual location for exploring matches in other cities worldwide.
      </p>
    </div>
  );
};

export default PassportLocationTab;
