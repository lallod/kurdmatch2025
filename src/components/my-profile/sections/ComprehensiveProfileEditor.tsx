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
  categoryProgress?: {
    basicInfo: number;
    lifestyle: number;
    valuesAndBeliefs: number;
    interestsAndHobbies: number;
    careerAndEducation: number;
    relationshipGoals: number;
    overall: number;
  };
  onUpdateProfile: (updates: Partial<ProfileData>) => void;
}

const ComprehensiveProfileEditor: React.FC<ComprehensiveProfileEditorProps> = ({ 
  profileData, 
  categoryProgress,
  onUpdateProfile 
}) => {
  const [activeTab, setActiveTab] = useState('basic');

  const profileSections = [
    { 
      id: 'basic', 
      label: 'Basic Info', 
      icon: User,
      component: BasicInfoEditor,
      fields: ['name', 'age', 'height', 'ethnicity', 'languages', 'location', 'bodyType', 'kurdistanRegion']
    },
    { 
      id: 'lifestyle', 
      label: 'Lifestyle', 
      icon: Dumbbell,
      component: LifestyleEditor,
      fields: ['exerciseHabits', 'dietaryPreferences', 'smoking', 'drinking', 'sleepSchedule', 'havePets', 'travelFrequency']
    },
    { 
      id: 'values', 
      label: 'Values & Beliefs', 
      icon: Star,
      component: ValuesPersonalityEditor,
      fields: ['religion', 'values', 'zodiacSign', 'personalityType', 'politicalViews', 'communicationStyle']
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
      fields: ['occupation', 'education', 'company', 'careerAmbitions', 'workLifeBalance']
    },
    { 
      id: 'relationship', 
      label: 'Relationship Goals', 
      icon: Heart,
      component: RelationshipPreferencesEditor,
      fields: ['relationshipGoals', 'wantChildren', 'loveLanguage', 'idealDate']
    }
  ];

  const calculateSectionCompletion = (fields: string[]): number => {
    if (!profileData) return 0;
    
    // Use category progress if available
    if (categoryProgress) {
      const sectionId = profileSections.find(s => 
        JSON.stringify(s.fields) === JSON.stringify(fields)
      )?.id;
      
      switch (sectionId) {
        case 'basics':
          return categoryProgress.basicInfo;
        case 'lifestyle': 
          return categoryProgress.lifestyle;
        case 'values':
          return categoryProgress.valuesAndBeliefs;
        case 'interests':
          return categoryProgress.interestsAndHobbies;
        case 'career':
          return categoryProgress.careerAndEducation;
        case 'relationship':
          return categoryProgress.relationshipGoals;
        default:
          break;
      }
    }
    
    // Fallback calculation
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
          {/* Enhanced TabsList with mobile-first responsive design */}
          <div className="relative mb-6">
            <TabsList className="
              w-full h-auto p-2 
              bg-white/15 backdrop-blur-lg border border-white/30 
              rounded-2xl shadow-xl
              flex overflow-x-auto scrollbar-hide
              md:grid md:grid-cols-4 lg:grid-cols-7
              gap-1 md:gap-2
            ">
              {profileSections.map((section) => {
                const completion = calculateSectionCompletion(section.fields);
                const IconComponent = section.icon;
                
                return (
                  <TabsTrigger 
                    key={section.id}
                    value={section.id} 
                    className="
                      relative flex-shrink-0 min-w-[100px] h-auto
                      data-[state=active]:bg-gradient-to-r 
                      data-[state=active]:from-purple-500 
                      data-[state=active]:to-pink-500 
                      data-[state=active]:text-white 
                      data-[state=active]:shadow-lg
                      data-[state=active]:border-white/20
                      text-white/80 hover:text-white
                      flex flex-col items-center justify-center 
                      gap-1.5 p-3 md:p-4
                      rounded-xl transition-all duration-300
                      hover:bg-white/10
                      border border-transparent
                      data-[state=active]:scale-105
                      group
                    "
                  >
                    {/* Icon with enhanced visibility */}
                    <div className="
                      relative p-1.5 rounded-lg
                      bg-white/10 group-data-[state=active]:bg-white/20
                      transition-all duration-300
                    ">
                      <IconComponent className="
                        h-5 w-5 md:h-6 md:w-6
                        transition-all duration-300
                        group-data-[state=active]:scale-110
                      " />
                    </div>
                    
                    {/* Label with better typography */}
                    <span className="
                      text-xs md:text-sm font-medium
                      text-center leading-tight
                      group-data-[state=active]:font-semibold
                      transition-all duration-300
                    ">
                      {section.label}
                    </span>
                    
                    {/* Enhanced completion badge */}
                    <Badge 
                      className={`
                        text-xs px-2 py-0.5 font-bold
                        border transition-all duration-300
                        shadow-sm
                        ${completion === 100 
                          ? 'bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/20' 
                          : completion > 50 
                          ? 'bg-amber-500 text-white border-amber-400 shadow-amber-500/20' 
                          : 'bg-red-500 text-white border-red-400 shadow-red-500/20'
                        }
                      `}
                    >
                      {completion}%
                    </Badge>

                    {/* Active state glow effect */}
                    <div className="
                      absolute inset-0 rounded-xl
                      bg-gradient-to-r from-purple-500/20 to-pink-500/20
                      opacity-0 group-data-[state=active]:opacity-100
                      transition-opacity duration-300
                      pointer-events-none
                      blur-sm -z-10
                    " />
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* Mobile scroll indicators */}
            <div className="
              absolute left-0 top-0 bottom-0 w-8
              bg-gradient-to-r from-purple-900/50 to-transparent
              pointer-events-none rounded-l-2xl
              md:hidden
            " />
            <div className="
              absolute right-0 top-0 bottom-0 w-8
              bg-gradient-to-l from-purple-900/50 to-transparent
              pointer-events-none rounded-r-2xl
              md:hidden
            " />
          </div>

          {/* Tab content remains the same */}
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
