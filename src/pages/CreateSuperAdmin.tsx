import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Shield } from 'lucide-react';

const CreateSuperAdmin = () => {
  const [email, setEmail] = useState('lalo.peshawa@gmail.com');
  const [password, setPassword] = useState('Kurdistan2025!');
  const [name, setName] = useState('Lalo Peshawa');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateAdmin = async () => {
    if (!email || !password) { toast.error('Email and password are required'); return; }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-super-admin', { body: { email, password, name } });
      if (error) throw error;
      toast.success(`Super admin account created for ${email}`);
      setTimeout(() => { toast.info(`Use email: ${email} and your password to login`); }, 2000);
    } catch (error: any) {
      console.error('Error creating super admin:', error);
      toast.error(error.message || 'Failed to create super admin account');
    } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2"><Shield className="h-6 w-6 text-primary" /><CardTitle className="text-2xl">Create Super Admin</CardTitle></div>
          <CardDescription>Set up your super admin account to access the admin dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><label className="text-sm font-medium">Email</label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" disabled={isLoading} /></div>
          <div className="space-y-2"><label className="text-sm font-medium">Password</label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter secure password" disabled={isLoading} /></div>
          <div className="space-y-2"><label className="text-sm font-medium">Name (Optional)</label><Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" disabled={isLoading} /></div>
          <Button onClick={handleCreateAdmin} disabled={isLoading} className="w-full" size="lg">
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating Admin Account...</> : <><Shield className="mr-2 h-4 w-4" />Create Super Admin</>}
          </Button>
          <p className="text-sm text-muted-foreground text-center mt-4">This will create a super admin account with full access to the system.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateSuperAdmin;
