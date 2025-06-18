
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Ruler } from 'lucide-react';

interface HeightSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  unit?: 'cm' | 'ft';
}

const HeightSelector = ({ value, onChange, unit = 'cm' }: HeightSelectorProps) => {
  // Generate height options based on unit
  const generateHeightOptions = () => {
    if (unit === 'cm') {
      const options = [];
      for (let i = 145; i <= 185; i++) {
        options.push({ value: `${i}`, label: `${i} cm` });
      }
      return options;
    } else {
      const options = [];
      for (let feet = 4; feet <= 6; feet++) {
        for (let inches = 0; inches < 12; inches++) {
          if (feet === 6 && inches > 1) break; // Max 6'1" (185cm)
          if (feet === 4 && inches < 9) continue; // Min 4'9" (145cm)
          const totalInches = feet * 12 + inches;
          const cm = Math.round(totalInches * 2.54);
          if (cm >= 145 && cm <= 185) {
            options.push({ 
              value: `${cm}`, 
              label: `${feet}'${inches}" (${cm} cm)` 
            });
          }
        }
      }
      return options;
    }
  };

  const heightOptions = generateHeightOptions();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Ruler className="w-4 h-4 text-purple-400" />
        <Label className="text-white">Height</Label>
      </div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-white/10 backdrop-blur border-white/20 text-white">
          <SelectValue placeholder="Select your height" />
        </SelectTrigger>
        <SelectContent className="bg-gray-900 border-gray-700 max-h-60">
          {heightOptions.map(option => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="text-white hover:bg-gray-800"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default HeightSelector;
