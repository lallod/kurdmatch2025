import React, { useState } from 'react';
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
import { toast } from 'sonner';

const PrivacySettings = () => {
  const navigate = useNavigate();
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [showLastActive, setShowLastActive] = useState(true);
  const [showProfileViews, setShowProfileViews] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState('everyone');
  const [messagePrivacy, setMessagePrivacy] = useState('everyone');
  const [locationSharing, setLocationSharing] = useState('approximate');

  const handleSave = () => {
    // Save privacy settings
    toast.success('Privacy settings updated');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 glass border-b border-border">
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
              <Lock className="h-5 w-5" />
              <h1 className="text-2xl font-bold">Privacy Settings</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Online Status */}
        <div className="glass rounded-lg p-6 border border-border">
          <h2 className="text-lg font-semibold mb-4">Activity Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="online-status">Show Online Status</Label>
                <p className="text-sm text-muted-foreground">
                  Let others see when you're online
                </p>
              </div>
              <Switch
                id="online-status"
                checked={showOnlineStatus}
                onCheckedChange={setShowOnlineStatus}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="last-active">Show Last Active</Label>
                <p className="text-sm text-muted-foreground">
                  Display when you were last active
                </p>
              </div>
              <Switch
                id="last-active"
                checked={showLastActive}
                onCheckedChange={setShowLastActive}
              />
            </div>
          </div>
        </div>

        {/* Profile Visibility */}
        <div className="glass rounded-lg p-6 border border-border">
          <h2 className="text-lg font-semibold mb-4">Profile Visibility</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Who can see your profile</Label>
              <Select value={profileVisibility} onValueChange={setProfileVisibility}>
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
                <Label htmlFor="profile-views">Show Profile Views</Label>
                <p className="text-sm text-muted-foreground">
                  Let others see who viewed their profile
                </p>
              </div>
              <Switch
                id="profile-views"
                checked={showProfileViews}
                onCheckedChange={setShowProfileViews}
              />
            </div>
          </div>
        </div>

        {/* Message Privacy */}
        <div className="glass rounded-lg p-6 border border-border">
          <h2 className="text-lg font-semibold mb-4">Message Privacy</h2>
          <div className="space-y-2">
            <Label>Who can message you</Label>
            <Select value={messagePrivacy} onValueChange={setMessagePrivacy}>
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
        <div className="glass rounded-lg p-6 border border-border">
          <h2 className="text-lg font-semibold mb-4">Location Privacy</h2>
          <div className="space-y-2">
            <Label>Location sharing</Label>
            <Select value={locationSharing} onValueChange={setLocationSharing}>
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
            <p className="text-sm text-muted-foreground">
              Control how precise your location appears to others
            </p>
          </div>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
        >
          Save Privacy Settings
        </Button>
      </div>
    </div>
  );
};

export default PrivacySettings;
