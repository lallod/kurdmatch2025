
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface ProfileInterestsBadgesProps {
  interests: string[];
}

const ProfileInterestsBadges = ({ interests }: ProfileInterestsBadgesProps) => {
  if (!interests || interests.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 mb-2">
      {interests.map((interest, index) => (
        <Badge key={index} variant="outline" className="text-xs border-pink-400/30 text-pink-300 px-1 py-0.5">
          {interest}
        </Badge>
      ))}
    </div>
  );
};

export default ProfileInterestsBadges;
