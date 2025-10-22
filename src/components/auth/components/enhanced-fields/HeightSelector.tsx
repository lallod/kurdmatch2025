
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
  const heightOptions = Array.from({ length: 66 }, (_, i) => {
    const cm = 145 + i;
    return { value: `${cm} cm`, label: `${cm} cm` };
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Ruler className="w-4 h-4 text-primary flex-shrink-0" />
        <Label className="text-white">Height</Label>
      </div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-white/10 backdrop-blur border-white/20 text-white">
          <SelectValue placeholder="Select your height" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border max-h-60">
          {heightOptions.map(option => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="text-foreground hover:bg-accent"
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
