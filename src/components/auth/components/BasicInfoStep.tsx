
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import BasicInfoHeader from './basic-info/BasicInfoHeader';
import NameFields from './basic-info/NameFields';
import DateOfBirthField from './basic-info/DateOfBirthField';
import GenderField from './basic-info/GenderField';
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
      <BasicInfoHeader />
      
      <NameFields form={form} />
      
      <DateOfBirthField form={form} />
      
      <GenderField form={form} />

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
