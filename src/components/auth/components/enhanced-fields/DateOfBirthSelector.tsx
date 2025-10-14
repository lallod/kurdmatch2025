import React, { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';
import { calculateZodiacSign } from '@/utils/zodiacCalculator';

interface DateOfBirthSelectorProps {
  day?: string;
  month?: string;
  year?: string;
  onDateChange: (day: string, month: string, year: string, zodiac: string) => void;
}

const DateOfBirthSelector = ({ day, month, year, onDateChange }: DateOfBirthSelectorProps) => {
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 100;
  const maxYear = currentYear - 18;

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => (maxYear - i).toString());

  useEffect(() => {
    if (day && month && year) {
      const zodiac = calculateZodiacSign(parseInt(day), parseInt(month));
      onDateChange(day, month, year, zodiac);
    }
  }, [day, month, year]);

  const handleChange = (field: 'day' | 'month' | 'year', value: string) => {
    const newDay = field === 'day' ? value : day || '';
    const newMonth = field === 'month' ? value : month || '';
    const newYear = field === 'year' ? value : year || '';
    
    if (newDay && newMonth && newYear) {
      const zodiac = calculateZodiacSign(parseInt(newDay), parseInt(newMonth));
      onDateChange(newDay, newMonth, newYear, zodiac);
    } else {
      onDateChange(newDay, newMonth, newYear, '');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-purple-400" />
        <Label className="text-white">Date of Birth</Label>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Select value={day} onValueChange={(value) => handleChange('day', value)}>
          <SelectTrigger className="bg-white/10 backdrop-blur border-white/20 text-white">
            <SelectValue placeholder="Day" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700 max-h-60">
            {days.map(d => (
              <SelectItem key={d} value={d} className="text-white hover:bg-gray-800">
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={month} onValueChange={(value) => handleChange('month', value)}>
          <SelectTrigger className="bg-white/10 backdrop-blur border-white/20 text-white">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700 max-h-60">
            {months.map(m => (
              <SelectItem key={m.value} value={m.value} className="text-white hover:bg-gray-800">
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={year} onValueChange={(value) => handleChange('year', value)}>
          <SelectTrigger className="bg-white/10 backdrop-blur border-white/20 text-white">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700 max-h-60">
            {years.map(y => (
              <SelectItem key={y} value={y} className="text-white hover:bg-gray-800">
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DateOfBirthSelector;
