import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, Heart, MessageSquare, Phone, MessageCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MobileSidebar from '@/components/landing/MobileSidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLandingContent } from '@/hooks/useLandingContent';

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
                Dating in your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Favorite</span> Instant Messengers!
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
                  Get Started <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.div>

            {/* Right Image Area */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full aspect-square bg-white/10 backdrop-blur-lg border border-white/20 rounded-full flex items-center justify-center">
                <Heart className="w-32 h-32 text-pink-300/30" />
                {/* Floating decorative elements */}
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-10 right-10 w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl"
                >
                  <Heart className="w-8 h-8 text-white" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, 20, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  className="absolute bottom-20 left-10 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-xl"
                >
                  <MessageSquare className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: MessageSquare, title: 'Message', description: 'Connect through instant messaging with Kurdish singles worldwide', color: 'bg-orange-500' },
              { icon: Phone, title: 'Voice Call', description: 'Make voice calls and hear the voice of your potential match', color: 'bg-red-500' },
              { icon: MessageCircle, title: 'Chat', description: 'Real-time chat features to build meaningful connections', color: 'bg-yellow-500' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center space-y-4 hover:bg-white/15 transition-all"
              >
                <div className={`mx-auto w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                <p className="text-purple-200">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet The Chosen One Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="w-full aspect-square bg-white/10 backdrop-blur-lg border border-white/20 rounded-full flex items-center justify-center">
                <Heart className="w-32 h-32 text-pink-300/30" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Meet The <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Chosen One</span>
              </h2>
              <p className="text-lg text-purple-200">
                Find your perfect match among Kurdish singles who share your heritage, values, and vision for the future. Build meaningful connections based on cultural understanding.
              </p>
              <Button 
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-full shadow-lg"
              >
                Join Now <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                We are a Dynamic Lover <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Communication</span>
              </h2>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-5xl font-bold text-pink-400 mb-2">2+</div>
                  <div className="text-purple-200">Years of service</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-pink-400 mb-2">502</div>
                  <div className="text-purple-200">Active Users</div>
                </div>
              </div>

              <Button 
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-full shadow-lg"
              >
                Get Started
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <div className="aspect-square bg-gradient-to-br from-orange-500 to-pink-600 rounded-3xl flex items-center justify-center shadow-xl">
                  <MessageCircle className="w-16 h-16 text-white" />
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="aspect-square bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
                  <Heart className="w-16 h-16 text-white" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl flex items-center justify-center">
                  <Heart className="w-16 h-16 text-pink-400" />
                </div>
                <div className="aspect-square bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl flex items-center justify-center pt-12">
                  <MessageSquare className="w-16 h-16 text-purple-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Your Friends Come To Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Phone.</span>
              </h2>
              <p className="text-lg text-purple-200">
                Connect with Kurdish singles from all over the world. Share your culture, traditions, and build meaningful relationships that last.
              </p>
              <Button 
                size="lg"
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-full shadow-lg"
              >
                Get Started
              </Button>
            </motion.div>
          </div>
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
