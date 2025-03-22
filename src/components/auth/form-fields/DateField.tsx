
import React from 'react';
import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';
import { UseFormReturn } from 'react-hook-form';
import { getCategoryIcon } from '../utils/categoryIcons';

interface DateFieldProps {
  question: QuestionItem;
  form: UseFormReturn<any>;
}

const DateField = ({ question, form }: DateFieldProps) => {
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
            <Input
              type="date"
              placeholder={question.placeholder}
              className="bg-indigo-900/20 border-indigo-800 focus:border-purple-500 text-white"
              {...field}
            />
          </FormControl>
          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  );
};

export default DateField;
