
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';

const ProfileOccupationSection = () => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="occupation" className="flex items-center">
          <User size={14} className="mr-1 text-tinder-rose" />
          Occupation
        </Label>
        <Input 
          id="occupation" 
          defaultValue="UX Designer" 
          className="neo-border focus-within:neo-glow transition-shadow" 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="company" className="flex items-center">
          <User size={14} className="mr-1 text-tinder-rose" />
          Company
        </Label>
        <Input 
          id="company" 
          defaultValue="Design Studio" 
          className="neo-border focus-within:neo-glow transition-shadow" 
        />
      </div>
    </>
  );
};

export default ProfileOccupationSection;
