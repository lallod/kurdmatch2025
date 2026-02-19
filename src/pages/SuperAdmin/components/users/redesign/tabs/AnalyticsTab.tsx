import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

const AnalyticsTab: React.FC = () => {
  const { t } = useTranslations();
  const registrationSteps = [
    { step: 'Email/Password', completed: 95, abandoned: 5 },
    { step: 'Personal Info', completed: 87, abandoned: 13 },
    { step: 'Physical Traits', completed: 78, abandoned: 22 },
    { step: 'Lifestyle', completed: 72, abandoned: 28 },
    { step: 'Beliefs/Values', completed: 65, abandoned: 35 },
    { step: 'Preferences', completed: 58, abandoned: 42 },
    { step: 'Photos', completed: 45, abandoned: 55 },
    { step: 'Final Review', completed: 42, abandoned: 58 }
  ];

  const profileCompletion = [
    { section: 'Core Identity', completion: 100 },
    { section: 'Physical Characteristics', completion: 78 },
    { section: 'Lifestyle & Habits', completion: 65 },
    { section: 'Beliefs & Values', completion: 52 },
    { section: 'Interests & Hobbies', completion: 70 },
    { section: 'Favorites', completion: 45 },
    { section: 'Relationship Goals', completion: 60 },
    { section: 'Communication', completion: 55 }
  ];

  const userDistribution = [
    { name: 'Active', value: 65, color: '#10B981' },
    { name: 'Inactive', value: 25, color: '#F59E0B' },
    { name: 'Pending', value: 10, color: '#EF4444' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('admin.avg_registration_time', 'Avg. Registration Time')}</p>
                <p className="text-2xl font-bold text-gray-900">12.5 min</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('admin.completion_rate', 'Completion Rate')}</p>
                <p className="text-2xl font-bold text-gray-900">42%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('admin.drop_off_rate', 'Drop-off Rate')}</p>
                <p className="text-2xl font-bold text-gray-900">58%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('admin.daily_signups', 'Daily Signups')}</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>{t('admin.reg_step_completion', 'Registration Step Completion')}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={registrationSteps}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="step" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#10B981" name="Completed %" />
                <Bar dataKey="abandoned" fill="#EF4444" name="Abandoned %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{t('admin.user_status_distribution', 'User Status Distribution')}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={userDistribution} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                  {userDistribution.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>{t('admin.profile_section_completion', 'Profile Section Completion Rates')}</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={profileCompletion} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis type="category" dataKey="section" width={150} />
              <Tooltip formatter={(value) => [`${value}%`, 'Completion Rate']} />
              <Bar dataKey="completion" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTab;
