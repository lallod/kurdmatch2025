import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Pencil, 
  Settings, 
  Eye, 
  Heart, 
  Camera, 
  Shield, 
  Sparkles, 
  TrendingUp,
  Users,
  Clock,
  CheckCircle2,
  Star
} from 'lucide-react';
import PhotoManagement from '@/components/my-profile/PhotoManagement';
import AccountSettings from '@/components/my-profile/AccountSettings';
import { ProfileData, KurdistanRegion } from '@/types/profile';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EditableAboutMeSection from '@/components/my-profile/sections/EditableAboutMeSection';
import ComprehensiveProfileEditor from '@/components/my-profile/sections/ComprehensiveProfileEditor';
import BottomNavigation from '@/components/BottomNavigation';
import { useRealProfileData } from '@/hooks/useRealProfileData';

const MyProfile = () => {
  const [isEditingSections, setIsEditingSections] = useState(false);
  const [profileBgColor, setProfileBgColor] = useState("#F1F0FB");
  const { profileData: realProfileData, loading, updateProfileData } = useRealProfileData();

  // Convert real profile data to ProfileData format
  const profileData: ProfileData = realProfileData ? {
    name: realProfileData.name || "User",
    age: realProfileData.age || 18,
    location: realProfileData.location || "Not specified",
    occupation: realProfileData.occupation || "Not specified",
    lastActive: realProfileData.last_active || "Unknown",
    verified: realProfileData.verified || false,
    profileImage: realProfileData.profile_image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80",
    distance: 0,
    kurdistanRegion: (realProfileData.kurdistan_region as KurdistanRegion) || "South-Kurdistan",
    bio: realProfileData.bio || "Tell us about yourself...",
    height: realProfileData.height || "Not specified",
    bodyType: "Not specified",
    ethnicity: realProfileData.ethnicity || "Not specified",
    religion: realProfileData.religion || "Not specified",
    politicalViews: realProfileData.political_views || "Not specified",
    values: realProfileData.values || [],
    interests: realProfileData.interests || [],
    hobbies: realProfileData.hobbies || [],
    languages: realProfileData.languages || [],
    education: realProfileData.education || "Not specified",
    company: realProfileData.company || "Not specified",
    exerciseHabits: realProfileData.exercise_habits || "Not specified",
    relationshipGoals: realProfileData.relationship_goals || "Not specified",
    wantChildren: realProfileData.want_children || "Not specified",
    havePets: realProfileData.have_pets || "Not specified",
    drinking: realProfileData.drinking || "Not specified",
    smoking: realProfileData.smoking || "Not specified",
    dietaryPreferences: realProfileData.dietary_preferences || "Not specified",
    zodiacSign: realProfileData.zodiac_sign || "Not specified",
    personalityType: realProfileData.personality_type || "Not specified",
    sleepSchedule: realProfileData.sleep_schedule || "Not specified",
    communicationStyle: realProfileData.communication_style || "Not specified",
    favoriteBooks: realProfileData.favorite_books || [],
    favoriteMovies: realProfileData.favorite_movies || [],
    favoriteMusic: realProfileData.favorite_music || [],
    favoriteFoods: realProfileData.favorite_foods || [],
    favoriteGames: realProfileData.favorite_games || [],
    favoritePodcasts: realProfileData.favorite_podcasts || [],
    creativePursuits: realProfileData.creative_pursuits || [],
    weekendActivities: realProfileData.weekend_activities || [],
    musicInstruments: realProfileData.music_instruments || [],
    techSkills: realProfileData.tech_skills || [],
    dreamVacation: realProfileData.dream_vacation || "Not specified",
    idealDate: realProfileData.ideal_date || "Not specified",
    loveLanguage: realProfileData.love_language ? realProfileData.love_language.join(', ') : "Not specified",
    familyCloseness: realProfileData.family_closeness || "Not specified",
    childrenStatus: realProfileData.children_status || "Not specified"
  } : {
    name: "User",
    age: 18,
    location: "Not specified",
    occupation: "Not specified",
    lastActive: "Unknown",
    verified: false,
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80",
    distance: 0,
    kurdistanRegion: "South-Kurdistan",
    bio: "Tell us about yourself...",
    height: "Not specified",
    bodyType: "Not specified",
    ethnicity: "Not specified",
    religion: "Not specified",
    politicalViews: "Not specified",
    values: [],
    interests: [],
    hobbies: [],
    languages: []
  };
  
  const [galleryImages, setGalleryImages] = useState([
    profileData.profileImage,
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"
  ]);

  // Profile completion calculation based on real data
  const calculateProfileCompletion = () => {
    if (!realProfileData) return 0;
    
    let completed = 0;
    const total = 20;
    
    if (realProfileData.name) completed++;
    if (realProfileData.bio && realProfileData.bio.length > 50) completed++;
    if (realProfileData.interests && realProfileData.interests.length >= 3) completed++;
    if (realProfileData.occupation) completed++;
    if (realProfileData.languages && realProfileData.languages.length >= 1) completed++;
    if (realProfileData.height) completed++;
    if (realProfileData.values && realProfileData.values.length >= 3) completed++;
    if (realProfileData.hobbies && realProfileData.hobbies.length >= 2) completed++;
    if (realProfileData.verified) completed++;
    if (realProfileData.religion) completed++;
    if (realProfileData.ethnicity) completed++;
    if (realProfileData.exercise_habits) completed++;
    if (realProfileData.relationship_goals) completed++;
    if (realProfileData.education) completed++;
    if (realProfileData.want_children) completed++;
    if (realProfileData.have_pets) completed++;
    if (realProfileData.dietary_preferences) completed++;
    if (realProfileData.dream_vacation) completed++;
    if (realProfileData.ideal_date) completed++;
    if (realProfileData.kurdistan_region) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  // Mock stats data (this would come from analytics in a real app)
  const profileStats = {
    views: 234,
    likes: 89,
    matches: 12,
    messages: 7
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newImageUrl = URL.createObjectURL(files[0]);
      setGalleryImages(prev => [newImageUrl, ...prev]);
    }
  };

  const removeImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  const setAsProfilePic = (index: number) => {
    if (index === 0) return;
    const newGallery = [...galleryImages];
    [newGallery[0], newGallery[index]] = [newGallery[index], newGallery[0]];
    setGalleryImages(newGallery);
  };

  const handleBioSave = (newBio: string) => {
    updateProfileData({ bio: newBio });
  };

  const handleProfileUpdate = (updates: Partial<ProfileData>) => {
    console.log('Profile updated:', updates);
    // Convert ProfileData updates to DatabaseProfile format and update
    const dbUpdates: any = {};
    Object.entries(updates).forEach(([key, value]) => {
      // Map ProfileData keys to database column names
      if (key === 'kurdistanRegion') dbUpdates.kurdistan_region = value;
      else if (key === 'politicalViews') dbUpdates.political_views = value;
      else if (key === 'exerciseHabits') dbUpdates.exercise_habits = value;
      else if (key === 'relationshipGoals') dbUpdates.relationship_goals = value;
      else if (key === 'wantChildren') dbUpdates.want_children = value;
      else if (key === 'havePets') dbUpdates.have_pets = value;
      else if (key === 'dietaryPreferences') dbUpdates.dietary_preferences = value;
      else if (key === 'zodiacSign') dbUpdates.zodiac_sign = value;
      else if (key === 'personalityType') dbUpdates.personality_type = value;
      else if (key === 'sleepSchedule') dbUpdates.sleep_schedule = value;
      else if (key === 'communicationStyle') dbUpdates.communication_style = value;
      else if (key === 'favoriteBooks') dbUpdates.favorite_books = value;
      else if (key === 'favoriteMovies') dbUpdates.favorite_movies = value;
      else if (key === 'favoriteMusic') dbUpdates.favorite_music = value;
      else if (key === 'favoriteFoods') dbUpdates.favorite_foods = value;
      else if (key === 'favoriteGames') dbUpdates.favorite_games = value;
      else if (key === 'favoritePodcasts') dbUpdates.favorite_podcasts = value;
      else if (key === 'creativePursuits') dbUpdates.creative_pursuits = value;
      else if (key === 'weekendActivities') dbUpdates.weekend_activities = value;
      else if (key === 'musicInstruments') dbUpdates.music_instruments = value;
      else if (key === 'techSkills') dbUpdates.tech_skills = value;
      else if (key === 'dreamVacation') dbUpdates.dream_vacation = value;
      else if (key === 'idealDate') dbUpdates.ideal_date = value;
      else if (key === 'familyCloseness') dbUpdates.family_closeness = value;
      else if (key === 'childrenStatus') dbUpdates.children_status = value;
      else if (key === 'loveLanguage') dbUpdates.love_language = typeof value === 'string' ? [value] : value;
      else dbUpdates[key] = value;
    });
    updateProfileData(dbUpdates);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900">
        <div className="animate-bounce flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-4">
            <Heart size={40} className="text-purple-600 animate-pulse" />
          </div>
          <div className="text-white text-xl font-semibold">Loading your profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 pb-32">
      {/* Enhanced Mobile-Friendly Header */}
      <div className="bg-black/20 backdrop-blur shadow-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-6">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3 relative">
              <Settings className="w-6 h-6 md:w-8 md:h-8 text-white" />
              {profileCompletion < 100 && (
                <div className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full h-5 w-5 md:h-6 md:w-6 flex items-center justify-center font-bold animate-pulse">
                  !
                </div>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-300 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-purple-200 text-sm md:text-base">Manage your profile and settings</p>
            
            {/* Enhanced Mobile Profile Stats */}
            <div className="grid grid-cols-2 md:flex md:justify-center gap-2 md:gap-4 mt-4">
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-3 text-xs md:text-sm">
                <Eye className="w-3 h-3 mr-1" />
                {profileStats.views}
              </Badge>
              <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-3 text-xs md:text-sm">
                <Heart className="w-3 h-3 mr-1" />
                {profileStats.likes}
              </Badge>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 py-2 px-3 text-xs md:text-sm">
                <Users className="w-3 h-3 mr-1" />
                {profileStats.matches}
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 py-2 px-3 text-xs md:text-sm">
                <Sparkles className="w-3 h-3 mr-1" />
                New
              </Badge>
            </div>
            
            {/* Enhanced Mobile Profile Completion */}
            <div className="max-w-sm md:max-w-md mx-auto mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-purple-200">Profile Completion</span>
                <span className="text-sm font-bold text-white bg-white/10 px-2 py-1 rounded-full">
                  {profileCompletion}%
                </span>
              </div>
              <Progress value={profileCompletion} className="h-3 bg-white/10 rounded-full">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
                />
              </Progress>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-3 md:px-4 py-4 md:py-8">
        <div className="backdrop-blur-md bg-white/10 rounded-xl md:rounded-2xl shadow-2xl border border-white/20 p-3 md:p-6 relative overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 animate-pulse"></div>
          
          <div className="relative z-10">
            <Tabs defaultValue="profile" className="w-full">
              {/* Enhanced Mobile-Friendly TabsList */}
              <TabsList className="
                w-full h-auto p-2 mb-4 md:mb-6
                bg-white/10 backdrop-blur border border-white/20 
                rounded-xl shadow-lg
                grid grid-cols-3 gap-2
              ">
                <TabsTrigger 
                  value="profile" 
                  className="
                    h-16 md:h-12
                    data-[state=active]:bg-gradient-to-r 
                    data-[state=active]:from-purple-500 
                    data-[state=active]:to-pink-500 
                    data-[state=active]:text-white 
                    data-[state=active]:shadow-lg
                    text-white/80 hover:text-white
                    flex flex-col items-center justify-center 
                    gap-1 p-2
                    rounded-lg transition-all duration-300
                    hover:bg-white/10
                    text-xs md:text-sm font-medium
                  "
                >
                  <Settings className="h-5 w-5 md:h-4 md:w-4" />
                  <span>Profile</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="photos" 
                  className="
                    h-16 md:h-12
                    data-[state=active]:bg-gradient-to-r 
                    data-[state=active]:from-purple-500 
                    data-[state=active]:to-pink-500 
                    data-[state=active]:text-white 
                    data-[state=active]:shadow-lg
                    text-white/80 hover:text-white
                    flex flex-col items-center justify-center 
                    gap-1 p-2
                    rounded-lg transition-all duration-300
                    hover:bg-white/10
                    text-xs md:text-sm font-medium
                  "
                >
                  <Camera className="h-5 w-5 md:h-4 md:w-4" />
                  <span>Photos</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="settings" 
                  className="
                    h-16 md:h-12
                    data-[state=active]:bg-gradient-to-r 
                    data-[state=active]:from-purple-500 
                    data-[state=active]:to-pink-500 
                    data-[state=active]:text-white 
                    data-[state=active]:shadow-lg
                    text-white/80 hover:text-white
                    flex flex-col items-center justify-center 
                    gap-1 p-2
                    rounded-lg transition-all duration-300
                    hover:bg-white/10
                    text-xs md:text-sm font-medium
                  "
                >
                  <Shield className="h-5 w-5 md:h-4 md:w-4" />
                  <span>Settings</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="space-y-4 md:space-y-6">
                {/* Enhanced Mobile Profile Header Card */}
                <Card className="overflow-hidden backdrop-blur-md bg-white/10 border border-white/20">
                  <CardContent className="p-4 md:p-6">
                    {/* Mobile: Stack vertically, Desktop: Keep horizontal */}
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
                      <div className="relative flex-shrink-0">
                        <Avatar className="h-20 w-20 md:h-24 md:w-24 ring-4 ring-purple-400/30">
                          <AvatarImage src={galleryImages[0]} alt={profileData.name} />
                          <AvatarFallback className="bg-purple-500 text-white text-xl md:text-2xl">
                            {profileData.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <Button 
                          size="icon" 
                          className="absolute -bottom-1 -right-1 h-7 w-7 md:h-8 md:w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                          <Camera className="h-3 w-3 md:h-4 md:w-4" />
                        </Button>
                        {profileData.verified && (
                          <div className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full p-1">
                            <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-2 mb-2">
                          <h2 className="text-xl md:text-2xl font-bold text-white">{profileData.name}</h2>
                          <span className="text-lg text-purple-200">{profileData.age}</span>
                          {profileData.verified && (
                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                              <Shield className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-purple-200 mb-2 text-sm md:text-base">{profileData.occupation}</p>
                        <p className="text-sm text-purple-300 mb-3">{profileData.location}</p>
                        
                        <div className="flex flex-wrap justify-center md:justify-start gap-2">
                          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                            <div className="w-2 h-2 rounded-full bg-white mr-1"></div>
                            Online now
                          </Badge>
                          <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/30">
                            {profileData.kurdistanRegion}
                          </Badge>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-10 md:h-auto px-6 md:px-4"
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Mobile Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  <Card className="backdrop-blur-md bg-white/10 border border-white/20">
                    <CardContent className="p-3 md:p-4 text-center">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Eye className="h-5 w-5 md:h-6 md:w-6 text-white" />
                      </div>
                      <div className="text-xl md:text-2xl font-bold text-white">{profileStats.views}</div>
                      <div className="text-xs md:text-sm text-purple-200">Profile Views</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="backdrop-blur-md bg-white/10 border border-white/20">
                    <CardContent className="p-3 md:p-4 text-center">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Heart className="h-5 w-5 md:h-6 md:w-6 text-white" />
                      </div>
                      <div className="text-xl md:text-2xl font-bold text-white">{profileStats.likes}</div>
                      <div className="text-xs md:text-sm text-purple-200">Likes Received</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="backdrop-blur-md bg-white/10 border border-white/20">
                    <CardContent className="p-3 md:p-4 text-center">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-white" />
                      </div>
                      <div className="text-xl md:text-2xl font-bold text-white">{profileStats.matches}</div>
                      <div className="text-xs md:text-sm text-purple-200">Total Matches</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="backdrop-blur-md bg-white/10 border border-white/20">
                    <CardContent className="p-3 md:p-4 text-center">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-white" />
                      </div>
                      <div className="text-xl md:text-2xl font-bold text-white">{profileCompletion}%</div>
                      <div className="text-xs md:text-sm text-purple-200">Profile Score</div>
                    </CardContent>
                  </Card>
                </div>

                {/* AI Bio Section */}
                <EditableAboutMeSection
                  bio={profileData.bio}
                  onSave={handleBioSave}
                  profileData={profileData}
                />

                {/* Comprehensive Profile Editor */}
                <ComprehensiveProfileEditor
                  profileData={profileData}
                  onUpdateProfile={handleProfileUpdate}
                />
              </TabsContent>
              
              <TabsContent value="photos" className="space-y-6">
                <PhotoManagement 
                  galleryImages={galleryImages}
                  onImageUpload={handleImageUpload}
                  removeImage={removeImage}
                  setAsProfilePic={setAsProfilePic}
                />
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-6">
                <AccountSettings />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={isEditingSections} onOpenChange={setIsEditingSections}>
        <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Profile Sections</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p className="text-sm text-gray-300">
              Choose which sections to display on your profile
            </p>
            {/* Section toggles would be implemented here */}
          </div>
        </DialogContent>
      </Dialog>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default MyProfile;
