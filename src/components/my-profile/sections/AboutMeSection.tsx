
import React from 'react';
import { BookOpen } from 'lucide-react';
import { SheetContent } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import DetailEditor from '@/components/DetailEditor';
import ProfileSectionButton from '../ProfileSectionButton';

interface AboutMeSectionProps {
  profileData: {
    bio: string;
    values: string[] | string;
  };
}

const AboutMeSection: React.FC<AboutMeSectionProps> = ({ profileData }) => {
  return (
    <ProfileSectionButton
      icon={<BookOpen />}
      title="About Me"
      description="Bio, lifestyle, values"
    >
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <div className="py-6 pr-6">
            <h3 className="text-lg font-semibold mb-6">About You</h3>
            <DetailEditor
              icon={<BookOpen size={18} />}
              title="Your Bio"
              fields={[
                { name: 'bio', label: 'Bio', value: profileData.bio, type: 'textarea' },
                { name: 'values', label: 'Values', value: Array.isArray(profileData.values) ? profileData.values.join(', ') : profileData.values }
              ]}
              listMode={true}
            />
          </div>
        </ScrollArea>
      </SheetContent>
    </ProfileSectionButton>
  );
};

export default AboutMeSection;
