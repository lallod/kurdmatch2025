import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Pencil, Settings } from 'lucide-react';
import ProfileHeader from '@/components/ProfileHeader';
import ProfileSections from '@/components/my-profile/ProfileSections';
import PhotoManagement from '@/components/my-profile/PhotoManagement';
import AccountSettings from '@/components/my-profile/AccountSettings';
import { ProfileData, KurdistanRegion } from '@/types/profile';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const MyProfile = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isEditingSections, setIsEditingSections] = useState(false);
  
  const profileData: ProfileData = {
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
  
  const [galleryImages, setGalleryImages] = useState([
    profileData.profileImage,
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"
  ]);

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

  const handleEditSections = () => {
    setIsEditingSections(true);
  };

  return (
    <div className="min-h-screen pt-4 px-4 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <Button variant="outline" size="sm" className="gap-2">
            <Pencil size={16} />
            Edit Profile
          </Button>
        </div>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            <div className="relative">
              <ProfileHeader 
                name={profileData.name}
                age={profileData.age}
                location={profileData.location}
                occupation={profileData.occupation}
                lastActive={profileData.lastActive}
                verified={profileData.verified}
                profileImage={galleryImages[0]}
                distance={profileData.distance}
                kurdistanRegion={profileData.kurdistanRegion}
              />
              <Button variant="outline" size="sm" className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm gap-2">
                <Pencil size={16} />
                Edit Profile
              </Button>
            </div>
            
            <div className="relative">
              <ProfileSections 
                profileData={profileData} 
                onEditSections={handleEditSections}
              />
              <div className="absolute top-0 right-0 p-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={handleEditSections}
                >
                  <Pencil size={16} />
                  Edit Sections
                </Button>
              </div>
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

      <Dialog open={isEditingSections} onOpenChange={setIsEditingSections}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile Sections</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p className="text-sm text-muted-foreground">
              Choose which sections to display on your profile
            </p>
            {/* Section toggles would be implemented here */}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyProfile;
