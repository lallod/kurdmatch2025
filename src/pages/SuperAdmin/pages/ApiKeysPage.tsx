import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Key, Eye, EyeOff, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ApiKeyConfig {
  key: string;
  label: string;
  description: string;
  placeholder: string;
  docsUrl?: string;
  free?: boolean;
}

const API_KEYS: ApiKeyConfig[] = [
  {
    key: 'GIPHY_API_KEY',
    label: 'Giphy API Key',
    description: 'For GIF search in chat. Free tier available at developers.giphy.com',
    placeholder: 'Enter your Giphy API key',
    docsUrl: 'https://developers.giphy.com/',
    free: true,
  },
  {
    key: 'OPENAI_API_KEY',
    label: 'OpenAI API Key',
    description: 'For AI-powered features like bio generation, moderation, and insights',
    placeholder: 'sk-...',
    docsUrl: 'https://platform.openai.com/api-keys',
  },
  {
    key: 'TWILIO_ACCOUNT_SID',
    label: 'Twilio Account SID',
    description: 'For SMS verification. Find in your Twilio console',
    placeholder: 'AC...',
    docsUrl: 'https://console.twilio.com/',
  },
  {
    key: 'TWILIO_AUTH_TOKEN',
    label: 'Twilio Auth Token',
    description: 'Twilio authentication token for SMS API',
    placeholder: 'Enter your Twilio auth token',
  },
  {
    key: 'TWILIO_PHONE_NUMBER',
    label: 'Twilio Phone Number',
    description: 'Your Twilio phone number for sending SMS',
    placeholder: '+1234567890',
  },
  {
    key: 'STRIPE_SECRET_KEY',
    label: 'Stripe Secret Key',
    description: 'For payment processing. Find in Stripe Dashboard → Developers → API keys',
    placeholder: 'sk_live_...',
    docsUrl: 'https://dashboard.stripe.com/apikeys',
  },
  {
    key: 'STRIPE_WEBHOOK_SECRET',
    label: 'Stripe Webhook Secret',
    description: 'For validating Stripe webhook events',
    placeholder: 'whsec_...',
  },
];

const ApiKeysPage = () => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [configured, setConfigured] = useState<Record<string, boolean>>({});

  // Check which keys are configured by calling a simple edge function
  useEffect(() => {
    checkConfiguredKeys();
  }, []);

  const checkConfiguredKeys = async () => {
    // We can't directly check secrets, but we can check if the edge functions work
    // For now, mark all as "unknown" - admin can save/overwrite
    const status: Record<string, boolean> = {};
    API_KEYS.forEach(k => { status[k.key] = false; });
    setConfigured(status);
  };

  const handleSave = async (keyConfig: ApiKeyConfig) => {
    const value = values[keyConfig.key];
    if (!value?.trim()) {
      toast.error('Please enter a value');
      return;
    }

    setSaving(prev => ({ ...prev, [keyConfig.key]: true }));
    try {
      // Save the secret via edge function
      const { data, error } = await supabase.functions.invoke('manage-api-keys', {
        body: { action: 'set', key: keyConfig.key, value: value.trim() },
      });

      if (error) throw error;

      toast.success(`${keyConfig.label} saved successfully`);
      setConfigured(prev => ({ ...prev, [keyConfig.key]: true }));
      setValues(prev => ({ ...prev, [keyConfig.key]: '' }));
    } catch (err: any) {
      toast.error(`Failed to save: ${err.message}`);
    } finally {
      setSaving(prev => ({ ...prev, [keyConfig.key]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">API Keys & Integrations</h1>
        <p className="text-white/60 mt-2">
          Manage external API keys for third-party integrations. Keys are stored securely as encrypted Supabase secrets.
        </p>
      </div>

      <div className="grid gap-4">
        {API_KEYS.map((keyConfig) => (
          <Card key={keyConfig.key} className="bg-[#1a1a1a] border-white/10">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Key className="h-5 w-5 text-orange-400" />
                  <div>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      {keyConfig.label}
                      {keyConfig.free && (
                        <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                          Free tier
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="text-white/50">
                      {keyConfig.description}
                    </CardDescription>
                  </div>
                </div>
                {configured[keyConfig.key] ? (
                  <Badge className="bg-green-500/20 text-green-400">
                    <CheckCircle className="h-3 w-3 mr-1" /> Configured
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
                    <AlertCircle className="h-3 w-3 mr-1" /> Not set
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Input
                    type={visibility[keyConfig.key] ? 'text' : 'password'}
                    placeholder={keyConfig.placeholder}
                    value={values[keyConfig.key] || ''}
                    onChange={(e) => setValues(prev => ({ ...prev, [keyConfig.key]: e.target.value }))}
                    className="bg-[#0f0f0f] border-white/10 text-white pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-white/40 hover:text-white"
                    onClick={() => setVisibility(prev => ({ ...prev, [keyConfig.key]: !prev[keyConfig.key] }))}
                  >
                    {visibility[keyConfig.key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <Button
                  onClick={() => handleSave(keyConfig)}
                  disabled={saving[keyConfig.key] || !values[keyConfig.key]?.trim()}
                  className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving[keyConfig.key] ? 'Saving...' : 'Save'}
                </Button>
              </div>
              {keyConfig.docsUrl && (
                <a
                  href={keyConfig.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:underline mt-2 inline-block"
                >
                  Get API key →
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ApiKeysPage;
