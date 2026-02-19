import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Bell, Trash2, Search, Calendar, CheckCircle, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useTranslations } from '@/hooks/useTranslations';

interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  actor_id: string;
  post_id: string;
  group_id: string;
  link: string;
}

const NotificationsPage = () => {
  const { t } = useTranslations();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(100);

      if (filter === 'read') {
        query = query.eq('read', true);
      } else if (filter === 'unread') {
        query = query.eq('read', false);
      }

      const { data, error, count } = await query;

      if (error) throw error;
      setNotifications(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error(t('admin.failed_load_notifications', 'Failed to load notifications'));
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (id: string) => {
    if (!confirm(t('admin.delete_notification_confirm', 'Are you sure you want to delete this notification?'))) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success(t('admin.notification_deleted', 'Notification deleted successfully'));
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error(t('admin.notification_delete_failed', 'Failed to delete notification'));
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const filteredNotifications = notifications.filter(notification => {
    const search = searchTerm.toLowerCase();
    return notification.title.toLowerCase().includes(search) || 
           notification.message.toLowerCase().includes(search) ||
           notification.type.toLowerCase().includes(search);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('admin.notifications_management', 'Notifications Management')}</h1>
          <p className="text-white/60 mt-1">{t('admin.view_manage_notifications', 'View and manage all system notifications ({{count}} total)', { count: totalCount })}</p>
        </div>
        <Button onClick={fetchNotifications} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
          {t('common.refresh', 'Refresh')}
        </Button>
      </div>

      <Card className="bg-[#1a1a1a] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bell className="h-5 w-5 text-yellow-500" />
            {t('admin.all_notifications', 'All Notifications')}
          </CardTitle>
          <div className="mt-4 space-y-4">
            <div className="flex gap-2">
              <Button size="sm" variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')} className={filter === 'all' ? '' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}>
                {t('common.all', 'All')}
              </Button>
              <Button size="sm" variant={filter === 'unread' ? 'default' : 'outline'} onClick={() => setFilter('unread')} className={filter === 'unread' ? '' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}>
                {t('common.unread', 'Unread')}
              </Button>
              <Button size="sm" variant={filter === 'read' ? 'default' : 'outline'} onClick={() => setFilter('read')} className={filter === 'read' ? '' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}>
                {t('common.read', 'Read')}
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder={t('admin.search_notifications', 'Search notifications...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-white/60">{t('admin.loading_notifications', 'Loading notifications...')}</div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-white/60">{t('admin.no_notifications_found', 'No notifications found')}</div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div key={notification.id} className="flex items-start justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="mt-1">
                      {notification.read ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Circle className="h-5 w-5 text-yellow-500" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-white font-medium">{notification.title}</h3>
                          <p className="text-white/60 text-sm mt-1">{notification.message}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap mt-3">
                        <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60 capitalize">{notification.type}</Badge>
                        <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(notification.created_at), 'MMM d, yyyy HH:mm')}
                        </Badge>
                        <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60 font-mono text-xs">
                          {t('common.user', 'User')}: {notification.user_id.substring(0, 8)}...
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)} className="text-red-500 hover:text-red-400 hover:bg-red-500/10 ml-4">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage;
