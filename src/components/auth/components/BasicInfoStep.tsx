
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';

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
                <Input placeholder="John" className="bg-white/10 backdrop-blur border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20" {...field} />
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
                <Input placeholder="Doe" className="bg-white/10 backdrop-blur border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20" {...field} />
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
                  {...field} 
                />
              </div>
            </FormControl>
            <FormDescription className="text-xs text-gray-400">
              You must be at least 18 years old
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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-white/10 backdrop-blur border-white/20 text-white focus:border-purple-500 focus:ring-purple-500/20">
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-gray-900/95 backdrop-blur border-white/20">
                <SelectItem value="man" className="text-white hover:bg-white/10">Man</SelectItem>
                <SelectItem value="woman" className="text-white hover:bg-white/10">Woman</SelectItem>
                <SelectItem value="non-binary" className="text-white hover:bg-white/10">Non-binary</SelectItem>
                <SelectItem value="prefer-not-to-say" className="text-white hover:bg-white/10">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BasicInfoStep;
