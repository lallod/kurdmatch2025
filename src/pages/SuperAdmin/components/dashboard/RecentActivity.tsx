
import React, { useEffect, useState } from 'react';
import { UserPlus, TrendingUp, ImageIcon, Mail, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        
        // Fetch admin activities from the database
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
        
        // Transform the data to match the expected structure
        const formattedActivities = data.map(item => ({
          id: item.id,
          activity_type: item.activity_type,
          description: item.description,
          user: 'Administrator', // Assuming these are admin activities
          time: new Date(item.created_at).toLocaleString(),
          created_at: item.created_at,
          user_id: item.user_id
        }));
        
        setActivities(formattedActivities);
      } catch (error) {
        console.error('Failed to load recent activities:', error);
        toast({
          title: 'Error loading activities',
          description: 'Could not load recent activities. Please try again.',
          variant: 'destructive',
        });
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [toast]);

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
    switch (type) {
      case 'user_register': return 'New user registration';
      case 'user_upgrade': return 'User upgraded to premium';
      case 'photo_upload': return 'New photos uploaded';
      case 'message_sent': return 'New message sent';
      case 'profile_update': return 'Profile updated';
      case 'user_moderation': return 'User moderation';
      case 'system_update': return 'System update';
      case 'content_moderation': return 'Content moderation';
      case 'user_support': return 'User support';
      case 'system_maintenance': return 'System maintenance';
      default: return type.replace(/_/g, ' ');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions across the platform</CardDescription>
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
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions across the platform</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-gray-500">No recent activities found.</p>
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
        <Button variant="outline" size="sm" className="w-full">View All Activity</Button>
      </CardFooter>
    </Card>
  );
};

export default RecentActivity;
