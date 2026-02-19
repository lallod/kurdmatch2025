
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Search, TrendingDown, Clock, Users } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

const UserJourneyTab: React.FC = () => {
  const { t } = useTranslations();
  const journeySteps = [
    { step: 'Landing Page Visit', users: 1000, completion: 100 },
    { step: 'Registration Started', users: 650, completion: 65 },
    { step: 'Email Verified', users: 580, completion: 58 },
    { step: 'Basic Info Complete', users: 520, completion: 52 },
    { step: 'Photo Uploaded', users: 420, completion: 42 },
    { step: 'Profile Complete', users: 380, completion: 38 },
    { step: 'First Match', users: 280, completion: 28 },
    { step: 'First Message', users: 180, completion: 18 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('admin.conversion_rate', 'Conversion Rate')}</p>
                <p className="text-2xl font-bold text-gray-900">18%</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('admin.avg_journey_time', 'Avg. Journey Time')}</p>
                <p className="text-2xl font-bold text-gray-900">3.2d</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('admin.drop_off_point', 'Drop-off Point')}</p>
                <p className="text-2xl font-bold text-gray-900">Photos</p>
              </div>
              <Search className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('admin.active_users', 'Active Users')}</p>
                <p className="text-2xl font-bold text-gray-900">180</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.user_journey_funnel', 'User Journey Funnel')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {journeySteps.map((step, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{step.step}</span>
                  <span className="text-sm text-gray-600">{t('admin.users_count', '{{count}} users ({{pct}}%)', { count: step.users, pct: step.completion })}</span>
                </div>
                <Progress value={step.completion} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserJourneyTab;
