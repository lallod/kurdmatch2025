import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import ComprehensiveProfileSettings from '@/components/settings/ComprehensiveProfileSettings';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslations } from '@/hooks/useTranslations';

const Settings = () => {
  const { signOut } = useSupabaseAuth();
  const navigate = useNavigate();
  const { t } = useTranslations();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">{t('settings.title', 'Settings')}</h1>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            {t('auth.sign_out', 'Sign Out')}
          </Button>
        </div>

        {/* Language Settings Section */}
        <div className="glass rounded-lg p-6 border border-tinder-rose/10">
          <h2 className="text-lg font-semibold mb-4">{t('settings.language', 'Language')}</h2>
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">
              Choose your preferred language for the app
            </p>
            <LanguageSwitcher />
          </div>
        </div>

        <ComprehensiveProfileSettings />
      </div>
    </div>
  );
};

export default Settings;
