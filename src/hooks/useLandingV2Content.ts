import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LanguageCode } from '@/contexts/LanguageContext';

export interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  image_url: string;
}

export interface HowItWorksStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

export interface LandingV2Content {
  hero_title: string;
  hero_subtitle: string;
  hero_cta_text: string;
  hero_image_url: string;
  features: FeatureCard[];
  community_title: string;
  community_subtitle: string;
  community_dialects: string[];
  community_description: string;
  community_images: string[];
  how_it_works_title: string;
  how_it_works_steps: HowItWorksStep[];
  cta_title: string;
  cta_subtitle?: string;
  cta_button_text: string;
  footer_text: string;
  footer_links: any[];
}

// Hardcoded fallback content (English)
const defaultContent: LandingV2Content = {
  hero_title: 'Find Your Kurdish Match - Connect Hearts Worldwide 💕',
  hero_subtitle: 'The first platform connecting Kurdish hearts from all regions of Kurdistan and the global diaspora',
  hero_cta_text: 'Join KurdMatch Today',
  hero_image_url: '/assets/landing/hero-romance.jpg',
  features: [
    { id: 'lover', title: 'Find Your Kurdish Lover 💕', description: 'Connect with Kurdish singles looking for meaningful relationships', icon: 'Heart', image_url: '/assets/landing/feature-lover.jpg' },
    { id: 'travel', title: 'Find Your Travel Mate ✈️', description: 'Discover Kurdish travel companions to explore the world together', icon: 'Plane', image_url: '/assets/landing/feature-travel.jpg' },
    { id: 'friends', title: 'Find New Kurdish Friends 🌍', description: 'Build lasting friendships within the global Kurdish community', icon: 'Users', image_url: '/assets/landing/feature-friends.jpg' },
    { id: 'family', title: 'Make a Kurdish Family 🏡', description: 'Connect with those who share your vision of family and future', icon: 'Home', image_url: '/assets/landing/feature-family.jpg' },
    { id: 'events', title: 'Find Kurdish Events 🎉', description: 'Discover and join Kurdish cultural events and celebrations', icon: 'Calendar', image_url: '/assets/landing/feature-events.jpg' },
    { id: 'parties', title: 'Find Kurdish Parties 🪩', description: 'Connect at Kurdish social gatherings and celebrations', icon: 'Music', image_url: '/assets/landing/feature-parties.jpg' },
    { id: 'picnic', title: 'Find Kurdish Picnic Events 🧺', description: 'Join outdoor gatherings and enjoy nature with Kurdish community', icon: 'UtensilsCrossed', image_url: '/assets/landing/feature-picnic.jpg' },
    { id: 'cultural', title: 'Explore Kurdish Cultural Events 🕊️', description: 'Experience traditional Kurdish music, dance, and celebrations', icon: 'Sparkles', image_url: '/assets/landing/feature-cultural.jpg' },
  ],
  community_title: 'Connect Across All Kurdish Regions',
  community_subtitle: 'Join a global community of Kurds from all dialects and regions',
  community_dialects: ['Kurmanji', 'Sorani', 'Pehlewani', 'Zazaki'],
  community_description: 'KurdMatch brings together Kurdish people from South, North, East, and West Kurdistan, as well as the diaspora across Europe, Americas, and beyond. No matter which dialect you speak or where you live, find your Kurdish connection here.',
  community_images: [],
  how_it_works_title: 'How It Works',
  how_it_works_steps: [
    { step: 1, title: 'Create Your Profile', description: 'Share your story, interests, and what makes you uniquely Kurdish', icon: 'UserPlus' },
    { step: 2, title: 'Connect with Kurds Worldwide', description: 'Browse profiles, send messages, and build meaningful connections', icon: 'MessageCircle' },
    { step: 3, title: 'Start Your Journey', description: 'Whether love, friendship, or community - your Kurdish connection awaits', icon: 'Heart' },
  ],
  cta_title: 'Ready to Connect with Your Kurdish Community?',
  cta_subtitle: 'Join thousands of Kurds worldwide who have found meaningful connections',
  cta_button_text: 'Join KurdMatch Today',
  footer_text: '© 2024 KurdMatch. Connecting Kurdish hearts worldwide.',
  footer_links: []
};

export const useLandingV2Content = (language: LanguageCode) => {
  const [content, setContent] = useState<LandingV2Content>(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('landing_page_v2_translations')
          .select('*')
          .eq('language_code', language)
          .eq('is_published', true)
          .maybeSingle();

        if (!error && data) {
          setContent({
            hero_title: data.hero_title,
            hero_subtitle: data.hero_subtitle,
            hero_cta_text: data.hero_cta_text,
            hero_image_url: data.hero_image_url,
            features: (data.features as unknown) as FeatureCard[],
            community_title: data.community_title,
            community_subtitle: data.community_subtitle,
            community_dialects: (data.community_dialects as unknown) as string[],
            community_description: data.community_description,
            community_images: (data.community_images as unknown) as string[],
            how_it_works_title: data.how_it_works_title,
            how_it_works_steps: (data.how_it_works_steps as unknown) as HowItWorksStep[],
            cta_title: data.cta_title,
            cta_subtitle: data.cta_subtitle,
            cta_button_text: data.cta_button_text,
            footer_text: data.footer_text,
            footer_links: (data.footer_links as unknown) as any[]
          });
        }
      } catch (error) {
        console.error('Error fetching landing v2 content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [language]);

  return { content, loading };
};
