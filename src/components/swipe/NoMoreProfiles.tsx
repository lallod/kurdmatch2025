
import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart } from 'lucide-react';


interface NoMoreProfilesProps {
  onStartOver: () => void;
}

const NoMoreProfiles = ({ onStartOver }: NoMoreProfilesProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex items-center justify-center pb-20 px-4">
      <div className="text-center text-white w-full max-w-sm">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold mb-2">No more profiles</h2>
        <p className="text-purple-200 mb-4 text-sm sm:text-base">Check back later for new matches!</p>
        <Button 
          onClick={onStartOver} 
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 w-full sm:w-auto"
        >
          Start Over
        </Button>
      </div>
      
    </div>
  );
};

export default NoMoreProfiles;
