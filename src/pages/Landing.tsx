import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Loader2, Heart, Globe, Users, Shield, ArrowRight } from 'lucide-react';
import SocialLogin from '@/components/auth/components/SocialLogin';
import { supabase } from '@/integrations/supabase/client';
import { LandingPageContent, initialContent } from '@/pages/SuperAdmin/pages/LandingPageEditor/types';

const Landing = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<LandingPageContent>(initialContent);
  const [contentLoading, setContentLoading] = useState(true);
  const { signIn } = useSupabaseAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch landing page content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('landing_page_content')
          .select('content')
          .single();

        if (!error && data?.content) {
          // Validate and set content safely
          if (typeof data.content === 'object' && data.content !== null && !Array.isArray(data.content)) {
            const contentData = data.content as Record<string, any>;
            if (contentData.hero && contentData.features && contentData.kurdistan && contentData.footer) {
              setContent(contentData as LandingPageContent);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching landing page content:', error);
      } finally {
        setContentLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success", 
          description: "Logged in successfully!",
        });
        // Let AppRoutes handle the proper redirection based on profile completion
        navigate('/discovery');
      }
    } catch (error: any) {
      toast({
        title: "Sign in failed", 
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (contentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">KurdMatch</h1>
              <p className="text-purple-200 text-sm">Connect Kurdish Hearts</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2 text-purple-200 text-sm">
            <Globe className="w-4 h-4" />
            <span>Connecting Kurds Worldwide</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex min-h-screen items-center justify-center px-6 py-20">
        <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                Find Your Kurdish <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Match</span>
              </h1>
              
              <p className="text-lg text-purple-200 max-w-xl">
                {content.hero.subtitle || "The first dating platform designed exclusively for Kurdish people from all parts of Kurdistan and the diaspora, bringing together singles who share our rich heritage and values."}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold px-8 py-4 text-lg"
                onClick={() => navigate('/register')}
              >
                Get Started - It's Free
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-purple-300/30 text-white hover:bg-purple-500/10 font-semibold px-8 py-4 text-lg"
                onClick={() => document.getElementById('login-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Sign In
              </Button>
            </div>
          </div>
          
          {/* Right Side - Login Form */}
          <div className="flex justify-center lg:justify-end">
            <Card id="login-form" className="w-full max-w-md bg-purple-900/90 backdrop-blur-md border-0 shadow-2xl">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
                    <p className="text-gray-400">Sign in to continue your journey</p>
                  </div>
                  
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-purple-700/50 border-purple-600 text-white placeholder:text-purple-300 focus:border-purple-400"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-300">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-purple-700/50 border-purple-600 text-white placeholder:text-purple-300 focus:border-purple-400"
                        required
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center gap-2 text-purple-300">
                        <input type="checkbox" className="rounded border-purple-600" />
                        Remember me
                      </label>
                      <Link to="/auth" className="text-purple-300 hover:text-purple-200">
                        Forgot password?
                      </Link>
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-3"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        'Sign in'
                      )}
                    </Button>
                  </form>
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-purple-600"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="bg-purple-900 px-2 text-purple-300">OR CONTINUE WITH</span>
                      </div>
                    </div>
                    
                    <SocialLogin />
                  </div>
                  
                  <div className="text-center text-sm text-purple-300">
                    Don't have an account?{' '}
                    <Link 
                      to="/register" 
                      className="text-purple-200 hover:text-white font-medium"
                    >
                      Create one now →
                    </Link>
                  </div>
                  
                  <p className="text-xs text-purple-400 text-center">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="absolute bottom-8 left-8 hidden lg:flex items-center gap-2">
        <div className="flex -space-x-2">
          {[1,2,3,4].map(i => (
            <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 border-2 border-white/20" />
          ))}
        </div>
        <span className="text-purple-200 font-medium ml-2">10,000+ Kurdish singles have already joined</span>
      </div>
      
      {/* Features Section */}
      <div className="bg-gradient-to-b from-transparent to-black/20 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
            Connecting Kurdish Hearts
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                <Globe className="w-8 h-8 text-purple-300" />
              </div>
              <h3 className="text-xl font-semibold text-white">Worldwide Connection</h3>
              <p className="text-purple-200">
                Connect with Kurdish singles from all regions of Kurdistan and across the global diaspora.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-purple-300" />
              </div>
              <h3 className="text-xl font-semibold text-white">Cultural Understanding</h3>
              <p className="text-purple-200">
                Find someone who shares your Kurdish heritage, traditions, and values.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-purple-300" />
              </div>
              <h3 className="text-xl font-semibold text-white">Meaningful Relationships</h3>
              <p className="text-purple-200">
                Build connections based on shared cultural identity and personal compatibility.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;