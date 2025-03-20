import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import ProfileHeader from '@/components/ProfileHeader';
import DetailEditor from '@/components/DetailEditor';
import { 
  User, Settings, Image, Heart, BookOpen, Palette, MapPin, Languages,
  BrainCircuit, LifeBuoy, CalendarDays, Plane, Music, Film, Utensils, Podcast
} from 'lucide-react';

type KurdistanRegion = 'South-Kurdistan' | 'West-Kurdistan' | 'East-Kurdistan' | 'North-Kurdistan';

const MyProfile = () => {
  const [activeTab, setActiveTab] = useState('general');
  
  const profileData = {
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

  return (
    <div className="min-h-screen pt-4 px-4 pb-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
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
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Profile Sections</h2>
                <p className="text-muted-foreground mb-6">
                  Update your profile information to help others get to know you better.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="w-full justify-start h-auto p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary/10">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-medium">Basic Info</h3>
                            <p className="text-sm text-muted-foreground">Height, body type, ethnicity</p>
                          </div>
                        </div>
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
                      <Button variant="outline" className="w-full justify-start h-auto p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary/10">
                            <Heart className="h-5 w-5 text-primary" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-medium">Interests</h3>
                            <p className="text-sm text-muted-foreground">Hobbies, activities, passions</p>
                          </div>
                        </div>
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
                      <Button variant="outline" className="w-full justify-start h-auto p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary/10">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-medium">About Me</h3>
                            <p className="text-sm text-muted-foreground">Bio, lifestyle, values</p>
                          </div>
                        </div>
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
                      <Button variant="outline" className="w-full justify-start h-auto p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary/10">
                            <Languages className="h-5 w-5 text-primary" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-medium">Languages</h3>
                            <p className="text-sm text-muted-foreground">Languages you speak</p>
                          </div>
                        </div>
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
                      <Button variant="outline" className="w-full justify-start h-auto p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary/10">
                            <MapPin className="h-5 w-5 text-primary" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-medium">Location</h3>
                            <p className="text-sm text-muted-foreground">Where you're from</p>
                          </div>
                        </div>
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
          </TabsContent>
          
          <TabsContent value="photos" className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">My Photos</h2>
              <p className="text-muted-foreground mb-6">
                Upload and manage your profile photos. The first photo will be your main profile picture.
              </p>
              
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Gallery ({galleryImages.length}/9)</h3>
                <div>
                  <Button variant="outline" className="relative overflow-hidden">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Image size={16} className="mr-2" />
                    <span>Add Photo</span>
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {galleryImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className={`aspect-square rounded-lg overflow-hidden border-2 ${index === 0 ? 'border-primary' : 'border-transparent'}`}>
                      <img 
                        src={image} 
                        alt={`Photo ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 rounded-lg">
                      {index !== 0 && (
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => setAsProfilePic(index)}
                          className="w-full max-w-[120px]"
                        >
                          <User size={14} className="mr-1" />
                          Set as main
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => removeImage(index)}
                        className="w-full max-w-[120px]"
                        disabled={galleryImages.length <= 1}
                      >
                        Remove
                      </Button>
                    </div>
                    
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                        Main
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-sm text-muted-foreground">
                <p>Tips for great photos:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Clear, recent photos of your face</li>
                  <li>A mix of close-up and full-body photos</li>
                  <li>Photos that show your interests and personality</li>
                  <li>Avoid overly filtered or group photos</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
              <p className="text-muted-foreground mb-6">
                Manage your account settings and preferences.
              </p>
              
              <div className="space-y-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Profile Visibility</h3>
                  <p className="text-sm text-muted-foreground mb-4">Control who can see your profile</p>
                  <div className="flex items-center justify-between">
                    <span>Show me in discovery</span>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Notification Settings</h3>
                  <p className="text-sm text-muted-foreground mb-4">Manage your notification preferences</p>
                  <div className="flex items-center justify-between">
                    <span>Email and push notifications</span>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Privacy</h3>
                  <p className="text-sm text-muted-foreground mb-4">Control your privacy settings</p>
                  <div className="flex items-center justify-between">
                    <span>Location sharing and data usage</span>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Change Password</h3>
                  <p className="text-sm text-muted-foreground mb-4">Update your account password</p>
                  <div className="flex items-center justify-between">
                    <span>Password and security</span>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 border-destructive/20 bg-destructive/5">
                  <h3 className="font-medium mb-2 text-destructive">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground mb-4">Permanent actions for your account</p>
                  <div className="flex items-center justify-between">
                    <span>Delete account</span>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyProfile;
