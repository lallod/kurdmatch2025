import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { locations } from '@/utils/profileGenerator/data/locations';

interface LocationSearchSelectorProps {
  value?: string;
  onChange: (value: string) => void;
}

const LocationSearchSelector = ({ value, onChange }: LocationSearchSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLocations = locations.filter(location =>
    location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-purple-400" />
        <Label className="text-white">Location</Label>
      </div>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20"
          >
            {value || "Search for your city..."}
            <MapPin className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-gray-900 border-gray-700" align="start">
          <Command className="bg-gray-900">
            <CommandInput 
              placeholder="Search city..." 
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="text-white"
            />
            <CommandList>
              <CommandEmpty className="text-white/60 py-6 text-center">No location found.</CommandEmpty>
              <CommandGroup>
                {filteredLocations.map((location) => (
                  <CommandItem
                    key={location}
                    value={location}
                    onSelect={() => {
                      onChange(location);
                      setOpen(false);
                    }}
                    className="text-white hover:bg-gray-800 cursor-pointer"
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    {location}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LocationSearchSelector;
