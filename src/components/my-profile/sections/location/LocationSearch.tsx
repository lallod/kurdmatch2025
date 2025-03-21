
import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface LocationSearchProps {
  onLocationSelect: (location: any) => void;
  buttonLabel: string;
  searchPlaceholder: string;
  emptyMessage: string;
  icon: React.ReactElement;
  width?: string;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  onLocationSelect,
  buttonLabel,
  searchPlaceholder,
  emptyMessage,
  icon,
  width,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const { toast } = useToast();

  // Function to search locations using Nominatim API with improved parameters
  const searchLocation = async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    
    try {
      // Use OpenStreetMap Nominatim API with improved parameters
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=10&featuretype=city&accept-language=en`,
        { 
          headers: { 
            'Accept-Language': 'en',
            'User-Agent': 'KurdMatch App' // Identify the app to the API service
          } 
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to search locations');
      }
      
      const data = await response.json();
      
      // Filter for results that are likely to be cities or significant places
      const filteredResults = data.filter((result: any) => {
        // Check if the result has a 'city', 'town', 'village', or 'state' property
        const address = result.address || {};
        return (
          address.city || 
          address.town || 
          address.village || 
          address.state ||
          address.country ||
          ["city", "town", "administrative", "place"].includes(result.type)
        );
      });
      
      setSearchResults(filteredResults);
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

  // Improved function to format the display text for a location search result
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
      // Fallback: create a shorter display name by taking first few parts
      return result.display_name.split(',').slice(0, 3).join(',');
    }
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearch(value);
    searchLocation(value);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 gap-1"
        >
          {React.cloneElement(icon, { size: 14 })}
          {buttonLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="end" side="top" style={{ width: width || "auto" }}>
        <Command className="rounded-lg border shadow-md">
          <CommandInput 
            placeholder={searchPlaceholder} 
            value={search}
            onValueChange={handleSearchChange}
            className="h-9"
          />
          <CommandList>
            {isLoading && (
              <div className="py-6 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground mt-2">Searching locations...</p>
              </div>
            )}
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup heading="Locations">
              {searchResults.map((result) => (
                <CommandItem
                  key={result.place_id}
                  value={result.display_name}
                  onSelect={() => {
                    onLocationSelect(result);
                    setOpen(false);
                  }}
                >
                  {React.cloneElement(icon, { className: "mr-2 h-4 w-4" })}
                  {formatLocationResult(result)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default LocationSearch;
