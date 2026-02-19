
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/useTranslations';

const AIRecommendations: React.FC = () => {
  const { t } = useTranslations();
  return (
    <Card className="bg-[#141414] border-white/5">
      <CardHeader>
        <CardTitle className="text-white">{t('admin.ai_role_recommendations', 'AI Role Recommendations')}</CardTitle>
        <CardDescription className="text-white/60">{t('admin.ai_role_suggestions_desc', 'Suggested role configurations based on usage patterns')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 border border-blue-500/20 rounded-lg bg-blue-500/10">
            <h4 className="font-semibold text-blue-300 mb-2">{t('admin.moderator_role_optimization', 'Moderator Role Optimization')}</h4>
            <p className="text-blue-200/80">
              {t('admin.moderator_optimization_desc', 'Moderators are rarely using the report creation functionality but frequently need to export content for review. Consider adjusting permissions to remove report creation and add export capabilities.')}
            </p>
            <div className="mt-3 flex justify-end">
              <Button variant="outline" size="sm" className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10">{t('admin.apply_recommendation', 'Apply Recommendation')}</Button>
            </div>
          </div>
          
          <div className="p-4 border border-green-500/20 rounded-lg bg-green-500/10">
            <h4 className="font-semibold text-green-300 mb-2">{t('admin.new_role_suggestion', 'New Role Suggestion: Content Creator')}</h4>
            <p className="text-green-200/80">
              {t('admin.content_creator_desc', 'We\'ve noticed a pattern where Marketing users need more granular content management permissions without user management access. A new "Content Creator" role could improve workflow efficiency.')}
            </p>
            <div className="mt-3 flex justify-end">
              <Button variant="outline" size="sm" className="border-green-500/30 text-green-300 hover:bg-green-500/10">{t('admin.create_suggested_role', 'Create Suggested Role')}</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIRecommendations;
