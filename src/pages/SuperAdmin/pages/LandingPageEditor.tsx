
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save, PenLine, Globe, ListChecks, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Define types for our landing page content
interface HeroContent {
  title: string;
  subtitle: string;
  tagline: string;
  userCount: string;
}

interface FeatureCard {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface KurdistanSection {
  title: string;
  subtitle: string;
  leftTitle: string;
  leftDescription: string;
  leftPoints: string[];
  rightTitle: string;
  rightDescription: string;
  rightPoints: string[];
}

interface FooterContent {
  copyright: string;
}

interface LandingPageContent {
  hero: HeroContent;
  features: {
    title: string;
    cards: FeatureCard[];
  };
  kurdistan: KurdistanSection;
  footer: FooterContent;
}

// Mock data until we connect to the database
const initialContent: LandingPageContent = {
  hero: {
    title: "Find Your Kurdish Match",
    subtitle: "The first dating platform designed exclusively for Kurdish people from all parts of Kurdistan and the diaspora, bringing together singles who share our rich heritage and values.",
    tagline: "Connecting Kurds Worldwide",
    userCount: "10,000+"
  },
  features: {
    title: "Connecting Kurdish Hearts",
    cards: [
      {
        id: "worldwide",
        icon: "Globe",
        title: "Worldwide Connection",
        description: "Connect with Kurdish singles from all regions of Kurdistan and across the global diaspora."
      },
      {
        id: "cultural",
        icon: "Users",
        title: "Cultural Understanding",
        description: "Find someone who shares your Kurdish heritage, traditions, and values."
      },
      {
        id: "relationships",
        icon: "Heart",
        title: "Meaningful Relationships",
        description: "Build connections based on shared cultural identity and personal compatibility."
      }
    ]
  },
  kurdistan: {
    title: "Celebrating Kurdish Heritage",
    subtitle: "Whether you're from Bakur, Bashur, Rojava, Rojhelat, or part of the diaspora, our platform helps you find someone who understands your unique background.",
    leftTitle: "For Kurds Everywhere",
    leftDescription: "Our community welcomes Kurdish people from all walks of life and all parts of the world. Whether you were born in Kurdistan or abroad, our platform helps you connect with others who share your heritage.",
    leftPoints: [
      "Connect with Kurds from different regions",
      "Share your unique cultural experiences",
      "Find partners who understand your background"
    ],
    rightTitle: "Preserving Our Culture",
    rightDescription: "We believe that fostering relationships within our community helps preserve and celebrate our rich Kurdish culture, language, and traditions for generations to come.",
    rightPoints: [
      "Filter by dialect and regional background",
      "Share your favorite Kurdish traditions",
      "Build relationships based on shared values"
    ]
  },
  footer: {
    copyright: "© 2023 Kurdish Dating. All rights reserved."
  }
};

const LandingPageEditor = () => {
  const { toast } = useToast();
  const [content, setContent] = useState<LandingPageContent>(initialContent);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load content from the database on component mount
  useEffect(() => {
    const fetchLandingPageContent = async () => {
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('landing_page_content')
          .select('*')
          .single();
        
        if (error) {
          console.error('Error fetching landing page content:', error);
          toast({
            title: "Failed to load content",
            description: "Could not load landing page content from the database.",
            variant: "destructive"
          });
        } else if (data) {
          setContent(data.content);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLandingPageContent();
  }, [toast]);

  // Update hero section content
  const updateHero = (field: keyof HeroContent, value: string) => {
    setContent(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: value }
    }));
  };

  // Update feature section content
  const updateFeatureTitle = (value: string) => {
    setContent(prev => ({
      ...prev,
      features: { ...prev.features, title: value }
    }));
  };

  // Update feature card
  const updateFeatureCard = (id: string, field: keyof Omit<FeatureCard, 'id'>, value: string) => {
    setContent(prev => ({
      ...prev,
      features: {
        ...prev.features,
        cards: prev.features.cards.map(card => 
          card.id === id ? { ...card, [field]: value } : card
        )
      }
    }));
  };

  // Update Kurdistan section
  const updateKurdistanSection = (field: keyof KurdistanSection, value: string | string[]) => {
    setContent(prev => ({
      ...prev,
      kurdistan: { ...prev.kurdistan, [field]: value }
    }));
  };

  // Update bullet point in Kurdistan section
  const updateKurdistanPoint = (section: 'leftPoints' | 'rightPoints', index: number, value: string) => {
    setContent(prev => {
      const newPoints = [...prev.kurdistan[section]];
      newPoints[index] = value;
      
      return {
        ...prev,
        kurdistan: {
          ...prev.kurdistan,
          [section]: newPoints
        }
      };
    });
  };

  // Update footer content
  const updateFooter = (field: keyof FooterContent, value: string) => {
    setContent(prev => ({
      ...prev,
      footer: { ...prev.footer, [field]: value }
    }));
  };

  // Save all changes to the database
  const saveChanges = async () => {
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('landing_page_content')
        .upsert({ 
          id: 1, // Assuming a single row for the landing page content
          content: content,
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error saving landing page content:', error);
        toast({
          title: "Failed to save content",
          description: "Could not save landing page content to the database.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Content saved",
          description: "Landing page content has been updated successfully.",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "An error occurred",
        description: "An unexpected error occurred while saving the content.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Landing Page Editor</h1>
          <p className="text-muted-foreground">
            Edit the content displayed on the public landing page
          </p>
        </div>
        <Button 
          onClick={saveChanges} 
          disabled={saving}
          className="bg-gradient-to-r from-tinder-rose to-tinder-orange hover:from-tinder-rose/90 hover:to-tinder-orange/90"
        >
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="hero">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="kurdistan">Kurdish Heritage</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
        </TabsList>

        {/* Hero Section Tab */}
        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenLine className="h-5 w-5" />
                Hero Section Content
              </CardTitle>
              <CardDescription>
                Edit the main content displayed in the hero section at the top of the landing page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero-tagline">Tagline</Label>
                <Input 
                  id="hero-tagline" 
                  value={content.hero.tagline} 
                  onChange={(e) => updateHero('tagline', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Short tagline displayed above the main title
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hero-title">Main Title</Label>
                <Input 
                  id="hero-title" 
                  value={content.hero.title} 
                  onChange={(e) => updateHero('title', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hero-subtitle">Subtitle</Label>
                <Textarea 
                  id="hero-subtitle" 
                  value={content.hero.subtitle} 
                  onChange={(e) => updateHero('subtitle', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hero-user-count">User Count</Label>
                <Input 
                  id="hero-user-count" 
                  value={content.hero.userCount} 
                  onChange={(e) => updateHero('userCount', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Number of users shown on the counter (e.g., "10,000+")
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Features Section
              </CardTitle>
              <CardDescription>
                Edit the features section title and feature cards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="features-title">Section Title</Label>
                <Input 
                  id="features-title" 
                  value={content.features.title} 
                  onChange={(e) => updateFeatureTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Feature Cards</h3>
                
                {content.features.cards.map((card, index) => (
                  <Card key={card.id} className="bg-gray-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Feature Card {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor={`feature-${card.id}-title`}>Title</Label>
                        <Input 
                          id={`feature-${card.id}-title`} 
                          value={card.title} 
                          onChange={(e) => updateFeatureCard(card.id, 'title', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`feature-${card.id}-description`}>Description</Label>
                        <Textarea 
                          id={`feature-${card.id}-description`} 
                          value={card.description} 
                          onChange={(e) => updateFeatureCard(card.id, 'description', e.target.value)}
                          rows={2}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`feature-${card.id}-icon`}>Icon</Label>
                        <Input 
                          id={`feature-${card.id}-icon`} 
                          value={card.icon} 
                          onChange={(e) => updateFeatureCard(card.id, 'icon', e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Icon name (Globe, Users, Heart, etc.)
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Kurdistan Heritage Tab */}
        <TabsContent value="kurdistan" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Kurdish Heritage Section
              </CardTitle>
              <CardDescription>
                Edit the content in the Kurdish heritage section
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="kurdistan-title">Section Title</Label>
                <Input 
                  id="kurdistan-title" 
                  value={content.kurdistan.title} 
                  onChange={(e) => updateKurdistanSection('title', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="kurdistan-subtitle">Section Subtitle</Label>
                <Textarea 
                  id="kurdistan-subtitle" 
                  value={content.kurdistan.subtitle} 
                  onChange={(e) => updateKurdistanSection('subtitle', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left column */}
                <Card className="bg-gray-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Left Box</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="kurdistan-left-title">Title</Label>
                      <Input 
                        id="kurdistan-left-title" 
                        value={content.kurdistan.leftTitle} 
                        onChange={(e) => updateKurdistanSection('leftTitle', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="kurdistan-left-description">Description</Label>
                      <Textarea 
                        id="kurdistan-left-description" 
                        value={content.kurdistan.leftDescription} 
                        onChange={(e) => updateKurdistanSection('leftDescription', e.target.value)}
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Bullet Points</Label>
                      {content.kurdistan.leftPoints.map((point, index) => (
                        <div key={`left-point-${index}`} className="flex gap-2">
                          <Input 
                            value={point} 
                            onChange={(e) => updateKurdistanPoint('leftPoints', index, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Right column */}
                <Card className="bg-gray-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Right Box</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="kurdistan-right-title">Title</Label>
                      <Input 
                        id="kurdistan-right-title" 
                        value={content.kurdistan.rightTitle} 
                        onChange={(e) => updateKurdistanSection('rightTitle', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="kurdistan-right-description">Description</Label>
                      <Textarea 
                        id="kurdistan-right-description" 
                        value={content.kurdistan.rightDescription} 
                        onChange={(e) => updateKurdistanSection('rightDescription', e.target.value)}
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Bullet Points</Label>
                      {content.kurdistan.rightPoints.map((point, index) => (
                        <div key={`right-point-${index}`} className="flex gap-2">
                          <Input 
                            value={point} 
                            onChange={(e) => updateKurdistanPoint('rightPoints', index, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Footer Tab */}
        <TabsContent value="footer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5" />
                Footer Content
              </CardTitle>
              <CardDescription>
                Edit the content displayed in the website footer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="footer-copyright">Copyright Text</Label>
                <Input 
                  id="footer-copyright" 
                  value={content.footer.copyright} 
                  onChange={(e) => updateFooter('copyright', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LandingPageEditor;
