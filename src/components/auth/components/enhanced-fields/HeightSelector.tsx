
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Ruler } from 'lucide-react';

interface HeightSelectorProps {
  value?: string;
  onChange: (value: string) => void;
}

const HeightSelector = ({ value, onChange }: HeightSelectorProps) => {
  // Generate height options in CM ONLY (145-210 cm range)
  const generateHeightOptions = () => {
    const options = [];
    for (let i = 145; i <= 210; i++) {
      options.push({ value: `${i} cm`, label: `${i} cm` });
    }
    return options;
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
