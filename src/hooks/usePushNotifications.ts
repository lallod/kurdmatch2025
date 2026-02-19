import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from '@/hooks/useTranslations';

export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslations();

  useEffect(() => {
    const supported = 'serviceWorker' in navigator && 'PushManager' in window;
    setIsSupported(supported);
    if (supported) { checkSubscriptionStatus(); }
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await (registration as any).pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  };

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) { outputArray[i] = rawData.charCodeAt(i); }
    return outputArray;
  };

  const subscribeToPush = async () => {
    if (!isSupported) {
      toast({ title: t('push.not_supported', 'Not Supported'), description: t('push.not_supported_desc', 'Push notifications are not supported in your browser'), variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        toast({ title: t('push.permission_denied', 'Permission Denied'), description: t('push.enable_in_settings', 'Please enable notifications in your browser settings'), variant: 'destructive' });
        setIsLoading(false);
        return;
      }

      const registration = await navigator.serviceWorker.register('/service-worker.js');
      await navigator.serviceWorker.ready;

      const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY || 'BEl62iUYgUivxIkv69yViEuiBIa-Ib37gfxCYqnA5pM1Jg3F3j9wq3qBVQqU5Y6T7Y8cLqYJ9Y8cLqYJ9Y8cLqY';
      const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

      const subscription = await (registration as any).pushManager.subscribe({ userVisibleOnly: true, applicationServerKey });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const subscriptionData = subscription.toJSON();
      const { error } = await supabase.from('push_subscriptions').insert({
        user_id: user.id,
        endpoint: subscriptionData.endpoint!,
        p256dh: subscriptionData.keys!.p256dh,
        auth: subscriptionData.keys!.auth,
        user_agent: navigator.userAgent,
      });

      if (error) throw error;
      setIsSubscribed(true);
      toast({ title: t('common.success', 'Success'), description: t('push.enabled', 'Push notifications enabled successfully') });
    } catch (error) {
      console.error('Error subscribing to push:', error);
      toast({ title: t('common.error', 'Error'), description: t('push.enable_failed', 'Failed to enable push notifications'), variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribeFromPush = async () => {
    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await (registration as any).pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('push_subscriptions').delete().eq('user_id', user.id).eq('endpoint', subscription.endpoint);
        }
        setIsSubscribed(false);
        toast({ title: t('common.success', 'Success'), description: t('push.disabled', 'Push notifications disabled') });
      }
    } catch (error) {
      console.error('Error unsubscribing from push:', error);
      toast({ title: t('common.error', 'Error'), description: t('push.disable_failed', 'Failed to disable push notifications'), variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return { isSupported, isSubscribed, isLoading, subscribeToPush, unsubscribeFromPush };
};
