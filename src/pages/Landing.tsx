
import React, { useState, useEffect } from 'react';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import KurdistanSection from '@/components/landing/KurdistanSection';
import Footer from '@/components/landing/Footer';
import { supabase } from '@/integrations/supabase/client';
import { LandingPageContent, initialContent } from '@/pages/SuperAdmin/pages/LandingPageEditor/types';
import { Json } from '@/integrations/supabase/types';

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
        const { data, error } = await supabase
          .from('landing_page_content')
          .select('content')
          .limit(1)
          .single();
        
        if (error) {
          console.error('Error fetching landing page content:', error);
        } else if (data && data.content) {
          // Safely parse the content
          const contentData = data.content as Json;
          
          // Check if it has the expected shape before using it
          if (isValidLandingPageContent(contentData)) {
            setContent(contentData);
          } else {
            console.error('Invalid landing page content format:', contentData);
            // Fallback to initial content
            setContent(initialContent);
          }
        }
      } catch (error) {
        console.error('Unexpected error fetching landing page content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLandingPageContent();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-indigo-950">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Kurdistan Heritage Section */}
      <KurdistanSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;
