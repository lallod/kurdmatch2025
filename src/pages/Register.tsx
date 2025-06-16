
import React from 'react';
import SimpleRegistrationForm from '@/components/auth/SimpleRegistrationForm';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Register = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-indigo-950 p-4">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        <div className="absolute top-4 left-4">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="flex items-center text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur"
          >
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
        
        <div className="text-center pt-16">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
            Join Our Community
          </h1>
          <p className="text-gray-300 text-lg">
            Create your account in just a few simple steps
          </p>
        </div>
        
        <div className="backdrop-blur-md bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/20 relative overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 animate-pulse"></div>
          
          <div className="relative z-10">
            <SimpleRegistrationForm />
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-400 border-t border-white/20 pt-6">
          Already have an account?{' '}
          <Link to="/auth" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
