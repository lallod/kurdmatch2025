import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Heart, MessageCircle, UserPlus, Eye, Calendar, Users, ArrowLeft, Check, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { useTranslations } from '@/hooks/useTranslations';

interface Notification {
  id: string; type: 'like' | 'comment' | 'follow' | 'view' | 'event' | 'group' | 'message';
  title: string; message: string; read: boolean; created_at: string;
  action_url?: string; actor_id?: string; actor_name?: string; actor_image?: string;
}

const Notifications = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const { t } = useTranslations();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    if (user) { fetchNotifications(); setupRealtimeSubscription(); }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [likes, comments, views, events] = await Promise.all([
        fetchLikeNotifications(), fetchCommentNotifications(), fetchViewNotifications(), fetchEventNotifications(),
      ]);
      const allNotifications = [...likes, ...comments, ...views, ...events]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setNotifications(allNotifications);
    } catch (error) { console.error('Error fetching notifications:', error); }
    finally { setLoading(false); }
  };

  const fetchLikeNotifications = async (): Promise<Notification[]> => {
    const { data } = await supabase.from('post_likes').select(`id, created_at, user_id, profiles!post_likes_user_id_fkey (id, name, profile_image)`)
      .eq('post_id', user!.id).order('created_at', { ascending: false }).limit(20);
    return (data || []).map((like: any) => ({
      id: like.id, type: 'like' as const, title: 'New Like',
      message: `${like.profiles?.name || 'Someone'} liked your post`, read: false, created_at: like.created_at,
      actor_id: like.user_id, actor_name: like.profiles?.name, actor_image: like.profiles?.profile_image,
    }));
  };

  const fetchCommentNotifications = async (): Promise<Notification[]> => {
    const { data } = await supabase.from('post_comments').select(`id, content, created_at, user_id, post_id, profiles!post_comments_user_id_fkey (id, name, profile_image)`)
      .neq('user_id', user!.id).order('created_at', { ascending: false }).limit(20);
    return (data || []).map((comment: any) => ({
      id: comment.id, type: 'comment' as const, title: 'New Comment',
      message: `${comment.profiles?.name || 'Someone'} commented on your post`, read: false,
      created_at: comment.created_at, action_url: `/post/${comment.post_id}`,
      actor_id: comment.user_id, actor_name: comment.profiles?.name, actor_image: comment.profiles?.profile_image,
    }));
  };

  const fetchViewNotifications = async (): Promise<Notification[]> => {
    const { data } = await supabase.from('profile_views').select(`id, viewed_at, viewer_id, profiles!profile_views_viewer_id_fkey (id, name, profile_image)`)
      .eq('viewed_profile_id', user!.id).order('viewed_at', { ascending: false }).limit(20);
    return (data || []).map((view: any) => ({
      id: view.id, type: 'view' as const, title: 'Profile View',
      message: `${view.profiles?.name || 'Someone'} viewed your profile`, read: false,
      created_at: view.viewed_at, action_url: `/profile/${view.viewer_id}`,
      actor_id: view.viewer_id, actor_name: view.profiles?.name, actor_image: view.profiles?.profile_image,
    }));
  };

  const fetchEventNotifications = async (): Promise<Notification[]> => [];

  const setupRealtimeSubscription = () => {
    const channel = supabase.channel('notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'post_likes' }, () => fetchNotifications())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'post_comments' }, () => fetchNotifications())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  };

  const markAsRead = async (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
  };
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast({ description: 'All notifications marked as read' });
  };
  const deleteNotification = async (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    toast({ description: 'Notification removed' });
  };
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.action_url) navigate(notification.action_url);
    else if (notification.actor_id) navigate(`/profile/${notification.actor_id}`);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like': return <Heart className="w-5 h-5 text-primary" />;
      case 'comment': return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'follow': return <UserPlus className="w-5 h-5 text-green-500" />;
      case 'view': return <Eye className="w-5 h-5 text-accent" />;
      case 'event': return <Calendar className="w-5 h-5 text-orange-500" />;
      case 'group': return <Users className="w-5 h-5 text-indigo-500" />;
      case 'message': return <MessageCircle className="w-5 h-5 text-cyan-500" />;
      default: return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const filteredNotifications = notifications.filter(n => filter === 'all' ? true : !n.read);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 bg-background border-b border-border/30">
        <div className="max-w-lg mx-auto px-4 h-11 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-8 w-8"><ArrowLeft className="w-4 h-4" /></Button>
            <h1 className="text-base font-semibold text-foreground">{t('notifications.activity', 'Activity')}</h1>
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs text-primary">{t('notifications.mark_all_read', 'Mark all read')}</Button>
          )}
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        <div className="flex border-b border-border/20 px-4">
          <button onClick={() => setFilter('all')} className={`flex-1 py-2.5 text-sm font-semibold text-center relative ${filter === 'all' ? 'text-foreground' : 'text-muted-foreground'}`}>
            {t('notifications.all', 'All')}
            {filter === 'all' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />}
          </button>
          <button onClick={() => setFilter('unread')} className={`flex-1 py-2.5 text-sm font-semibold text-center relative ${filter === 'unread' ? 'text-foreground' : 'text-muted-foreground'}`}>
            {t('notifications.unread', 'Unread')} {unreadCount > 0 && `(${unreadCount})`}
            {filter === 'unread' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />}
          </button>
        </div>

        <div>
          {loading ? (
            <div className="py-12 text-center text-muted-foreground text-sm">{t('notifications.loading', 'Loading...')}</div>
          ) : filteredNotifications.length === 0 ? (
            <div className="py-16 text-center">
              <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">
                {filter === 'unread' ? t('notifications.no_unread', 'No unread notifications') : t('notifications.no_notifications', 'No notifications yet')}
              </p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div key={notification.id} className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors border-b border-border/10 ${!notification.read ? 'bg-primary/5' : ''}`} onClick={() => handleNotificationClick(notification)}>
                {notification.actor_image ? (
                  <img src={notification.actor_image} alt="" className="w-11 h-11 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center flex-shrink-0">{getNotificationIcon(notification.type)}</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground"><span className="font-semibold">{notification.actor_name || notification.title}</span>{' '}{notification.message.replace(notification.actor_name || '', '').trim()}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }} className="text-muted-foreground h-8 w-8 flex-shrink-0 opacity-0 hover:opacity-100"><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
