import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, Heart } from 'lucide-react';

const trustIndicators = [
  { icon: Heart, text: '100% Free to Join' },
  { icon: CheckCircle, text: 'Verified Profiles' },
  { icon: Shield, text: 'Secure & Private' },
];

const LandingCTA = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full relative py-20 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 animate-gradient-slow" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <div 
          className="glass-card p-12 rounded-3xl border border-white/20 shadow-2xl shadow-purple-500/30 backdrop-blur-md bg-white/5 transform-gpu transition-all duration-500 hover:scale-105 hover:shadow-3xl hover:shadow-purple-500/50"
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
            const rotateX = (y - centerY) / 30;
            const rotateY = (centerX - x) / 30;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
          }}
          onMouseLeave={(e) => {
            const card = e.currentTarget;
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
          }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Join 10,000+ Kurdish Singles Today
          </h2>
          
          <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
            Start your journey to find meaningful connections within the Kurdish community. 
            It's free, secure, and designed for you.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              size="lg"
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold px-12 py-6 text-xl shadow-lg shadow-purple-500/50 animate-pulse-slow"
            >
              Join Now – Free
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white/30 bg-white/5 hover:bg-white/10 text-white font-semibold px-12 py-6 text-xl backdrop-blur-sm"
            >
              Learn More
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 pt-6 border-t border-white/10">
            {trustIndicators.map((indicator, index) => {
              const Icon = indicator.icon;
              return (
                <div key={index} className="flex items-center gap-2 text-purple-200">
                  <Icon className="w-5 h-5 text-purple-400" />
                  <span className="font-medium">{indicator.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingCTA;
