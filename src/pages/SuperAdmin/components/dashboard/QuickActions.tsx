
import React from 'react';
import { Users, MessageSquare, Tag, Settings, Heart, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/useTranslations';

const QuickActions = () => {
  const { t } = useTranslations();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.quick_actions', 'Quick Actions')}</CardTitle>
        <CardDescription>{t('admin.common_admin_tasks', 'Common administrative tasks')}</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="p-4 h-auto flex flex-col gap-2 items-center justify-center">
          <Users size={20} />
          <span>{t('admin.add_new_user', 'Add New User')}</span>
        </Button>
        <Button variant="outline" className="p-4 h-auto flex flex-col gap-2 items-center justify-center">
          <MessageSquare size={20} />
          <span>{t('admin.send_notification', 'Send Notification')}</span>
        </Button>
        <Button variant="outline" className="p-4 h-auto flex flex-col gap-2 items-center justify-center">
          <Tag size={20} />
          <span>{t('admin.manage_categories', 'Manage Categories')}</span>
        </Button>
        <Button variant="outline" className="p-4 h-auto flex flex-col gap-2 items-center justify-center">
          <Settings size={20} />
          <span>{t('admin.system_settings', 'System Settings')}</span>
        </Button>
        <Button variant="outline" className="p-4 h-auto flex flex-col gap-2 items-center justify-center">
          <Heart size={20} />
          <span>{t('admin.manage_likes', 'Manage Likes')}</span>
        </Button>
        <Button variant="outline" className="p-4 h-auto flex flex-col gap-2 items-center justify-center">
          <Eye size={20} />
          <span>{t('admin.view_analytics', 'View Analytics')}</span>
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
