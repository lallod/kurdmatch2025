
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { User } from 'lucide-react';
import PremiumFeatureButton from './PremiumFeatureButton';

const ProfileOnlineStatusSection = () => {
  const [isSubscriber] = useState(false); // Mock subscription status
  const [isOnline, setIsOnline] = useState(true);

  return (
    <div className="space-y-2">
      <Label htmlFor="lastActive" className="flex items-center justify-between">
        <div className="flex items-center">
          <User size={14} className="mr-1 text-tinder-rose" />
          Online Status
        </div>
        {isSubscriber ? (
          <Switch 
            id="lastActive" 
            checked={isOnline} 
            onCheckedChange={setIsOnline} 
            className="data-[state=checked]:bg-tinder-rose"
          />
        ) : (
          <div className="flex items-center gap-2">
            <PremiumFeatureButton />
            <Switch 
              id="lastActive" 
              checked={isOnline} 
              disabled={true}
              className="data-[state=checked]:bg-gray-400 opacity-70 cursor-not-allowed"
            />
          </div>
        )}
      </Label>
      <p className="text-xs text-muted-foreground mt-1">
        {isOnline ? "Show as online" : "Show as offline"}
      </p>
    </div>
  );
};

export default ProfileOnlineStatusSection;
