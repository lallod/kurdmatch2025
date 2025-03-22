
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AIRecommendations: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Role Recommendations</CardTitle>
        <CardDescription>Suggested role configurations based on usage patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-blue-50">
            <h4 className="font-semibold text-blue-800 mb-2">Moderator Role Optimization</h4>
            <p className="text-blue-700">
              Moderators are rarely using the report creation functionality but frequently need 
              to export content for review. Consider adjusting permissions to remove report 
              creation and add export capabilities.
            </p>
            <div className="mt-3 flex justify-end">
              <Button variant="outline" size="sm">Apply Recommendation</Button>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg bg-green-50">
            <h4 className="font-semibold text-green-800 mb-2">New Role Suggestion: Content Creator</h4>
            <p className="text-green-700">
              We've noticed a pattern where Marketing users need more granular content management 
              permissions without user management access. A new "Content Creator" role could 
              improve workflow efficiency.
            </p>
            <div className="mt-3 flex justify-end">
              <Button variant="outline" size="sm">Create Suggested Role</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIRecommendations;
