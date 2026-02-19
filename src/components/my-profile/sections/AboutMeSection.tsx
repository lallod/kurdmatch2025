
import React from 'react';
import { BookOpen } from 'lucide-react';
import { SheetContent } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import DetailEditor from '@/components/DetailEditor';
import ProfileSectionButton from '../ProfileSectionButton';
import { useTranslations } from '@/hooks/useTranslations';

interface AboutMeSectionProps {
  profileData: {
    bio: string;
    values: string[] | string;
  };
}

const AboutMeSection: React.FC<AboutMeSectionProps> = ({ profileData }) => {
  const { t } = useTranslations();

  return (
    <ProfileSectionButton
      icon={<BookOpen />}
      title={t('profile.about_me', 'About Me')}
      description={t('profile.about_me_desc', 'Bio, lifestyle, values')}
    >
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <div className="py-6 pr-6">
            <h3 className="text-lg font-semibold mb-6">{t('profile.about_you', 'About You')}</h3>
            <DetailEditor
              icon={<BookOpen size={18} />}
              title={t('profile.your_bio', 'Your Bio')}
              fields={[
                { name: 'bio', label: t('profile.bio', 'Bio'), value: profileData.bio, type: 'textarea' },
                { name: 'values', label: t('profile.values', 'Values'), value: Array.isArray(profileData.values) ? profileData.values.join(', ') : profileData.values }
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
