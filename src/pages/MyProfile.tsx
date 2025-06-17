
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
import BasicInfoSection from '@/components/my-profile/sections/BasicInfoSection';
import LocationSection from '@/components/my-profile/sections/LocationSection';
import LanguagesSection from '@/components/my-profile/sections/LanguagesSection';
import InterestsSection from '@/components/my-profile/sections/InterestsSection';
import BottomNavigation from '@/components/BottomNavigation';

const MyProfile = () => {
  const [isEditingSections, setIsEditingSections] = useState(false);
  const [profileBgColor, setProfileBgColor] = useState("#F1F0FB");
  
  const initialProfileData: ProfileData = {
    name: "Sarah",
    age: 28,
    location: "San Francisco, CA",
    occupation: "UX Designer",
    lastActive: "2 hours ago",
    verified: true,
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80",
    distance: 8,
    kurdistanRegion: "South-Kurdistan" as KurdistanRegion,
    bio: "Designer, hiker, and coffee enthusiast. Looking for someone who enjoys meaningful conversation and outdoor adventure.",
    height: "5'7\"",
    bodyType: "Athletic",
    ethnicity: "Middle Eastern",
    religion: "Spiritual",
    politicalViews: "Moderate",
    values: ["Honesty", "Kindness", "Growth", "Balance"],
    interests: ["Hiking", "Photography", "Design", "Travel", "Coffee", "Cooking"],
    hobbies: ["Drawing", "Yoga", "Reading"],
    languages: ["English", "Kurdish", "Farsi"]
  };
  
  const [profileData, setProfileData] = useState<ProfileData>(initialProfileData);

  const [galleryImages, setGalleryImages] = useState([
    profileData.profileImage,
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"
  ]);

  // Profile completion calculation
  const calculateProfileCompletion = () => {
    let completed = 0;
    const total = 10;
    
    if (profileData.name) completed++;
    if (profileData.bio && profileData.bio.length > 50) completed++;
    if (galleryImages.length >= 3) completed++;
    if (profileData.interests.length >= 3) completed++;
    if (profileData.occupation) completed++;
    if (profileData.languages.length >= 1) completed++;
    if (profileData.height) completed++;
    if (profileData.values.length >= 3) completed++;
    if (profileData.hobbies.length >= 2) completed++;
    if (profileData.verified) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  // Mock stats data
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
    setProfileData(prev => ({ ...prev, bio: newBio }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 pb-32">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur shadow-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 relative">
              <Settings className="w-8 h-8 text-white" />
              {profileCompletion < 100 && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
                  !
                </div>
              )}
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-300 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-purple-200">Manage your profile and settings</p>
            
            {/* Profile Stats */}
            <div className="flex justify-center gap-4 mt-4">
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <Eye className="w-3 h-3 mr-1" />
                {profileStats.views} views
              </Badge>
              <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                <Heart className="w-3 h-3 mr-1" />
                {profileStats.likes} likes
              </Badge>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                <Users className="w-3 h-3 mr-1" />
                {profileStats.matches} matches
              </Badge>
            </div>
            
            {/* Profile Completion */}
            <div className="max-w-md mx-auto mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-purple-200">Profile Completion</span>
                <span className="text-sm font-medium text-white">{profileCompletion}%</span>
              </div>
              <Progress value={profileCompletion} className="h-2 bg-white/10">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                  style={{ width: `${profileCompletion}%` }}
                />
              </Progress>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="backdrop-blur-md bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6 relative overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 animate-pulse"></div>
          
          <div className="relative z-10">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6 bg-white/10 backdrop-blur border-white/20">
                <TabsTrigger value="profile" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white text-purple-200">
                  Profile
                </TabsTrigger>
                <TabsTrigger value="photos" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white text-purple-200">
                  Photos
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white text-purple-200">
                  Settings
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="space-y-6">
                {/* Profile Header Card */}
                <Card className="overflow-hidden backdrop-blur-md bg-white/10 border border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <Avatar className="h-24 w-24 ring-4 ring-purple-400/30">
                          <AvatarImage src={galleryImages[0]} alt={profileData.name} />
                          <AvatarFallback className="bg-purple-500 text-white text-2xl">
                            {profileData.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <Button 
                          size="icon" 
                          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                        {profileData.verified && (
                          <div className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full p-1">
                            <CheckCircle2 className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h2 className="text-2xl font-bold text-white">{profileData.name}</h2>
                          <span className="text-lg text-purple-200">{profileData.age}</span>
                          {profileData.verified && (
                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                              <Shield className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-purple-200 mb-2">{profileData.occupation}</p>
                        <p className="text-sm text-purple-300 mb-3">{profileData.location}</p>
                        
                        <div className="flex gap-2">
                          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                            <div className="w-2 h-2 rounded-full bg-white mr-1"></div>
                            Online now
                          </Badge>
                          <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/30">
                            {profileData.kurdistanRegion}
                          </Badge>
                        </div>
                      </div>
                      
                      <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="backdrop-blur-md bg-white/10 border border-white/20">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Eye className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-white">{profileStats.views}</div>
                      <div className="text-sm text-purple-200">Profile Views</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="backdrop-blur-md bg-white/10 border border-white/20">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Heart className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-white">{profileStats.likes}</div>
                      <div className="text-sm text-purple-200">Likes Received</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="backdrop-blur-md bg-white/10 border border-white/20">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Sparkles className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-white">{profileStats.matches}</div>
                      <div className="text-sm text-purple-200">Total Matches</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="backdrop-blur-md bg-white/10 border border-white/20">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-white">{profileCompletion}%</div>
                      <div className="text-sm text-purple-200">Profile Score</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Profile Sections */}
                <div className="space-y-6">
                  <EditableAboutMeSection
                    bio={profileData.bio}
                    onSave={handleBioSave}
                  />
                  
                  <Card className="backdrop-blur-md bg-white/10 border border-white/20">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4 text-white">Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <BasicInfoSection profileData={profileData} />
                        <LocationSection profileData={profileData} />
                        <LanguagesSection profileData={profileData} />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <InterestsSection profileData={profileData} />

                  <Button 
                    onClick={() => setIsEditingSections(true)} 
                    variant="outline" 
                    className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Edit displayed sections
                  </Button>
                </div>
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

      <BottomNavigation />
    </div>
  );
};

export default MyProfile;
