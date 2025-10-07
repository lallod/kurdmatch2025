import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Heart } from 'lucide-react';
import kurdishFriends from '@/assets/kurdish-friends.jpg';

const CommunityPhone = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-[#FFF5F0] to-[#FFE8DD]">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left Side - Image with Chat Bubbles */}
          <div className="relative animate-fade-in">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={kurdishFriends} 
                alt="Kurdish Friends"
                className="w-full h-[500px] object-cover"
              />
            </div>

            {/* Chat Bubble 1 */}
            <div className="absolute top-12 -right-4 bg-white rounded-3xl rounded-tr-none p-4 shadow-xl max-w-[200px] animate-fade-in">
              <div className="flex items-start gap-2">
                <MessageCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-gray-900 font-medium">Hello! How are you?</p>
                  <p className="text-xs text-gray-500 mt-1">Just now</p>
                </div>
              </div>
            </div>

            {/* Chat Bubble 2 */}
            <div className="absolute bottom-12 -left-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl rounded-tl-none p-4 shadow-xl max-w-[200px] animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-start gap-2">
                <Heart className="w-5 h-5 text-white flex-shrink-0 mt-1" />
                <div>
                  <p className="text-white font-medium">So excited to connect!</p>
                  <p className="text-xs text-purple-200 mt-1">2 min ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Your Kurdish <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Community</span> Awaits
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                Stay connected to your heritage and build meaningful relationships with 
                Kurdish people worldwide. Chat, share experiences, and celebrate our 
                culture together.
              </p>
              
              {/* Features List */}
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="bg-purple-100 rounded-full p-2 mt-1">
                    <MessageCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Instant Messaging</div>
                    <div className="text-gray-600">Chat in Kurdish, English, or both</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-pink-100 rounded-full p-2 mt-1">
                    <Heart className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Cultural Connection</div>
                    <div className="text-gray-600">Share traditions, stories, and values</div>
                  </div>
                </li>
              </ul>
            </div>

            {/* CTA Button */}
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-12 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => navigate('/register')}
            >
              Start Connecting Today
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityPhone;
