
import React from 'react';
import { UserPlus, TrendingUp, ImageIcon, Mail, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const RecentActivity = () => {
  const recentActivityData = [
    { type: 'user_register', user: 'Alice Johnson', time: '2 minutes ago' },
    { type: 'user_upgrade', user: 'Bob Smith', time: '15 minutes ago' },
    { type: 'photo_upload', user: 'Carol Williams', time: '30 minutes ago' },
    { type: 'message_sent', user: 'Dave Miller', time: '45 minutes ago' },
    { type: 'profile_update', user: 'Emma Davis', time: '1 hour ago' },
  ];

  const activityIcons = {
    user_register: <UserPlus size={16} className="text-green-500" />,
    user_upgrade: <TrendingUp size={16} className="text-purple-500" />,
    photo_upload: <ImageIcon size={16} className="text-blue-500" />,
    message_sent: <Mail size={16} className="text-orange-500" />,
    profile_update: <Users size={16} className="text-gray-500" />,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions across the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivityData.map((activity, index) => (
            <div key={index} className="flex items-center gap-4 py-2 border-b last:border-0">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                {activityIcons[activity.type as keyof typeof activityIcons]}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {activity.type === 'user_register' && 'New user registration'}
                  {activity.type === 'user_upgrade' && 'User upgraded to premium'}
                  {activity.type === 'photo_upload' && 'New photos uploaded'}
                  {activity.type === 'message_sent' && 'New message sent'}
                  {activity.type === 'profile_update' && 'Profile updated'}
                </p>
                <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">View All Activity</Button>
      </CardFooter>
    </Card>
  );
};

export default RecentActivity;
