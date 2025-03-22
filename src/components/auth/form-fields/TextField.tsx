
import React from 'react';
import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';
import { UseFormReturn } from 'react-hook-form';
import { getCategoryIcon } from '../utils/categoryIcons';
import { Eye, EyeOff } from 'lucide-react';

interface TextFieldProps {
  question: QuestionItem;
  form: UseFormReturn<any>;
}

const TextField = ({ question, form }: TextFieldProps) => {
  const [showPassword, setShowPassword] = React.useState(false);
  
  // Check if this is a password field
  const isPassword = question.profileField === 'password';
  
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
            <div className="relative">
              <Input
                type={isPassword ? (showPassword ? 'text' : 'password') : 'text'}
                placeholder={question.placeholder}
                className="bg-indigo-900/20 border-indigo-800 focus:border-purple-500 text-white pr-10"
                {...field}
              />
              {isPassword && (
                <button 
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>
          </FormControl>
          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  );
};

export default TextField;
