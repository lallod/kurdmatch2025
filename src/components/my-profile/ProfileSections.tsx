import React from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Pencil } from 'lucide-react';
import type { KurdistanRegion } from '@/types/profile';
import BasicInfoSection from './sections/BasicInfoSection';
import InterestsSection from './sections/InterestsSection';
import AboutMeSection from './sections/AboutMeSection';
import LanguagesSection from './sections/LanguagesSection';
import LocationSection from './sections/LocationSection';
import { useTranslations } from '@/hooks/useTranslations';

interface ProfileSectionsProps {
  profileData: {
    height: string;
    bodyType: string;
    ethnicity: string;
    religion: string;
    politicalViews: string;
    values: string[];
    interests: string[];
    hobbies: string[];
    languages: string[];
    bio: string;
    location: string;
    kurdistanRegion: KurdistanRegion;
  };
  onEditSections?: () => void;
}

const ProfileSections: React.FC<ProfileSectionsProps> = ({ profileData, onEditSections }) => {
  const { t } = useTranslations();
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t('profile.sections', 'Profile Sections')}</h2>
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={onEditSections ? (e) => {
                  e.preventDefault();
                  onEditSections();
                } : undefined}
              >
                <Pencil size={16} />
                {t('profile.edit_sections', 'Edit Sections')}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <h3 className="text-lg font-semibold mb-6">{t('profile.edit_sections', 'Edit Sections')}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('profile.choose_sections', 'Choose which sections to display on your profile')}
              </p>
            </SheetContent>
          </Sheet>
        </div>
        <p className="text-muted-foreground mb-6">
          {t('profile.update_info', 'Update your profile information to help others get to know you better.')}
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BasicInfoSection profileData={profileData} />
          <InterestsSection profileData={profileData} />
          <AboutMeSection profileData={profileData} />
          <LanguagesSection profileData={profileData} />
          <LocationSection profileData={profileData} />
        </div>
      </div>
    </div>
  );
};

export default ProfileSections;
