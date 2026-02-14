import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Shield, Mail, MessageSquare, Camera, Bell, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

const ChaperoneMode: React.FC = () => {
  const { user } = useSupabaseAuth();
  const [enabled, setEnabled] = useState(false);
  const [chaperoneName, setChaperoneName] = useState('');
  const [chaperoneEmail, setChaperoneEmail] = useState('');
  const [notifyOnMatch, setNotifyOnMatch] = useState(true);
  const [notifyOnMessage, setNotifyOnMessage] = useState(true);
  const [canViewMessages, setCanViewMessages] = useState(false);
  const [canViewPhotos, setCanViewPhotos] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('chaperone_settings')
        .select('*')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setEnabled(data.enabled);
        setChaperoneName(data.chaperone_name || '');
        setChaperoneEmail(data.chaperone_email || '');
        setNotifyOnMatch(data.notify_on_match);
        setNotifyOnMessage(data.notify_on_message);
        setCanViewMessages(data.can_view_messages);
        setCanViewPhotos(data.can_view_photos);
      }
    } catch (error) {
      console.error('Error fetching chaperone settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    if (enabled && !chaperoneEmail) {
      toast.error('Please enter your chaperone\'s email');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        user_id: user.id,
        enabled,
        chaperone_name: chaperoneName || null,
        chaperone_email: chaperoneEmail || null,
        notify_on_match: notifyOnMatch,
        notify_on_message: notifyOnMessage,
        can_view_messages: canViewMessages,
        can_view_photos: canViewPhotos,
      };

      const { error } = await supabase
        .from('chaperone_settings')
        .upsert(payload, { onConflict: 'user_id' });

      if (error) throw error;
      toast.success('Chaperone settings saved');
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-8 text-muted-foreground">Loading...</div>;

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Chaperone Mode
        </CardTitle>
        <CardDescription>
          Invite a trusted person to oversee your conversations for added safety and cultural respect
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
          <div>
            <p className="font-medium">Enable Chaperone Mode</p>
            <p className="text-sm text-muted-foreground">A trusted person can monitor your interactions</p>
          </div>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>

        {enabled && (
          <>
            <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border">
              <h4 className="font-medium flex items-center gap-2">
                <Users className="w-4 h-4" />
                Chaperone Details
              </h4>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  placeholder="Chaperone's name"
                  value={chaperoneName}
                  onChange={e => setChaperoneName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  type="email"
                  placeholder="Chaperone's email"
                  value={chaperoneEmail}
                  onChange={e => setChaperoneEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Notification Preferences</h4>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  <Label>Notify on new match</Label>
                </div>
                <Switch checked={notifyOnMatch} onCheckedChange={setNotifyOnMatch} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <Label>Notify on new message</Label>
                </div>
                <Switch checked={notifyOnMessage} onCheckedChange={setNotifyOnMessage} />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Access Permissions</h4>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <Label>Can view messages</Label>
                </div>
                <Switch checked={canViewMessages} onCheckedChange={setCanViewMessages} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  <Label>Can view shared photos</Label>
                </div>
                <Switch checked={canViewPhotos} onCheckedChange={setCanViewPhotos} />
              </div>
            </div>
          </>
        )}

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ChaperoneMode;
