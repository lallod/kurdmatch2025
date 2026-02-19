
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Users, Mail, Shield, Edit, Trash2, CheckCircle } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

const BulkActionsTab: React.FC = () => {
  const { t } = useTranslations();
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
              {t('admin.bulk_actions', 'Bulk Actions')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">{t('admin.select_action', 'Select Action')}</label>
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger><SelectValue placeholder={t('admin.choose_bulk_action', 'Choose bulk action')} /></SelectTrigger>
                <SelectContent>
                  {bulkActions.map((action) => (
                    <SelectItem key={action.id} value={action.id}>
                      <div className="flex items-center gap-2"><action.icon size={16} />{action.label}</div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">{t('admin.target_users', 'Target Users')}</label>
              <Select>
                <SelectTrigger><SelectValue placeholder={t('admin.select_user_group', 'Select user group')} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('admin.all_users', 'All Users')}</SelectItem>
                  <SelectItem value="active">{t('admin.active_users', 'Active Users')}</SelectItem>
                  <SelectItem value="inactive">{t('admin.inactive_users', 'Inactive Users')}</SelectItem>
                  <SelectItem value="pending">{t('admin.pending_verification', 'Pending Verification')}</SelectItem>
                  <SelectItem value="premium">{t('admin.premium_users', 'Premium Users')}</SelectItem>
                  <SelectItem value="free">{t('admin.free_users', 'Free Users')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('admin.filters', 'Filters')}</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2"><Checkbox id="location" /><label htmlFor="location" className="text-sm">{t('admin.filter_by_location', 'Filter by location')}</label></div>
                <div className="flex items-center space-x-2"><Checkbox id="joindate" /><label htmlFor="joindate" className="text-sm">{t('admin.filter_by_join_date', 'Filter by join date')}</label></div>
                <div className="flex items-center space-x-2"><Checkbox id="activity" /><label htmlFor="activity" className="text-sm">{t('admin.filter_by_activity', 'Filter by activity level')}</label></div>
              </div>
            </div>

            <Button className="w-full" disabled={!selectedAction}>{t('admin.execute_bulk_action', 'Execute Bulk Action')}</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{t('admin.quick_actions', 'Quick Actions')}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {commonUpdates.map((update, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">{update.label}</p>
                  <Badge variant="secondary" className="mt-1">{update.count} users</Badge>
                </div>
                <Button variant="outline" size="sm">{t('admin.execute', 'Execute')}</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>{t('admin.field_specific_tools', 'Field-Specific Tools')}</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">{t('admin.location_verification', 'Location Verification')}</h3>
              <p className="text-sm text-gray-600 mb-3">{t('admin.verify_locations_desc', 'Verify and standardize user locations')}</p>
              <Button variant="outline" size="sm" className="w-full">{t('admin.verify_locations', 'Verify Locations')}</Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">{t('admin.photo_moderation', 'Photo Moderation')}</h3>
              <p className="text-sm text-gray-600 mb-3">{t('admin.review_photos_desc', 'Review and approve pending photos')}</p>
              <Button variant="outline" size="sm" className="w-full">{t('admin.review_photos', 'Review Photos')}</Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">{t('admin.content_check', 'Content Check')}</h3>
              <p className="text-sm text-gray-600 mb-3">{t('admin.scan_content_desc', 'Scan profiles for inappropriate content')}</p>
              <Button variant="outline" size="sm" className="w-full">{t('admin.scan_content', 'Scan Content')}</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkActionsTab;
