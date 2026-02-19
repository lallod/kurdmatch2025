
import React from 'react';
import { Heart } from 'lucide-react';
import { SheetContent } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import DetailEditor from '@/components/DetailEditor';
import ProfileSectionButton from '../ProfileSectionButton';
import { useTranslations } from '@/hooks/useTranslations';

interface InterestsSectionProps {
  profileData: {
    interests: string[];
    hobbies: string[] | string;
    values: string[];
  };
}

const InterestsSection: React.FC<InterestsSectionProps> = ({ profileData }) => {
  const { t } = useTranslations();

  return (
    <ProfileSectionButton
      icon={<Heart />}
      title={t('profile.interests', 'Interests')}
      description={t('profile.interests_desc', 'Values, hobbies, activities, passions')}
    >
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <div className="py-6 pr-6">
            <h3 className="text-lg font-semibold mb-6">{t('profile.interests_hobbies_values', 'Interests, Hobbies & Values')}</h3>
            <DetailEditor
              icon={<Heart size={18} />}
              title={t('profile.your_interests', 'Your Interests')}
              fields={[
                { name: 'values', label: t('profile.values', 'Values'), value: profileData.values.join(', ') },
                { name: 'interests', label: t('profile.interests', 'Interests'), value: profileData.interests.join(', ') },
                { name: 'hobbies', label: t('profile.hobbies', 'Hobbies'), value: Array.isArray(profileData.hobbies) ? profileData.hobbies.join(', ') : profileData.hobbies }
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