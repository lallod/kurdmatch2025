
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import DetailEditor from '@/components/DetailEditor';
import { User, Map, Church, Heart, BookOpen, Brain, Cpu } from 'lucide-react';

const DetailsTab = () => {
  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <Card className="mb-6 neo-card bg-white/80">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Cpu size={20} className="mr-2 text-tinder-rose" />
            <span>Personal Details</span>
          </CardTitle>
          <CardDescription>Edit your profile's personal information. AI will help optimize compatibility.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <DetailEditor 
              icon={<User size={18} />} 
              title="Basic Info" 
              fields={[
                { name: "height", label: "Height", value: "5'7\"", type: "select" },
                { name: "bodyType", label: "Body Type", value: "Athletic", type: "select" },
                { name: "ethnicity", label: "Ethnicity", value: "Mixed", type: "select" },
                { name: "zodiacSign", label: "Zodiac Sign", value: "Libra", type: "select" },
                { name: "personalityType", label: "Personality Type", value: "ENFJ", type: "select" },
              ]}
              selectionMode={true}
            />
            
            <Separator className="bg-gradient-to-r from-tinder-rose/20 to-tinder-orange/20" />
            
            <DetailEditor 
              icon={<Map size={18} />} 
              title="Interests & Hobbies" 
              fields={[
                { name: "interests", label: "Interests", value: "Hiking, Photography, Cooking, Yoga, Travel, Art, Reading, Board games", 
                  type: "listInput" },
                { name: "hobbies", label: "Hobbies", value: "Film photography, Ceramics, Rock climbing, Cooking new cuisines", 
                  type: "listInput" },
              ]}
              listMode={true}
            />
            
            <Separator className="bg-gradient-to-r from-tinder-rose/20 to-tinder-orange/20" />
            
            <DetailEditor 
              icon={<Church size={18} />} 
              title="Beliefs" 
              fields={[
                { name: "religion", label: "Religion", value: "Spiritual", type: "select" },
                { name: "politicalViews", label: "Political Views", value: "Moderate", type: "select" },
              ]}
              selectionMode={true}
            />
            
            <Separator className="bg-gradient-to-r from-tinder-rose/20 to-tinder-orange/20" />
            
            <DetailEditor 
              icon={<Heart size={18} />} 
              title="Relationship" 
              fields={[
                { name: "relationshipGoals", label: "Relationship Goals", value: "Looking for a serious relationship", type: "select" },
                { name: "wantChildren", label: "Children Plans", value: "Open to children", type: "select" },
                { name: "childrenStatus", label: "Children Status", value: "No children", type: "select" },
                { name: "familyCloseness", label: "Family Closeness", value: "Very close with family", type: "select" },
                { name: "friendshipStyle", label: "Friendship Style", value: "Small circle of close friends" },
                { name: "loveLanguage", label: "Love Language", value: "Quality Time, Words of Affirmation", type: "select", 
                  options: ["Quality Time", "Words of Affirmation", "Physical Touch", "Acts of Service", "Receiving Gifts"] },
                { name: "idealDate", label: "Ideal Date", value: "A hike followed by dinner at a local restaurant" },
              ]}
              selectionMode={true}
            />
            
            <Separator className="bg-gradient-to-r from-tinder-rose/20 to-tinder-orange/20" />
            
            <DetailEditor 
              icon={<BookOpen size={18} />} 
              title="Lifestyle & Interests" 
              fields={[
                { name: "exerciseHabits", label: "Exercise Habits", value: "Regular - 4-5 times per week", type: "select" },
                { name: "sleepSchedule", label: "Sleep Schedule", value: "Early bird", type: "select" },
                { name: "financialHabits", label: "Financial Habits", value: "Saver with occasional splurges", type: "select" },
                { name: "workLifeBalance", label: "Work-Life Balance", value: "Values boundaries between work and personal life", type: "select" },
                { name: "careerAmbitions", label: "Career Ambitions", value: "Working towards creative director position" },
                { name: "weekendActivities", label: "Weekend Activities", value: "Farmers markets, Hiking trails, Art exhibitions, Cozy coffee shops" },
                { name: "dreamVacation", label: "Dream Vacation", value: "Backpacking through Southeast Asia" },
                { name: "travelFrequency", label: "Travel Frequency", value: "Several times per year",
                  options: ["Never", "Rarely", "Yearly", "Several times per year", "Monthly"] },
                { name: "communicationStyle", label: "Communication Style", value: "Direct and thoughtful", type: "select" },
                { name: "petPeeves", label: "Pet Peeves", value: "Tardiness, Poor communication, Rudeness to service workers" },
              ]}
              selectionMode={true}
            />
            
            <Separator className="bg-gradient-to-r from-tinder-rose/20 to-tinder-orange/20" />
            
            <DetailEditor 
              icon={<Brain size={18} />} 
              title="Personality & Growth" 
              fields={[
                { name: "growthGoals", label: "Growth Goals", value: "Improve public speaking, Learn a new language, Start a side business", 
                  type: "listInput" },
                { name: "hiddenTalents", label: "Hidden Talents", value: "Perfect pitch, Can identify most typefaces by name", 
                  type: "listInput" },
                { name: "favoriteMemory", label: "Favorite Memory", value: "Watching sunrise from a mountain peak after an overnight hike" },
                { name: "stressRelievers", label: "Stress Relievers", value: "Yoga, Forest walks, Pottery class", 
                  type: "listInput" },
                { name: "charityInvolvement", label: "Charity Involvement", value: "Volunteer design work for environmental nonprofits" },
                { name: "decisionMakingStyle", label: "Decision Making Style", value: "Thoughtful and research-based, but also trust intuition" },
              ]}
              selectionMode={true}
            />
            
            <Separator className="bg-gradient-to-r from-tinder-rose/20 to-tinder-orange/20" />
            
            <DetailEditor 
              icon={<Cpu size={18} />} 
              title="Creative & Lifestyle" 
              fields={[
                { name: "creativePursuits", label: "Creative Pursuits", value: "Watercolor painting, Digital illustration, Handmade ceramics", 
                  type: "listInput" },
                { name: "dreamHome", label: "Dream Home", value: "Mountain cabin with modern interior and large windows" },
                { name: "transportationPreference", label: "Transportation", value: "Bicycle for local, train for travel" },
                { name: "techSkills", label: "Tech Skills", value: "UI/UX design, Figma, Adobe Creative Suite, Basic coding", 
                  type: "listInput" },
                { name: "workEnvironment", label: "Work Environment", value: "Creative, collaborative spaces with natural light" },
                { name: "favoriteSeason", label: "Favorite Season", value: "Fall", 
                  options: ["Spring", "Summer", "Fall", "Winter"] },
                { name: "idealWeather", label: "Ideal Weather", value: "Slightly cool with sunshine" },
                { name: "morningRoutine", label: "Morning Routine", value: "Meditation, coffee, and morning walk before work" },
                { name: "eveningRoutine", label: "Evening Routine", value: "Reading with herbal tea, journaling, and early to bed" },
                { name: "dietaryPreferences", label: "Dietary Preferences", value: "Mostly plant-based, occasional seafood" },
              ]}
              selectionMode={true}
            />
          </div>
        </CardContent>
      </Card>
    </ScrollArea>
  );
};

export default DetailsTab;
