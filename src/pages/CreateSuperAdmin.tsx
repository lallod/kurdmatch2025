import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Shield } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

const CreateSuperAdmin = () => {
  const { t } = useTranslations();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateAdmin = async () => {
    if (!email || !password) { toast.error(t('admin.email_password_required', 'Email and password are required')); return; }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-super-admin', { body: { email, password, name } });
      if (error) throw error;
      toast.success(t('admin.admin_created', `Super admin account created for ${email}`, { email }));
      setTimeout(() => { toast.info(t('admin.login_info', `Use email: ${email} and your password to login`, { email })); }, 2000);
    } catch (error: any) {
      console.error('Error creating super admin:', error);
      toast.error(error.message || t('admin.create_admin_failed', 'Failed to create super admin account'));
    } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2"><Shield className="h-6 w-6 text-primary" /><CardTitle className="text-2xl">{t('admin.create_super_admin', 'Create Super Admin')}</CardTitle></div>
          <CardDescription>{t('admin.create_admin_desc', 'Set up your super admin account to access the admin dashboard')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><label className="text-sm font-medium">{t('common.email', 'Email')}</label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" disabled={isLoading} /></div>
          <div className="space-y-2"><label className="text-sm font-medium">{t('common.password', 'Password')}</label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('admin.enter_secure_password', 'Enter secure password')} disabled={isLoading} /></div>
          <div className="space-y-2"><label className="text-sm font-medium">{t('admin.name_optional', 'Name (Optional)')}</label><Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('admin.your_name', 'Your name')} disabled={isLoading} /></div>
          <Button onClick={handleCreateAdmin} disabled={isLoading} className="w-full" size="lg">
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('admin.creating_admin', 'Creating Admin Account...')}</> : <><Shield className="mr-2 h-4 w-4" />{t('admin.create_super_admin', 'Create Super Admin')}</>}
          </Button>
          <p className="text-sm text-muted-foreground text-center mt-4">{t('admin.full_access_note', 'This will create a super admin account with full access to the system.')}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateSuperAdmin;
