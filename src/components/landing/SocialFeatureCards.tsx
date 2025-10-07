import React, { useState } from 'react';
import { Video, MessageCircle, Calendar } from 'lucide-react';

const features = [
  {
    icon: Video,
    title: 'Video Call',
    description: 'Connect face-to-face with Kurds worldwide through high-quality video calls.',
  },
  {
    icon: MessageCircle,
    title: 'Instant Messaging',
    description: 'Chat seamlessly in Kurdish, English, or any language you prefer.',
  },
  {
    icon: Calendar,
    title: 'Global Events',
    description: 'Join Kurdish gatherings, meetups, and cultural events in your area.',
  },
];

const SocialFeatureCards = () => {
  const [cardRotations, setCardRotations] = useState<{ [key: number]: { rotateX: number; rotateY: number } }>({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    setCardRotations(prev => ({
      ...prev,
      [index]: { rotateX, rotateY }
    }));
  };

  const handleMouseLeave = () => {
    setCardRotations({});
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Everything You Need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Connect</span>
          </h2>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Features designed specifically for the Kurdish community
          </p>
        </div>

        {/* Feature Cards Grid - Now 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative group"
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `perspective(1000px) rotateX(${cardRotations[index]?.rotateX || 0}deg) rotateY(${cardRotations[index]?.rotateY || 0}deg)`,
                transition: 'transform 0.1s ease-out',
              }}
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 h-full hover:bg-white/10 transition-all duration-300 hover:border-purple-400/50 group-hover:shadow-2xl group-hover:shadow-purple-500/20">
                {/* Icon with gradient background */}
                <div className="mb-6 inline-flex">
                  <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl p-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-10 h-10 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-purple-400 transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-purple-200 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialFeatureCards;
