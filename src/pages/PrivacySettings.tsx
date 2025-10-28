import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUserSettings } from '@/hooks/useUserSettings';

const PrivacySettings = () => {
  const navigate = useNavigate();
  const { settings, loading, updateSettings } = useUserSettings();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-accent flex items-center justify-center">
        <div className="text-white">Loading settings...</div>
      </div>
    );
  }

  const handleUpdate = async (field: string, value: any) => {
    await updateSettings({ [field]: value } as any);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-accent pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/20 backdrop-blur border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-bold text-white">Privacy Settings</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Online Status */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <h2 className="text-lg font-semibold mb-4 text-white">Activity Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="online-status" className="text-white">Show Online Status</Label>
                <p className="text-sm text-purple-200">
                  Let others see when you're online
                </p>
              </div>
              <Switch
                id="online-status"
                checked={settings?.privacy_show_online_status ?? true}
                onCheckedChange={(checked) => handleUpdate('privacy_show_online_status', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="last-active" className="text-white">Show Last Active</Label>
                <p className="text-sm text-purple-200">
                  Display when you were last active
                </p>
              </div>
              <Switch
                id="last-active"
                checked={settings?.privacy_show_last_active ?? true}
                onCheckedChange={(checked) => handleUpdate('privacy_show_last_active', checked)}
              />
            </div>
          </div>
        </div>

        {/* Profile Visibility */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <h2 className="text-lg font-semibold mb-4 text-white">Profile Visibility</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Who can see your profile</Label>
              <Select 
                value={settings?.privacy_profile_visibility ?? 'everyone'} 
                onValueChange={(value) => handleUpdate('privacy_profile_visibility', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="everyone">Everyone</SelectItem>
                  <SelectItem value="matches">Only Matches</SelectItem>
                  <SelectItem value="nobody">Nobody</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="profile-views" className="text-white">Show Profile Views</Label>
                <p className="text-sm text-purple-200">
                  Let others see who viewed their profile
                </p>
              </div>
              <Switch
                id="profile-views"
                checked={settings?.privacy_show_profile_views ?? true}
                onCheckedChange={(checked) => handleUpdate('privacy_show_profile_views', checked)}
              />
            </div>
          </div>
        </div>

        {/* Message Privacy */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <h2 className="text-lg font-semibold mb-4 text-white">Message Privacy</h2>
          <div className="space-y-2">
            <Label className="text-white">Who can message you</Label>
            <Select 
              value={settings?.privacy_message_privacy ?? 'everyone'} 
              onValueChange={(value) => handleUpdate('privacy_message_privacy', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="everyone">Everyone</SelectItem>
                <SelectItem value="matches">Only Matches</SelectItem>
                <SelectItem value="nobody">Nobody</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Location Privacy */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <h2 className="text-lg font-semibold mb-4 text-white">Location Privacy</h2>
          <div className="space-y-2">
            <Label className="text-white">Location sharing</Label>
            <Select 
              value={settings?.privacy_location_sharing ?? 'approximate'} 
              onValueChange={(value) => handleUpdate('privacy_location_sharing', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exact">Exact location</SelectItem>
                <SelectItem value="approximate">Approximate location</SelectItem>
                <SelectItem value="city">City only</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-purple-200">
              Control how precise your location appears to others
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
