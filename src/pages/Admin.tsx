import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Image, User, Heart, BookOpen, Music, Coffee, Film, Utensils, Sparkles, Bot, Brain, Zap, Cpu, CircuitBoard, Wand2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import DetailEditor from '@/components/DetailEditor';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const AdminDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubscriber] = useState(false); // Mock subscription status - set to false by default
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSave = () => {
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "AI Analysis Complete",
        description: "Your profile changes have been processed and optimized.",
      });
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 relative overflow-hidden">
      {/* AI-inspired background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(253,41,123,0.1),transparent_50%)]"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-tinder-rose/5 filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-tinder-orange/5 filter blur-3xl"></div>
      </div>

      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50 neo-border">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft size={18} />
              </Button>
            </Link>
            <div className="flex items-center">
              <Bot size={20} className="mr-2 text-tinder-rose" />
              <h1 className="text-xl font-semibold ai-text-gradient">AI Admin Console</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="ai-badge flex items-center gap-1">
              <Brain size={14} />
              <span>AI Powered</span>
            </Badge>
            <Button 
              onClick={handleSave} 
              className="bg-gradient-to-r from-tinder-rose to-tinder-orange hover:from-tinder-rose/90 hover:to-tinder-orange/90 neo-glow relative"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Cpu size={16} className="mr-2 animate-pulse" /> Processing...
                </>
              ) : (
                <>
                  <Zap size={16} className="mr-2" /> Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="container px-4 py-6 max-w-6xl mx-auto relative z-10">
        <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-8 neo-border overflow-hidden bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="basic" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-tinder-rose/10 data-[state=active]:to-tinder-orange/10">Basic Info</TabsTrigger>
            <TabsTrigger value="photos" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-tinder-rose/10 data-[state=active]:to-tinder-orange/10">Photos</TabsTrigger>
            <TabsTrigger value="details" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-tinder-rose/10 data-[state=active]:to-tinder-orange/10">Details</TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-tinder-rose/10 data-[state=active]:to-tinder-orange/10">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card className="neo-card bg-white/80">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CircuitBoard size={20} className="mr-2 text-tinder-rose" />
                  <span>Basic Information</span>
                </CardTitle>
                <CardDescription>Edit the basic profile information. AI will optimize for best matches.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center">
                      <User size={14} className="mr-1 text-tinder-rose" />
                      Name
                    </Label>
                    <Input id="name" defaultValue="Sophia" className="neo-border focus-within:neo-glow transition-shadow" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age" className="flex items-center">
                      <User size={14} className="mr-1 text-tinder-rose" />
                      Age
                    </Label>
                    <Input id="age" type="number" defaultValue={29} className="neo-border focus-within:neo-glow transition-shadow" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center">
                      <User size={14} className="mr-1 text-tinder-rose" />
                      Location
                    </Label>
                    <Input id="location" defaultValue="San Francisco, CA" className="neo-border focus-within:neo-glow transition-shadow" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="occupation" className="flex items-center">
                      <User size={14} className="mr-1 text-tinder-rose" />
                      Occupation
                    </Label>
                    <Input id="occupation" defaultValue="UX Designer" className="neo-border focus-within:neo-glow transition-shadow" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company" className="flex items-center">
                      <User size={14} className="mr-1 text-tinder-rose" />
                      Company
                    </Label>
                    <Input id="company" defaultValue="Design Studio" className="neo-border focus-within:neo-glow transition-shadow" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastActive" className="flex items-center">
                      <User size={14} className="mr-1 text-tinder-rose" />
                      Last Active
                    </Label>
                    <Input id="lastActive" defaultValue="2 hours ago" className="neo-border focus-within:neo-glow transition-shadow" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="about" className="flex items-center">
                      <User size={14} className="mr-1 text-tinder-rose" />
                      About
                    </Label>
                    <div className="flex items-center gap-2">
                      <div className="text-xs bg-gradient-to-r from-tinder-rose to-tinder-orange bg-clip-text text-transparent font-medium flex items-center">
                        <Sparkles size={14} className="mr-1 text-tinder-orange" />
                        AI Generated
                      </div>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Badge variant="outline" className="text-xs border-tinder-rose text-tinder-rose cursor-pointer flex items-center gap-1">
                            <Wand2 size={12} />
                            Subscribers Only
                          </Badge>
                        </DialogTrigger>
                        <DialogContent className="neo-card bg-white/90 backdrop-blur-md">
                          <DialogHeader>
                            <DialogTitle className="ai-text-gradient">AI Premium Feature</DialogTitle>
                            <DialogDescription>
                              Editing AI-generated bio content is a premium feature available only to subscribers.
                              {!isSubscriber && (
                                <div className="mt-4">
                                  <Button className="w-full bg-gradient-to-r from-tinder-rose to-tinder-orange hover:from-tinder-rose/90 hover:to-tinder-orange/90 neo-glow">
                                    <Sparkles size={16} className="mr-2" />
                                    Upgrade to Premium
                                  </Button>
                                </div>
                              )}
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  <div className="relative">
                    <Textarea 
                      id="about" 
                      rows={6} 
                      defaultValue="Hi there! I'm Sophia, a UX designer with a passion for creating beautiful and functional digital experiences. When I'm not designing, you'll find me hiking in the mountains, trying new restaurants, or curling up with a good book. I believe in living life to the fullest and finding beauty in the small moments. Looking for someone who shares my sense of adventure and appreciation for both the outdoors and quiet evenings at home." 
                      disabled={!isSubscriber}
                      className={`neo-border ${!isSubscriber ? "opacity-70 cursor-not-allowed" : "focus-within:neo-glow transition-shadow"}`}
                    />
                    {!isSubscriber && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-tinder-rose/20 shadow-sm">
                          <p className="text-sm font-medium text-tinder-rose flex items-center">
                            <Bot size={16} className="mr-2" />
                            Subscribe to premium to edit AI-generated content
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  {!isSubscriber && (
                    <p className="text-xs text-tinder-rose mt-1 flex items-center">
                      <Bot size={12} className="mr-1" />
                      Subscribe to premium to edit AI-generated content
                    </p>
                  )}
                </div>
                <div className="w-full py-2 px-3 rounded-md bg-gradient-to-r from-tinder-rose/5 to-tinder-orange/5 flex items-center">
                  <Brain size={18} className="text-tinder-rose mr-2 animate-pulse" />
                  <p className="text-xs text-gray-600">Our AI is analyzing your profile to optimize match potential</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos">
            <Card className="neo-card bg-white/80">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Image size={20} className="mr-2 text-tinder-rose" />
                  <span>Photo Gallery</span>
                </CardTitle>
                <CardDescription>Manage profile photos. AI will suggest the best photo order.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
                    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
                    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
                    "https://images.unsplash.com/photo-1598897516650-e4dc73d8e417?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  ].map((photo, index) => (
                    <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border neo-border">
                      <img 
                        src={photo} 
                        alt={`Gallery image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button variant="outline" size="icon" className="bg-black/20 border-white/20 text-white hover:bg-black/40 hover:text-white">
                          <Image size={16} />
                        </Button>
                      </div>
                      {index === 0 && (
                        <div className="absolute top-2 right-2 bg-gradient-to-r from-tinder-rose to-tinder-orange text-white text-xs px-2 py-1 rounded-full flex items-center">
                          <Sparkles size={10} className="mr-1" />
                          AI Recommended
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="aspect-square rounded-lg border-2 border-dashed flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer neo-border">
                    <div className="flex flex-col items-center text-gray-500">
                      <Image size={24} className="mb-2" />
                      <span className="text-sm">Add Photo</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 w-full py-2 px-3 rounded-md bg-gradient-to-r from-tinder-rose/5 to-tinder-orange/5 flex items-center">
                  <Brain size={18} className="text-tinder-rose mr-2" />
                  <p className="text-xs text-gray-600">AI analysis shows your first photo gets 62% more matches than others</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details">
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
                  </div>
                </CardContent>
              </Card>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="preferences">
            <Card className="mb-6 neo-card bg-white/80">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart size={20} className="mr-2 text-tinder-rose" />
                  <span>Favorites & Preferences</span>
                </CardTitle>
                <CardDescription>Edit your favorite things and preferences. AI will match with compatible profiles.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <DetailEditor 
                    icon={<Music size={18} />} 
                    title="Music" 
                    fields={[
                      { name: "musicGenre", label: "Music Genres", value: "Indie Folk, Jazz, Classic Rock, Electronic" },
                    ]}
                    listMode={true}
                  />
                  
                  <Separator className="bg-gradient-to-r from-tinder-rose/20 to-tinder-orange/20" />
                  
                  <DetailEditor 
                    icon={<Coffee size={18} />} 
                    title="Books" 
                    fields={[
                      { name: "books", label: "Favorite Books", value: "The Alchemist, Thinking Fast and Slow, Dune" },
                    ]}
                    listMode={true}
                  />
                  
                  <Separator className="bg-gradient-to-r from-tinder-rose/20 to-tinder-orange/20" />
                  
                  <DetailEditor 
                    icon={<Film size={18} />} 
                    title="Movies" 
                    fields={[
                      { name: "movies", label: "Favorite Movies", value: "Lost in Translation, The Grand Budapest Hotel, Parasite" },
                    ]}
                    listMode={true}
                  />
                  
                  <Separator className="bg-gradient-to-r from-tinder-rose/20 to-tinder-orange/20" />
                  
                  <DetailEditor 
                    icon={<Utensils size={18} />} 
                    title="Food" 
                    fields={[
                      { name: "foods", label: "Favorite Foods", value: "Japanese, Mediterranean, Thai, Italian" },
                    ]}
                    listMode={true}
                  />
                </div>
                <div className="mt-6 w-full py-3 px-4 rounded-md bg-gradient-to-r from-tinder-rose/10 to-tinder-orange/10 flex items-center">
                  <Sparkles size={18} className="text-tinder-rose mr-2" />
                  <p className="text-sm text-gray-700">AI prediction: Your preferences are highly compatible with 24% of users in your area</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default AdminDashboard;
