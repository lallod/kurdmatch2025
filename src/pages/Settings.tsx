import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useMockAuth } from '@/integrations/supabase/mockAuth';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import ComprehensiveProfileSettings from '@/components/settings/ComprehensiveProfileSettings';

const Settings = () => {
  const { logout } = useMockAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      logout();
      toast.success('Logged out successfully');
      navigate('/profile-selector');
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
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>

        <ComprehensiveProfileSettings />
      </div>
    </div>
  );
};

export default Settings;