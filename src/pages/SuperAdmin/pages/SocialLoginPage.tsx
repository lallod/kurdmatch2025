
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2, Save, Facebook, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SocialLogin from '@/components/auth/components/SocialLogin';
import { getSocialLoginProviders, updateSocialLoginProvider } from '@/api/admin';

interface Provider {
  id: string;
  name: string;
  enabled: boolean;
  client_id?: string;
  client_secret?: string;
}

const SocialLoginPage = () => {
  const [activeTab, setActiveTab] = useState('facebook');
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const data = await getSocialLoginProviders();
        setProviders(data);
      } catch (error) {
        console.error('Error fetching social providers:', error);
        toast({
          title: "Error loading providers",
          description: "Could not load social login providers.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [toast]);

  const handleToggleProvider = (id: string, enabled: boolean) => {
    setProviders(providers.map(provider => 
      provider.id === id ? { ...provider, enabled } : provider
    ));
  };

  const handleInputChange = (id: string, field: 'client_id' | 'client_secret', value: string) => {
    setProviders(providers.map(provider => 
      provider.id === id ? { ...provider, [field]: value } : provider
    ));
  };

  const handleSave = async (id: string) => {
    const provider = providers.find(p => p.id === id);
    if (!provider) return;

    setSaving(true);
    try {
      await updateSocialLoginProvider(id, {
        enabled: provider.enabled,
        client_id: provider.client_id,
        client_secret: provider.client_secret
      });
      
      toast({
        title: "Settings saved",
        description: `${provider.name} login settings updated successfully.`
      });
    } catch (error) {
      console.error('Error saving provider settings:', error);
      toast({
        title: "Error saving settings",
        description: "Could not save social login provider settings.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Social Login Configuration</h1>
        <p className="text-muted-foreground">
          Configure social login providers for your application
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Provider Settings</CardTitle>
              <CardDescription>
                Configure client ID, client secret, and enable/disable providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="facebook" className="flex items-center gap-2">
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </TabsTrigger>
                  <TabsTrigger value="gmail" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Gmail
                  </TabsTrigger>
                </TabsList>

                {providers.map(provider => (
                  <TabsContent key={provider.id} value={provider.id} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">{provider.name} Login</h3>
                        <p className="text-sm text-muted-foreground">
                          {provider.enabled ? 'Enabled' : 'Disabled'}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Switch 
                          checked={provider.enabled} 
                          onCheckedChange={(checked) => handleToggleProvider(provider.id, checked)} 
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor={`${provider.id}-client-id`}>Client ID</Label>
                        <Input 
                          id={`${provider.id}-client-id`} 
                          value={provider.client_id || ''} 
                          onChange={(e) => handleInputChange(provider.id, 'client_id', e.target.value)}
                          placeholder="Enter client ID"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor={`${provider.id}-client-secret`}>Client Secret</Label>
                        <Input 
                          id={`${provider.id}-client-secret`} 
                          type="password"
                          value={provider.client_secret || ''} 
                          onChange={(e) => handleInputChange(provider.id, 'client_secret', e.target.value)}
                          placeholder="Enter client secret"
                        />
                      </div>

                      <Button 
                        onClick={() => handleSave(provider.id)} 
                        disabled={saving}
                        className="mt-2"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Settings
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                See how social login buttons will appear to users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-md">
                <SocialLogin />
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Setup Guide</CardTitle>
              <CardDescription>
                How to set up social login credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <div>
                <h4 className="font-medium mb-1">Facebook Login</h4>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Go to Facebook Developers site</li>
                  <li>Create a new app</li>
                  <li>Add Facebook Login product</li>
                  <li>Configure OAuth redirect URI</li>
                  <li>Copy App ID and Secret</li>
                </ol>
              </div>

              <div>
                <h4 className="font-medium mb-1">Gmail Login</h4>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Go to Google Cloud Console</li>
                  <li>Create a new project</li>
                  <li>Set up OAuth consent screen</li>
                  <li>Create OAuth credentials</li>
                  <li>Add authorized redirect URIs</li>
                  <li>Copy Client ID and Secret</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SocialLoginPage;
