
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Facebook, Mail, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Provider } from '@supabase/supabase-js';

interface SocialLoginProps {
  isLoading?: boolean;
}

interface SocialProvider {
  id: string;
  name: string;
  enabled: boolean;
  client_id?: string;
  client_secret?: string;
}

const SocialLogin = ({ isLoading: isFormLoading = false }: SocialLoginProps) => {
  const { toast } = useToast();
  const [providers, setProviders] = useState<Record<string, boolean>>({});
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  useEffect(() => {
    async function loadSocialProviders() {
      try {
        const { data, error } = await supabase
          .from('social_login_providers')
          .select();
        
        if (error) throw error;
        
        const enabledProviders = (data as SocialProvider[]).reduce((acc, provider) => {
          acc[provider.id] = provider.enabled;
          return acc;
        }, {} as Record<string, boolean>);
        
        setProviders(enabledProviders);
      } catch (error) {
        console.error('Error loading social providers:', error);
        // Fallback to default values
        setProviders({
          facebook: true,
          gmail: true
        });
      } finally {
        setLoadingProviders(false);
      }
    }
    
    loadSocialProviders();
  }, []);

  const handleSocialLogin = async (providerName: 'Facebook' | 'Gmail') => {
    setLoadingProvider(providerName);
    const provider = (providerName === 'Gmail' ? 'google' : 'facebook') as Provider;

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
      });

      if (error) {
        throw error;
      }
      // On success, Supabase handles the redirect. No need to clear loading state.
    } catch (error: any) {
      toast({
        title: `Login with ${providerName} failed`,
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
      setLoadingProvider(null);
    }
  };

  if (loadingProviders) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // If no providers are enabled, don't render anything
  if (!providers.facebook && !providers.gmail) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-600/50"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {providers.facebook && (
          <Button 
            variant="outline" 
            className="bg-white/5 hover:bg-white/10 border-gray-600/50"
            onClick={() => handleSocialLogin('Facebook')}
            disabled={isFormLoading || !!loadingProvider}
          >
            {loadingProvider === 'Facebook' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Facebook className="mr-2 h-4 w-4 text-blue-500" />
            )}
            Facebook
          </Button>
        )}
        
        {providers.gmail && (
          <Button 
            variant="outline" 
            className="bg-white/5 hover:bg-white/10 border-gray-600/50"
            onClick={() => handleSocialLogin('Gmail')}
            disabled={isFormLoading || !!loadingProvider}
          >
            {loadingProvider === 'Gmail' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Mail className="mr-2 h-4 w-4 text-red-500" />
            )}
            Gmail
          </Button>
        )}
      </div>
    </div>
  );
};

export default SocialLogin;
