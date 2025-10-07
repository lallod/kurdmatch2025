import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Globe, Users } from 'lucide-react';
import kurdishCommunity from '@/assets/kurdish-community.jpg';

const DynamicCommunity = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            We are a Dynamic <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Global Community</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Connecting the Kurdish diaspora worldwide. Whether you're in Kurdistan, 
            Europe, the Americas, or anywhere else, find your community here.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Stats */}
          <div className="space-y-8 animate-fade-in">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-100">
              <div className="flex items-center gap-6">
                <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl p-6">
                  <Globe className="w-12 h-12 text-white" />
                </div>
                <div>
                  <div className="text-5xl font-bold text-purple-600">50+</div>
                  <div className="text-lg text-gray-700 mt-1">Countries Represented</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-8 border border-pink-100">
              <div className="flex items-center gap-6">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <div>
                  <div className="text-5xl font-bold text-pink-600">10.5K</div>
                  <div className="text-lg text-gray-700 mt-1">Active Users Worldwide</div>
                </div>
              </div>
            </div>

            <Button 
              size="lg"
              className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-12 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => navigate('/register')}
            >
              Join Our Community
            </Button>
          </div>

          {/* Right Side - Profile Cards Stack */}
          <div className="relative animate-fade-in">
            <div className="relative">
              <img 
                src={kurdishCommunity} 
                alt="Kurdish Community"
                className="w-full h-[600px] object-cover rounded-3xl shadow-2xl"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 via-transparent to-transparent rounded-3xl"></div>
              
              {/* Floating badge */}
              <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">Growing Every Day</div>
                  <div className="text-gray-700">New members joining from around the world</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DynamicCommunity;
