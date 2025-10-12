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
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
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

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/auth')}
                className="text-foreground"
              >
                Login
              </Button>
              <Button 
                onClick={() => navigate('/register')}
                className="bg-primary hover:bg-primary/90"
              >
                REGISTER
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden w-10 h-10 flex items-center justify-center"
            >
              <Menu className="w-6 h-6 text-foreground" />
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
                <span className="text-sm text-primary font-medium bg-primary/10 px-4 py-2 rounded-full">
                  {content.hero.tagline}
                </span>
              </div>
              
              <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight ${isSorani ? 'font-kurdish-sorani' : ''}`}>
                Dating in your <span className="text-primary">Favorite</span> Instant Messengers!
              </h1>

              <p className="text-lg text-muted-foreground max-w-xl">
                {content.hero.subtitle}
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button 
                  size="lg"
                  onClick={() => navigate('/register')}
                  className="bg-primary hover:bg-primary/90 text-white px-8"
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
              <div className="relative w-full aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                <Heart className="w-32 h-32 text-primary/30" />
                {/* Floating decorative elements */}
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-10 right-10 w-16 h-16 bg-primary rounded-full flex items-center justify-center"
                >
                  <Heart className="w-8 h-8 text-white" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, 20, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  className="absolute bottom-20 left-10 w-12 h-12 bg-accent rounded-full flex items-center justify-center"
                >
                  <MessageSquare className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-muted/30">
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
                className="bg-background rounded-2xl p-8 text-center space-y-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`mx-auto w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
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
              <div className="w-full aspect-square bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
                <Heart className="w-32 h-32 text-primary/30" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold">
                Meet The <span className="text-primary">Chosen One</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Find your perfect match among Kurdish singles who share your heritage, values, and vision for the future. Build meaningful connections based on cultural understanding.
              </p>
              <Button 
                onClick={() => navigate('/register')}
                className="bg-primary hover:bg-primary/90"
              >
                Join Now <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold">
                We are a Dynamic Lover <span className="text-primary">Communication</span>
              </h2>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-5xl font-bold text-primary mb-2">2+</div>
                  <div className="text-muted-foreground">Years of service</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-primary mb-2">502</div>
                  <div className="text-muted-foreground">Active Users</div>
                </div>
              </div>

              <Button 
                onClick={() => navigate('/register')}
                className="bg-primary hover:bg-primary/90"
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
                <div className="aspect-square bg-gradient-to-br from-orange-400 to-orange-500 rounded-3xl flex items-center justify-center">
                  <MessageCircle className="w-16 h-16 text-white" />
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="aspect-square bg-gradient-to-br from-primary to-purple-600 rounded-3xl flex items-center justify-center">
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
                <div className="aspect-square bg-gradient-to-br from-pink-100 to-pink-200 rounded-3xl flex items-center justify-center">
                  <Heart className="w-16 h-16 text-primary" />
                </div>
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl flex items-center justify-center pt-12">
                  <MessageSquare className="w-16 h-16 text-primary" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold">
                Your Friends Come To Your <span className="text-primary">Phone.</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Connect with Kurdish singles from all over the world. Share your culture, traditions, and build meaningful relationships that last.
              </p>
              <Button 
                size="lg"
                onClick={() => navigate('/register')}
                className="bg-primary hover:bg-primary/90"
              >
                Get Started
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">KurdMatch</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Connecting Kurdish hearts worldwide
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#about" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Get Started</h4>
              <div className="space-y-2">
                <Button 
                  onClick={() => navigate('/auth')}
                  variant="outline"
                  className="w-full"
                >
                  Login
                </Button>
                <Button 
                  onClick={() => navigate('/register')}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Register
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 KurdMatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingV2;
