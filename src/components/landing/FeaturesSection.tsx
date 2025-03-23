
import React from 'react';
import FeatureCard from './FeatureCard';
import { Globe, Users, Heart, LucideIcon } from 'lucide-react';

interface FeatureCard {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface FeaturesContent {
  title: string;
  cards: FeatureCard[];
}

interface FeaturesSectionProps {
  content?: FeaturesContent;
}

// Default content
const defaultContent: FeaturesContent = {
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
};

// Helper function to get icon component from string
const getIconComponent = (iconName: string): React.ReactNode => {
  switch (iconName) {
    case 'Globe':
      return <Globe className="h-6 w-6" />;
    case 'Users':
      return <Users className="h-6 w-6" />;
    case 'Heart':
      return <Heart className="h-6 w-6" />;
    default:
      return <Globe className="h-6 w-6" />;
  }
};

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ content = defaultContent }) => {
  return (
    <div className="py-16 relative z-10 bg-indigo-950/80 backdrop-blur-lg border-t border-indigo-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">{content.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.cards.map(card => (
            <FeatureCard 
              key={card.id}
              icon={getIconComponent(card.icon)}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
