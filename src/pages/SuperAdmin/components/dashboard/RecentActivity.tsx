
import React, { useEffect, useState } from 'react';
import { UserPlus, TrendingUp, ImageIcon, Mail, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/useTranslations';

interface ActivityItem {
  id: string;
  activity_type: string;
  user: string;
  time: string;
  description?: string;
  created_at?: string;
  user_id?: string;
}

const RecentActivity = () => {
  const { t } = useTranslations();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('admin_activities')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
          setActivities([]);
          return;
        }
        
        const formattedActivities = data.map(item => ({
          id: item.id,
          activity_type: item.activity_type,
          description: item.description,
          user: item.user_id ? `User ${item.user_id.slice(0, 8)}...` : 'Administrator',
          time: new Date(item.created_at).toLocaleString(),
          created_at: item.created_at,
          user_id: item.user_id
        }));
        
        setActivities(formattedActivities);
      } catch (error) {
        console.error('Failed to load recent activities:', error);
        toast.error(t('admin.no_recent_activities', 'No recent activities found.'));
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  const activityIcons = {
    user_register: <UserPlus size={16} className="text-green-500" />,
    user_upgrade: <TrendingUp size={16} className="text-purple-500" />,
    photo_upload: <ImageIcon size={16} className="text-blue-500" />,
    message_sent: <Mail size={16} className="text-orange-500" />,
    profile_update: <Users size={16} className="text-gray-500" />,
    user_moderation: <UserPlus size={16} className="text-green-500" />,
    system_update: <TrendingUp size={16} className="text-purple-500" />,
    content_moderation: <ImageIcon size={16} className="text-blue-500" />,
    user_support: <Mail size={16} className="text-orange-500" />,
    system_maintenance: <Users size={16} className="text-gray-500" />,
  };

  const getActivityTitle = (type: string) => {
    const titles: Record<string, string> = {
      user_register: t('admin.new_user_registration', 'New user registration'),
      user_upgrade: t('admin.user_upgraded_premium', 'User upgraded to premium'),
      photo_upload: t('admin.new_photos_uploaded', 'New photos uploaded'),
      message_sent: t('admin.new_message_sent', 'New message sent'),
      profile_update: t('admin.profile_updated', 'Profile updated'),
      user_moderation: t('admin.user_moderation_activity', 'User moderation'),
      system_update: t('admin.system_update_activity', 'System update'),
      content_moderation: t('admin.content_moderation_activity', 'Content moderation'),
      user_support: t('admin.user_support_activity', 'User support'),
      system_maintenance: t('admin.system_maintenance_activity', 'System maintenance'),
    };
    return titles[type] || type.replace(/_/g, ' ');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.recent_activity', 'Recent Activity')}</CardTitle>
          <CardDescription>{t('admin.latest_actions', 'Latest actions across the platform')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div key={index} className="h-16 bg-gray-100 animate-pulse rounded-md"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.recent_activity', 'Recent Activity')}</CardTitle>
        <CardDescription>{t('admin.latest_actions', 'Latest actions across the platform')}</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-gray-500">{t('admin.no_recent_activities', 'No recent activities found.')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 py-2 border-b last:border-0">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  {activityIcons[activity.activity_type as keyof typeof activityIcons] || 
                   <Users size={16} className="text-gray-500" />}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {getActivityTitle(activity.activity_type)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activity.description || `${activity.user} • ${activity.time}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">{t('admin.view_all_activity', 'View All Activity')}</Button>
      </CardFooter>
    </Card>
  );
};

export default RecentActivity;
