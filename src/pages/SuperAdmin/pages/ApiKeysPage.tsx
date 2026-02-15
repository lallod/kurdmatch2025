import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Key, Eye, EyeOff, Save, CheckCircle, AlertCircle, Trash2, RefreshCw, ExternalLink, MessageSquare, CreditCard, Phone, Brain, Image, Globe, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ApiKeyConfig {
  key: string;
  label: string;
  description: string;
  placeholder: string;
  category: string;
  docsUrl?: string;
  free?: boolean;
  usedBy?: string[];
}

const API_KEYS: ApiKeyConfig[] = [
  // Chat & Communication
  {
    key: 'GIPHY_API_KEY',
    label: 'Giphy API Key',
    description: 'GIF search in chat messaging',
    placeholder: 'Enter your Giphy API key',
    category: 'chat',
    docsUrl: 'https://developers.giphy.com/',
    free: true,
    usedBy: ['search-gifs'],
  },
  // AI & ML
  {
    key: 'OPENAI_API_KEY',
    label: 'OpenAI API Key',
    description: 'AI bio generation, content moderation, match scoring, insights, icebreakers, wingman',
    placeholder: 'sk-...',
    category: 'ai',
    docsUrl: 'https://platform.openai.com/api-keys',
    usedBy: ['generate-bio', 'moderate-message', 'moderate-photo', 'generate-insights', 'generate-icebreakers', 'ai-wingman', 'calculate-match-score', 'calculate-compatibility'],
  },
  {
    key: 'GOOGLE_AI_API_KEY',
    label: 'Google AI API Key (Gemini)',
    description: 'Alternative AI provider for text generation and analysis',
    placeholder: 'AIza...',
    category: 'ai',
    docsUrl: 'https://aistudio.google.com/apikey',
    free: true,
  },
  // Payments
  {
    key: 'STRIPE_SECRET_KEY',
    label: 'Stripe Secret Key',
    description: 'Payment processing for subscriptions and premium features',
    placeholder: 'sk_live_... or sk_test_...',
    category: 'payments',
    docsUrl: 'https://dashboard.stripe.com/apikeys',
    usedBy: ['create-checkout', 'check-subscription', 'customer-portal', 'stripe-webhook'],
  },
  {
    key: 'STRIPE_WEBHOOK_SECRET',
    label: 'Stripe Webhook Secret',
    description: 'Validates incoming Stripe webhook events',
    placeholder: 'whsec_...',
    category: 'payments',
    docsUrl: 'https://dashboard.stripe.com/webhooks',
    usedBy: ['stripe-webhook'],
  },
  {
    key: 'STRIPE_PRICE_PREMIUM',
    label: 'Stripe Premium Price ID',
    description: 'Price ID for the premium subscription plan',
    placeholder: 'price_...',
    category: 'payments',
    usedBy: ['create-checkout'],
  },
  {
    key: 'STRIPE_PRICE_GOLD',
    label: 'Stripe Gold Price ID',
    description: 'Price ID for the gold subscription plan',
    placeholder: 'price_...',
    category: 'payments',
    usedBy: ['create-checkout'],
  },
  // SMS & Phone Verification
  {
    key: 'TWILIO_ACCOUNT_SID',
    label: 'Twilio Account SID',
    description: 'SMS verification for phone number validation',
    placeholder: 'AC...',
    category: 'sms',
    docsUrl: 'https://console.twilio.com/',
    usedBy: ['send-sms-verification', 'verify-phone-code'],
  },
  {
    key: 'TWILIO_AUTH_TOKEN',
    label: 'Twilio Auth Token',
    description: 'Authentication token for Twilio SMS API',
    placeholder: 'Enter your Twilio auth token',
    category: 'sms',
    usedBy: ['send-sms-verification', 'verify-phone-code'],
  },
  {
    key: 'TWILIO_PHONE_NUMBER',
    label: 'Twilio Phone Number',
    description: 'Sender phone number for outgoing SMS',
    placeholder: '+1234567890',
    category: 'sms',
    usedBy: ['send-sms-verification'],
  },
  // Translation
  {
    key: 'GOOGLE_TRANSLATE_API_KEY',
    label: 'Google Translate API Key',
    description: 'Real-time message translation in chat',
    placeholder: 'AIza...',
    category: 'translation',
    docsUrl: 'https://console.cloud.google.com/apis/credentials',
    usedBy: ['translate-message', 'sync-translations', 'sync-all-translations'],
  },
  // Push Notifications
  {
    key: 'VAPID_PUBLIC_KEY',
    label: 'VAPID Public Key',
    description: 'Web push notifications - public key',
    placeholder: 'B...',
    category: 'notifications',
    docsUrl: 'https://web.dev/articles/push-notifications-overview',
    usedBy: ['send-push-notification'],
  },
  {
    key: 'VAPID_PRIVATE_KEY',
    label: 'VAPID Private Key',
    description: 'Web push notifications - private key',
    placeholder: 'Enter VAPID private key',
    category: 'notifications',
    usedBy: ['send-push-notification'],
  },
  // OCR / Text Extraction
  {
    key: 'GOOGLE_VISION_API_KEY',
    label: 'Google Vision API Key',
    description: 'OCR text extraction from images for verification',
    placeholder: 'AIza...',
    category: 'verification',
    docsUrl: 'https://console.cloud.google.com/apis/credentials',
    usedBy: ['extract-texts'],
  },
  // Admin
  {
    key: 'SUPER_ADMIN_EMAIL',
    label: 'Super Admin Email',
    description: 'Default super admin login email',
    placeholder: 'admin@example.com',
    category: 'admin',
    usedBy: ['setup-admin', 'create-super-admin'],
  },
  {
    key: 'SUPER_ADMIN_PASSWORD',
    label: 'Super Admin Password',
    description: 'Default super admin login password',
    placeholder: '••••••••',
    category: 'admin',
    usedBy: ['setup-admin', 'create-super-admin'],
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All', icon: <Key className="h-4 w-4" /> },
  { id: 'ai', label: 'AI & ML', icon: <Brain className="h-4 w-4" /> },
  { id: 'payments', label: 'Payments', icon: <CreditCard className="h-4 w-4" /> },
  { id: 'chat', label: 'Chat', icon: <MessageSquare className="h-4 w-4" /> },
  { id: 'sms', label: 'SMS', icon: <Phone className="h-4 w-4" /> },
  { id: 'translation', label: 'Translation', icon: <Globe className="h-4 w-4" /> },
  { id: 'notifications', label: 'Push', icon: <Globe className="h-4 w-4" /> },
  { id: 'verification', label: 'Verification', icon: <Image className="h-4 w-4" /> },
  { id: 'admin', label: 'Admin', icon: <Shield className="h-4 w-4" /> },
];

const ApiKeysPage = () => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [deleting, setDeleting] = useState<Record<string, boolean>>({});
  const [configured, setConfigured] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  const checkConfiguredKeys = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-api-keys', {
        body: { action: 'list' },
      });
      if (data?.keys) {
        setConfigured(data.keys);
      }
    } catch (err) {
      console.error('Failed to check API key status:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkConfiguredKeys();
  }, [checkConfiguredKeys]);

  const handleSave = async (keyConfig: ApiKeyConfig) => {
    const value = values[keyConfig.key];
    if (!value?.trim()) {
      toast.error('Please enter a value');
      return;
    }

    setSaving(prev => ({ ...prev, [keyConfig.key]: true }));
    try {
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

  const handleDelete = async (keyConfig: ApiKeyConfig) => {
    if (!confirm(`Remove ${keyConfig.label}? This will disable features that depend on it.`)) return;

    setDeleting(prev => ({ ...prev, [keyConfig.key]: true }));
    try {
      const { data, error } = await supabase.functions.invoke('manage-api-keys', {
        body: { action: 'delete', key: keyConfig.key },
      });
      if (error) throw error;

      toast.success(`${keyConfig.label} removed`);
      setConfigured(prev => ({ ...prev, [keyConfig.key]: false }));
    } catch (err: any) {
      toast.error(`Failed to remove: ${err.message}`);
    } finally {
      setDeleting(prev => ({ ...prev, [keyConfig.key]: false }));
    }
  };

  const filteredKeys = activeTab === 'all' ? API_KEYS : API_KEYS.filter(k => k.category === activeTab);
  const configuredCount = Object.values(configured).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">API Keys & Integrations</h1>
          <p className="text-white/60 mt-2">
            Manage external API keys for all app integrations. Keys are stored securely in the database.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-white/20 text-white/70 text-sm py-1 px-3">
            {configuredCount}/{API_KEYS.length} configured
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={checkConfiguredKeys}
            className="border-white/10 text-white/70 hover:text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-[#1a1a1a] border border-white/10 flex-wrap h-auto gap-1 p-1">
          {CATEGORIES.map(cat => (
            <TabsTrigger
              key={cat.id}
              value={cat.id}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500/20 data-[state=active]:to-orange-500/20 data-[state=active]:text-orange-400 text-white/60"
            >
              <span className="mr-1.5">{cat.icon}</span>
              {cat.label}
              {cat.id !== 'all' && (
                <span className="ml-1.5 text-xs opacity-60">
                  ({API_KEYS.filter(k => k.category === cat.id).filter(k => configured[k.key]).length}/{API_KEYS.filter(k => k.category === cat.id).length})
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="grid gap-4">
            {filteredKeys.map((keyConfig) => (
              <Card key={keyConfig.key} className="bg-[#1a1a1a] border-white/10">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Key className="h-5 w-5 text-orange-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <CardTitle className="text-white text-lg flex items-center gap-2 flex-wrap">
                          {keyConfig.label}
                          {keyConfig.free && (
                            <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                              Free tier
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="text-white/50 text-sm">
                          {keyConfig.description}
                        </CardDescription>
                        {keyConfig.usedBy && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {keyConfig.usedBy.map(fn => (
                              <Badge key={fn} variant="outline" className="text-xs border-white/10 text-white/40 py-0">
                                {fn}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {configured[keyConfig.key] ? (
                        <>
                          <Badge className="bg-green-500/20 text-green-400 border-0">
                            <CheckCircle className="h-3 w-3 mr-1" /> Active
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            onClick={() => handleDelete(keyConfig)}
                            disabled={deleting[keyConfig.key]}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
                          <AlertCircle className="h-3 w-3 mr-1" /> Not set
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <Input
                        type={visibility[keyConfig.key] ? 'text' : 'password'}
                        placeholder={configured[keyConfig.key] ? '••••••• (already set, enter new value to update)' : keyConfig.placeholder}
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
                      {saving[keyConfig.key] ? 'Saving...' : configured[keyConfig.key] ? 'Update' : 'Save'}
                    </Button>
                  </div>
                  {keyConfig.docsUrl && (
                    <a
                      href={keyConfig.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:underline mt-2 inline-flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Get API key
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiKeysPage;
