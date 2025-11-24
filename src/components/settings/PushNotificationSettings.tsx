import { Bell, BellOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export const PushNotificationSettings = () => {
  const {
    isSupported,
    isSubscribed,
    isLoading,
    subscribeToPush,
    unsubscribeFromPush,
  } = usePushNotifications();

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Push Notifications Not Supported
          </CardTitle>
          <CardDescription>
            Your browser doesn't support push notifications. Please use a modern browser like Chrome, Firefox, or Safari.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Push Notifications
        </CardTitle>
        <CardDescription>
          Receive notifications even when the app is closed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="push-toggle">Enable Push Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Get notified about new messages, matches, and likes
            </p>
          </div>
          <Switch
            id="push-toggle"
            checked={isSubscribed}
            onCheckedChange={(checked) => {
              if (checked) {
                subscribeToPush();
              } else {
                unsubscribeFromPush();
              }
            }}
            disabled={isLoading}
          />
        </div>

        {isSubscribed && (
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-sm text-green-900 dark:text-green-100">
              ✓ Push notifications are enabled. You'll receive notifications even when the app is closed.
            </p>
          </div>
        )}

        {!isSubscribed && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Stay connected with instant notifications for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-4">
              <li>New messages from your matches</li>
              <li>When someone likes your profile</li>
              <li>New matches</li>
              <li>Profile views</li>
            </ul>
            <Button
              onClick={subscribeToPush}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Enabling...' : 'Enable Push Notifications'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
