
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
    <Card className="bg-[#141414] border-white/5">
      <CardHeader>
        <CardTitle className="text-white">AI Role Recommendations</CardTitle>
        <CardDescription className="text-white/60">Suggested role configurations based on usage patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 border border-blue-500/20 rounded-lg bg-blue-500/10">
            <h4 className="font-semibold text-blue-300 mb-2">Moderator Role Optimization</h4>
            <p className="text-blue-200/80">
              Moderators are rarely using the report creation functionality but frequently need 
              to export content for review. Consider adjusting permissions to remove report 
              creation and add export capabilities.
            </p>
            <div className="mt-3 flex justify-end">
              <Button variant="outline" size="sm" className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10">Apply Recommendation</Button>
            </div>
          </div>
          
          <div className="p-4 border border-green-500/20 rounded-lg bg-green-500/10">
            <h4 className="font-semibold text-green-300 mb-2">New Role Suggestion: Content Creator</h4>
            <p className="text-green-200/80">
              We've noticed a pattern where Marketing users need more granular content management 
              permissions without user management access. A new "Content Creator" role could 
              improve workflow efficiency.
            </p>
            <div className="mt-3 flex justify-end">
              <Button variant="outline" size="sm" className="border-green-500/30 text-green-300 hover:bg-green-500/10">Create Suggested Role</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIRecommendations;
