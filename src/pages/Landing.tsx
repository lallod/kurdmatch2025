import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Users, Star } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center text-white max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
            Find Your Perfect Match
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-purple-100">
            Connect with like-minded people and discover meaningful relationships
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button asChild size="lg" className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3">
              <Link to="/register">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-900 px-8 py-3">
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
          
          {/* Features Grid */}
          <div className="grid md:grid-cols-4 gap-8 mt-20">
            <div className="text-center">
              <div className="bg-white/10 rounded-full p-6 mx-auto mb-4 w-20 h-20 flex items-center justify-center">
                <Heart className="h-8 w-8 text-pink-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Matching</h3>
              <p className="text-purple-200">Our algorithm finds your perfect matches</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/10 rounded-full p-6 mx-auto mb-4 w-20 h-20 flex items-center justify-center">
                <MessageCircle className="h-8 w-8 text-blue-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy Messaging</h3>
              <p className="text-purple-200">Chat instantly with your matches</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/10 rounded-full p-6 mx-auto mb-4 w-20 h-20 flex items-center justify-center">
                <Users className="h-8 w-8 text-green-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Real People</h3>
              <p className="text-purple-200">Verified profiles for authentic connections</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/10 rounded-full p-6 mx-auto mb-4 w-20 h-20 flex items-center justify-center">
                <Star className="h-8 w-8 text-yellow-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Premium Features</h3>
              <p className="text-purple-200">Advanced filters and priority matching</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-black/20 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Find Love?
          </h2>
          <p className="text-purple-200 mb-8 max-w-2xl mx-auto">
            Join thousands of singles who have found their perfect match. Start your journey today.
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-12 py-4">
            <Link to="/register">Start Matching Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;