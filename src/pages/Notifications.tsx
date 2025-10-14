import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Heart, 
  MessageCircle, 
  UserPlus, 
  Eye, 
  Calendar,
  Users,
  ArrowLeft,
  Check,
  Trash2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'view' | 'event' | 'group' | 'message';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  action_url?: string;
  actor_id?: string;
  actor_name?: string;
  actor_image?: string;
}

const Notifications = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    if (user) {
      fetchNotifications();
      setupRealtimeSubscription();
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch various notification sources
      const [likes, comments, views, events] = await Promise.all([
        fetchLikeNotifications(),
        fetchCommentNotifications(),
        fetchViewNotifications(),
        fetchEventNotifications(),
      ]);

      const allNotifications = [
        ...likes,
        ...comments,
        ...views,
        ...events,
      ].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setNotifications(allNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLikeNotifications = async (): Promise<Notification[]> => {
    const { data } = await supabase
      .from('post_likes')
      .select(`
        id,
        created_at,
        user_id,
        profiles!post_likes_user_id_fkey (
          id,
          name,
          profile_image
        )
      `)
      .eq('post_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(20);

    return (data || []).map((like: any) => ({
      id: like.id,
      type: 'like' as const,
      title: 'New Like',
      message: `${like.profiles?.name || 'Someone'} liked your post`,
      read: false,
      created_at: like.created_at,
      actor_id: like.user_id,
      actor_name: like.profiles?.name,
      actor_image: like.profiles?.profile_image,
    }));
  };

  const fetchCommentNotifications = async (): Promise<Notification[]> => {
    const { data } = await supabase
      .from('post_comments')
      .select(`
        id,
        content,
        created_at,
        user_id,
        post_id,
        profiles!post_comments_user_id_fkey (
          id,
          name,
          profile_image
        )
      `)
      .neq('user_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(20);

    return (data || []).map((comment: any) => ({
      id: comment.id,
      type: 'comment' as const,
      title: 'New Comment',
      message: `${comment.profiles?.name || 'Someone'} commented on your post`,
      read: false,
      created_at: comment.created_at,
      action_url: `/post/${comment.post_id}`,
      actor_id: comment.user_id,
      actor_name: comment.profiles?.name,
      actor_image: comment.profiles?.profile_image,
    }));
  };

  const fetchViewNotifications = async (): Promise<Notification[]> => {
    const { data } = await supabase
      .from('profile_views')
      .select(`
        id,
        viewed_at,
        viewer_id,
        profiles!profile_views_viewer_id_fkey (
          id,
          name,
          profile_image
        )
      `)
      .eq('viewed_profile_id', user!.id)
      .order('viewed_at', { ascending: false })
      .limit(20);

    return (data || []).map((view: any) => ({
      id: view.id,
      type: 'view' as const,
      title: 'Profile View',
      message: `${view.profiles?.name || 'Someone'} viewed your profile`,
      read: false,
      created_at: view.viewed_at,
      action_url: `/profile/${view.viewer_id}`,
      actor_id: view.viewer_id,
      actor_name: view.profiles?.name,
      actor_image: view.profiles?.profile_image,
    }));
  };

  const fetchEventNotifications = async (): Promise<Notification[]> => {
    // This is a simplified version - you could track event updates, new attendees, etc.
    return [];
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'post_likes',
        },
        () => fetchNotifications()
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'post_comments',
        },
        () => fetchNotifications()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const markAsRead = async (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast({ description: 'All notifications marked as read' });
  };

  const deleteNotification = async (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    toast({ description: 'Notification removed' });
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.action_url) {
      navigate(notification.action_url);
    } else if (notification.actor_id) {
      navigate(`/profile/${notification.actor_id}`);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-pink-500" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case 'view':
        return <Eye className="w-5 h-5 text-purple-500" />;
      case 'event':
        return <Calendar className="w-5 h-5 text-orange-500" />;
      case 'group':
        return <Users className="w-5 h-5 text-indigo-500" />;
      case 'message':
        return <MessageCircle className="w-5 h-5 text-cyan-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const filteredNotifications = notifications.filter((n) =>
    filter === 'all' ? true : !n.read
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 pb-24">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/discovery')}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-white/70">{unreadCount} unread</p>
              )}
            </div>
          </div>
          {notifications.length > 0 && unreadCount > 0 && (
            <Button
              variant="ghost"
              onClick={markAllAsRead}
              className="text-white hover:bg-white/10"
            >
              <Check className="w-4 h-4 mr-2" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'unread')}>
          <TabsList className="grid w-full grid-cols-2 bg-white/10">
            <TabsTrigger value="all" className="data-[state=active]:bg-white/20">
              All
            </TabsTrigger>
            <TabsTrigger value="unread" className="data-[state=active]:bg-white/20">
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="space-y-3">
            {loading ? (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="py-8 text-center text-white">
                  Loading notifications...
                </CardContent>
              </Card>
            ) : filteredNotifications.length === 0 ? (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="py-12 text-center">
                  <Bell className="w-12 h-12 text-white/30 mx-auto mb-3" />
                  <p className="text-white/70">
                    {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`bg-white/10 backdrop-blur-md border-white/20 cursor-pointer hover:bg-white/15 transition-colors ${
                    !notification.read ? 'border-l-4 border-l-pink-500' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Actor Image or Icon */}
                      {notification.actor_image ? (
                        <img
                          src={notification.actor_image}
                          alt={notification.actor_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-white font-medium">
                              {notification.title}
                            </p>
                            <p className="text-white/70 text-sm">
                              {notification.message}
                            </p>
                            <p className="text-white/50 text-xs mt-1">
                              {formatDistanceToNow(new Date(notification.created_at), {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="text-white/50 hover:text-white hover:bg-white/10 flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Notifications;
