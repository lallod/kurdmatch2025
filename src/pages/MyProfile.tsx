import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Pencil, Settings, Eye, Heart, Camera, Shield, Sparkles, TrendingUp, Users, Clock, CheckCircle2, Star, Grid3X3, Share2
} from 'lucide-react';
import PhotoManagement from '@/components/my-profile/PhotoManagement';
import AccountSettings from '@/components/my-profile/AccountSettings';
import { ProfileData, KurdistanRegion } from '@/types/profile';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EditableAboutMeSection from '@/components/my-profile/sections/EditableAboutMeSection';
import ComprehensiveProfileEditor from '@/components/my-profile/sections/ComprehensiveProfileEditor';
import BottomNavigation from '@/components/BottomNavigation';
import { useRealProfileData } from '@/hooks/useRealProfileData';
import { toast } from 'sonner';
import { uploadProfilePhoto } from '@/api/profiles';

const MyProfile = () => {
  const navigate = useNavigate();
  const [isEditingSections, setIsEditingSections] = useState(false);
  const [profileBgColor, setProfileBgColor] = useState("#F1F0FB");
  
  const { 
    profileData: realProfileData, fieldSources = {}, loading, onboardingProgress, categoryProgress, engagement, updateProfileData, refreshData 
  } = useRealProfileData();

  const profileData: ProfileData = realProfileData ? {
    name: realProfileData.name || '',
    age: realProfileData.age || 0,
    location: realProfileData.location || '',
    occupation: realProfileData.occupation || '',
    lastActive: realProfileData.last_active || '',
    verified: realProfileData.verified || false,
    profileImage: realProfileData.profile_image || '',
    distance: 0,
    kurdistanRegion: (realProfileData.kurdistan_region as KurdistanRegion) || "South-Kurdistan",
    bio: realProfileData.bio || '',
    height: realProfileData.height || '',
    bodyType: realProfileData.body_type || '',
    ethnicity: realProfileData.ethnicity || '',
    religion: realProfileData.religion || '',
    politicalViews: realProfileData.political_views || '',
    values: realProfileData.values || [],
    interests: realProfileData.interests || [],
    hobbies: realProfileData.hobbies || [],
    languages: realProfileData.languages || [],
    education: realProfileData.education || '',
    company: realProfileData.company || '',
    relationshipGoals: realProfileData.relationship_goals || '',
    wantChildren: realProfileData.want_children || '',
    havePets: realProfileData.have_pets || '',
    exerciseHabits: realProfileData.exercise_habits || '',
    zodiacSign: realProfileData.zodiac_sign || '',
    personalityType: realProfileData.personality_type || '',
    sleepSchedule: realProfileData.sleep_schedule || '',
    travelFrequency: realProfileData.travel_frequency || '',
    communicationStyle: realProfileData.communication_style || '',
    loveLanguage: realProfileData.love_language || '',
    creativePursuits: realProfileData.creative_pursuits || [],
    weekendActivities: realProfileData.weekend_activities || [],
    dietaryPreferences: realProfileData.dietary_preferences || '',
    smoking: realProfileData.smoking || '',
    drinking: realProfileData.drinking || '',
    idealDate: realProfileData.ideal_date || '',
    workLifeBalance: realProfileData.work_life_balance || '',
    careerAmbitions: realProfileData.career_ambitions || ''
  } : {
    name: '', age: 0, location: '', occupation: '', lastActive: '', verified: false, profileImage: '', distance: 0,
    kurdistanRegion: "South-Kurdistan" as KurdistanRegion, bio: '', height: '', bodyType: '', ethnicity: '',
    religion: '', politicalViews: '', values: [], interests: [], hobbies: [], languages: [], education: '',
    company: '', relationshipGoals: '', wantChildren: '', havePets: '', exerciseHabits: '', zodiacSign: '',
    personalityType: '', sleepSchedule: '', travelFrequency: '', communicationStyle: '', loveLanguage: '',
    petPeeves: [], dreamVacation: '', weekendActivities: [], financialHabits: '', idealDate: '', childrenStatus: '',
    familyCloseness: '', friendshipStyle: '', workLifeBalance: '', careerAmbitions: '', dietaryPreferences: '',
    favoriteQuote: '', morningRoutine: '', eveningRoutine: '', favoriteSeason: '', idealWeather: '',
    creativePursuits: [], dreamHome: '', transportationPreference: '', techSkills: [], musicInstruments: [],
    favoriteGames: [], favoritePodcasts: [], favoriteBooks: [], favoriteMovies: [], favoriteMusic: [],
    favoriteFoods: [], charityInvolvement: '', growthGoals: [], hiddenTalents: [], favoriteMemory: '',
    stressRelievers: [], workEnvironment: '', decisionMakingStyle: '', smoking: '', drinking: ''
  };

  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    if (profileData.profileImage) setGalleryImages([profileData.profileImage]);
  }, [profileData.profileImage]);

  const profileCompletion = categoryProgress?.overall || 0;
  const profileStats = {
    views: engagement?.profileViews || 0,
    likes: engagement?.likesReceived || 0,
    matches: engagement?.totalMatches || 0,
    messages: engagement?.messagesReceived || 0
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      try {
        const isPrimary = galleryImages.length === 0;
        const photo = await uploadProfilePhoto(files[0], isPrimary);
        setGalleryImages(prev => [photo, ...prev]);
        toast.success(isPrimary ? 'Profile photo set' : 'Photo uploaded');
      } catch (error) {
        console.error('Photo upload failed:', error);
        toast.error('Failed to upload photo');
      }
    }
  };

  const removeImage = (index: number) => setGalleryImages(prev => prev.filter((_, i) => i !== index));
  const setAsProfilePic = (index: number) => {
    if (index === 0) return;
    const newGallery = [...galleryImages];
    [newGallery[0], newGallery[index]] = [newGallery[index], newGallery[0]];
    setGalleryImages(newGallery);
  };

  const handleBioSave = async (newBio: string) => {
    try {
      await updateProfileData({ bio: newBio });
      toast.success('Bio updated successfully');
      refreshData();
    } catch (error) { toast.error('Failed to update bio'); }
  };

  const handleProfileUpdate = async (updates: Partial<ProfileData>) => {
    try {
      const dbUpdates: any = {};
      if (updates.height) dbUpdates.height = updates.height;
      if (updates.bodyType) dbUpdates.body_type = updates.bodyType;
      if (updates.ethnicity) dbUpdates.ethnicity = updates.ethnicity;
      if (updates.religion) dbUpdates.religion = updates.religion;
      if (updates.politicalViews) dbUpdates.political_views = updates.politicalViews;
      if (updates.values) dbUpdates.values = updates.values;
      if (updates.interests) dbUpdates.interests = updates.interests;
      if (updates.hobbies) dbUpdates.hobbies = updates.hobbies;
      if (updates.languages) dbUpdates.languages = updates.languages;
      if (updates.education) dbUpdates.education = updates.education;
      if (updates.company) dbUpdates.company = updates.company;
      if (updates.relationshipGoals) dbUpdates.relationship_goals = updates.relationshipGoals;
      if (updates.wantChildren) dbUpdates.want_children = updates.wantChildren;
      if (updates.havePets) dbUpdates.have_pets = updates.havePets;
      if (updates.exerciseHabits) dbUpdates.exercise_habits = updates.exerciseHabits;
      if (updates.zodiacSign) dbUpdates.zodiac_sign = updates.zodiacSign;
      if (updates.personalityType) dbUpdates.personality_type = updates.personalityType;
      if (updates.sleepSchedule) dbUpdates.sleep_schedule = updates.sleepSchedule;
      if (updates.travelFrequency) dbUpdates.travel_frequency = updates.travelFrequency;
      if (updates.communicationStyle) dbUpdates.communication_style = updates.communicationStyle;
      if (updates.loveLanguage) dbUpdates.love_language = updates.loveLanguage;
      if (updates.creativePursuits) dbUpdates.creative_pursuits = updates.creativePursuits;
      if (updates.weekendActivities) dbUpdates.weekend_activities = updates.weekendActivities;
      if (updates.dietaryPreferences) dbUpdates.dietary_preferences = updates.dietaryPreferences;
      if (updates.smoking) dbUpdates.smoking = updates.smoking;
      if (updates.drinking) dbUpdates.drinking = updates.drinking;
      if (updates.idealDate) dbUpdates.ideal_date = updates.idealDate;
      if (updates.workLifeBalance) dbUpdates.work_life_balance = updates.workLifeBalance;
      if (updates.careerAmbitions) dbUpdates.career_ambitions = updates.careerAmbitions;
      await updateProfileData(dbUpdates);
      toast.success('Profile updated successfully');
      refreshData();
    } catch (error) { toast.error('Failed to update profile'); }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-24">
        {/* Slim header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border/30">
          <div className="max-w-lg mx-auto px-4 h-11 flex items-center justify-between">
            <h1 className="text-base font-semibold text-foreground">{profileData.name || 'Profile'}</h1>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('/settings')}>
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 py-4">
          {/* Profile completion bar */}
          {profileCompletion < 100 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Profile {profileCompletion}% complete</span>
              </div>
              <Progress value={profileCompletion} className="h-1 bg-muted" />
            </div>
          )}

          {/* Instagram-style profile header */}
          <div className="flex items-start gap-6 mb-4">
            <div className="relative flex-shrink-0">
              <Avatar className="h-20 w-20 ring-2 ring-border">
                <AvatarImage src={galleryImages[0]} alt={profileData.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {profileData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <label className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center cursor-pointer">
                <Camera className="h-3 w-3 text-primary-foreground" />
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            {/* Stats row */}
            <div className="flex-1 flex justify-around pt-2">
              <div className="text-center">
                <div className="text-lg font-bold text-foreground">{profileStats.views}</div>
                <div className="text-xs text-muted-foreground">Views</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-foreground">{profileStats.likes}</div>
                <div className="text-xs text-muted-foreground">Likes</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-foreground">{profileStats.matches}</div>
                <div className="text-xs text-muted-foreground">Matches</div>
              </div>
            </div>
          </div>

          {/* Name + bio */}
          <div className="mb-3">
            <div className="flex items-center gap-1.5">
              <h2 className="font-semibold text-foreground">{profileData.name}</h2>
              {profileData.verified && <CheckCircle2 className="h-4 w-4 text-primary fill-primary" />}
              <span className="text-muted-foreground text-sm">{profileData.age}</span>
            </div>
            {profileData.occupation && <p className="text-sm text-muted-foreground">{profileData.occupation}</p>}
            {profileData.location && <p className="text-sm text-muted-foreground">{profileData.location}</p>}
            {profileData.bio && <p className="text-sm text-foreground mt-1">{profileData.bio}</p>}
            <div className="flex gap-1.5 mt-2">
              <Badge className="bg-primary/15 text-primary border-primary/20 text-xs">{profileData.kurdistanRegion}</Badge>
              <Badge className="bg-muted text-muted-foreground text-xs">Online now</Badge>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-sm"
              onClick={() => {
                const el = document.getElementById('profile-sections');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Pencil className="h-3.5 w-3.5 mr-1.5" />
              Edit Profile
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-sm"
              onClick={() => navigate(`/profile/${realProfileData?.id}`)}
            >
              <Share2 className="h-3.5 w-3.5 mr-1.5" />
              Share Profile
            </Button>
          </div>

          {/* Underline icon tabs */}
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="w-full h-auto p-0 bg-transparent border-t border-border/20 rounded-none grid grid-cols-3">
              <TabsTrigger
                value="profile"
                className="py-2.5 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-foreground text-muted-foreground data-[state=active]:text-foreground"
              >
                <Grid3X3 className="h-5 w-5" />
              </TabsTrigger>
              <TabsTrigger
                value="photos"
                className="py-2.5 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-foreground text-muted-foreground data-[state=active]:text-foreground"
              >
                <Camera className="h-5 w-5" />
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="py-2.5 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-foreground text-muted-foreground data-[state=active]:text-foreground"
              >
                <Settings className="h-5 w-5" />
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-4 mt-4">
              <EditableAboutMeSection bio={profileData.bio} onSave={handleBioSave} profileData={profileData} />
              <div id="profile-sections">
                <ComprehensiveProfileEditor
                  profileData={profileData}
                  categoryProgress={categoryProgress}
                  fieldSources={fieldSources}
                  onUpdateProfile={handleProfileUpdate}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="photos" className="mt-4">
              <PhotoManagement 
                galleryImages={galleryImages}
                onImageUpload={handleImageUpload}
                removeImage={removeImage}
                setAsProfilePic={setAsProfilePic}
              />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-4">
              <AccountSettings />
            </TabsContent>
          </Tabs>
        </div>

        <Dialog open={isEditingSections} onOpenChange={setIsEditingSections}>
          <DialogContent className="sm:max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Edit Profile Sections</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <p className="text-sm text-muted-foreground">Choose which sections to display on your profile</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default MyProfile;
