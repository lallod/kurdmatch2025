
import React, { useState } from 'react';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import KurdistanSection from '@/components/landing/KurdistanSection';
import Footer from '@/components/landing/Footer';

const Landing = () => {
  const [showAIAnimation, setShowAIAnimation] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-indigo-950">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Kurdistan Heritage Section */}
      <KurdistanSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;
