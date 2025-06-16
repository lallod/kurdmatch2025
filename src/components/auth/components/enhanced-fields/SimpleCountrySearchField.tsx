
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface SimpleCountrySearchFieldProps {
  value?: string;
  onChange: (value: string) => void;
}

const countries = [
  { name: 'Afghanistan', code: 'AF' },
  { name: 'Albania', code: 'AL' },
  { name: 'Algeria', code: 'DZ' },
  { name: 'Argentina', code: 'AR' },
  { name: 'Armenia', code: 'AM' },
  { name: 'Australia', code: 'AU' },
  { name: 'Austria', code: 'AT' },
  { name: 'Azerbaijan', code: 'AZ' },
  { name: 'Bahrain', code: 'BH' },
  { name: 'Bangladesh', code: 'BD' },
  { name: 'Belgium', code: 'BE' },
  { name: 'Brazil', code: 'BR' },
  { name: 'Canada', code: 'CA' },
  { name: 'China', code: 'CN' },
  { name: 'Denmark', code: 'DK' },
  { name: 'Egypt', code: 'EG' },
  { name: 'France', code: 'FR' },
  { name: 'Germany', code: 'DE' },
  { name: 'India', code: 'IN' },
  { name: 'Iran', code: 'IR' },
  { name: 'Iraq', code: 'IQ' },
  { name: 'Ireland', code: 'IE' },
  { name: 'Israel', code: 'IL' },
  { name: 'Italy', code: 'IT' },
  { name: 'Japan', code: 'JP' },
  { name: 'Jordan', code: 'JO' },
  { name: 'Kurdistan', code: 'KU' },
  { name: 'Kuwait', code: 'KW' },
  { name: 'Lebanon', code: 'LB' },
  { name: 'Netherlands', code: 'NL' },
  { name: 'Norway', code: 'NO' },
  { name: 'Pakistan', code: 'PK' },
  { name: 'Palestine', code: 'PS' },
  { name: 'Qatar', code: 'QA' },
  { name: 'Saudi Arabia', code: 'SA' },
  { name: 'Spain', code: 'ES' },
  { name: 'Sweden', code: 'SE' },
  { name: 'Switzerland', code: 'CH' },
  { name: 'Syria', code: 'SY' },
  { name: 'Turkey', code: 'TR' },
  { name: 'United Arab Emirates', code: 'AE' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'United States', code: 'US' },
];

const SimpleCountrySearchField = ({ value = '', onChange }: SimpleCountrySearchFieldProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const currentValue = value || '';
  const selectedCountry = countries.find(country => country.name === currentValue);

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
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
        <Globe className="w-5 h-5 text-purple-600" />
        <Label className="text-white">Born In</Label>
      </div>
      
      <div className="relative">
        <Button
          variant="outline"
          className="w-full justify-between bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20"
          onClick={() => setOpen(!open)}
        >
          <span className={selectedCountry ? "text-white" : "text-purple-300"}>
            {selectedCountry ? selectedCountry.name : "Select country..."}
          </span>
          <ChevronDown className={`ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform ${open ? 'rotate-180' : ''}`} />
        </Button>
        
        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50 max-h-60 overflow-hidden">
            <div className="p-2 border-b border-gray-700">
              <input
                type="text"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filteredCountries.length === 0 ? (
                <div className="p-4 text-center text-gray-400">No country found.</div>
              ) : (
                filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    className="w-full px-4 py-2 text-left text-white hover:bg-gray-800 flex items-center justify-between"
                    onClick={() => handleSelect(country.name)}
                  >
                    <span className="text-white">{country.name}</span>
                    {currentValue === country.name && (
                      <Check className="h-4 w-4 text-purple-400" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleCountrySearchField;
