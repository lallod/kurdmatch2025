
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Facebook, Mail, Info, Shield, Key, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SocialLogin from '@/components/auth/components/SocialLogin';

const SocialLoginPage = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  // In a real app, these would be fetched from your backend or config store
  const [providers, setProviders] = useState({
    facebook: {
      enabled: true,
      appId: '',
      appSecret: ''
    },
    gmail: {
      enabled: true,
      clientId: '',
      clientSecret: ''
    }
  });

  const handleProviderToggle = (provider: 'facebook' | 'gmail') => {
    setProviders({
      ...providers,
      [provider]: {
        ...providers[provider],
        enabled: !providers[provider].enabled
      }
    });
  };

  const handleInputChange = (
    provider: 'facebook' | 'gmail', 
    field: string, 
    value: string
  ) => {
    setProviders({
      ...providers,
      [provider]: {
        ...providers[provider],
        [field]: value
      }
    });
  };

  const handleSave = () => {
    setSaving(true);
    
    // Simulate API call to save settings
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Settings Saved",
        description: "Social login provider settings have been updated.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Social Login Configuration</h1>
          <p className="text-muted-foreground">
            Configure and manage social login options for your users
          </p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-gradient-to-r from-tinder-rose to-tinder-orange"
        >
          {saving ? (
            <>Saving...</>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Facebook className="h-5 w-5 text-blue-500" />
                <CardTitle>Facebook Login</CardTitle>
              </div>
              <Switch 
                checked={providers.facebook.enabled} 
                onCheckedChange={() => handleProviderToggle('facebook')}
              />
            </div>
            <CardDescription>
              Allow users to sign in with their Facebook account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="facebook-app-id">App ID</Label>
              <Input 
                id="facebook-app-id" 
                placeholder="Facebook App ID" 
                value={providers.facebook.appId}
                onChange={(e) => handleInputChange('facebook', 'appId', e.target.value)}
                disabled={!providers.facebook.enabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebook-app-secret">App Secret</Label>
              <div className="relative">
                <Input 
                  id="facebook-app-secret" 
                  type="password"
                  placeholder="Facebook App Secret" 
                  value={providers.facebook.appSecret}
                  onChange={(e) => handleInputChange('facebook', 'appSecret', e.target.value)}
                  disabled={!providers.facebook.enabled}
                />
                <Shield className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="flex items-start p-3 text-sm border rounded-md bg-muted/50">
              <Info className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                You need to create a Facebook App in the Facebook Developer Console 
                and configure the OAuth redirect URIs.
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-red-500" />
                <CardTitle>Gmail Login</CardTitle>
              </div>
              <Switch 
                checked={providers.gmail.enabled} 
                onCheckedChange={() => handleProviderToggle('gmail')}
              />
            </div>
            <CardDescription>
              Allow users to sign in with their Google account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gmail-client-id">Client ID</Label>
              <Input 
                id="gmail-client-id" 
                placeholder="Google Client ID" 
                value={providers.gmail.clientId}
                onChange={(e) => handleInputChange('gmail', 'clientId', e.target.value)}
                disabled={!providers.gmail.enabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gmail-client-secret">Client Secret</Label>
              <div className="relative">
                <Input 
                  id="gmail-client-secret" 
                  type="password"
                  placeholder="Google Client Secret" 
                  value={providers.gmail.clientSecret}
                  onChange={(e) => handleInputChange('gmail', 'clientSecret', e.target.value)}
                  disabled={!providers.gmail.enabled}
                />
                <Key className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="flex items-start p-3 text-sm border rounded-md bg-muted/50">
              <Info className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                You need to create OAuth credentials in the Google Cloud Console 
                and configure the authorized redirect URIs.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>
            This is how social login options will appear to your users
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center bg-black/80 p-8 rounded-md">
          <div className="max-w-sm w-full">
            <SocialLogin />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Preview shows only enabled providers
          </p>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            Refresh Preview
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SocialLoginPage;
