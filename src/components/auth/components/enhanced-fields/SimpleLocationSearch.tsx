
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MapPin, ChevronDown, Check } from 'lucide-react';

interface SimpleLocationSearchProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

const locations = [
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

const SimpleLocationSearch = ({ 
  value = '', 
  onChange, 
  label = "Dream Vacation Destination",
  placeholder = "Where would you love to travel?"
}: SimpleLocationSearchProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const currentValue = value || '';
  const selectedLocation = locations.find(location => location.display === currentValue);

  const filteredLocations = locations.filter(location =>
    location.display.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (selectedValue: string) => {
    if (onChange) {
      onChange(selectedValue === currentValue ? "" : selectedValue);
    }
    setOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5 text-purple-600" />
        <Label className="text-lg font-medium">{label}</Label>
      </div>
      
      <div className="relative">
        <Button
          variant="outline"
          className="w-full justify-between text-lg p-4 rounded-xl h-auto"
          onClick={() => setOpen(!open)}
        >
          <span className={selectedLocation ? "text-gray-900" : "text-gray-500"}>
            {selectedLocation ? selectedLocation.display : placeholder}
          </span>
          <ChevronDown className={`ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform ${open ? 'rotate-180' : ''}`} />
        </Button>
        
        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-hidden">
            <div className="p-2 border-b border-gray-200">
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filteredLocations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No destinations found.</div>
              ) : (
                filteredLocations.map((location) => (
                  <button
                    key={location.id}
                    className="w-full px-4 py-2 text-left text-gray-900 hover:bg-gray-100 flex items-center justify-between"
                    onClick={() => handleSelect(location.display)}
                  >
                    <div>
                      <span className="font-medium">{location.name}</span>
                      <span className="text-sm text-gray-500 ml-2">{location.country}</span>
                    </div>
                    {currentValue === location.display && (
                      <Check className="h-4 w-4 text-purple-600" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      <p className="text-sm text-gray-500">Choose a destination you've always wanted to visit</p>
    </div>
  );
};

export default SimpleLocationSearch;
