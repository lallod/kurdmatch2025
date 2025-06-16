
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

interface GenderFieldProps {
  form: UseFormReturn<any>;
}

const GenderField = ({ form }: GenderFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="gender"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white">Gender</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="male" 
                  id="male" 
                  className="border-white/20 text-purple-500"
                />
                <label htmlFor="male" className="text-white">Male</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="female" 
                  id="female" 
                  className="border-white/20 text-purple-500"
                />
                <label htmlFor="female" className="text-white">Female</label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default GenderField;
