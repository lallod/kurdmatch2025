import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LanguageCode } from '@/contexts/LanguageContext';

export interface LandingContent {
  hero: {
    title: string;
    subtitle: string;
    tagline: string;
    cta: string;
  };
  features: {
    title: string;
    items: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
}

const defaultContent: LandingContent = {
  hero: {
    title: 'Find Your Kurdish Match',
    subtitle: 'The first dating platform designed exclusively for Kurdish people from all parts of Kurdistan and the diaspora',
    tagline: 'Connecting Kurdish Hearts',
    cta: 'Start Your Journey'
  },
  features: {
    title: 'Connecting Kurdish Hearts',
    items: [
      {
        icon: 'Globe',
        title: 'Worldwide Connection',
        description: 'Connect with Kurdish singles from all regions of Kurdistan and across the global diaspora'
      },
      {
        icon: 'Users',
        title: 'Cultural Understanding',
        description: 'Find someone who shares your Kurdish heritage, traditions, and values'
      },
      {
        icon: 'Heart',
        title: 'Meaningful Relationships',
        description: 'Build connections based on shared cultural identity and personal compatibility'
      }
    ]
  }
};

export const useLandingContent = (language: LanguageCode) => {
  const [content, setContent] = useState<LandingContent>(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('landing_page_translations')
          .select('content')
          .eq('language_code', language)
          .eq('is_published', true)
          .single();

        if (!error && data?.content) {
          const contentData = data.content as any;
          if (contentData.hero && contentData.features) {
            setContent(contentData);
          }
        }
      } catch (error) {
        console.error('Error fetching landing content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [language]);

  return { content, loading };
};
