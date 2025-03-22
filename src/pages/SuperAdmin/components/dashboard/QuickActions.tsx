
import React from 'react';
import { Users, MessageSquare, Tag, Settings, Heart, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const QuickActions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common administrative tasks</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="p-4 h-auto flex flex-col gap-2 items-center justify-center">
          <Users size={20} />
          <span>Add New User</span>
        </Button>
        <Button variant="outline" className="p-4 h-auto flex flex-col gap-2 items-center justify-center">
          <MessageSquare size={20} />
          <span>Send Notification</span>
        </Button>
        <Button variant="outline" className="p-4 h-auto flex flex-col gap-2 items-center justify-center">
          <Tag size={20} />
          <span>Manage Categories</span>
        </Button>
        <Button variant="outline" className="p-4 h-auto flex flex-col gap-2 items-center justify-center">
          <Settings size={20} />
          <span>System Settings</span>
        </Button>
        <Button variant="outline" className="p-4 h-auto flex flex-col gap-2 items-center justify-center">
          <Heart size={20} />
          <span>Manage Likes</span>
        </Button>
        <Button variant="outline" className="p-4 h-auto flex flex-col gap-2 items-center justify-center">
          <Eye size={20} />
          <span>View Analytics</span>
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
