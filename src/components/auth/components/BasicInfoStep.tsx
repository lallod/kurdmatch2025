
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { User, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import HeightSelector from './enhanced-fields/HeightSelector';
import CountrySearchField from './enhanced-fields/CountrySearchField';
import LanguageMultiSelect from './enhanced-fields/LanguageMultiSelect';
import OccupationSelector from './enhanced-fields/OccupationSelector';

interface BasicInfoStepProps {
  form: UseFormReturn<any>;
}

const BasicInfoStep = ({ form }: BasicInfoStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">Basic Info</h2>
        <p className="text-gray-300 mt-1">Tell us about yourself</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">First Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                  <Input 
                    placeholder="John" 
                    className="pl-10 bg-white/10 backdrop-blur border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20" 
                    autoComplete="given-name"
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Last Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Doe" 
                  className="bg-white/10 backdrop-blur border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20" 
                  autoComplete="family-name"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="dateOfBirth"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Date of Birth</FormLabel>
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

      <FormField
        control={form.control}
        name="height"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <HeightSelector 
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="bornIn"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <CountrySearchField 
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="languages"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <LanguageMultiSelect 
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="occupation"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <OccupationSelector 
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BasicInfoStep;
