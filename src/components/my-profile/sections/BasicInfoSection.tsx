
import React from 'react';
import { User } from 'lucide-react';
import { SheetContent } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import DetailEditor from '@/components/DetailEditor';
import ProfileSectionButton from '../ProfileSectionButton';
import { useTranslations } from '@/hooks/useTranslations';

interface BasicInfoSectionProps {
  profileData: {
    height: string;
    bodyType: string;
    ethnicity: string;
  };
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ profileData }) => {
  const { t } = useTranslations();
  return (
    <ProfileSectionButton
      icon={<User />}
      title={t('profile.basic_info', 'Basic Info')}
      description={t('profile.basic_info_desc', 'Height, body type, ethnicity')}
    >
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <div className="py-6 pr-6">
            <h3 className="text-lg font-semibold mb-6">{t('profile.basic_information', 'Basic Information')}</h3>
            <DetailEditor
              icon={<User size={18} />}
              title={t('profile.your_basics', 'Your Basics')}
              fields={[
                { name: 'height', label: t('profile.height', 'Height'), value: profileData.height, type: 'select' },
                { name: 'bodyType', label: t('profile.body_type', 'Body Type'), value: profileData.bodyType, type: 'select' },
                { name: 'ethnicity', label: t('profile.ethnicity', 'Ethnicity'), value: profileData.ethnicity, type: 'select' }
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
