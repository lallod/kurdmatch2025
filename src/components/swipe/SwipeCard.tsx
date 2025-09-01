
import React from 'react';
import { Card } from "@/components/ui/card";
import ProfilePhotoGallery from './ProfilePhotoGallery';
import ProfileInfo from './ProfileInfo';
import ProfileBioSection from './ProfileBioSection';
import ProfileDetails from '@/components/ProfileDetails';
import { Profile, SwipeAction } from '@/types/swipe';

interface SwipeCardProps {
  profile: Profile;
  currentPhotoIndex: number;
  isExpanded: boolean;
  onNextPhoto: () => void;
  onPrevPhoto: () => void;
  onToggleExpanded: () => void;
  onReport: (profileId: string) => void;
  onSwipeAction: (action: SwipeAction, profileId: string) => void;
  onMessage: (profileId: string) => void;
}

const SwipeCard = ({
  profile,
  currentPhotoIndex,
  isExpanded,
  onNextPhoto,
  onPrevPhoto,
  onToggleExpanded,
  onReport,
  onSwipeAction,
  onMessage
}: SwipeCardProps) => {
  return (
    <Card className="relative w-full max-w-md mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">
      <ProfilePhotoGallery 
        profile={profile} 
        currentPhotoIndex={currentPhotoIndex}
        onNextPhoto={onNextPhoto}
        onPrevPhoto={onPrevPhoto}
      />
      
      <ProfileInfo 
        profile={profile}
        onReport={onReport}
        onSwipeAction={onSwipeAction}
        onMessage={onMessage}
      />
      
      <ProfileBioSection profile={profile} />
      
      {isExpanded && (
        <div className="absolute inset-0 bg-white rounded-3xl overflow-y-auto z-20">
          <div className="p-6">
            <ProfileDetails details={{
              about: profile.bio || '',
              height: profile.height || '',
              bodyType: profile.bodyType || '',
              ethnicity: profile.ethnicity || '',
              education: profile.education || '',
              occupation: profile.occupation || '',
              company: profile.company || '',
              religion: profile.religion || '',
              politicalViews: profile.politicalViews || '',
              drinking: profile.drinking || '',
              smoking: profile.smoking || '',
              relationshipGoals: profile.relationshipGoals || '',
              wantChildren: profile.wantChildren || '',
              havePets: profile.havePets || '',
              exerciseHabits: profile.exerciseHabits || '',
              interests: profile.interests || [],
              hobbies: profile.hobbies || [],
              languages: profile.languages || [],
              values: profile.values || [],
              favoriteBooks: profile.favoriteBooks || [],
              favoriteMovies: profile.favoriteMovies || [],
              favoriteMusic: profile.favoriteMusic || [],
              favoriteFoods: profile.favoriteFoods || [],
              favoriteGames: profile.favoriteGames || [],
              favoritePodcasts: profile.favoritePodcasts || []
            } as any} />
          </div>
        </div>
      )}
    </Card>
  );
};

export default SwipeCard;
