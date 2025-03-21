
import React, { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { SheetContent } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import DetailEditor from '@/components/DetailEditor';
import ProfileSectionButton from '../ProfileSectionButton';
import type { KurdistanRegion } from '@/types/profile';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface LocationSectionProps {
  profileData: {
    location: string;
    kurdistanRegion: KurdistanRegion;
  };
}

// Sample cities for demonstration - in a real app, this would come from an API
const cities = [
  "San Francisco, CA, USA",
  "New York, NY, USA",
  "Los Angeles, CA, USA",
  "Chicago, IL, USA",
  "Seattle, WA, USA",
  "Boston, MA, USA",
  "Austin, TX, USA",
  "Denver, CO, USA",
  "Portland, OR, USA",
  "Miami, FL, USA",
  "London, UK",
  "Paris, France",
  "Berlin, Germany",
  "Tokyo, Japan",
  "Sydney, Australia",
  "Toronto, Canada",
  "Vancouver, Canada",
  "Dubai, UAE",
  "Stockholm, Sweden",
  "Amsterdam, Netherlands"
];

const LocationSection: React.FC<LocationSectionProps> = ({ profileData }) => {
  const [location, setLocation] = useState(profileData.location);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  
  const filteredCities = cities.filter(city => 
    city.toLowerCase().includes(search.toLowerCase())
  );

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
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="location" className="text-sm font-medium">City & State</label>
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
                      <PopoverContent className="p-0" align="end" side="top">
                        <Command className="rounded-lg border shadow-md">
                          <CommandInput 
                            placeholder="Search for a city or country..." 
                            value={search}
                            onValueChange={setSearch}
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No location found.</CommandEmpty>
                            <CommandGroup heading="Locations">
                              {filteredCities.map((city) => (
                                <CommandItem
                                  key={city}
                                  value={city}
                                  onSelect={(currentValue) => {
                                    setLocation(currentValue);
                                    setOpen(false);
                                  }}
                                >
                                  <MapPin className="mr-2 h-4 w-4" />
                                  {city}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="p-3 bg-muted rounded-md">
                    {location}
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
