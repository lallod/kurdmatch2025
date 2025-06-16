
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Check, ExternalLink, Database, Key, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SuperAdminSetupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [copiedSecret, setCopiedSecret] = useState<string | null>(null);
  const { toast } = useToast();

  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
    toast({
      title: "Strong password generated",
      description: "Make sure to copy and save this password securely.",
    });
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSecret(type);
      toast({
        title: "Copied to clipboard",
        description: `${type} copied successfully.`,
      });
      setTimeout(() => setCopiedSecret(null), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please copy the text manually.",
        variant: "destructive",
      });
    }
  };

  const supabaseUrl = "https://bqgjfxilcpqosmccextj.supabase.co";
  const projectRef = "bqgjfxilcpqosmccextj";

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Super Admin Setup Configuration
          </CardTitle>
          <CardDescription>
            Configure your Supabase project to enable super admin functionality. Follow these steps in order.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Step 1: Configure Admin Credentials */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Key className="h-4 w-4" />
              Step 1: Configure Admin Credentials
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@yourdomain.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Admin Password</Label>
                <div className="flex gap-2">
                  <Input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter strong password"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={generateStrongPassword}
                    className="whitespace-nowrap"
                  >
                    Generate
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Add Secrets to Supabase */}
          {email && password && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Database className="h-4 w-4" />
                Step 2: Add Secrets to Supabase Dashboard
              </h3>
              
              <Alert>
                <AlertDescription>
                  Go to your Supabase Dashboard → Project Settings → Edge Functions → Secrets and add these two secrets:
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <strong>Secret Name:</strong>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard('SUPER_ADMIN_EMAIL', 'Secret name')}
                    >
                      {copiedSecret === 'Secret name' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <code className="text-sm">SUPER_ADMIN_EMAIL</code>
                  
                  <div className="flex items-center justify-between mb-2 mt-3">
                    <strong>Secret Value:</strong>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(email, 'Admin email')}
                    >
                      {copiedSecret === 'Admin email' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <code className="text-sm break-all">{email}</code>
                </div>

                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <strong>Secret Name:</strong>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard('SUPER_ADMIN_PASSWORD', 'Password secret name')}
                    >
                      {copiedSecret === 'Password secret name' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <code className="text-sm">SUPER_ADMIN_PASSWORD</code>
                  
                  <div className="flex items-center justify-between mb-2 mt-3">
                    <strong>Secret Value:</strong>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(password, 'Admin password')}
                    >
                      {copiedSecret === 'Admin password' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <code className="text-sm break-all">{password}</code>
                </div>
              </div>

              <Button 
                asChild 
                className="w-full"
              >
                <a 
                  href={`${supabaseUrl}/project/${projectRef}/settings/functions`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Supabase Edge Functions Settings
                </a>
              </Button>
            </div>
          )}

          {/* Step 3: Deploy Edge Function */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 3: Deploy Edge Function</h3>
            <Alert>
              <AlertDescription>
                The setup-admin Edge Function is already configured in your project. If you have the Supabase CLI installed, 
                you can deploy it by running this command in your project directory:
              </AlertDescription>
            </Alert>
            
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <strong>CLI Command:</strong>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard('supabase functions deploy setup-admin', 'CLI command')}
                >
                  {copiedSecret === 'CLI command' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <code className="text-sm">supabase functions deploy setup-admin</code>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Alternatively, you can deploy the function through the Supabase Dashboard in the Edge Functions section.
            </p>
          </div>

          {/* Step 4: Verify Setup */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 4: Verify Setup</h3>
            <Alert>
              <AlertDescription>
                After completing steps 1-3, refresh the admin login page. The setup should run automatically 
                and create your admin user. You can then log in using the credentials you configured.
              </AlertDescription>
            </Alert>
          </div>

          {/* Database Requirements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Database Requirements</h3>
            <Alert>
              <AlertDescription>
                Ensure your database has a `user_roles` table with the following structure:
                <br />
                • user_id (UUID, references auth.users)
                <br />
                • role (TEXT)
                <br />
                • created_at (TIMESTAMP)
                <br />
                And proper Row Level Security policies are enabled.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminSetupForm;
