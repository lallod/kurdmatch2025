
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Ruler } from 'lucide-react';

interface HeightFilterProps {
  selectedHeightRange?: string;
  onHeightRangeChange: (range: string | undefined) => void;
}

export const heightRanges = [
  { value: '145-155', label: '145-155 cm (4\'9" - 5\'1")', min: 145, max: 155 },
  { value: '155-165', label: '155-165 cm (5\'1" - 5\'5")', min: 155, max: 165 },
  { value: '165-175', label: '165-175 cm (5\'5" - 5\'9")', min: 165, max: 175 },
  { value: '175-185', label: '175-185 cm (5\'9" - 6\'1")', min: 175, max: 185 },
  { value: '185+', label: '185+ cm (6\'1"+)', min: 185, max: 999 }
];

const HeightFilter: React.FC<HeightFilterProps> = ({
  selectedHeightRange,
  onHeightRangeChange
}) => {
  const clearFilter = () => {
    onHeightRangeChange(undefined);
  };

  const getSelectedRangeLabel = () => {
    const range = heightRanges.find(r => r.value === selectedHeightRange);
    return range ? range.label : '';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Ruler className="w-4 h-4 text-purple-400" />
        <span className="text-sm font-medium text-gray-700">Height Range</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Select value={selectedHeightRange || ''} onValueChange={(value) => onHeightRangeChange(value || undefined)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select height range" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200 max-h-60 z-50">
            {heightRanges.map(range => (
              <SelectItem 
                key={range.value} 
                value={range.value}
                className="hover:bg-gray-100"
              >
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {selectedHeightRange && (
          <button
            onClick={clearFilter}
            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>
      
      {selectedHeightRange && (
        <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
          {getSelectedRangeLabel()}
        </Badge>
      )}
    </div>
  );
};

export default HeightFilter;
