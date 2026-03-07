
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
import { useTranslations } from '@/hooks/useTranslations';

interface GenderFieldProps {
  form: UseFormReturn<any>;
}

const GenderField = ({ form }: GenderFieldProps) => {
  const { t } = useTranslations();
  return (
    <FormField
      control={form.control}
      name="gender"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white">{t('auth.gender', 'Gender')}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="Male" 
                  id="male" 
                  className="border-white/20 text-primary"
                />
                <label htmlFor="male" className="text-white cursor-pointer">{t('auth.male', 'Male')}</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="Female" 
                  id="female" 
                  className="border-white/20 text-primary"
                />
                <label htmlFor="female" className="text-white cursor-pointer">{t('auth.female', 'Female')}</label>
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
