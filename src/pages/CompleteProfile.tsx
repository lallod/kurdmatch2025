import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { checkProfileCompleteness } from '@/utils/auth/profileUtils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRealProfileData } from '@/hooks/useRealProfileData';

export const CompleteProfile: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { profileData, loading } = useRealProfileData();
  const [isComplete, setIsComplete] = useState(false);
  const [checkingCompleteness, setCheckingCompleteness] = useState(true);

  // Check profile completeness
  useEffect(() => {
    const checkCompletion = async () => {
      if (!user) return;
      
      try {
        const complete = await checkProfileCompleteness(user.id);
        setIsComplete(complete);
      } catch (error) {
        console.error('Error checking profile completeness:', error);
      } finally {
        setCheckingCompleteness(false);
      }
    };

    if (user) {
      checkCompletion();
    }
  }, [user, profileData]);

  // Redirect if profile is complete
  if (isComplete && !checkingCompleteness) {
    return <Navigate to="/discovery" replace />;
  }

  if (loading || checkingCompleteness) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user || !profileData) {
    return <Navigate to="/register" replace />;
  }

  // Calculate completion percentage
  const calculateCompleteness = () => {
    let completed = 0;
    const total = 15;

    if (profileData.name && profileData.name !== '') completed++;
    if (profileData.bio && profileData.bio.length >= 20 && profileData.bio !== 'Tell us about yourself...') completed++;
    if (profileData.occupation && profileData.occupation !== 'Not specified') completed++;
    if (profileData.education && profileData.education !== 'Not specified') completed++;
    if (profileData.height && profileData.height !== '') completed++;
    if (profileData.body_type && profileData.body_type !== '') completed++;
    if (profileData.ethnicity && profileData.ethnicity !== '') completed++;
    if (profileData.religion && profileData.religion !== '') completed++;
    if (profileData.kurdistan_region && profileData.kurdistan_region !== '') completed++;
    if (profileData.relationship_goals && profileData.relationship_goals !== '') completed++;
    if (profileData.want_children && profileData.want_children !== '') completed++;
    if (profileData.exercise_habits && profileData.exercise_habits !== '') completed++;
    if (profileData.values && profileData.values.length >= 3) completed++;
    if (profileData.interests && profileData.interests.length >= 3) completed++;
    if (profileData.hobbies && profileData.hobbies.length >= 2) completed++;

    return Math.round((completed / total) * 100);
  };

  const completionPercent = calculateCompleteness();

  // Requirements checklist
  const requirements = [
    { label: 'Complete Bio (20+ characters)', met: profileData.bio && profileData.bio.length >= 20 && profileData.bio !== 'Tell us about yourself...' },
    { label: 'Occupation (not default)', met: profileData.occupation && profileData.occupation !== 'Not specified' },
    { label: 'Education (not default)', met: profileData.education && profileData.education !== 'Not specified' },
    { label: 'Height', met: profileData.height && profileData.height !== '' },
    { label: 'Body Type', met: profileData.body_type && profileData.body_type !== '' },
    { label: 'Ethnicity', met: profileData.ethnicity && profileData.ethnicity !== '' },
    { label: 'Religion', met: profileData.religion && profileData.religion !== '' },
    { label: 'Kurdistan Region', met: profileData.kurdistan_region && profileData.kurdistan_region !== '' },
    { label: 'Relationship Goals', met: profileData.relationship_goals && profileData.relationship_goals !== '' },
    { label: 'Children Preference', met: profileData.want_children && profileData.want_children !== '' },
    { label: 'Exercise Habits', met: profileData.exercise_habits && profileData.exercise_habits !== '' },
    { label: 'At least 3 Values', met: profileData.values && profileData.values.length >= 3 },
    { label: 'At least 3 Interests', met: profileData.interests && profileData.interests.length >= 3 },
    { label: 'At least 2 Hobbies', met: profileData.hobbies && profileData.hobbies.length >= 2 },
    { label: 'At least 1 Language', met: profileData.languages && profileData.languages.length >= 1 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <Card className="mb-6 border-0 bg-white/10 backdrop-blur-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <AlertCircle className="h-8 w-8 text-yellow-400" />
              <h1 className="text-3xl font-bold text-white">Complete Your Profile</h1>
            </div>
            <p className="text-white/80 text-lg">
              Your profile needs to be 100% complete to start finding matches
            </p>
            
            {/* Progress Bar */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm text-white/60">
                <span>Profile Completion</span>
                <span>{completionPercent}%</span>
              </div>
              <Progress value={completionPercent} className="h-3" />
            </div>
          </CardHeader>
        </Card>

        {/* Alert */}
        <Alert className="mb-6 border-yellow-400/20 bg-yellow-400/10">
          <AlertCircle className="h-4 w-4 text-yellow-400" />
          <AlertDescription className="text-yellow-100">
            <strong>Profile Incomplete:</strong> Please complete all requirements below to access the app.
          </AlertDescription>
        </Alert>

        {/* Requirements Checklist */}
        <Card className="mb-6 border-0 bg-white/10 backdrop-blur-md">
          <CardHeader>
            <h2 className="text-xl font-semibold text-white">Profile Requirements</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {requirements.map((req, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  {req.met ? (
                    <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                  )}
                  <span className={`text-sm ${req.met ? 'text-green-100' : 'text-yellow-100'}`}>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="border-0 bg-white/10 backdrop-blur-md">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold text-white mb-4">How to Complete Your Profile</h3>
            <p className="text-white/80 mb-4">
              Go to your <strong>My Profile</strong> page to fill out the missing information. 
              Once all requirements are met, you'll automatically be able to access the app.
            </p>
            <a 
              href="/my-profile" 
              className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors"
            >
              Complete Profile
            </a>
          </CardContent>
        </Card>

        {/* Completion Status */}
        {completionPercent === 100 && (
          <Alert className="mt-6 border-green-400/20 bg-green-400/10">
            <CheckCircle2 className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-100">
              <strong>Profile Complete!</strong> Redirecting to the app...
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};