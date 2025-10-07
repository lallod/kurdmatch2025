import React from 'react';
import { Sparkles, Globe, Camera, Circle, Image, MessageCircle } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Matchmaking',
    description: 'Smart algorithm finds compatible Kurdish singles based on your preferences and values',
  },
  {
    icon: Globe,
    title: 'Cultural Discovery',
    description: 'Connect through shared Kurdish heritage, traditions, and cultural identity',
  },
  {
    icon: Camera,
    title: 'Social Feed',
    description: 'Share posts, stories, photos, and life moments with your community',
  },
  {
    icon: Circle,
    title: 'Live Stories',
    description: 'View and share daily stories from your matches and connections',
  },
  {
    icon: Image,
    title: 'Photo Sharing',
    description: 'Share beautiful moments and memories with your Kurdish community',
  },
  {
    icon: MessageCircle,
    title: 'Instant Messaging',
    description: 'Real-time chat with matches featuring text, photos, and emojis',
  },
];

const SocialFeatureCards = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
        Everything You Need to Connect
      </h2>
      <p className="text-purple-200 text-center mb-12 max-w-2xl mx-auto">
        Modern features designed for meaningful connections within the Kurdish community
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="group p-6 rounded-xl bg-indigo-900/20 backdrop-blur-lg border border-indigo-800/30 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-purple-200 text-sm leading-relaxed">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SocialFeatureCards;
