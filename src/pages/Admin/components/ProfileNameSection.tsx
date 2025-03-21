
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';

const ProfileNameSection = () => {
  return (
    <div className="space-y-2">
      <Label htmlFor="name" className="flex items-center">
        <User size={14} className="mr-1 text-tinder-rose" />
        Name
      </Label>
      <Input 
        id="name" 
        defaultValue="Sophia" 
        className="neo-border focus-within:neo-glow transition-shadow opacity-70"
        disabled={true}
      />
      <p className="text-xs text-muted-foreground">Name cannot be changed</p>
    </div>
  );
};

export default ProfileNameSection;
