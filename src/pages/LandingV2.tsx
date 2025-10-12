import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, Heart, Globe, Users, Sparkles } from 'lucide-react';
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

  const iconMap: Record<string, any> = {
    Globe,
    Users,
    Heart,
    Sparkles
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Heart className="w-12 h-12 text-white" />
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
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute top-0 left-0 right-0 z-30 p-4 md:p-6"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-lg hover:bg-white/20 transition-all"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-white font-bold text-lg">KurdMatch</h1>
              <p className="text-purple-200 text-xs">Kurdish Hearts</p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <div className="flex min-h-screen items-center justify-center px-4 py-20">
        <div className="w-full max-w-4xl text-center space-y-8 md:space-y-12">
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block px-6 py-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20"
          >
            <p className={`text-purple-200 text-sm md:text-base ${isSorani ? 'font-kurdish-sorani' : ''}`}>
              {content.hero.tagline}
            </p>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight ${isSorani ? 'font-kurdish-sorani' : ''}`}
          >
            {content.hero.title.split(' ').map((word, i, arr) => (
              i === arr.length - 1 ? (
                <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                  {word}
                </span>
              ) : (
                <span key={i}>{word} </span>
              )
            ))}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className={`text-lg sm:text-xl md:text-2xl text-purple-200 max-w-3xl mx-auto ${isSorani ? 'font-kurdish-sorani' : ''}`}
          >
            {content.hero.subtitle}
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Button
              size="lg"
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-xl rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              {content.hero.cta}
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex items-center justify-center gap-2 pt-8"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map(i => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2 + i * 0.1, type: 'spring' }}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 border-2 border-white/20"
                />
              ))}
            </div>
            <span className="text-purple-200 font-medium ml-2 text-sm sm:text-base">
              502 Kurdish singles ready to connect
            </span>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-b from-transparent to-black/20 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-8 sm:mb-16 ${isSorani ? 'font-kurdish-sorani' : ''}`}
          >
            {content.features.title}
          </motion.h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {content.features.items.map((feature, index) => {
              const IconComponent = iconMap[feature.icon] || Heart;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="text-center space-y-4 p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center"
                  >
                    <IconComponent className="w-8 h-8 text-purple-300" />
                  </motion.div>
                  <h3 className={`text-lg sm:text-xl font-semibold text-white ${isSorani ? 'font-kurdish-sorani' : ''}`}>
                    {feature.title}
                  </h3>
                  <p className={`text-purple-200 text-sm sm:text-base ${isSorani ? 'font-kurdish-sorani' : ''}`}>
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingV2;
