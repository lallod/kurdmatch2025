
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CircuitBoard } from 'lucide-react';
import ProfileNameSection from '../components/ProfileNameSection';
import ProfileDateOfBirthSection from '../components/ProfileDateOfBirthSection';
import ProfileLocationSection from '../components/ProfileLocationSection';
import ProfileOccupationSection from '../components/ProfileOccupationSection';
import ProfileOnlineStatusSection from '../components/ProfileOnlineStatusSection';
import ProfileAboutSection from '../components/ProfileAboutSection';
import ProfileAiAnalytics from '../components/ProfileAiAnalytics';

const BasicInfoTab = () => {
  return (
    <Card className="neo-card bg-white/80">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CircuitBoard size={20} className="mr-2 text-tinder-rose" />
          <span>Basic Information</span>
        </CardTitle>
        <CardDescription>Edit the basic profile information. AI will optimize for best matches.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProfileNameSection />
          <ProfileDateOfBirthSection />
          <ProfileLocationSection />
          <ProfileOccupationSection />
          <ProfileOnlineStatusSection />
        </div>
        <ProfileAboutSection />
        <ProfileAiAnalytics />
      </CardContent>
    </Card>
  );
};

export default BasicInfoTab;
