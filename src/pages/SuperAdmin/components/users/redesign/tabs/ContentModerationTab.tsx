
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Flag, Eye, AlertTriangle } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

const ContentModerationTab: React.FC = () => {
  const { t } = useTranslations();
  const moderationQueue = [
    { id: 1, type: 'Photo', user: 'John Doe', content: 'Profile photo', status: 'pending', risk: 'low' },
    { id: 2, type: 'Bio', user: 'Jane Smith', content: 'About me text', status: 'flagged', risk: 'medium' },
    { id: 3, type: 'Photo', user: 'Mike Johnson', content: 'Profile photo', status: 'pending', risk: 'high' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#141414] border-white/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/60">{t('admin.pending_review', 'Pending Review')}</p>
                <p className="text-2xl font-bold text-white">23</p>
              </div>
              <Eye className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#141414] border-white/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/60">{t('admin.flagged_content', 'Flagged Content')}</p>
                <p className="text-2xl font-bold text-white">5</p>
              </div>
              <Flag className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#141414] border-white/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/60">{t('admin.high_risk', 'High Risk')}</p>
                <p className="text-2xl font-bold text-white">2</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#141414] border-white/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/60">{t('admin.auto_approved', 'Auto-Approved')}</p>
                <p className="text-2xl font-bold text-white">145</p>
              </div>
              <Shield className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#141414] border-white/5">
        <CardHeader>
          <CardTitle className="text-white">{t('admin.moderation_queue', 'Moderation Queue')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {moderationQueue.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border border-white/5 rounded-lg bg-white/5">
                <div className="flex items-center gap-4">
                  <Badge variant={item.type === 'Photo' ? 'default' : 'secondary'}>{item.type}</Badge>
                  <div>
                    <p className="font-medium text-white">{item.user}</p>
                    <p className="text-sm text-white/60">{item.content}</p>
                  </div>
                  <Badge variant={item.risk === 'high' ? 'destructive' : item.risk === 'medium' ? 'default' : 'secondary'}>
                    {item.risk} risk
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/5">{t('admin.review', 'Review')}</Button>
                  <Button variant="destructive" size="sm">{t('admin.reject', 'Reject')}</Button>
                  <Button size="sm">{t('admin.approve', 'Approve')}</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentModerationTab;
