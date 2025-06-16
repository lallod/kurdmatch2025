
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
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-purple-300/30"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gradient-to-r from-purple-900 to-pink-900 px-3 text-purple-200">
            Or sign up with email
          </span>
        </div>
      </div>
      
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Email Address</FormLabel>
            <FormControl>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-pink-400" />
                <Input 
                  placeholder="your@email.com" 
                  className="pl-10 bg-white/10 backdrop-blur border-purple-300/30 text-white placeholder:text-purple-300 focus:border-pink-400 focus:ring-pink-400/20" 
                  type="email"
                  autoComplete="email"
                  autoFocus
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
                <Lock className="absolute left-3 top-3 h-4 w-4 text-pink-400" />
                <Input 
                  placeholder="Create a strong password" 
                  className="pl-10 bg-white/10 backdrop-blur border-purple-300/30 text-white placeholder:text-purple-300 focus:border-pink-400 focus:ring-pink-400/20" 
                  type="password"
                  autoComplete="new-password"
                  {...field} 
                />
              </div>
            </FormControl>
            <FormDescription className="text-xs text-purple-300">
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
                <Lock className="absolute left-3 top-3 h-4 w-4 text-pink-400" />
                <Input 
                  placeholder="Confirm your password" 
                  className="pl-10 bg-white/10 backdrop-blur border-purple-300/30 text-white placeholder:text-purple-300 focus:border-pink-400 focus:ring-pink-400/20" 
                  type="password"
                  autoComplete="new-password"
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
