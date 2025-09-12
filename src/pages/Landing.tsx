
import React, { useState, useEffect } from 'react';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import KurdistanSection from '@/components/landing/KurdistanSection';
import Footer from '@/components/landing/Footer';
import { supabase } from '@/integrations/supabase/client';
import { LandingPageContent, initialContent } from '@/pages/SuperAdmin/pages/LandingPageEditor/types';
import { Json } from '@/integrations/supabase/types';
import { Loader2 } from 'lucide-react';

// Helper function to safely validate and parse the content
const isValidLandingPageContent = (data: any): data is LandingPageContent => {
  return (
    typeof data === 'object' && 
    data !== null && 
    !Array.isArray(data) &&
    'hero' in data && 
    'features' in data && 
    'kurdistan' in data && 
    'footer' in data
  );
};

const Landing = () => {
  const [content, setContent] = useState<LandingPageContent>(initialContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandingPageContent = async () => {
      try {
        console.log('Fetching landing page content...');
        const { data, error } = await supabase
          .from('landing_page_content')
          .select('content')
          .limit(1)
          .single();
        
        if (error) {
          console.error('Error fetching landing page content:', error);
          // Fallback to initial content - already set by default
        } else if (data && data.content) {
          console.log('Landing page content received:', data.content);
          // Safely parse the content
          const contentData = data.content as Json;
          
          // Check if it has the expected shape before using it
          if (isValidLandingPageContent(contentData)) {
            setContent(contentData);
          } else {
            console.error('Invalid landing page content format:', contentData);
            // Fallback to initial content - already set by default
          }
        }
      } catch (error) {
        console.error('Unexpected error fetching landing page content:', error);
        // Fallback to initial content - already set by default
      } finally {
        setLoading(false);
      }
    };

    fetchLandingPageContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <Loader2 className="h-10 w-10 text-purple-500 animate-spin mb-4" />
        <p className="text-white">Loading beautiful Kurdish experiences...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-indigo-950">
      {/* Hero Section */}
      <HeroSection content={content.hero} />

      {/* Features Section */}
      <FeaturesSection content={content.features} />

      {/* Kurdistan Heritage Section */}
      <KurdistanSection content={content.kurdistan} />

      {/* Footer */}
      <Footer content={content.footer} />
    </div>
  );
};

export default Landing;
