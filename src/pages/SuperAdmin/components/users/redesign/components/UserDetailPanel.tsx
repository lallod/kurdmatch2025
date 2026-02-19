
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Heart, MapPin, Briefcase, Calendar, Camera, MessageSquare } from 'lucide-react';
import { User as UserType } from '../../types';
import { useTranslations } from '@/hooks/useTranslations';

interface UserDetailPanelProps {
  user: UserType | null;
  onUserUpdate: () => void;
}

const UserDetailPanel: React.FC<UserDetailPanelProps> = ({ user, onUserUpdate }) => {
  const { t } = useTranslations();

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">{t('admin.select_user_details', 'Select a user to view details')}</p>
        </CardContent>
      </Card>
    );
  }

  const profileSections = [
    {
      id: 'core',
      label: t('admin.core_identity', 'Core Identity'),
      icon: <User size={16} />,
      fields: ['name', 'email', 'role', 'status']
    },
    {
      id: 'personal',
      label: t('admin.personal_info', 'Personal Info'),
      icon: <Heart size={16} />,
      fields: ['age', 'gender', 'location', 'occupation']
    },
    {
      id: 'activity',
      label: t('admin.activity', 'Activity'),
      icon: <MessageSquare size={16} />,
      fields: ['joinDate', 'lastActive', 'photoCount', 'messageCount']
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User size={20} />
          {t('admin.user_profile', 'User Profile')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="core" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            {profileSections.map((section) => (
              <TabsTrigger key={section.id} value={section.id} className="flex items-center gap-1">
                {section.icon}
                <span className="hidden sm:inline">{section.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="core" className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">{t('common.name', 'Name')}</label>
                <p className="text-sm">{user.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">{t('common.email', 'Email')}</label>
                <p className="text-sm">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">{t('common.role', 'Role')}</label>
                <Badge variant="secondary">{user.role}</Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">{t('common.status', 'Status')}</label>
                <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                  {user.status}
                </Badge>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="personal" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-gray-400" />
                <span className="text-sm">{user.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-gray-400" />
                <span className="text-sm">{t('admin.joined', 'Joined')} {user.joinDate}</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera size={14} className="text-gray-400" />
                  <span className="text-sm">{t('common.photos', 'Photos')}</span>
                </div>
                <Badge variant="outline">{user.photoCount}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare size={14} className="text-gray-400" />
                  <span className="text-sm">{t('common.messages', 'Messages')}</span>
                </div>
                <Badge variant="outline">{user.messageCount}</Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">{t('admin.last_active', 'Last Active')}</label>
                <p className="text-sm">{user.lastActive}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 space-y-2">
          <Button className="w-full" size="sm">
            {t('admin.edit_profile', 'Edit Profile')}
          </Button>
          <Button variant="outline" className="w-full" size="sm">
            {t('admin.view_full_profile', 'View Full Profile')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDetailPanel;
