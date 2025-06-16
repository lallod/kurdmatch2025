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
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import Logo from './Logo';
import { useNavigate, Link } from 'react-router-dom';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface HeroContent {
  title: string;
  tagline: string;
  subtitle: string;
  userCount: string;
}

interface HeroSectionProps {
  content?: HeroContent;
}

const defaultContent: HeroContent = {
  title: "Find Your Kurdish Match",
  tagline: "Connecting Kurds Worldwide",
  subtitle: "The first dating platform designed exclusively for Kurdish people from all parts of Kurdistan and the diaspora, bringing together singles who share our rich heritage and values.",
  userCount: "10,000+"
};

const HeroSection: React.FC<HeroSectionProps> = ({ content = defaultContent }) => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const { toast } = useToast();

  const handleLoginSuccess = async (email: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user?.id) {
        console.error('No user ID available after login');
        navigate('/app');
        return;
      }
      
      console.log("Checking role for user ID:", userData.user.id);
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userData.user.id)
        .eq('role', 'super_admin')
        .maybeSingle();

      if (error) {
        console.error('Error checking user role:', error);
        throw error;
      }

      if (data) {
        navigate('/super-admin');
        toast({
          title: "Welcome Super Admin",
          description: "You've been redirected to the admin dashboard",
        });
      } else {
        navigate('/app');
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
      }
    } catch (error) {
      console.error('Error checking user role:', error);
      navigate('/app');
    }
  };

  return (
    <div className="relative py-16 overflow-hidden">
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
        <div className="mb-8 flex justify-between items-center">
          <Logo size="large" />
          <Link 
            to="/admin-login" 
            className="text-xs text-gray-400 hover:text-white transition-colors duration-200"
          >
            Super Admin
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-900/30 border border-purple-700/30 text-sm text-purple-300 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 mr-2 text-purple-400" />
              <span>{content.tagline}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
              {content.title.split(" ").slice(0, -1).join(" ")}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 ml-2">
                {content.title.split(" ").slice(-1)[0]}
              </span>
            </h1>
            
            <p className="text-xl text-gray-300">
              {content.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-3 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => navigate('/register')}
              >
                Get Started - It's Free
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-3 rounded-lg text-lg transition-all duration-200"
                onClick={() => navigate('/auth')}
              >
                Sign In
              </Button>
            </div>
          </div>
          
          <div className="flex-1 mt-8 md:mt-0">
            <Card className="w-full max-w-md mx-auto backdrop-blur-md bg-white/10 border-gray-800/50 shadow-xl neo-card">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-white">Welcome Back</CardTitle>
                <CardDescription className="text-gray-400">
                  Sign in to continue your journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LoginForm onLoginSuccess={handleLoginSuccess} />
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="text-center">
                  <Button 
                    variant="link" 
                    className="text-purple-400 hover:text-purple-300"
                    onClick={() => navigate('/register')}
                  >
                    Don't have an account? Create one now →
                  </Button>
                </div>
                <div className="text-center text-sm text-gray-500">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </div>
              </CardFooter>
            </Card>
            
            <div className="flex items-center space-x-4 text-sm text-gray-400 mt-4 justify-center">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 border-2 border-indigo-900"></div>
                ))}
              </div>
              <div>
                <span className="text-white font-semibold">{content.userCount}</span> Kurdish singles have already joined
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
