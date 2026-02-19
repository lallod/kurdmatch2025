
import React, { useState } from 'react';
import { Languages } from 'lucide-react';
import { SheetContent } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import DetailEditor from '@/components/DetailEditor';
import ProfileSectionButton from '../ProfileSectionButton';
import LanguageEditor from '@/components/profile/LanguageEditor';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/useTranslations';

interface LanguagesSectionProps {
  profileData: {
    languages: string[];
  };
}

const LanguagesSection: React.FC<LanguagesSectionProps> = ({ profileData }) => {
  const { t } = useTranslations();
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(profileData.languages || []);
  
  const handleSaveLanguages = () => {
    toast.success(t('toast.languages.updated', 'Languages updated successfully!'));
  };

  return (
    <ProfileSectionButton
      icon={<Languages />}
      title={t('profile.languages', 'Languages')}
      description={t('profile.languages_desc', 'Languages you speak')}
    >
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <div className="py-6 pr-6">
            <h3 className="text-lg font-semibold mb-6">{t('profile.languages', 'Languages')}</h3>
            <LanguageEditor
              selectedLanguages={selectedLanguages}
              setSelectedLanguages={setSelectedLanguages}
              onSave={handleSaveLanguages}
              maxLanguages={5}
            />
          </div>
        </ScrollArea>
      </SheetContent>
    </ProfileSectionButton>
  );
};

export default LanguagesSection;
