
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';

interface DateOfBirthFieldProps {
  form: UseFormReturn<any>;
}

const DateOfBirthField = ({ form }: DateOfBirthFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="dateOfBirth"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white">Birthday (Month / Day / Year)</FormLabel>
          <FormControl>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
              <Input 
                type="date" 
                className="pl-10 bg-white/10 backdrop-blur border-white/20 text-white focus:border-purple-500 focus:ring-purple-500/20" 
                autoComplete="bday"
                {...field} 
              />
            </div>
          </FormControl>
          <FormDescription className="text-xs text-gray-400">
            You must be at least 18 years old to register
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DateOfBirthField;
