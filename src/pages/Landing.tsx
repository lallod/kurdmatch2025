
import React, { useState, useEffect } from 'react';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import KurdistanSection from '@/components/landing/KurdistanSection';
import Footer from '@/components/landing/Footer';
import { supabase } from '@/integrations/supabase/client';
import { LandingPageContent } from '@/pages/SuperAdmin/pages/LandingPageEditor/types';

const Landing = () => {
  const [content, setContent] = useState<LandingPageContent | null>(null);
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
          setContent(data.content as LandingPageContent);
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
