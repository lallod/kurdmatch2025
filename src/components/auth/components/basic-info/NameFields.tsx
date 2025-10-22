
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

interface NameFieldsProps {
  form: UseFormReturn<any>;
}

const NameFields = ({ form }: NameFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">First Name</FormLabel>
            <FormControl>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-primary" />
                <Input 
                  placeholder="John" 
                  className="pl-10 bg-white/10 backdrop-blur border-white/20 text-white placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20" 
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
                className="bg-white/10 backdrop-blur border-white/20 text-white placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20" 
                autoComplete="family-name"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default NameFields;
