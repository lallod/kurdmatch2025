
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Mail, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';

interface AccountStepProps {
  form: UseFormReturn<any>;
}

const AccountStep = ({ form }: AccountStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">Email & Password</h2>
        <p className="text-gray-300 mt-1">Create your secure account</p>
      </div>
      
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Email Address</FormLabel>
            <FormControl>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                <Input 
                  placeholder="your@email.com" 
                  className="pl-10 bg-white/10 backdrop-blur border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20" 
                  type="email"
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
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Password</FormLabel>
            <FormControl>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                <Input 
                  placeholder="Create a strong password" 
                  className="pl-10 bg-white/10 backdrop-blur border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20" 
                  type="password"
                  {...field} 
                />
              </div>
            </FormControl>
            <FormDescription className="text-xs text-gray-400">
              Must be 8+ characters with uppercase, lowercase, and number
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Confirm Password</FormLabel>
            <FormControl>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                <Input 
                  placeholder="Confirm your password" 
                  className="pl-10 bg-white/10 backdrop-blur border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20" 
                  type="password"
                  {...field} 
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AccountStep;
