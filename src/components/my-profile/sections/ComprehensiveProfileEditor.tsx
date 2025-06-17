
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ProfileData } from '@/types/profile';
import { 
  User, 
  Heart, 
  Briefcase, 
  Camera, 
  MapPin, 
  Star,
  Coffee,
  Music,
  Book,
  Dumbbell
} from 'lucide-react';
import BasicInfoEditor from './editors/BasicInfoEditor';
import LifestyleEditor from './editors/LifestyleEditor';
import ValuesPersonalityEditor from './editors/ValuesPersonalityEditor';
import InterestsHobbiesEditor from './editors/InterestsHobbiesEditor';
import CareerEducationEditor from './editors/CareerEducationEditor';
import FavoritesEditor from './editors/FavoritesEditor';
import RelationshipPreferencesEditor from './editors/RelationshipPreferencesEditor';

interface ComprehensiveProfileEditorProps {
  profileData: ProfileData;
  onUpdateProfile: (updates: Partial<ProfileData>) => void;
}

const ComprehensiveProfileEditor: React.FC<ComprehensiveProfileEditorProps> = ({
  profileData,
  onUpdateProfile
}) => {
  const [activeTab, setActiveTab] = useState('basic');

  const profileSections = [
    { 
      id: 'basic', 
      label: 'Basic Info', 
      icon: User,
      component: BasicInfoEditor,
      fields: ['name', 'age', 'height', 'ethnicity', 'languages', 'location']
    },
    { 
      id: 'lifestyle', 
      label: 'Lifestyle', 
      icon: Dumbbell,
      component: LifestyleEditor,
      fields: ['exerciseHabits', 'dietaryPreferences', 'smoking', 'drinking', 'sleepSchedule']
    },
    { 
      id: 'values', 
      label: 'Values & Beliefs', 
      icon: Star,
      component: ValuesPersonalityEditor,
      fields: ['religion', 'values', 'zodiacSign', 'personalityType']
    },
    { 
      id: 'interests', 
      label: 'Interests & Hobbies', 
      icon: Heart,
      component: InterestsHobbiesEditor,
      fields: ['interests', 'hobbies', 'creativePursuits', 'weekendActivities']
    },
    { 
      id: 'career', 
      label: 'Career & Education', 
      icon: Briefcase,
      component: CareerEducationEditor,
      fields: ['occupation', 'education', 'company', 'careerAmbitions']
    },
    { 
      id: 'favorites', 
      label: 'Favorites', 
      icon: Coffee,
      component: FavoritesEditor,
      fields: ['favoriteBooks', 'favoriteMovies', 'favoriteMusic', 'favoriteFoods']
    },
    { 
      id: 'relationship', 
      label: 'Relationship Goals', 
      icon: Heart,
      component: RelationshipPreferencesEditor,
      fields: ['relationshipGoals', 'childrenStatus', 'familyCloseness']
    }
  ];

  const calculateSectionCompletion = (fields: string[]) => {
    const completedFields = fields.filter(field => {
      const value = profileData[field as keyof ProfileData];
      if (Array.isArray(value)) return value.length > 0;
      return value && value !== '';
    });
    return Math.round((completedFields.length / fields.length) * 100);
  };

  return (
    <Card className="backdrop-blur-md bg-white/10 border border-white/20">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">Complete Profile</h3>
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            All Registration Data
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 lg:grid-cols-7 mb-6 bg-white/10 backdrop-blur border-white/20">
            {profileSections.map((section) => {
              const completion = calculateSectionCompletion(section.fields);
              const IconComponent = section.icon;
              
              return (
                <TabsTrigger 
                  key={section.id}
                  value={section.id} 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white text-purple-200 flex flex-col items-center gap-1 p-3"
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="text-xs">{section.label}</span>
                  <Badge 
                    className={`text-xs ${
                      completion === 100 
                        ? 'bg-green-500 text-white' 
                        : completion > 50 
                        ? 'bg-yellow-500 text-black' 
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {completion}%
                  </Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {profileSections.map((section) => {
            const EditorComponent = section.component;
            return (
              <TabsContent key={section.id} value={section.id} className="space-y-4">
                <EditorComponent 
                  profileData={profileData}
                  onUpdate={onUpdateProfile}
                />
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ComprehensiveProfileEditor;
