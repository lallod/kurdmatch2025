import React from 'react';
import SwipeCard from './SwipeCard';
import SwipeActions from './SwipeActions';
import { Profile, SwipeAction } from '@/types/swipe';

interface SwipeContainerProps {
  profile: Profile;
  onSwipeAction: (action: SwipeAction, profileId: string) => void;
  onMessage: (profileId: string) => void;
}

const SwipeContainer: React.FC<SwipeContainerProps> = ({
  profile,
  onSwipeAction,
  onMessage
}) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <SwipeCard 
          profile={profile}
          onSwipeLeft={() => onSwipeAction('pass', profile.id)}
          onSwipeRight={() => onSwipeAction('like', profile.id)}
        />
      </div>
      
      <SwipeActions
        onSwipeAction={onSwipeAction}
        onMessage={onMessage}
        profileId={profile.id}
      />
    </div>
  );
};

export default SwipeContainer;