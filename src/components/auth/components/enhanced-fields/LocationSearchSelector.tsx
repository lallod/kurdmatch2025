import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { locations } from '@/utils/profileGenerator/data/locations';
import { useTranslations } from '@/hooks/useTranslations';

interface LocationSearchSelectorProps {
  value?: string;
  onChange: (value: string) => void;
}

const LocationSearchSelector = ({ value, onChange }: LocationSearchSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslations();

  const filteredLocations = locations.filter(location =>
    location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0" />
        <Label className="text-white">{t('search.location', 'Location')}</Label>
      </div>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20"
          >
            {value || t('location.search_placeholder', 'Search for your city...')}
            <MapPin className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-background/95 border-border backdrop-blur" align="start">
          <Command className="bg-transparent">
            <CommandInput 
              placeholder={t('location.search_city', 'Search city...')} 
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="text-foreground"
            />
            <CommandList>
              <CommandEmpty className="text-muted-foreground py-6 text-center">{t('location.not_found', 'No location found.')}</CommandEmpty>
              <CommandGroup>
                {filteredLocations.map((location) => (
                  <CommandItem
                    key={location}
                    value={location}
                    onSelect={() => {
                      onChange(location);
                      setOpen(false);
                    }}
                    className="text-foreground hover:bg-accent cursor-pointer"
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