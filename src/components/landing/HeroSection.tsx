
import React from 'react';
import { Sparkles } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import DynamicRegistrationForm from '@/components/auth/DynamicRegistrationForm';

const HeroSection: React.FC = () => {
  return (
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
  );
};

export default HeroSection;
