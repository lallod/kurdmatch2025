
import { Json } from '@/integrations/supabase/types';

// Define types for our landing page content
export interface HeroContent {
  title: string;
  subtitle: string;
  tagline: string;
  userCount: string;
}

export interface FeatureCard {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface KurdistanSection {
  title: string;
  subtitle: string;
  leftTitle: string;
  leftDescription: string;
  leftPoints: string[];
  rightTitle: string;
  rightDescription: string;
  rightPoints: string[];
}

export interface FooterContent {
  copyright: string;
}

export interface LandingPageContent {
  hero: HeroContent;
  features: {
    title: string;
    cards: FeatureCard[];
  };
  kurdistan: KurdistanSection;
  footer: FooterContent;
}

// Type for the database record
export interface LandingPageRecord {
  id: number;
  content: LandingPageContent;
  created_at?: string;
  updated_at?: string;
}

// Initial content data
export const initialContent: LandingPageContent = {
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
