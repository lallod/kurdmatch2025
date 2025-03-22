
import React from 'react';
import { Languages } from 'lucide-react';
import { SheetContent } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import DetailEditor from '@/components/DetailEditor';
import ProfileSectionButton from '../ProfileSectionButton';

interface LanguagesSectionProps {
  profileData: {
    languages: string[];
  };
}

const LanguagesSection: React.FC<LanguagesSectionProps> = ({ profileData }) => {
  return (
    <ProfileSectionButton
      icon={<Languages />}
      title="Languages"
      description="Languages you speak"
    >
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <div className="py-6 pr-6">
            <h3 className="text-lg font-semibold mb-6">Languages</h3>
            <DetailEditor
              icon={<Languages size={18} />}
              title="Languages You Speak"
              fields={[
                { name: 'languages', label: 'Languages', value: profileData.languages.join(', ') }
              ]}
              listMode={true}
            />
          </div>
        </ScrollArea>
      </SheetContent>
    </ProfileSectionButton>
  );
};

export default LanguagesSection;
