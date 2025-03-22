
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import DetailEditor from '@/components/DetailEditor';
import { User, Map, Church, Heart, BookOpen, Brain, Cpu, Home, Wine, Languages, Briefcase, Calendar, Coffee, Bike, Camera, Smartphone } from 'lucide-react';

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
                { name: "ethnicity", label: "Ethnicity", value: "Kurdish", type: "select" },
                { name: "zodiacSign", label: "Zodiac Sign", value: "Libra", type: "select" },
                { name: "personalityType", label: "Personality Type", value: "ENFJ", type: "select" },
                { name: "education", label: "Education", value: "Master's Degree", type: "select" },
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
                { name: "sportsActivities", label: "Sports & Activities", value: "Running, Yoga, Hiking, Swimming",
                  type: "listInput" },
                { name: "creativeHobbies", label: "Creative Pursuits", value: "Photography, Writing, Painting, Music", 
                  type: "listInput" },
              ]}
              listMode={true}
            />
            
            <Separator className="bg-gradient-to-r from-tinder-rose/20 to-tinder-orange/20" />
            
            <DetailEditor 
              icon={<Church size={18} />} 
              title="Beliefs & Values" 
              fields={[
                { name: "religion", label: "Religion", value: "Spiritual", type: "select" },
                { name: "politicalViews", label: "Political Views", value: "Moderate", type: "select" },
                { name: "values", label: "Core Values", value: "Honesty, Kindness, Growth, Balance", type: "listInput" },
                { name: "charityInvolvement", label: "Charity/Volunteer Work", value: "Environmental conservation, Mentoring" },
              ]}
              selectionMode={true}
            />
            
            <Separator className="bg-gradient-to-r from-tinder-rose/20 to-tinder-orange/20" />
            
            <DetailEditor 
              icon={<Heart size={18} />} 
              title="Relationship" 
              fields={[
                { name: "relationshipGoals", label: "Relationship Goals", value: "Looking for a serious relationship", type: "select" },
                { name: "relationshipType", label: "Relationship Type", value: "Monogamous", type: "select" },
                { name: "wantChildren", label: "Children Plans", value: "Open to children", type: "select" },
                { name: "childrenStatus", label: "Children Status", value: "No children", type: "select" },
                { name: "familyCloseness", label: "Family Closeness", value: "Very close with family", type: "select" },
                { name: "friendshipStyle", label: "Friendship Style", value: "Small circle of close friends" },
                { name: "loveLanguage", label: "Love Language", value: "Quality Time, Words of Affirmation", type: "select" },
                { name: "idealDate", label: "Ideal Date", value: "A hike followed by dinner at a local restaurant" },
                { name: "idealDateActivities", label: "Date Activities", value: "Museum visits, Live music, Cooking together", type: "listInput" },
              ]}
              selectionMode={true}
            />
            
            <Separator className="bg-gradient-to-r from-tinder-rose/20 to-tinder-orange/20" />
            
            <DetailEditor 
              icon={<Wine size={18} />} 
              title="Lifestyle Habits" 
              fields={[
                { name: "drinking", label: "Drinking", value: "Socially", type: "select" },
                { name: "smoking", label: "Smoking", value: "Never", type: "select" },
                { name: "exerciseHabits", label: "Exercise Habits", value: "Regular - 4-5 times per week", type: "select" },
                { name: "sleepSchedule", label: "Sleep Schedule", value: "Early bird", type: "select" },
                { name: "financialHabits", label: "Financial Habits", value: "Saver with occasional splurges", type: "select" },
                { name: "dietaryPreferences", label: "Dietary Preferences", value: "Mostly plant-based, occasional seafood", type: "select" },
                { name: "livingArrangement", label: "Living Arrangement", value: "Live alone", type: "select" },
                { name: "petsOwned", label: "Pets", value: "Dog", type: "select" },
              ]}
              selectionMode={true}
            />
            
            <Separator className="bg-gradient-to-r from-tinder-rose/20 to-tinder-orange/20" />
            
            <DetailEditor 
              icon={<Briefcase size={18} />} 
              title="Work & Career" 
              fields={[
                { name: "occupation", label: "Occupation", value: "UX Designer" },
                { name: "company", label: "Company/Industry", value: "Tech startup" },
                { name: "workLifeBalance", label: "Work-Life Balance", value: "Values boundaries between work and personal life", type: "select" },
                { name: "careerAmbitions", label: "Career Ambitions", value: "Working towards creative director position" },
                { name: "workEnvironment", label: "Work Environment", value: "Creative, collaborative spaces with natural light" },
              ]}
              selectionMode={true}
            />
            
            <Separator className="bg-gradient-to-r from-tinder-rose/20 to-tinder-orange/20" />
            
            <DetailEditor 
              icon={<Calendar size={18} />} 
              title="Daily Life" 
              fields={[
                { name: "weekendActivities", label: "Weekend Activities", value: "Farmers markets, Hiking trails, Art exhibitions, Cozy coffee shops" },
                { name: "morningRoutine", label: "Morning Routine", value: "Meditation, coffee, and morning walk before work" },
                { name: "eveningRoutine", label: "Evening Routine", value: "Reading with herbal tea, journaling, and early to bed" },
                { name: "stressRelievers", label: "Stress Relievers", value: "Yoga, Forest walks, Pottery class", 
                  type: "listInput" },
              ]}
              selectionMode={true}
            />
            
            <Separator className="bg-gradient-to-r from-tinder-rose/20 to-tinder-orange/20" />
            
            <DetailEditor 
              icon={<Map size={18} />} 
              title="Travel & Adventure" 
              fields={[
                { name: "travelFrequency", label: "Travel Frequency", value: "Several times per year", type: "select" },
                { name: "dreamVacation", label: "Dream Vacation", value: "Backpacking through Southeast Asia" },
                { name: "transportationPreference", label: "Transportation", value: "Bicycle for local, train for travel" },
              ]}
              selectionMode={true}
            />
            
            <Separator className="bg-gradient-to-r from-tinder-rose/20 to-tinder-orange/20" />
            
            <DetailEditor 
              icon={<Languages size={18} />} 
              title="Communication" 
              fields={[
                { name: "languages", label: "Languages", value: "English, Kurdish, Spanish", type: "listInput" },
                { name: "communicationStyle", label: "Communication Style", value: "Direct and thoughtful", type: "select" },
                { name: "decisionMakingStyle", label: "Decision Making Style", value: "Thoughtful and research-based, but also trust intuition" },
              ]}
              selectionMode={true}
            />
            
            <Separator className="bg-gradient-to-r from-tinder-rose/20 to-tinder-orange/20" />
            
            <DetailEditor 
              icon={<BookOpen size={18} />} 
              title="Favorites" 
              fields={[
                { name: "favoriteBooks", label: "Books", value: "The Alchemist, Thinking Fast and Slow, 1984", type: "listInput" },
                { name: "favoriteMovies", label: "Movies", value: "Eternal Sunshine of the Spotless Mind, Parasite, The Godfather", type: "listInput" },
                { name: "favoriteMusic", label: "Music", value: "Indie rock, Jazz, Electronic, Kurdish folk", type: "listInput" },
                { name: "favoriteFoods", label: "Foods", value: "Thai curry, Dolma, Persian kebabs, Italian pasta", type: "listInput" },
                { name: "favoritePodcasts", label: "Podcasts", value: "This American Life, RadioLab, How I Built This", type: "listInput" },
                { name: "favoriteGames", label: "Games", value: "Chess, Catan, The Last of Us", type: "listInput" },
                { name: "favoriteSeason", label: "Favorite Season", value: "Fall", type: "select" },
                { name: "favoriteQuote", label: "Favorite Quote", value: "The only way to do great work is to love what you do." },
              ]}
              listMode={true}
            />
            
            <Separator className="bg-gradient-to-r from-tinder-rose/20 to-tinder-orange/20" />
            
            <DetailEditor 
              icon={<Brain size={18} />} 
              title="Personality & Growth" 
              fields={[
                { name: "petPeeves", label: "Pet Peeves", value: "Tardiness, Poor communication, Rudeness to service workers", 
                  type: "listInput" },
                { name: "growthGoals", label: "Growth Goals", value: "Improve public speaking, Learn a new language, Start a side business", 
                  type: "listInput" },
                { name: "hiddenTalents", label: "Hidden Talents", value: "Perfect pitch, Can identify most typefaces by name", 
                  type: "listInput" },
                { name: "favoriteMemory", label: "Favorite Memory", value: "Watching sunrise from a mountain peak after an overnight hike" },
              ]}
              selectionMode={true}
            />
            
            <Separator className="bg-gradient-to-r from-tinder-rose/20 to-tinder-orange/20" />
            
            <DetailEditor 
              icon={<Home size={18} />} 
              title="Home & Lifestyle" 
              fields={[
                { name: "dreamHome", label: "Dream Home", value: "Mountain cabin with modern interior and large windows" },
                { name: "idealWeather", label: "Ideal Weather", value: "Slightly cool with sunshine" },
              ]}
              selectionMode={true}
            />
            
            <Separator className="bg-gradient-to-r from-tinder-rose/20 to-tinder-orange/20" />
            
            <DetailEditor 
              icon={<Smartphone size={18} />} 
              title="Skills & Talents" 
              fields={[
                { name: "techSkills", label: "Tech Skills", value: "UI/UX design, Figma, Adobe Creative Suite, Basic coding", 
                  type: "listInput" },
                { name: "musicInstruments", label: "Musical Instruments", value: "Guitar (intermediate), Piano (beginner)", 
                  type: "listInput" },
                { name: "creativePursuits", label: "Creative Pursuits", value: "Watercolor painting, Digital illustration, Handmade ceramics", 
                  type: "listInput" },
              ]}
              listMode={true}
            />
          </div>
        </CardContent>
      </Card>
    </ScrollArea>
  );
};

export default DetailsTab;
