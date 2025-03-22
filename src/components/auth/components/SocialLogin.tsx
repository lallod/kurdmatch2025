
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Facebook, Mail } from 'lucide-react';

const SocialLogin = () => {
  const { toast } = useToast();

  const handleSocialLogin = (provider: string) => {
    // In a real app, this would integrate with an auth provider
    console.log(`Logging in with ${provider}`);
    
    toast({
      title: "Coming Soon",
      description: `${provider} login will be available soon.`,
    });
  };

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
        <Button 
          variant="outline" 
          className="bg-white/5 hover:bg-white/10 border-gray-600/50"
          onClick={() => handleSocialLogin('Facebook')}
        >
          <Facebook className="mr-2 h-4 w-4 text-blue-500" />
          Facebook
        </Button>
        <Button 
          variant="outline" 
          className="bg-white/5 hover:bg-white/10 border-gray-600/50"
          onClick={() => handleSocialLogin('Gmail')}
        >
          <Mail className="mr-2 h-4 w-4 text-red-500" />
          Gmail
        </Button>
      </div>
    </div>
  );
};

export default SocialLogin;
