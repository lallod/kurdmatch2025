import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2, Heart, Globe, Users, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { LandingPageContent, initialContent } from '@/pages/SuperAdmin/pages/LandingPageEditor/types';

const Landing = () => {
  const [content, setContent] = useState<LandingPageContent>(initialContent);
  const [contentLoading, setContentLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch landing page content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('landing_page_content')
          .select('content')
          .maybeSingle();

        if (!error && data?.content) {
          // Validate and set content safely
          if (typeof data.content === 'object' && data.content !== null && !Array.isArray(data.content)) {
            const contentData = data.content as Record<string, any>;
            if (contentData.hero && contentData.features && contentData.kurdistan && contentData.footer) {
              setContent(contentData as LandingPageContent);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching landing page content:', error);
      } finally {
        setContentLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (contentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">KurdMatch</h1>
              <p className="text-purple-200 text-sm">Connect Kurdish Hearts</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2 text-purple-200 text-sm">
            <Globe className="w-4 h-4" />
            <span>Connecting Kurds Worldwide</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex min-h-screen items-center justify-center px-6 py-20">
        <div className="w-full max-w-4xl text-center space-y-12">
          
          {/* Hero Content */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Find Your Kurdish <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Match</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-purple-200 max-w-3xl mx-auto">
              {content.hero.subtitle || "The first dating platform designed exclusively for Kurdish people from all parts of Kurdistan and the diaspora, bringing together singles who share our rich heritage and values."}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold px-12 py-6 text-xl"
              onClick={() => navigate('/profile-selector')}
            >
              Browse 502 Profiles
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-2 pt-8">
            <div className="flex -space-x-2">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 border-2 border-white/20" />
              ))}
            </div>
            <span className="text-purple-200 font-medium ml-2">502 Kurdish singles ready to connect</span>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-gradient-to-b from-transparent to-black/20 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
            Connecting Kurdish Hearts
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                <Globe className="w-8 h-8 text-purple-300" />
              </div>
              <h3 className="text-xl font-semibold text-white">Worldwide Connection</h3>
              <p className="text-purple-200">
                Connect with Kurdish singles from all regions of Kurdistan and across the global diaspora.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-purple-300" />
              </div>
              <h3 className="text-xl font-semibold text-white">Cultural Understanding</h3>
              <p className="text-purple-200">
                Find someone who shares your Kurdish heritage, traditions, and values.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-purple-300" />
              </div>
              <h3 className="text-xl font-semibold text-white">Meaningful Relationships</h3>
              <p className="text-purple-200">
                Build connections based on shared cultural identity and personal compatibility.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
