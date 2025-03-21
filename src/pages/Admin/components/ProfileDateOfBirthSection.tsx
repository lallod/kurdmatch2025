
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const ProfileDateOfBirthSection = () => {
  const [birthDate, setBirthDate] = useState<Date>();

  const calculateAge = (birthDate?: Date): number => {
    if (!birthDate) return 0;
    
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const quickDateOptions = [
    { label: "18 years ago", date: new Date(new Date().setFullYear(new Date().getFullYear() - 18)) },
    { label: "21 years ago", date: new Date(new Date().setFullYear(new Date().getFullYear() - 21)) },
    { label: "25 years ago", date: new Date(new Date().setFullYear(new Date().getFullYear() - 25)) },
    { label: "30 years ago", date: new Date(new Date().setFullYear(new Date().getFullYear() - 30)) },
    { label: "35 years ago", date: new Date(new Date().setFullYear(new Date().getFullYear() - 35)) },
    { label: "40 years ago", date: new Date(new Date().setFullYear(new Date().getFullYear() - 40)) },
  ];

  return (
    <div className="space-y-2">
      <Label htmlFor="birthDate" className="flex items-center">
        <CalendarDays size={14} className="mr-1 text-tinder-rose" />
        Date of Birth
      </Label>
      <div className="space-y-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal neo-border focus-within:neo-glow transition-shadow",
                !birthDate && "text-muted-foreground"
              )}
            >
              {birthDate ? format(birthDate, "PPP") : <span>Select date of birth</span>}
              <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-3 border-b">
              <div className="text-sm font-medium mb-2">Quick select</div>
              <div className="grid grid-cols-2 gap-1">
                {quickDateOptions.map((option) => (
                  <Button 
                    key={option.label}
                    variant="outline" 
                    size="sm"
                    className="text-xs h-7" 
                    onClick={() => setBirthDate(option.date)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
            <Calendar
              mode="single"
              selected={birthDate}
              onSelect={setBirthDate}
              disabled={(date) =>
                date > new Date() || date < new Date("1950-01-01")
              }
              initialFocus
              className="p-3"
            />
          </PopoverContent>
        </Popover>
        {birthDate && (
          <p className="text-xs text-muted-foreground mt-1">
            Age: {calculateAge(birthDate)} years
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileDateOfBirthSection;
