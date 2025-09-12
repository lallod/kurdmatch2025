import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Verified } from 'lucide-react';
import { Profile } from '@/types/swipe';

interface ProfileInfoProps {
  profile: Profile;
  minimal?: boolean;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ profile, minimal = false }) => {
  return (
    <div className="text-white space-y-3">
      {/* Name and Age */}
      <div className="flex items-center gap-3">
        <h2 className="text-3xl font-bold">{profile.name}</h2>
        <span className="text-2xl font-light">{profile.age}</span>
      </div>
      
      {/* Location */}
      <div className="flex items-center gap-2 text-white/90">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <span>{profile.location}</span>
        <span className="text-white/70">•</span>
        <span>{profile.distance || Math.floor(Math.random() * 20) + 1}km away</span>
      </div>
      
      {/* Interests/Bio snippet */}
      {minimal && profile.interests && profile.interests.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {profile.interests.slice(0, 3).map((interest, index) => (
            <span key={index} className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
              {interest}
            </span>
          ))}
          {profile.interests.length > 3 && (
            <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
              +{profile.interests.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;