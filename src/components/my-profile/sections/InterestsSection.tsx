
import React from 'react';
import { Heart } from 'lucide-react';
import { SheetContent } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import DetailEditor from '@/components/DetailEditor';
import ProfileSectionButton from '../ProfileSectionButton';

interface InterestsSectionProps {
  profileData: {
    interests: string[];
    hobbies: string[] | string;
  };
}

const InterestsSection: React.FC<InterestsSectionProps> = ({ profileData }) => {
  return (
    <ProfileSectionButton
      icon={<Heart />}
      title="Interests"
      description="Hobbies, activities, passions"
    >
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <div className="py-6 pr-6">
            <h3 className="text-lg font-semibold mb-6">Interests & Hobbies</h3>
            <DetailEditor
              icon={<Heart size={18} />}
              title="Your Interests"
              fields={[
                { name: 'interests', label: 'Interests', value: profileData.interests.join(', ') },
                { name: 'hobbies', label: 'Hobbies', value: Array.isArray(profileData.hobbies) ? profileData.hobbies.join(', ') : profileData.hobbies }
              ]}
              listMode={true}
            />
          </div>
        </ScrollArea>
      </SheetContent>
    </ProfileSectionButton>
  );
};

export default InterestsSection;
