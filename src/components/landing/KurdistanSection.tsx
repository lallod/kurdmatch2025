
import React from 'react';

const KurdistanSection: React.FC = () => {
  return (
    <div className="py-16 relative z-10 bg-gradient-to-b from-indigo-950/80 to-purple-950/80">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-4">Celebrating Kurdish Heritage</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Whether you're from Bakur, Bashur, Rojava, Rojhelat, or part of the diaspora, 
            our platform helps you find someone who understands your unique background.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12">
          <div className="bg-indigo-900/20 p-8 rounded-xl border border-indigo-800/30">
            <h3 className="text-2xl font-bold text-white mb-4">For Kurds Everywhere</h3>
            <p className="text-gray-300 mb-6">
              Our community welcomes Kurdish people from all walks of life and all parts of the world. Whether 
              you were born in Kurdistan or abroad, our platform helps you connect with others who share your heritage.
            </p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <span className="h-5 w-5 mr-2 rounded-full bg-purple-500 flex items-center justify-center text-white">✓</span>
                Connect with Kurds from different regions
              </li>
              <li className="flex items-center">
                <span className="h-5 w-5 mr-2 rounded-full bg-purple-500 flex items-center justify-center text-white">✓</span>
                Share your unique cultural experiences
              </li>
              <li className="flex items-center">
                <span className="h-5 w-5 mr-2 rounded-full bg-purple-500 flex items-center justify-center text-white">✓</span>
                Find partners who understand your background
              </li>
            </ul>
          </div>
          
          <div className="bg-indigo-900/20 p-8 rounded-xl border border-indigo-800/30">
            <h3 className="text-2xl font-bold text-white mb-4">Preserving Our Culture</h3>
            <p className="text-gray-300 mb-6">
              We believe that fostering relationships within our community helps preserve and celebrate 
              our rich Kurdish culture, language, and traditions for generations to come.
            </p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <span className="h-5 w-5 mr-2 rounded-full bg-purple-500 flex items-center justify-center text-white">✓</span>
                Filter by dialect and regional background
              </li>
              <li className="flex items-center">
                <span className="h-5 w-5 mr-2 rounded-full bg-purple-500 flex items-center justify-center text-white">✓</span>
                Share your favorite Kurdish traditions
              </li>
              <li className="flex items-center">
                <span className="h-5 w-5 mr-2 rounded-full bg-purple-500 flex items-center justify-center text-white">✓</span>
                Build relationships based on shared values
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KurdistanSection;
