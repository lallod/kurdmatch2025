
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import DynamicRegistrationForm from '@/components/auth/DynamicRegistrationForm';
import { Brain, Sparkles, Zap, Layers, Code, Bot, Heart, Globe, Users } from 'lucide-react';

const Landing = () => {
  const [showAIAnimation, setShowAIAnimation] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-indigo-950">
      {/* Hero Section */}
      <div className="relative py-16 overflow-hidden">
        {/* Abstract AI background elements */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <div className="absolute w-full h-full bg-grid-white/5"></div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full shimmer"
              style={{
                width: `${Math.random() * 500 + 300}px`,
                height: `${Math.random() * 500 + 300}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                background: `radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(30,27,75,0) 70%)`,
                transform: `scale(${Math.random() * 0.5 + 0.5})`,
              }}
            ></div>
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-900/30 border border-purple-700/30 text-sm text-purple-300 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 mr-2 text-purple-400" />
                <span>Connecting Kurds Worldwide</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
                Find Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 ml-2">Kurdish Match</span>
              </h1>
              
              <p className="text-xl text-gray-300">
                The first dating platform designed exclusively for Kurdish people from all parts of Kurdistan 
                and the diaspora, bringing together singles who share our rich heritage and values.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0"
                  onClick={() => setShowAIAnimation(true)}
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Join Our Community
                </Button>
                <Button size="lg" variant="outline" className="text-purple-300 border-purple-700/50 hover:bg-purple-900/20">
                  Learn More
                </Button>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 border-2 border-indigo-900"></div>
                  ))}
                </div>
                <div>
                  <span className="text-white font-semibold">10,000+</span> Kurdish singles have already joined
                </div>
              </div>
            </div>
            
            <div className="flex-1 mt-8 md:mt-0">
              <Card className="w-full max-w-md mx-auto backdrop-blur-md bg-white/10 border-gray-800/50 shadow-xl neo-card">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl text-white">Join Our Community</CardTitle>
                  <CardDescription className="text-gray-400">
                    Connect with Kurdish singles from around the world
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="register" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-900/50">
                      <TabsTrigger value="login" className="data-[state=active]:bg-purple-800/30">Login</TabsTrigger>
                      <TabsTrigger value="register" className="data-[state=active]:bg-purple-800/30">Register</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                      <LoginForm />
                    </TabsContent>
                    <TabsContent value="register">
                      <DynamicRegistrationForm />
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-center text-sm text-gray-500">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 relative z-10 bg-indigo-950/80 backdrop-blur-lg border-t border-indigo-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Connecting Kurdish Hearts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Globe className="h-6 w-6" />}
              title="Worldwide Connection"
              description="Connect with Kurdish singles from all regions of Kurdistan and across the global diaspora."
            />
            <FeatureCard 
              icon={<Users className="h-6 w-6" />}
              title="Cultural Understanding"
              description="Find someone who shares your Kurdish heritage, traditions, and values."
            />
            <FeatureCard 
              icon={<Heart className="h-6 w-6" />}
              title="Meaningful Relationships"
              description="Build connections based on shared cultural identity and personal compatibility."
            />
          </div>
        </div>
      </div>

      {/* Kurdistan Heritage Section */}
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

      {/* Footer */}
      <footer className="py-8 bg-black/60 backdrop-blur-sm mt-auto border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-500">© 2023 Kurdish Dating. All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              <Link to="/terms" className="text-sm text-gray-500 hover:text-purple-400 transition-colors">
                Terms
              </Link>
              <Link to="/privacy" className="text-sm text-gray-500 hover:text-purple-400 transition-colors">
                Privacy
              </Link>
              <Link to="/contact" className="text-sm text-gray-500 hover:text-purple-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature card component for the features section
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="p-6 text-center space-y-4 rounded-xl bg-indigo-900/20 border border-indigo-800/30 hover:bg-indigo-800/30 transition-colors neo-border group">
    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center text-purple-400 mx-auto group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-white">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

export default Landing;
