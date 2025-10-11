
import React, { useState } from 'react';
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
import SimpleLocationSearch from './enhanced-fields/SimpleLocationSearch';
import LocationCapture from '@/components/location/LocationCapture';
import { Coordinates } from '@/types/location';

interface LocationStepProps {
  form: UseFormReturn<any>;
  location: string;
  locationLoading: boolean;
}

const LocationStep = ({ form, location, locationLoading }: LocationStepProps) => {
  const [showManualInput, setShowManualInput] = useState(false);

  const handleLocationCapture = (coords: Coordinates, locationName: string) => {
    form.setValue('location', locationName);
    form.setValue('latitude', coords.latitude);
    form.setValue('longitude', coords.longitude);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">Where Do You Live?</h2>
        <p className="text-purple-200 mt-1">Share your location to find matches near you</p>
      </div>
      
      <LocationCapture
        onLocationCapture={handleLocationCapture}
        initialLocation={location}
      />

      <FormField
        control={form.control}
        name="dreamVacation"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <SimpleLocationSearch 
                value={field.value}
                onChange={field.onChange}
                label="Dream Vacation Destination"
              />
            </FormControl>
            <FormDescription className="text-xs text-purple-300">
              Where would you love to travel? Includes all parts of Kurdistan and top global destinations.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default LocationStep;
