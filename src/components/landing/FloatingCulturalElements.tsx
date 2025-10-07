import React from 'react';
import { Heart } from 'lucide-react';

const FloatingCulturalElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating Hearts */}
      {[...Array(8)].map((_, i) => (
        <div
          key={`heart-${i}`}
          className="absolute animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        >
          <Heart
            className="text-pink-400/20"
            size={20 + Math.random() * 20}
            fill="currentColor"
          />
        </div>
      ))}

      {/* Glowing Particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-particle-float"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: '0',
            animationDelay: `${i * 0.3}s`,
            animationDuration: `${8 + Math.random() * 4}s`,
          }}
        />
      ))}

      {/* Kurdish Pattern Overlay */}
      <div className="absolute inset-0 kurdish-pattern opacity-5" />
    </div>
  );
};

export default FloatingCulturalElements;
