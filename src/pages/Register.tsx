
import React, { useEffect } from 'react';
import SimpleRegistrationForm from '@/components/auth/SimpleRegistrationForm';
import DynamicRegistrationForm from '@/components/auth/DynamicRegistrationForm';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Register = () => {
  // Scroll to top on component mount and step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-sm sm:max-w-lg lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mx-auto space-y-6 sm:space-y-8">
        <div className="absolute top-4 left-4 z-10">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="flex items-center text-white/80 hover:text-white hover:bg-white/10 backdrop-blur border border-white/20 text-sm sm:text-base"
          >
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
        
        {/* Logo and Header */}
        <div className="text-center pt-12 sm:pt-16 lg:pt-20">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white fill-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
                KurdMatch
              </h1>
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-300 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Join Our Community
          </h2>
          <p className="text-purple-200 text-base sm:text-lg lg:text-xl px-4">
            Create your account in just a few simple steps
          </p>
        </div>
        
        <div className="backdrop-blur-md bg-white/10 p-4 sm:p-6 lg:p-8 xl:p-10 rounded-2xl shadow-2xl border border-white/20 relative overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 animate-pulse"></div>
          
          <div className="relative z-10">
            <DynamicRegistrationForm />
          </div>
        </div>
        
        <div className="text-center text-sm text-purple-200 border-t border-white/20 pt-6">
          Already have an account?{' '}
          <Link to="/auth" className="text-pink-400 hover:text-pink-300 font-medium transition-colors">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
