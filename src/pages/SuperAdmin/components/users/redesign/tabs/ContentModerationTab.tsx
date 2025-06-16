
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Flag, Eye, AlertTriangle } from 'lucide-react';

const ContentModerationTab: React.FC = () => {
  const moderationQueue = [
    { id: 1, type: 'Photo', user: 'John Doe', content: 'Profile photo', status: 'pending', risk: 'low' },
    { id: 2, type: 'Bio', user: 'Jane Smith', content: 'About me text', status: 'flagged', risk: 'medium' },
    { id: 3, type: 'Photo', user: 'Mike Johnson', content: 'Profile photo', status: 'pending', risk: 'high' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">23</p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Flagged Content</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
              <Flag className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Risk</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Auto-Approved</p>
                <p className="text-2xl font-bold text-gray-900">145</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Moderation Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {moderationQueue.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Badge variant={item.type === 'Photo' ? 'default' : 'secondary'}>
                    {item.type}
                  </Badge>
                  <div>
                    <p className="font-medium">{item.user}</p>
                    <p className="text-sm text-gray-600">{item.content}</p>
                  </div>
                  <Badge variant={item.risk === 'high' ? 'destructive' : item.risk === 'medium' ? 'default' : 'secondary'}>
                    {item.risk} risk
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Review</Button>
                  <Button variant="destructive" size="sm">Reject</Button>
                  <Button size="sm">Approve</Button>
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
