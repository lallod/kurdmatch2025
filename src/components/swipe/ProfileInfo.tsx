import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Verified } from 'lucide-react';
import { Profile } from '@/types/swipe';

interface ProfileInfoProps {
  profile: Profile;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ profile }) => {
  return (
    <div className="text-white space-y-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold">{profile.name}</h2>
          <span className="text-xl font-normal">{profile.age}</span>
        </div>
        
        {/* Compatibility percentage */}
        <div className="bg-green-500 px-3 py-1 rounded-full flex items-center gap-1">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span className="text-white font-semibold text-sm">
            {profile.compatibilityScore || Math.floor(Math.random() * 20) + 80}%
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-1 text-white/90 text-sm">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <span>{profile.location}</span>
        <span className="text-white/70">•</span>
        <span>{profile.distance || Math.floor(Math.random() * 20) + 1}km away</span>
      </div>
      
      <div className="flex items-center gap-2 mt-2">
        {profile.kurdistanRegion && (
          <span className="bg-purple-600/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
            {profile.kurdistanRegion}
          </span>
        )}
      </div>

      <div className="text-white/90 text-sm mt-2">
        Looking for: {profile.relationshipGoals || 'Long-term relationship'}
      </div>
      
      <div className="flex gap-2 mt-2">
        <span className="bg-purple-600/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
          {profile.occupation || 'Not specified'}
        </span>
      </div>
    </div>
  );
};

export default ProfileInfo;