
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';
import { UseFormReturn } from 'react-hook-form';
import { getCategoryIcon } from '../utils/categoryIcons';

interface CheckboxFieldProps {
  question: QuestionItem;
  form: UseFormReturn<any>;
}

const CheckboxField = ({ question, form }: CheckboxFieldProps) => {
  return (
    <FormField
      key={question.id}
      control={form.control}
      name={question.id}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="flex items-center space-x-2 text-gray-200">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-900/50 text-purple-400">
              {getCategoryIcon(question.category)}
            </span>
            <span>{question.text}</span>
            {question.required && <span className="text-red-400 text-sm">*</span>}
          </FormLabel>
          <FormControl>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={question.id}
                checked={field.value === 'true'}
                onCheckedChange={(checked) => {
                  field.onChange(checked ? 'true' : 'false');
                }}
                className="border-indigo-700 data-[state=checked]:bg-purple-600"
              />
              <label
                htmlFor={question.id}
                className="text-sm font-medium leading-none text-gray-300"
              >
                {question.placeholder}
              </label>
            </div>
          </FormControl>
          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  );
};

export default CheckboxField;
