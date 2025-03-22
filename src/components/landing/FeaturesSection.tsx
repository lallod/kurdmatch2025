
import React from 'react';
import FeatureCard from './FeatureCard';
import { Globe, Users, Heart } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  return (
    <div className="py-16 relative z-10 bg-indigo-950/80 backdrop-blur-lg border-t border-indigo-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Connecting Kurdish Hearts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Globe className="h-6 w-6" />}
            title="Worldwide Connection"
            description="Connect with Kurdish singles from all regions of Kurdistan and across the global diaspora."
          />
          <FeatureCard 
            icon={<Users className="h-6 w-6" />}
            title="Cultural Understanding"
            description="Find someone who shares your Kurdish heritage, traditions, and values."
          />
          <FeatureCard 
            icon={<Heart className="h-6 w-6" />}
            title="Meaningful Relationships"
            description="Build connections based on shared cultural identity and personal compatibility."
          />
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
