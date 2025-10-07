import React from 'react';
import { Check } from 'lucide-react';
import kurdishLandscape from '@/assets/kurdish-landscape.jpg';

const culturalPoints = [
  'Meet singles from all regions of Kurdistan',
  'Share traditions, language, and values',
  'Build meaningful relationships rooted in culture',
  'Celebrate Kurdish identity together',
];

const CulturalShowcase = () => {
  return (
    <div className="w-full bg-gradient-to-b from-transparent via-black/20 to-transparent py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <div className="relative transform-gpu transition-all duration-500 hover:scale-105">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/20 transform-gpu transition-all duration-500 hover:shadow-3xl hover:shadow-purple-500/40"
              style={{
                transformStyle: 'preserve-3d',
              }}
              onMouseMove={(e) => {
                const card = e.currentTarget;
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
              }}
              onMouseLeave={(e) => {
                const card = e.currentTarget;
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
              }}
            >
              <img
                src={kurdishLandscape}
                alt="Kurdish Heritage"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-purple-900/40 to-transparent" />
              
              {/* Floating Pattern Overlay */}
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full bg-repeat" style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M30 0l5 15h15l-12 9 5 15-13-10-13 10 5-15-12-9h15z" fill="%23ffffff" fill-opacity="1"/%3E%3C/svg%3E")',
                  backgroundSize: '40px 40px',
                }} />
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="space-y-6">
            <div className="inline-block">
              <span className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full text-purple-200 text-sm font-medium">
                Rooted in Kurdish Culture
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Connecting Hearts,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                Honoring Heritage
              </span>
            </h2>

            <p className="text-xl text-purple-200 leading-relaxed">
              KurdMatch is more than a dating app – it's a celebration of Kurdish identity, 
              bringing together singles who share our rich cultural heritage.
            </p>

            <div className="space-y-4 pt-4">
              {culturalPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-purple-100 text-lg">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CulturalShowcase;
