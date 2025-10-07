import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Users, Heart, Globe } from 'lucide-react';
import kurdishCoupleEmbrace from '@/assets/kurdish-couple-embrace.jpg';

const MeetTheConnection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-[#FFF5F0] to-[#FFE8DD]">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left Side - Image */}
          <div className="relative animate-fade-in">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={kurdishCoupleEmbrace} 
                alt="Kurdish Connection"
                className="w-full h-[500px] object-cover"
              />
              {/* Decorative hearts */}
              <div className="absolute top-8 right-8 bg-pink-500 rounded-full p-3 animate-pulse">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <div className="absolute bottom-8 left-8 bg-purple-500 rounded-full p-3 animate-pulse" style={{ animationDelay: '0.5s' }}>
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Meet Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Kurdish Connection</span>
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed">
                Whether you're looking for friendship, romance, or professional networking, 
                KurdMatch connects you with Kurdish people who share your heritage, values, 
                and aspirations across the globe.
              </p>
            </div>

            {/* Statistics Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-100">
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-purple-600">10.5K+</div>
                  <div className="text-sm text-gray-600 mt-1">Active Users</div>
                </div>
                <div className="text-center border-x border-purple-100">
                  <div className="flex items-center justify-center mb-2">
                    <Globe className="w-6 h-6 text-pink-600" />
                  </div>
                  <div className="text-3xl font-bold text-pink-600">50+</div>
                  <div className="text-sm text-gray-600 mt-1">Countries</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Heart className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-purple-600">2,340</div>
                  <div className="text-sm text-gray-600 mt-1">Success Stories</div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-12 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => navigate('/register')}
            >
              Find Your Community
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeetTheConnection;
