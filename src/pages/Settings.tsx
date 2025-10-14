import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { toast } from 'sonner';
import { ArrowLeft, UserX, Lock, Bell, Globe, ChevronRight } from 'lucide-react';
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

        {/* Settings Sections */}
        <div className="space-y-3">
          {/* Privacy Settings */}
          <Button
            variant="ghost"
            onClick={() => navigate('/settings/privacy')}
            className="w-full justify-between h-auto p-4 glass border border-tinder-rose/10"
          >
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-tinder-rose" />
              <div className="text-left">
                <h3 className="font-semibold">Privacy Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Control who can see your profile and activity
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Button>

          {/* Notification Settings */}
          <Button
            variant="ghost"
            onClick={() => navigate('/notifications/settings')}
            className="w-full justify-between h-auto p-4 glass border border-tinder-rose/10"
          >
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-tinder-rose" />
              <div className="text-left">
                <h3 className="font-semibold">Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your notification preferences
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Button>

          {/* Blocked Users */}
          <Button
            variant="ghost"
            onClick={() => navigate('/settings/blocked')}
            className="w-full justify-between h-auto p-4 glass border border-tinder-rose/10"
          >
            <div className="flex items-center gap-3">
              <UserX className="h-5 w-5 text-tinder-rose" />
              <div className="text-left">
                <h3 className="font-semibold">Blocked Users</h3>
                <p className="text-sm text-muted-foreground">
                  View and manage blocked users
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>

        {/* Language Settings Section */}
        <div className="glass rounded-lg p-6 border border-tinder-rose/10">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="h-5 w-5 text-tinder-rose" />
            <h2 className="text-lg font-semibold">{t('settings.language', 'Language')}</h2>
          </div>
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
