
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Bot, Brain, Zap, Cpu } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BasicInfoTab from './tabs/BasicInfoTab';
import PhotosTab from './tabs/PhotosTab';
import DetailsTab from './tabs/DetailsTab';
import PreferencesTab from './tabs/PreferencesTab';

const AdminDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
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
              <h1 className="text-xl font-semibold ai-text-gradient">Edit Profile</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
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
            <BasicInfoTab />
          </TabsContent>

          <TabsContent value="photos">
            <PhotosTab />
          </TabsContent>

          <TabsContent value="details">
            <DetailsTab />
          </TabsContent>

          <TabsContent value="preferences">
            <PreferencesTab />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default AdminDashboard;
