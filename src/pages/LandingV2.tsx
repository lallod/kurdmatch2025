import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, Heart, Plane, Users, Home, Calendar, Music, UtensilsCrossed, Sparkles, ArrowRight, Globe2, MessageCircle, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MobileSidebar from '@/components/landing/MobileSidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLandingContent } from '@/hooks/useLandingContent';

// Import generated images
import heroRomance from '@/assets/landing/hero-romance.jpg';
import featureLover from '@/assets/landing/feature-lover.jpg';
import featureTravel from '@/assets/landing/feature-travel.jpg';
import featureFriends from '@/assets/landing/feature-friends.jpg';
import featureFamily from '@/assets/landing/feature-family.jpg';
import featureEvents from '@/assets/landing/feature-events.jpg';
import featureParties from '@/assets/landing/feature-parties.jpg';
import featurePicnic from '@/assets/landing/feature-picnic.jpg';
import featureCultural from '@/assets/landing/feature-cultural.jpg';

// Import user photos
import user1 from '@/assets/landing/user-1.png';
import user2 from '@/assets/landing/user-2.png';
import user3 from '@/assets/landing/user-3.png';
import user4 from '@/assets/landing/user-4.png';

const LandingV2 = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { content, loading } = useLandingContent(language);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Heart className="w-12 h-12 text-primary" />
        </motion.div>
      </div>
    );
  }

  const isSorani = language === 'kurdish_sorani';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.5, 0.1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold text-white hidden sm:block">KurdMatch</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-white hover:text-pink-300 transition-colors font-medium">Home</a>
              <a href="#about" className="text-purple-200 hover:text-pink-300 transition-colors">About</a>
              <a href="#features" className="text-purple-200 hover:text-pink-300 transition-colors">Features</a>
              <a href="#contact" className="text-purple-200 hover:text-pink-300 transition-colors">Contact</a>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/auth')}
                className="text-white hover:bg-white/10"
              >
                Login
              </Button>
              <Button 
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                REGISTER
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-all"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="inline-block">
                <span className="text-sm text-purple-200 font-medium bg-white/10 backdrop-blur-lg border border-white/20 px-4 py-2 rounded-full">
                  {content.hero.tagline}
                </span>
              </div>
              
              <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white ${isSorani ? 'font-kurdish-sorani' : ''}`}>
                {content.hero.title}
              </h1>

              <p className="text-lg text-purple-200 max-w-xl">
                {content.hero.subtitle}
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button 
                  size="lg"
                  onClick={() => navigate('/register')}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 rounded-full shadow-lg"
                >
                  {content.hero.cta} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.div>

            {/* Right Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img 
                src={heroRomance} 
                alt="Kurdish Couple Romance" 
                className="w-full rounded-3xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* What You Can Find - Main Features Grid */}
      <section id="features" className="py-16 md:py-24 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What You Can <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Find</span>
            </h2>
            <p className="text-lg text-purple-200">Connect with Kurdish community worldwide</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: 'Find Your Kurdish Lover', emoji: '💕', description: 'Connect with singles who share your heritage and values', image: featureLover },
              { icon: Plane, title: 'Find Your Travel Mate', emoji: '✈️', description: 'Explore Kurdistan and the world with fellow adventurers', image: featureTravel },
              { icon: Users, title: 'Find New Friends', emoji: '🌍', description: 'Build friendships across all Kurdish regions and diaspora', image: featureFriends },
              { icon: Home, title: 'Make a Kurdish Family', emoji: '🏡', description: 'Create lasting bonds and build your future together', image: featureFamily },
              { icon: Calendar, title: 'Find Kurdish Events', emoji: '🎉', description: 'Discover and join cultural gatherings in your area', image: featureEvents },
              { icon: Music, title: 'Find Kurdish Parties', emoji: '🪩', description: 'Celebrate life with vibrant Kurdish party scenes', image: featureParties },
              { icon: UtensilsCrossed, title: 'Find Kurdish Picnics', emoji: '🧺', description: 'Enjoy outdoor gatherings with traditional Kurdish cuisine', image: featurePicnic },
              { icon: Sparkles, title: 'Cultural Events', emoji: '🕊️', description: 'Experience traditional music, dance, and celebrations', image: featureCultural }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 transition-all group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 right-4 text-3xl">{feature.emoji}</div>
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <feature.icon className="w-5 h-5 text-pink-400" />
                    <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-purple-200">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Kurdish Community Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Join the Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Kurdish Community</span>
            </h2>
            <p className="text-lg text-purple-200 max-w-2xl mx-auto">
              Connect with Kurds from all regions of Kurdistan and across the global diaspora. No matter where you are, find your community.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Globe2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">All Kurdish Dialects Welcome</h3>
                  <p className="text-purple-200">Kurmanji, Sorani, Pehlewani, Zazaki - unite across linguistic boundaries and celebrate our shared heritage.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Kurdistan & Diaspora</h3>
                  <p className="text-purple-200">From Hewlêr to Europe, North America to Australia - connect with Kurds everywhere in the world.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Cultural Understanding</h3>
                  <p className="text-purple-200">Find people who understand your traditions, values, and the importance of Kurdish identity.</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <img src={user1} alt="Kurdish community" className="rounded-2xl shadow-xl" />
              <img src={user2} alt="Kurdish community" className="rounded-2xl shadow-xl mt-8" />
              <img src={user3} alt="Kurdish community" className="rounded-2xl shadow-xl" />
              <img src={user4} alt="Kurdish community" className="rounded-2xl shadow-xl mt-8" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Works</span>
            </h2>
            <p className="text-lg text-purple-200">Three simple steps to start your journey</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create Your Profile', description: 'Sign up and share your story, interests, and what you\'re looking for in the Kurdish community' },
              { step: '02', title: 'Discover Connections', description: 'Browse profiles, attend events, and connect with Kurds who share your interests and values' },
              { step: '03', title: 'Build Relationships', description: 'Start conversations, meet in person at events, and build meaningful connections that last' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 space-y-4">
                  <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  <p className="text-purple-200">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-pink-400 to-purple-400" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="contact" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl p-12 text-center space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Kurdish Connection?</span>
            </h2>
            <p className="text-lg text-purple-200 max-w-2xl mx-auto">
              Join thousands of Kurds from around the world finding love, friendship, and community on KurdMatch.
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-12 rounded-full shadow-xl"
            >
              Join KurdMatch Today <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-lg border-t border-white/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xl font-bold text-white">KurdMatch</span>
              </div>
              <p className="text-sm text-purple-200">
                Connecting Kurdish hearts worldwide
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-sm text-purple-200">
                <li><a href="#about" className="hover:text-pink-300 transition-colors">About Us</a></li>
                <li><a href="#features" className="hover:text-pink-300 transition-colors">Features</a></li>
                <li><a href="#contact" className="hover:text-pink-300 transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Legal</h4>
              <ul className="space-y-2 text-sm text-purple-200">
                <li><a href="#" className="hover:text-pink-300 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-pink-300 transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Get Started</h4>
              <div className="space-y-2">
                <Button 
                  onClick={() => navigate('/auth')}
                  variant="outline"
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Login
                </Button>
                <Button 
                  onClick={() => navigate('/register')}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  Register
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-purple-200">
            <p>&copy; 2025 KurdMatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingV2;
