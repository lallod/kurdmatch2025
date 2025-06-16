
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { MapPin, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';

interface LocationBioStepProps {
  form: UseFormReturn<any>;
  location: string;
  locationLoading: boolean;
}

const LocationBioStep = ({ form, location, locationLoading }: LocationBioStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">Location & Bio</h2>
        <p className="text-gray-300 mt-1">Where are you from?</p>
      </div>
      
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Current Location</FormLabel>
            <FormControl>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                {locationLoading ? (
                  <div className="flex items-center gap-2 p-3 bg-white/10 backdrop-blur border border-white/20 rounded-lg text-white">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Detecting your location...</span>
                  </div>
                ) : (
                  <Input 
                    placeholder="Detecting location..." 
                    className="pl-10 bg-white/10 backdrop-blur border-white/20 text-white placeholder:text-gray-400 cursor-not-allowed opacity-75" 
                    value={field.value}
                    readOnly
                  />
                )}
              </div>
            </FormControl>
            <FormDescription className="text-xs text-gray-400">
              Your location is automatically detected. You can change this later in settings.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">About Me (Optional)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Tell us a bit about yourself..." 
                className="resize-none min-h-[100px] bg-white/10 backdrop-blur border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20" 
                {...field}
              />
            </FormControl>
            <FormDescription className="text-xs text-gray-400">
              {field.value?.length || 0}/500 characters
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default LocationBioStep;
