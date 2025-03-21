
import React from 'react';
import { Brain } from 'lucide-react';

const ProfileAiAnalytics = () => {
  return (
    <div className="w-full py-2 px-3 rounded-md bg-gradient-to-r from-tinder-rose/5 to-tinder-orange/5 flex items-center">
      <Brain size={18} className="text-tinder-rose mr-2 animate-pulse" />
      <p className="text-xs text-gray-600">Our AI is analyzing your profile to optimize match potential</p>
    </div>
  );
};

export default ProfileAiAnalytics;
