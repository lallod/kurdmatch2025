
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
import SimpleLanguageMultiSelect from './enhanced-fields/SimpleLanguageMultiSelect';
import OccupationSelector from './enhanced-fields/OccupationSelector';
import ErrorBoundary from './ErrorBoundary';

interface BasicInfoStepProps {
  form: UseFormReturn<any>;
}

const BasicInfoStep = ({ form }: BasicInfoStepProps) => {
  console.log('BasicInfoStep rendering with form values:', form.getValues());

  return (
    <div className="space-y-6">
      <BasicInfoHeader />
      
      <ErrorBoundary>
        <NameFields form={form} />
      </ErrorBoundary>
      
      <ErrorBoundary>
        <DateOfBirthField form={form} />
      </ErrorBoundary>
      
      <ErrorBoundary>
        <GenderField form={form} />
      </ErrorBoundary>

      <ErrorBoundary>
        <FormField
          control={form.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <HeightSelector 
                  value={field.value || ''}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </ErrorBoundary>

      <ErrorBoundary>
        <FormField
          control={form.control}
          name="bornIn"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <CountrySearchField 
                  value={field.value || ''}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </ErrorBoundary>

      <ErrorBoundary>
        <FormField
          control={form.control}
          name="languages"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <SimpleLanguageMultiSelect 
                  value={Array.isArray(field.value) ? field.value : []}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </ErrorBoundary>

      <ErrorBoundary>
        <FormField
          control={form.control}
          name="occupation"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <OccupationSelector 
                  value={field.value || ''}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </ErrorBoundary>
    </div>
  );
};

export default BasicInfoStep;
