import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { 
  Settings, Heart, Camera, CheckCircle2, Share2, ChevronRight,
  User, Dumbbell, Star, Briefcase, MapPin, Pencil, Plus, Shield
} from 'lucide-react';
import PhotoManagement from '@/components/my-profile/PhotoManagement';
import PrivacySettings from '@/components/my-profile/PrivacySettings';
import { ProfileData, KurdistanRegion } from '@/types/profile';
import EditableAboutMeSection from '@/components/my-profile/sections/EditableAboutMeSection';
import BasicInfoEditor from '@/components/my-profile/sections/editors/BasicInfoEditor';
import LifestyleEditor from '@/components/my-profile/sections/editors/LifestyleEditor';
import ValuesPersonalityEditor from '@/components/my-profile/sections/editors/ValuesPersonalityEditor';
import InterestsHobbiesEditor from '@/components/my-profile/sections/editors/InterestsHobbiesEditor';
import EducationCareerEditor from '@/components/my-profile/sections/editors/EducationCareerEditor';
import RelationshipPreferencesEditor from '@/components/my-profile/sections/editors/RelationshipPreferencesEditor';

import { useRealProfileData } from '@/hooks/useRealProfileData';
import { toast } from 'sonner';
import { uploadProfilePhoto } from '@/api/profiles';

const profileSections = [
  { id: 'basic', label: 'Basic Info', icon: User, component: BasicInfoEditor },
  { id: 'lifestyle', label: 'Lifestyle', icon: Dumbbell, component: LifestyleEditor },
  { id: 'values', label: 'Values & Beliefs', icon: Star, component: ValuesPersonalityEditor },
  { id: 'interests', label: 'Interests & Hobbies', icon: Heart, component: InterestsHobbiesEditor },
  { id: 'career', label: 'Career & Education', icon: Briefcase, component: EducationCareerEditor },
  { id: 'relationship', label: 'Relationship Goals', icon: Heart, component: RelationshipPreferencesEditor },
];

const MyProfile = () => {
  const navigate = useNavigate();
  const [openSheet, setOpenSheet] = useState<string | null>(null);
  
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

  const getSectionCompletion = (id: string) => {
    if (!categoryProgress) return 0;
    switch (id) {
      case 'basic': return categoryProgress.basicInfo || 0;
      case 'lifestyle': return categoryProgress.lifestyle || 0;
      case 'values': return categoryProgress.valuesAndBeliefs || 0;
      case 'interests': return categoryProgress.interestsAndHobbies || 0;
      case 'career': return categoryProgress.careerAndEducation || 0;
      case 'relationship': return categoryProgress.relationshipGoals || 0;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-28">
        {/* Header with settings */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/10">
          <div className="max-w-md mx-auto px-4 h-12 flex items-center justify-between">
            <h1 className="text-lg font-bold text-foreground">Profile</h1>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" onClick={() => navigate('/settings')}>
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Hero section with gradient bg */}
        <div className="relative">
          <div className="h-28 bg-gradient-to-b from-primary/20 to-background" />
          <div className="max-w-md mx-auto px-4 -mt-16 flex flex-col items-center">
            {/* Profile image */}
            <div className="relative mb-3">
              <Avatar className="h-24 w-24 ring-4 ring-background shadow-xl">
                <AvatarImage src={galleryImages[0]} alt={profileData.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {profileData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <label className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-primary flex items-center justify-center cursor-pointer shadow-lg">
                <Camera className="h-4 w-4 text-primary-foreground" />
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            {/* Name + verified + age */}
            <div className="flex items-center gap-1.5 mb-1">
              <h2 className="text-xl font-bold text-foreground">{profileData.name}</h2>
              {profileData.verified && <CheckCircle2 className="h-5 w-5 text-primary fill-primary" />}
              {profileData.age > 0 && <span className="text-muted-foreground font-medium">, {profileData.age}</span>}
            </div>

            {/* Occupation + location */}
            {profileData.occupation && (
              <p className="text-sm text-muted-foreground">{profileData.occupation}</p>
            )}
            {profileData.location && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />{profileData.location}
              </p>
            )}

            <div className="flex gap-1.5 mt-2">
              <Badge className="bg-primary/15 text-primary border-primary/20 text-xs rounded-full">{profileData.kurdistanRegion}</Badge>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto mt-4 space-y-3">
          {/* Stats card */}
          <div className="mx-4 bg-card rounded-2xl p-4 shadow-md">
            <div className="flex justify-around">
              {[
                { value: profileStats.views, label: 'Views' },
                { value: profileStats.likes, label: 'Likes' },
                { value: profileStats.matches, label: 'Matches' },
              ].map((stat, i) => (
                <React.Fragment key={stat.label}>
                  {i > 0 && <div className="w-px bg-border/30" />}
                  <div className="text-center px-4">
                    <div className="text-xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Completion banner */}
          {profileCompletion < 100 && (
            <div className="mx-4 bg-gradient-to-r from-primary/15 to-accent/15 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-4">
                {/* Circular progress ring */}
                <div className="relative w-14 h-14 flex-shrink-0">
                  <svg viewBox="0 0 56 56" className="w-14 h-14 -rotate-90">
                    <circle cx="28" cy="28" r="24" fill="none" strokeWidth="4" className="stroke-muted/30" />
                    <circle cx="28" cy="28" r="24" fill="none" strokeWidth="4" className="stroke-primary"
                      strokeDasharray={`${(profileCompletion / 100) * 150.8} 150.8`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">
                    {profileCompletion}%
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">Complete your profile</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Fill in missing details to get more matches</p>
                </div>
                <Button size="sm" className="rounded-full h-9 px-4 text-xs" onClick={() => {
                  const incomplete = profileSections.find(s => getSectionCompletion(s.id) < 100);
                  if (incomplete) setOpenSheet(incomplete.id);
                }}>
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="mx-4 flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 h-11 rounded-2xl text-sm font-medium"
              onClick={() => navigate(`/profile/${realProfileData?.id}`)}
            >
              <Share2 className="h-4 w-4 mr-1.5" />
              Share Profile
            </Button>
            <Button variant="outline" size="sm" className="flex-1 h-11 rounded-2xl text-sm font-medium"
              onClick={() => setOpenSheet('basic')}
            >
              <Pencil className="h-4 w-4 mr-1.5" />
              Edit Profile
            </Button>
          </div>

          {/* Bio card */}
          <div className="mx-4">
            <EditableAboutMeSection bio={profileData.bio} onSave={handleBioSave} profileData={profileData} />
          </div>

          {/* Quick info section cards */}
          <div className="mx-4 space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-1">Profile Sections</h3>
            {profileSections.map((section) => {
              const completion = getSectionCompletion(section.id);
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setOpenSheet(section.id)}
                  className="w-full bg-card rounded-2xl p-4 shadow-sm flex items-center gap-3 active:scale-[0.98] transition-transform"
                >
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-foreground">{section.label}</p>
                  </div>
                  <Badge className={`text-xs px-2 py-0.5 rounded-full ${
                    completion === 100 
                      ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/20' 
                      : completion > 50 
                      ? 'bg-amber-500/15 text-amber-500 border-amber-500/20' 
                      : 'bg-red-500/15 text-red-500 border-red-500/20'
                  }`}>
                    {completion}%
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              );
            })}
          </div>

          {/* Photo Grid card */}
          <div className="mx-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">Photos</h3>
            <div className="bg-card rounded-2xl p-3 shadow-sm">
              <div className="grid grid-cols-3 gap-2">
                {galleryImages.slice(0, 6).map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
                    <img src={img} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    {i === 0 && (
                      <div className="absolute top-1.5 left-1.5">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400 drop-shadow" />
                      </div>
                    )}
                  </div>
                ))}
                {galleryImages.length < 6 && (
                  <label className="aspect-square rounded-2xl border-2 border-dashed border-border/40 flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <Plus className="w-6 h-6 text-muted-foreground" />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Privacy & Visibility Settings */}
          <div className="mx-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">Privacy & Visibility</h3>
            <PrivacySettings />
          </div>
        </div>
      </div>

      {/* Bottom sheets for editing sections */}
      {profileSections.map((section) => {
        const EditorComponent = section.component;
        return (
          <Sheet key={section.id} open={openSheet === section.id} onOpenChange={(open) => !open && setOpenSheet(null)}>
            <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto bg-background">
              <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full mx-auto mb-4 mt-2" />
              <SheetHeader className="pb-4">
                <SheetTitle className="text-foreground text-lg">{section.label}</SheetTitle>
              </SheetHeader>
              <EditorComponent 
                profileData={profileData} 
                fieldSources={fieldSources}
                onUpdate={handleProfileUpdate}
              />
            </SheetContent>
          </Sheet>
        );
      })}
    </div>
  );
};

export default MyProfile;
