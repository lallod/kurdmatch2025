
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { MapPin, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import EnhancedLocationSearch from './enhanced-fields/EnhancedLocationSearch';

interface LocationBioStepProps {
  form: UseFormReturn<any>;
  location: string;
  locationLoading: boolean;
}

const LocationBioStep = ({ form, location, locationLoading }: LocationBioStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">Location & Travel</h2>
        <p className="text-gray-300 mt-1">Where are you from and where do you dream to go?</p>
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
        name="dreamVacation"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <EnhancedLocationSearch 
                value={field.value}
                onChange={field.onChange}
                label="Dream Vacation Destination"
              />
            </FormControl>
            <FormDescription className="text-xs text-gray-400">
              Where would you love to travel? Includes all parts of Kurdistan and top global destinations.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default LocationBioStep;
