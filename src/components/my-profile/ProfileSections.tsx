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
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Profile Sections</h2>
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
                Edit Sections
              </Button>
            </SheetTrigger>
            <SheetContent>
              <h3 className="text-lg font-semibold mb-6">Edit Sections</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose which sections to display on your profile
              </p>
              {/* Section toggles would go here */}
            </SheetContent>
          </Sheet>
        </div>
        <p className="text-muted-foreground mb-6">
          Update your profile information to help others get to know you better.
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
