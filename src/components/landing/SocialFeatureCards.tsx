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
              className="group p-6 rounded-xl bg-indigo-900/20 backdrop-blur-lg border border-indigo-800/30 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/40 transform-gpu perspective-card"
              style={{
                animationDelay: `${index * 0.1}s`,
                transformStyle: 'preserve-3d',
              }}
              onMouseMove={(e) => {
                const card = e.currentTarget;
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
              }}
              onMouseLeave={(e) => {
                const card = e.currentTarget;
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
              }}
            >
              <div 
                className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-500 group-hover:rotate-12"
                style={{ transform: 'translateZ(30px)' }}
              >
                <Icon className="w-7 h-7 text-purple-400 group-hover:text-pink-400 transition-colors" />
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
