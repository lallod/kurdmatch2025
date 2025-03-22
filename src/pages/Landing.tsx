
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, Heart, Shield, MessageSquare, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Json } from '@/integrations/supabase/types';

type LandingPageData = {
  title: string;
  subtitle: string;
  description: string;
  callToAction: string;
  features: {
    title: string;
    description: string;
  }[];
};

const DEFAULT_CONTENT: LandingPageData = {
  title: "Find Your Perfect Match",
  subtitle: "AI-Powered Dating",
  description: "Our intelligent matching algorithm helps you find meaningful connections based on compatibility, interests, and relationship goals.",
  callToAction: "Get Started",
  features: [
    {
      title: "Smart Matching",
      description: "Our AI analyzes your preferences to find the most compatible matches"
    },
    {
      title: "Verified Profiles",
      description: "All profiles are verified for your safety and security"
    },
    {
      title: "Meaningful Connections",
      description: "Focus on quality conversations and lasting relationships"
    }
  ]
};

const FeatureIcon = ({ index }: { index: number }) => {
  switch (index) {
    case 0:
      return <Heart className="h-10 w-10 text-tinder-rose" />;
    case 1:
      return <Shield className="h-10 w-10 text-tinder-rose" />;
    case 2:
      return <MessageSquare className="h-10 w-10 text-tinder-rose" />;
    default:
      return <Heart className="h-10 w-10 text-tinder-rose" />;
  }
};

// Helper function to safely parse content from the database
const parseContent = (data: { content: Json } | null): LandingPageData => {
  if (!data || !data.content) {
    return DEFAULT_CONTENT;
  }
  
  // If content is already an object with the right properties, return it
  const content = data.content as any;
  
  // Validate that the content has the required properties
  if (
    typeof content === 'object' && 
    content !== null &&
    typeof content.title === 'string' &&
    typeof content.subtitle === 'string' &&
    typeof content.description === 'string' &&
    typeof content.callToAction === 'string' &&
    Array.isArray(content.features)
  ) {
    return content as LandingPageData;
  }
  
  // Return default content if validation fails
  return DEFAULT_CONTENT;
};

const Landing = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['landingPageContent'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('landing_page_content')
          .select('*')
          .eq('id', 1)
          .maybeSingle();

        if (error) {
          console.error("Error fetching landing page content:", error);
          return null;
        }
        
        return data;
      } catch (err) {
        console.error("Error in landing page query:", err);
        return null;
      }
    }
  });

  const content = parseContent(data);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-tinder-rose" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-tinder-rose to-tinder-orange text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.title}</h1>
          <h2 className="text-xl md:text-2xl mb-6">{content.subtitle}</h2>
          <p className="text-lg max-w-2xl mx-auto mb-8">{content.description}</p>
          <Link to="/home">
            <Button size="lg" className="bg-white text-tinder-rose hover:bg-gray-100">
              {content.callToAction} <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {content.features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  <FeatureIcon index={index} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4">© {new Date().getFullYear()} AI Dating App. All rights reserved.</p>
          <div className="flex justify-center space-x-4">
            <Link to="/home" className="hover:text-tinder-rose transition-colors">Home</Link>
            <Link to="/admin" className="hover:text-tinder-rose transition-colors">Admin</Link>
            <Link to="/super-admin" className="hover:text-tinder-rose transition-colors">Super Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
