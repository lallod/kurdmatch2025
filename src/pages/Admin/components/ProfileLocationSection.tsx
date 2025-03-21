
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';
import PremiumFeatureOverlay from './PremiumFeatureOverlay';

const ProfileLocationSection = () => {
  const [isSubscriber] = useState(false); // Mock subscription status

  return (
    <div className="space-y-2">
      <Label htmlFor="location" className="flex items-center">
        <User size={14} className="mr-1 text-tinder-rose" />
        Location
      </Label>
      {isSubscriber ? (
        <Input 
          id="location" 
          defaultValue="San Francisco, CA" 
          className="neo-border focus-within:neo-glow transition-shadow" 
        />
      ) : (
        <PremiumFeatureOverlay>
          <Input 
            id="location" 
            defaultValue="San Francisco, CA" 
            className="neo-border opacity-70 cursor-not-allowed" 
            disabled={true}
          />
        </PremiumFeatureOverlay>
      )}
    </div>
  );
};

export default ProfileLocationSection;
