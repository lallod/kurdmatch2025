import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, Heart, Plane, Users, Home, Calendar, Music, UtensilsCrossed, Sparkles, ArrowRight, Globe2, MessageCircle, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MobileSidebar from '@/components/landing/MobileSidebar';
import PhotoGallerySection from '@/components/landing/PhotoGallerySection';
import { useLanguage, LanguageCode } from '@/contexts/LanguageContext';
import { useLandingV2Content } from '@/hooks/useLandingV2Content';
import { isRTL, getTextDirection } from '@/utils/rtl';

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

// Image mapping for features
const imageMap: Record<string, string> = {
  lover: featureLover,
  travel: featureTravel,
  friends: featureFriends,
  family: featureFamily,
  events: featureEvents,
  parties: featureParties,
  picnic: featurePicnic,
  cultural: featureCultural,
};

const LandingV2 = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { content, loading } = useLandingV2Content(language);
  const textDir = getTextDirection(language);
  const isRtl = isRTL(language);
  const isKurdish = language === 'kurdish_sorani' || language === 'kurdish_kurmanci';

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

  return (
    <div className="min-h-screen bg-background relative overflow-hidden" dir={textDir}>
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
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground hidden sm:block">KurdMatch</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-foreground hover:text-primary transition-colors font-medium">Home</a>
              <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">About</a>
              <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</a>
              <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</a>
            </nav>

            {/* Desktop Language Switcher & Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Select value={language} onValueChange={(value) => setLanguage(value as LanguageCode)}>
                <SelectTrigger className="w-[180px] bg-accent/10 border-border text-foreground hover:bg-accent/15">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border-border z-50">
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="kurdish_sorani">کوردی (سۆرانی)</SelectItem>
                  <SelectItem value="kurdish_kurmanci">Kurdî (Kurmancî)</SelectItem>
                  <SelectItem value="norwegian">Norsk</SelectItem>
                  <SelectItem value="german">Deutsch</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/auth')}
                className="text-foreground hover:bg-accent/10"
              >
                Login
              </Button>
              <Button 
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-600"
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
              <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-foreground ${isKurdish ? 'font-kurdistan' : ''} ${isRtl ? 'text-right' : ''}`}>
                {content.hero_title}
              </h1>

              <p className={`text-lg text-muted-foreground max-w-xl ${isKurdish ? 'font-kurdistan' : ''} ${isRtl ? 'text-right' : ''}`}>
                {content.hero_subtitle}
              </p>

              <div className={`flex flex-wrap gap-4 pt-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <Button 
                  size="lg"
                  onClick={() => navigate('/register')}
                  className="bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-600 text-primary-foreground px-8 rounded-full shadow-lg"
                >
                  {content.hero_cta_text} <ArrowRight className={`${isRtl ? 'mr-2' : 'ml-2'} w-4 h-4`} />
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
      <section id="features" className="py-16 md:py-24 bg-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What You Can <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-400">Find</span>
            </h2>
            <p className="text-lg text-muted-foreground">Connect with Kurdish community worldwide</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.features.map((feature, index) => {
              const iconMap: Record<string, any> = {
                Heart, Plane, Users, Home, Calendar, Music, UtensilsCrossed, Sparkles
              };
              const FeatureIcon = iconMap[feature.icon] || Heart;
              
              return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="bg-card backdrop-blur-lg border border-border rounded-2xl overflow-hidden hover:bg-card/80 transition-all group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={imageMap[feature.id] || featureLover} 
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className={`p-6 space-y-3 ${isRtl ? 'text-right' : ''}`}>
                  <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <FeatureIcon className="w-5 h-5 text-primary" />
                    <h3 className={`text-lg font-bold text-foreground ${isKurdish ? 'font-kurdistan' : ''}`}>{feature.title}</h3>
                  </div>
                  <p className={`text-sm text-muted-foreground ${isKurdish ? 'font-kurdistan' : ''}`}>{feature.description}</p>
                </div>
              </motion.div>
            );
            })}
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
            <h2 className={`text-3xl md:text-4xl font-bold text-foreground mb-4 ${isKurdish ? 'font-kurdistan' : ''}`}>
              {content.community_title}
            </h2>
            <p className={`text-lg text-muted-foreground max-w-2xl mx-auto ${isKurdish ? 'font-kurdistan' : ''}`}>
              {content.community_subtitle}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className={`flex items-start gap-4 ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Globe2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-xl font-bold text-foreground mb-2 ${isKurdish ? 'font-kurdistan' : ''}`}>All Kurdish Dialects Welcome</h3>
                  <p className={`text-muted-foreground ${isKurdish ? 'font-kurdistan' : ''}`}>{content.community_dialects.join(', ')} - {content.community_description}</p>
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
      <section className="py-16 md:py-24 bg-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className={`text-3xl md:text-4xl font-bold text-foreground mb-4 ${isKurdish ? 'font-kurdistan' : ''}`}>
              {content.how_it_works_title}
            </h2>
            <p className={`text-lg text-muted-foreground ${isKurdish ? 'font-kurdistan' : ''}`}>Three simple steps to start your journey</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {content.how_it_works_steps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                <div className={`bg-card backdrop-blur-lg border border-border rounded-2xl p-8 space-y-4 ${isRtl ? 'text-right' : ''}`}>
                  <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-400">
                    {String(item.step).padStart(2, '0')}
                  </div>
                  <h3 className={`text-xl font-bold text-foreground ${isKurdish ? 'font-kurdistan' : ''}`}>{item.title}</h3>
                  <p className={`text-muted-foreground ${isKurdish ? 'font-kurdistan' : ''}`}>{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-pink-400 to-purple-400" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <PhotoGallerySection
        title={content.gallery_title}
        subtitle={content.gallery_subtitle}
        categories={content.gallery_categories}
        isRtl={isRtl}
      />

      {/* Final CTA Section */}
      <section id="contact" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card/50 backdrop-blur-lg border border-border rounded-3xl p-12 text-center space-y-6"
          >
            <h2 className={`text-3xl md:text-4xl font-bold text-foreground ${isKurdish ? 'font-kurdistan' : ''}`}>
              {content.cta_title}
            </h2>
            <p className={`text-lg text-muted-foreground max-w-2xl mx-auto ${isKurdish ? 'font-kurdistan' : ''}`}>
              {content.cta_subtitle || 'Join thousands of Kurds from around the world finding love, friendship, and community on KurdMatch.'}
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-600 text-primary-foreground px-12 rounded-full shadow-xl"
            >
              {content.cta_button_text} <ArrowRight className={`${isRtl ? 'mr-2' : 'ml-2'} w-5 h-5`} />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/30 backdrop-blur-lg border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xl font-bold text-foreground">KurdMatch</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Connecting Kurdish hearts worldwide
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-sm text-purple-200">
                <li><a href="/about" className="hover:text-pink-300 transition-colors">About Us</a></li>
                <li><a href="#features" className="hover:text-pink-300 transition-colors">Features</a></li>
                <li><a href="/help" className="hover:text-pink-300 transition-colors">Help & Support</a></li>
                <li><a href="/community-guidelines" className="hover:text-pink-300 transition-colors">Community Guidelines</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Legal</h4>
              <ul className="space-y-2 text-sm text-purple-200">
                <li><a href="/privacy-policy" className="hover:text-pink-300 transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-pink-300 transition-colors">Terms of Service</a></li>
                <li><a href="/cookie-policy" className="hover:text-pink-300 transition-colors">Cookie Policy</a></li>
                <li><a href="/contact" className="hover:text-pink-300 transition-colors">Contact Us</a></li>
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

          <div className={`border-t border-white/20 mt-8 pt-8 text-center text-sm text-purple-200 ${isRtl ? 'font-arabic' : ''}`}>
            <p>© {new Date().getFullYear()} KurdMatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingV2;
