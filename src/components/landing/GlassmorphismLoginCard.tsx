import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GlassmorphismLoginCard = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div 
      className="glass-card p-8 rounded-2xl border border-white/20 shadow-2xl shadow-purple-500/20 backdrop-blur-md bg-white/10 transform-gpu transition-all duration-500 hover:scale-105 hover:shadow-3xl hover:shadow-purple-500/40"
      style={{
        transform: isHovered ? 'perspective(1000px) rotateY(-5deg) rotateX(5deg)' : 'perspective(1000px) rotateY(0deg) rotateX(0deg)',
        transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tabs */}
      <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-lg">
        <button
          onClick={() => setActiveTab('login')}
          className={`flex-1 py-2 px-4 rounded-md transition-all ${
            activeTab === 'login'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
              : 'text-purple-200 hover:text-white'
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setActiveTab('signup')}
          className={`flex-1 py-2 px-4 rounded-md transition-all ${
            activeTab === 'signup'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
              : 'text-purple-200 hover:text-white'
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
          <Input
            type="email"
            placeholder="Email address"
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-purple-300"
          />
        </div>
        
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
          <Input
            type="password"
            placeholder="Password"
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-purple-300"
          />
        </div>

        <Button 
          onClick={() => navigate(activeTab === 'login' ? '/login' : '/register')}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold"
        >
          {activeTab === 'login' ? 'Login' : 'Create Account'}
        </Button>
      </div>

      {/* Social Login */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-transparent text-purple-200">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <Button
            variant="outline"
            className="bg-white/5 border-white/20 hover:bg-white/10 text-white"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </Button>

          <Button
            variant="outline"
            className="bg-white/5 border-white/20 hover:bg-white/10 text-white"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
          </Button>

          <Button
            variant="outline"
            className="bg-white/5 border-white/20 hover:bg-white/10 text-white"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </Button>
        </div>
      </div>

      {/* AI Badge */}
      <div className="mt-6 flex items-center justify-center gap-2 text-purple-200 text-sm">
        <Sparkles className="w-4 h-4" />
        <span>AI-Powered Matchmaking</span>
      </div>
    </div>
  );
};

export default GlassmorphismLoginCard;
