
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSocialLoginProviders, updateSocialLoginProvider } from '@/api/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, Facebook, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Provider {
  id: string;
  enabled: boolean;
  client_id: string | null;
  client_secret: string | null;
  created_at: string;
  updated_at: string;
}

const ProviderCard = ({ provider }: { provider: Provider }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [clientId, setClientId] = useState(provider.client_id || '');
  const [clientSecret, setClientSecret] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const mutation = useMutation({
    mutationFn: (updates: Partial<Provider>) => updateSocialLoginProvider(provider.id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialLoginProviders'] });
      toast({ title: 'Success', description: `${provider.id} provider updated.` });
      setIsEditing(false);
      setClientSecret('');
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: `Failed to update provider: ${error.message}`, variant: 'destructive' });
    }
  });

  const handleToggle = (enabled: boolean) => {
    mutation.mutate({ enabled });
  };
  
  const handleSave = () => {
    const updates: { client_id: string, client_secret?: string } = {
        client_id: clientId,
    };
    if (clientSecret) {
        updates.client_secret = clientSecret;
    }
    mutation.mutate(updates);
  };
  
  const getIcon = () => {
    switch(provider.id) {
      case 'facebook':
        return <Facebook className="h-8 w-8 text-blue-600" />;
      case 'google':
        return <Mail className="h-8 w-8 text-red-600" />;
      default:
        return null;
    }
  };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-4">
          {getIcon()}
          <CardTitle className="text-2xl font-bold">{capitalize(provider.id)}</CardTitle>
        </div>
        <div className="flex items-center space-x-2">
            <Label htmlFor={`enabled-${provider.id}`} className={mutation.isPending ? 'text-muted-foreground' : ''}>{provider.enabled ? 'Enabled' : 'Disabled'}</Label>
            <Switch
                id={`enabled-${provider.id}`}
                checked={provider.enabled}
                onCheckedChange={handleToggle}
                disabled={mutation.isPending}
            />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 pt-4">
            <div>
                <Label htmlFor={`client-id-${provider.id}`}>Client ID</Label>
                <Input id={`client-id-${provider.id}`} value={clientId} onChange={e => { setClientId(e.target.value); setIsEditing(true); }} placeholder="Enter Client ID" disabled={mutation.isPending} />
            </div>
            <div>
                <Label htmlFor={`client-secret-${provider.id}`}>Client Secret</Label>
                <Input id={`client-secret-${provider.id}`} type="password" value={clientSecret} onChange={e => { setClientSecret(e.target.value); setIsEditing(true); }} placeholder="Enter new Client Secret" disabled={mutation.isPending} />
                 <p className="text-sm text-muted-foreground mt-1">Leave blank to keep existing secret.</p>
            </div>
            {isEditing && (
                 <Button onClick={handleSave} disabled={mutation.isPending}>
                    {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Save Credentials
                </Button>
            )}
        </div>
      </CardContent>
    </Card>
  );
};


const SocialLoginPage = () => {
  const { data: providers, isLoading, isError, error } = useQuery({
    queryKey: ['socialLoginProviders'],
    queryFn: getSocialLoginProviders
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-destructive/10 border border-destructive/50 text-destructive p-4 rounded-lg flex items-center">
        <AlertTriangle className="h-5 w-5 mr-3" />
        <div>
          <h4 className="font-semibold">Error loading providers</h4>
          <p>{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Social Login Management</h1>
        <p className="text-muted-foreground">Enable, disable, and configure OAuth providers for user authentication.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {(providers as Provider[])?.map(provider => (
          <ProviderCard key={provider.id} provider={provider} />
        ))}
      </div>
      
      {providers?.length === 0 && (
         <Card>
            <CardHeader>
                <CardTitle>No Providers Found</CardTitle>
            </CardHeader>
            <CardContent>
                <p>There are no social login providers configured in your Supabase project. Please add them to the `social_login_providers` table.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SocialLoginPage;
