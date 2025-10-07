import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2, Heart, Globe, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { LandingPageContent, initialContent } from '@/pages/SuperAdmin/pages/LandingPageEditor/types';
import FloatingCulturalElements from '@/components/landing/FloatingCulturalElements';
import GlassmorphismLoginCard from '@/components/landing/GlassmorphismLoginCard';
import SocialFeatureCards from '@/components/landing/SocialFeatureCards';
import LandingCTA from '@/components/landing/LandingCTA';
import Scene3D from '@/components/landing/Scene3D';
import MeetTheConnection from '@/components/landing/MeetTheConnection';
import DynamicCommunity from '@/components/landing/DynamicCommunity';
import CommunityPhone from '@/components/landing/CommunityPhone';
import CommunityTestimonials from '@/components/landing/CommunityTestimonials';
import EnhancedFooter from '@/components/landing/EnhancedFooter';

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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 relative overflow-hidden">
      {/* 3D Scene */}
      <Scene3D />
      
      {/* Floating Cultural Elements */}
      <FloatingCulturalElements />

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

      {/* Hero Section - Split Layout */}
      <div className="relative flex min-h-screen items-center justify-center px-6 py-20">
        <div className="w-full max-w-7xl grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Hero Content */}
          <div className="space-y-6 text-left">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full animate-fade-in">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-purple-200 text-sm font-medium">AI-Powered Kurdish Dating</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight animate-fade-in">
              Find Your Kurdish{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-pink-300 to-purple-400">
                Match
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-purple-200 leading-relaxed max-w-xl animate-fade-in">
              The first dating platform designed exclusively for Kurdish people from all parts of Kurdistan and the diaspora, bringing together singles who share our rich heritage and values.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in pt-2">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-10 py-6 text-lg shadow-lg transition-all duration-300 hover:scale-105 rounded-full"
                onClick={() => navigate('/register')}
              >
                Join Now – Free
              </Button>
              
              <Button 
                size="lg"
                className="border-2 border-white/30 bg-transparent hover:bg-white/10 text-white font-semibold px-10 py-6 text-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 rounded-full"
              >
                Learn More
              </Button>
            </div>

            {/* User Count with Avatar Stack */}
            <div className="flex items-center gap-3 pt-4 animate-fade-in">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div 
                    key={i} 
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 border-2 border-purple-900" 
                  />
                ))}
              </div>
              <span className="text-purple-200 font-medium text-base">
                <span className="text-white font-bold">10,502</span> Kurdish singles ready to connect
              </span>
            </div>
          </div>

          {/* Right Side - Glassmorphism Login Card */}
          <div className="flex justify-center md:justify-end animate-fade-in">
            <GlassmorphismLoginCard />
          </div>
        </div>
      </div>

      {/* Social Feature Cards Section */}
      <div className="relative bg-gradient-to-b from-black/20 via-transparent to-black/20">
        <SocialFeatureCards />
      </div>

      {/* Meet The Connection Section */}
      <MeetTheConnection />

      {/* Dynamic Community Section */}
      <DynamicCommunity />

      {/* Community Phone Section */}
      <CommunityPhone />

      {/* Testimonials Section */}
      <CommunityTestimonials />

      {/* Final CTA Section */}
      <div className="relative">
        <LandingCTA />
      </div>

      {/* Enhanced Footer */}
      <EnhancedFooter />
    </div>
  );
};

export default Landing;
