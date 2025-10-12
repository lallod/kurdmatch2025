import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mail, MessageCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Provider } from '@supabase/supabase-js';
interface SocialLoginProps {
  isLoading?: boolean;
}
const SocialLogin = ({
  isLoading: isFormLoading = false
}: SocialLoginProps) => {
  const {
    toast
  } = useToast();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const handleSocialLogin = async (providerName: string, provider: Provider) => {
    setLoadingProvider(providerName);
    try {
      const {
        error
      } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) {
        throw error;
      }
      // On success, Supabase handles the redirect
    } catch (error: any) {
      toast({
        title: `Login with ${providerName} failed`,
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive'
      });
      setLoadingProvider(null);
    }
  };

  // Custom Instagram icon component
  const InstagramIcon = ({
    className
  }: {
    className?: string;
  }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>;

  // Custom Facebook icon component
  const FacebookIcon = ({
    className
  }: {
    className?: string;
  }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>;
  return <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 py-1 text-purple-600 font-semibold">
            OR CONTINUE WITH
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button 
          type="button" 
          onClick={() => handleSocialLogin('Gmail', 'google')} 
          disabled={isFormLoading || !!loadingProvider} 
          className="bg-purple-700 hover:bg-purple-800 text-white h-12 font-medium border-0"
        >
          {loadingProvider === 'Gmail' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-5 w-5" />}
          Gmail
        </Button>
        
        <Button 
          type="button" 
          onClick={() => handleSocialLogin('Facebook', 'facebook')} 
          disabled={isFormLoading || !!loadingProvider} 
          className="bg-purple-700 hover:bg-purple-800 text-white h-12 font-medium border-0"
        >
          {loadingProvider === 'Facebook' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FacebookIcon className="mr-2 h-5 w-5" />}
          Facebook
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button 
          type="button" 
          onClick={() => handleSocialLogin('Instagram', 'google')}
          disabled={isFormLoading || !!loadingProvider} 
          className="bg-purple-700 hover:bg-purple-800 text-white h-12 font-medium border-0"
        >
          {loadingProvider === 'Instagram' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <InstagramIcon className="mr-2 h-5 w-5" />}
          Instagram
        </Button>
        
        <Button 
          type="button" 
          onClick={() => handleSocialLogin('WhatsApp', 'google')}
          disabled={isFormLoading || !!loadingProvider} 
          className="bg-purple-700 hover:bg-purple-800 text-white h-12 font-medium border-0"
        >
          {loadingProvider === 'WhatsApp' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageCircle className="mr-2 h-5 w-5" />}
          WhatsApp
        </Button>
      </div>
    </div>;
};
export default SocialLogin;