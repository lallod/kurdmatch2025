
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Heart, MapPin, Briefcase, Calendar, Camera, MessageSquare } from 'lucide-react';
import { User as UserType } from '../../types';

interface UserDetailPanelProps {
  user: UserType | null;
  onUserUpdate: () => void;
}

const UserDetailPanel: React.FC<UserDetailPanelProps> = ({ user, onUserUpdate }) => {
  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Select a user to view details</p>
        </CardContent>
      </Card>
    );
  }

  const profileSections = [
    {
      id: 'core',
      label: 'Core Identity',
      icon: <User size={16} />,
      fields: ['name', 'email', 'role', 'status']
    },
    {
      id: 'personal',
      label: 'Personal Info',
      icon: <Heart size={16} />,
      fields: ['age', 'gender', 'location', 'occupation']
    },
    {
      id: 'activity',
      label: 'Activity',
      icon: <MessageSquare size={16} />,
      fields: ['joinDate', 'lastActive', 'photoCount', 'messageCount']
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User size={20} />
          User Profile
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
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-sm">{user.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-sm">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Role</label>
                <Badge variant="secondary">{user.role}</Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
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
                <span className="text-sm">Joined {user.joinDate}</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera size={14} className="text-gray-400" />
                  <span className="text-sm">Photos</span>
                </div>
                <Badge variant="outline">{user.photoCount}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare size={14} className="text-gray-400" />
                  <span className="text-sm">Messages</span>
                </div>
                <Badge variant="outline">{user.messageCount}</Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Active</label>
                <p className="text-sm">{user.lastActive}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 space-y-2">
          <Button className="w-full" size="sm">
            Edit Profile
          </Button>
          <Button variant="outline" className="w-full" size="sm">
            View Full Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDetailPanel;
