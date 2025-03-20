
import React from 'react';
import { 
  User, Heart, BookOpen, Languages, MapPin, Pencil
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import DetailEditor from '@/components/DetailEditor';
import type { KurdistanRegion } from '@/types/profile';

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
}

const ProfileSections: React.FC<ProfileSectionsProps> = ({ profileData }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Profile Sections</h2>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
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
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full justify-between h-auto p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">Basic Info</h3>
                    <p className="text-sm text-muted-foreground">Height, body type, ethnicity</p>
                  </div>
                </div>
                <Pencil size={16} className="text-muted-foreground" />
              </Button>
            </SheetTrigger>
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
          </Sheet>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full justify-between h-auto p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary/10">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">Interests</h3>
                    <p className="text-sm text-muted-foreground">Hobbies, activities, passions</p>
                  </div>
                </div>
                <Pencil size={16} className="text-muted-foreground" />
              </Button>
            </SheetTrigger>
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
          </Sheet>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full justify-between h-auto p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">About Me</h3>
                    <p className="text-sm text-muted-foreground">Bio, lifestyle, values</p>
                  </div>
                </div>
                <Pencil size={16} className="text-muted-foreground" />
              </Button>
            </SheetTrigger>
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
          </Sheet>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full justify-between h-auto p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary/10">
                    <Languages className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">Languages</h3>
                    <p className="text-sm text-muted-foreground">Languages you speak</p>
                  </div>
                </div>
                <Pencil size={16} className="text-muted-foreground" />
              </Button>
            </SheetTrigger>
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
          </Sheet>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full justify-between h-auto p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">Location</h3>
                    <p className="text-sm text-muted-foreground">Where you're from</p>
                  </div>
                </div>
                <Pencil size={16} className="text-muted-foreground" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
              <ScrollArea className="h-[calc(100vh-5rem)]">
                <div className="py-6 pr-6">
                  <h3 className="text-lg font-semibold mb-6">Location Information</h3>
                  <DetailEditor
                    icon={<MapPin size={18} />}
                    title="Your Location"
                    fields={[
                      { name: 'location', label: 'City & State', value: profileData.location },
                      { name: 'kurdistanRegion', label: 'Kurdistan Region', value: profileData.kurdistanRegion, type: 'select', 
                        options: ['West-Kurdistan', 'East-Kurdistan', 'North-Kurdistan', 'South-Kurdistan'] }
                    ]}
                  />
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default ProfileSections;
