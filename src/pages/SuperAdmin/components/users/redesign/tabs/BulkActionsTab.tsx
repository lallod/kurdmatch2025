
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Users, Mail, Shield, Edit, Trash2, CheckCircle } from 'lucide-react';

const BulkActionsTab: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const bulkActions = [
    { id: 'verify', label: 'Verify Users', icon: CheckCircle, color: 'green' },
    { id: 'role', label: 'Change Role', icon: Shield, color: 'blue' },
    { id: 'email', label: 'Send Email', icon: Mail, color: 'purple' },
    { id: 'suspend', label: 'Suspend Users', icon: Trash2, color: 'red' },
    { id: 'update', label: 'Update Fields', icon: Edit, color: 'orange' }
  ];

  const commonUpdates = [
    { label: 'Update location for inactive users', count: 45 },
    { label: 'Verify photos for pending users', count: 23 },
    { label: 'Send welcome email to new users', count: 12 },
    { label: 'Update premium role for subscribers', count: 8 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={20} />
              Bulk Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Action</label>
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose bulk action" />
                </SelectTrigger>
                <SelectContent>
                  {bulkActions.map((action) => (
                    <SelectItem key={action.id} value={action.id}>
                      <div className="flex items-center gap-2">
                        <action.icon size={16} />
                        {action.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Target Users</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select user group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="active">Active Users</SelectItem>
                  <SelectItem value="inactive">Inactive Users</SelectItem>
                  <SelectItem value="pending">Pending Verification</SelectItem>
                  <SelectItem value="premium">Premium Users</SelectItem>
                  <SelectItem value="free">Free Users</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Filters</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="location" />
                  <label htmlFor="location" className="text-sm">Filter by location</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="joindate" />
                  <label htmlFor="joindate" className="text-sm">Filter by join date</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="activity" />
                  <label htmlFor="activity" className="text-sm">Filter by activity level</label>
                </div>
              </div>
            </div>

            <Button className="w-full" disabled={!selectedAction}>
              Execute Bulk Action
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {commonUpdates.map((update, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">{update.label}</p>
                  <Badge variant="secondary" className="mt-1">
                    {update.count} users
                  </Badge>
                </div>
                <Button variant="outline" size="sm">
                  Execute
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Field-Specific Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Location Verification</h3>
              <p className="text-sm text-gray-600 mb-3">Verify and standardize user locations</p>
              <Button variant="outline" size="sm" className="w-full">
                Verify Locations
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Photo Moderation</h3>
              <p className="text-sm text-gray-600 mb-3">Review and approve pending photos</p>
              <Button variant="outline" size="sm" className="w-full">
                Review Photos
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Content Check</h3>
              <p className="text-sm text-gray-600 mb-3">Scan profiles for inappropriate content</p>
              <Button variant="outline" size="sm" className="w-full">
                Scan Content
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkActionsTab;
