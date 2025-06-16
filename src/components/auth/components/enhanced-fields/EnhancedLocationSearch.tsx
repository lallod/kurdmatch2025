
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { MapPin, ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedLocationSearchProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
}

// Kurdistan cities and top global tourism destinations
const destinations = [
  { 
    category: 'Iraqi Kurdistan', 
    locations: [
      'Erbil', 'Sulaymaniyah', 'Dohuk', 'Zakho', 'Akre', 'Amedi', 'Bardarash', 
      'Chamchamal', 'Choman', 'Dahuk', 'Halabja', 'Kalar', 'Koya', 'Mergasor',
      'Penjwin', 'Qandil', 'Rawanduz', 'Ranya', 'Shaqlawa', 'Sharbazher', 'Soran'
    ]
  },
  { 
    category: 'Turkish Kurdistan', 
    locations: [
      'Diyarbakır', 'Van', 'Şırnak', 'Hakkari', 'Mardin', 'Batman', 'Siirt', 
      'Muş', 'Bitlis', 'Ağrı', 'Iğdır', 'Kars', 'Ardahan', 'Bingöl', 'Elazığ',
      'Tunceli', 'Malatya', 'Adıyaman', 'Gaziantep', 'Şanlıurfa', 'Cizre', 'Nusaybin'
    ]
  },
  { 
    category: 'Syrian Kurdistan', 
    locations: [
      'Qamishli', 'Kobani', 'Afrin', 'Hasakah', 'Amuda', 'Derik', 'Malikiya',
      'Ras al-Ayn', 'Tell Tamer', 'Tirbespiye', 'Rmelan', 'Qahtaniyah'
    ]
  },
  { 
    category: 'Iranian Kurdistan', 
    locations: [
      'Sanandaj', 'Mahabad', 'Urmia', 'Piranshahr', 'Sardasht', 'Bukan', 
      'Saqqez', 'Baneh', 'Marivan', 'Kamyaran', 'Divandarreh', 'Bijar',
      'Kermanshah', 'Ilam', 'Paveh', 'Javanrud', 'Sarpol-e Zahab'
    ]
  },
  { 
    category: 'Top Global Destinations', 
    locations: [
      'Paris', 'London', 'New York', 'Tokyo', 'Dubai', 'Istanbul', 'Barcelona', 
      'Rome', 'Amsterdam', 'Berlin', 'Vienna', 'Prague', 'Budapest', 'Stockholm',
      'Copenhagen', 'Oslo', 'Helsinki', 'Zurich', 'Geneva', 'Munich', 'Frankfurt',
      'Madrid', 'Lisbon', 'Athens', 'Venice', 'Florence', 'Milan', 'Naples',
      'Santorini', 'Mykonos', 'Dubrovnik', 'Split', 'Zagreb', 'Ljubljana',
      'Krakow', 'Warsaw', 'Bucharest', 'Sofia', 'Belgrade', 'Sarajevo',
      'Bali', 'Bangkok', 'Singapore', 'Hong Kong', 'Seoul', 'Kyoto', 'Osaka',
      'Sydney', 'Melbourne', 'Auckland', 'Vancouver', 'Toronto', 'Montreal',
      'Los Angeles', 'San Francisco', 'Las Vegas', 'Miami', 'Chicago', 'Boston',
      'Washington DC', 'Mexico City', 'Buenos Aires', 'Rio de Janeiro', 'São Paulo',
      'Lima', 'Cusco', 'Bogotá', 'Cartagena', 'Santiago', 'Cairo', 'Marrakech',
      'Casablanca', 'Cape Town', 'Johannesburg', 'Nairobi', 'Addis Ababa',
      'Delhi', 'Mumbai', 'Goa', 'Jaipur', 'Agra', 'Kerala', 'Kathmandu',
      'Colombo', 'Maldives', 'Seychelles', 'Mauritius', 'Madagascar'
    ]
  }
];

const EnhancedLocationSearch = ({ 
  value, 
  onChange, 
  label = "Dream Vacation Destination" 
}: EnhancedLocationSearchProps) => {
  const [open, setOpen] = useState(false);

  // Ensure value is always a string
  const currentValue = value || '';

  // Safely flatten destinations array with defensive checks
  const allLocations = destinations && destinations.length > 0 
    ? destinations.flatMap(category => 
        category && category.locations && Array.isArray(category.locations)
          ? category.locations.map(location => ({ name: location, category: category.category }))
          : []
      )
    : [];

  const selectedLocation = allLocations.find(loc => loc && loc.name === currentValue);

  const handleSelect = (selectedValue: string) => {
    if (!onChange) return;
    onChange(selectedValue === currentValue ? "" : selectedValue);
    setOpen(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-purple-400" />
        <Label className="text-white">{label}</Label>
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20"
          >
            {selectedLocation ? selectedLocation.name : "Select destination..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-gray-900 border-gray-700">
          <Command>
            <CommandInput 
              placeholder="Search destinations..." 
              className="text-white"
            />
            <CommandEmpty>No destination found.</CommandEmpty>
            <div className="max-h-60 overflow-auto">
              {destinations && destinations.length > 0 && destinations.map((category) => (
                category && category.category && category.locations && Array.isArray(category.locations) ? (
                  <CommandGroup key={category.category} heading={category.category} className="text-white">
                    {category.locations.map((location) => (
                      <CommandItem
                        key={location}
                        value={location}
                        onSelect={() => handleSelect(location)}
                        className="text-white hover:bg-gray-800"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            currentValue === location ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {location}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ) : null
              ))}
            </div>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default EnhancedLocationSearch;
