
import React from 'react';
import { User } from 'lucide-react';
import { SheetContent } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import DetailEditor from '@/components/DetailEditor';
import ProfileSectionButton from '../ProfileSectionButton';

interface BasicInfoSectionProps {
  profileData: {
    height: string;
    bodyType: string;
    ethnicity: string;
  };
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ profileData }) => {
  return (
    <ProfileSectionButton
      icon={<User />}
      title="Basic Info"
      description="Height, body type, ethnicity"
    >
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <div className="py-6 pr-6">
            <h3 className="text-lg font-semibold mb-6">Basic Information</h3>
            <DetailEditor
              icon={<User size={18} />}
              title="Your Basics"
              fields={[
                { name: 'height', label: 'Height', value: profileData.height, type: 'select' },
                { name: 'bodyType', label: 'Body Type', value: profileData.bodyType, type: 'select' },
                { name: 'ethnicity', label: 'Ethnicity', value: profileData.ethnicity, type: 'select' }
              ]}
              selectionMode={true}
            />
          </div>
        </ScrollArea>
      </SheetContent>
    </ProfileSectionButton>
  );
};

export default BasicInfoSection;
