
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMatchRecommendations } from '@/api/profiles';
import SwipeCard from './SwipeCard';
import { Button } from '@/components/ui/button';
import { RotateCcw, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface SwipeContainerProps {
  onFilterClick: () => void;
  activeFilters: number;
}

const SwipeContainer: React.FC<SwipeContainerProps> = ({ onFilterClick, activeFilters }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedProfiles, setSwipedProfiles] = useState<string[]>([]);

  const { data: profiles = [], isLoading, refetch } = useQuery({
    queryKey: ['match-recommendations'],
    queryFn: () => getMatchRecommendations(20),
  });

  const filteredProfiles = profiles.filter(profile => !swipedProfiles.includes(profile.id));
  const currentProfile = filteredProfiles[currentIndex];

  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    if (!currentProfile) return;

    // Add current profile to swiped list
    setSwipedProfiles(prev => [...prev, currentProfile.id]);
    
    // Move to next profile
    if (currentIndex < filteredProfiles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // No more profiles, reset or show empty state
      setCurrentIndex(0);
      toast.info("No more profiles! Try adjusting your filters.");
    }

    // Show swipe feedback
    switch (direction) {
      case 'left':
        toast.info("Profile passed");
        break;
      case 'right':
        toast.success("Profile liked!");
        break;
      case 'up':
        toast.success("Super Like sent! ⭐");
        break;
    }
  };

  const handleUndo = () => {
    if (swipedProfiles.length === 0) return;
    
    const lastSwipedProfile = swipedProfiles[swipedProfiles.length - 1];
    setSwipedProfiles(prev => prev.slice(0, -1));
    
    // Move back to previous profile
    const profileIndex = profiles.findIndex(p => p.id === lastSwipedProfile);
    if (profileIndex !== -1) {
      setCurrentIndex(profileIndex);
    }
    
    toast.info("Undo successful");
  };

  const handleMessage = () => {
    // Navigate to message composition
    toast.info("Message feature coming soon!");
  };

  const handleReport = () => {
    toast.info("Report feature coming soon!");
  };

  const handleBlock = () => {
    if (!currentProfile) return;
    setSwipedProfiles(prev => [...prev, currentProfile.id]);
    handleSwipe('left');
    toast.success("User blocked");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (filteredProfiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Filter className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No more profiles</h3>
        <p className="text-purple-200 mb-4">Try adjusting your filters or check back later</p>
        <Button 
          onClick={() => refetch()}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Control Buttons */}
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleUndo}
          disabled={swipedProfiles.length === 0}
          className="bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Undo
        </Button>
        
        <div className="text-center text-purple-200">
          <span className="text-sm">
            {filteredProfiles.length - currentIndex} profiles remaining
          </span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onFilterClick}
          className="bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20"
        >
          <Filter className="h-4 w-4 mr-1" />
          Filters {activeFilters > 0 && `(${activeFilters})`}
        </Button>
      </div>

      {/* Card Stack */}
      <div className="relative h-[600px]">
        {/* Background cards for stack effect */}
        {filteredProfiles.slice(currentIndex + 1, currentIndex + 3).map((profile, index) => (
          <div
            key={profile.id}
            className="absolute inset-0"
            style={{
              transform: `scale(${1 - (index + 1) * 0.05}) translateY(${(index + 1) * 10}px)`,
              zIndex: 10 - index,
              opacity: 0.6 - index * 0.2
            }}
          >
            <SwipeCard
              profile={profile}
              onSwipe={() => {}}
              onMessage={() => {}}
              onReport={() => {}}
              onBlock={() => {}}
              isActive={false}
            />
          </div>
        ))}
        
        {/* Active card */}
        {currentProfile && (
          <SwipeCard
            key={currentProfile.id}
            profile={currentProfile}
            onSwipe={handleSwipe}
            onMessage={handleMessage}
            onReport={handleReport}
            onBlock={handleBlock}
            isActive={true}
          />
        )}
      </div>
    </div>
  );
};

export default SwipeContainer;
