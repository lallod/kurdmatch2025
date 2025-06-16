
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Search } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface LocationOption {
  id: string;
  name: string;
  country: string;
  display: string;
}

interface LocationSearchProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  value = '',
  onChange,
  placeholder = "Search for a city..."
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(value);

  // Sample location data - in a real app, this would come from an API
  const locations: LocationOption[] = [
    // Kurdish cities
    { id: '1', name: 'Erbil', country: 'Kurdistan', display: 'Erbil, Kurdistan' },
    { id: '2', name: 'Sulaymaniyah', country: 'Kurdistan', display: 'Sulaymaniyah, Kurdistan' },
    { id: '3', name: 'Duhok', country: 'Kurdistan', display: 'Duhok, Kurdistan' },
    { id: '4', name: 'Kirkuk', country: 'Kurdistan', display: 'Kirkuk, Kurdistan' },
    { id: '5', name: 'Halabja', country: 'Kurdistan', display: 'Halabja, Kurdistan' },
    { id: '6', name: 'Qamishli', country: 'Kurdistan', display: 'Qamishli, Kurdistan' },
    { id: '7', name: 'Kobani', country: 'Kurdistan', display: 'Kobani, Kurdistan' },
    { id: '8', name: 'Diyarbakir', country: 'Kurdistan', display: 'Diyarbakir, Kurdistan' },
    { id: '9', name: 'Sanandaj', country: 'Kurdistan', display: 'Sanandaj, Kurdistan' },
    { id: '10', name: 'Mahabad', country: 'Kurdistan', display: 'Mahabad, Kurdistan' },
    
    // Major world cities
    { id: '11', name: 'London', country: 'United Kingdom', display: 'London, United Kingdom' },
    { id: '12', name: 'Paris', country: 'France', display: 'Paris, France' },
    { id: '13', name: 'Berlin', country: 'Germany', display: 'Berlin, Germany' },
    { id: '14', name: 'Stockholm', country: 'Sweden', display: 'Stockholm, Sweden' },
    { id: '15', name: 'Amsterdam', country: 'Netherlands', display: 'Amsterdam, Netherlands' },
    { id: '16', name: 'New York', country: 'United States', display: 'New York, United States' },
    { id: '17', name: 'Toronto', country: 'Canada', display: 'Toronto, Canada' },
    { id: '18', name: 'Sydney', country: 'Australia', display: 'Sydney, Australia' },
    { id: '19', name: 'Dubai', country: 'UAE', display: 'Dubai, UAE' },
    { id: '20', name: 'Istanbul', country: 'Turkey', display: 'Istanbul, Turkey' },
    { id: '21', name: 'Baghdad', country: 'Iraq', display: 'Baghdad, Iraq' },
    { id: '22', name: 'Tehran', country: 'Iran', display: 'Tehran, Iran' },
    { id: '23', name: 'Ankara', country: 'Turkey', display: 'Ankara, Turkey' },
    { id: '24', name: 'Damascus', country: 'Syria', display: 'Damascus, Syria' },
    { id: '25', name: 'Vienna', country: 'Austria', display: 'Vienna, Austria' },
    { id: '26', name: 'Oslo', country: 'Norway', display: 'Oslo, Norway' },
    { id: '27', name: 'Copenhagen', country: 'Denmark', display: 'Copenhagen, Denmark' },
    { id: '28', name: 'Helsinki', country: 'Finland', display: 'Helsinki, Finland' }
  ];

  const filteredLocations = locations.filter(location =>
    location.display.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSelect = (location: LocationOption) => {
    setSearchValue(location.display);
    onChange(location.display);
    setOpen(false);
  };

  return (
    <div className="space-y-3">
      <Label className="text-lg font-medium">Dream Vacation Destination</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between text-lg p-4 rounded-xl h-auto"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-600" />
              <span className={searchValue ? "text-gray-900" : "text-gray-500"}>
                {searchValue || placeholder}
              </span>
            </div>
            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search cities..."
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>No cities found.</CommandEmpty>
              <CommandGroup>
                {filteredLocations.slice(0, 10).map((location) => (
                  <CommandItem
                    key={location.id}
                    value={location.display}
                    onSelect={() => handleSelect(location)}
                    className="flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4 text-purple-600" />
                    <span>{location.name}</span>
                    <span className="text-sm text-gray-500">{location.country}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <p className="text-sm text-gray-500">Choose a destination you've always wanted to visit</p>
    </div>
  );
};
