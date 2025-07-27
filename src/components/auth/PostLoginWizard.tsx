
import React, { useState, useEffect } from 'react';
import { WelcomeModal } from './wizard/WelcomeModal';
import { ProfileCompletionWizard } from './wizard/ProfileCompletionWizard';
import { CompletionCelebration } from './wizard/CompletionCelebration';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { checkProfileCompleteness } from '@/utils/auth/profileUtils';

interface PostLoginWizardProps {
  onComplete: () => void;
}

export const PostLoginWizard: React.FC<PostLoginWizardProps> = ({ onComplete }) => {
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (!user) return;

      try {
        // Get user name for welcome modal
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', user.id)
          .single();

        setUserName(profile?.name || '');
        
        // Use the improved profile completeness check
        const isProfileComplete = await checkProfileCompleteness(user.id);
        setProfileCompleted(isProfileComplete);

        // Show welcome modal only if profile is not completed
        if (!isProfileComplete) {
          setShowWelcome(true);
        } else {
          onComplete();
        }
      } catch (error) {
        console.error('Error checking profile completion:', error);
      }
    };

    checkProfileCompletion();
  }, [user, onComplete]);

  const handleStartWizard = () => {
    setShowWelcome(false);
    setShowWizard(true);
  };

  const handleWizardComplete = () => {
    setShowWizard(false);
    setShowCelebration(true);
  };

  const handleSkipWizard = () => {
    setShowWelcome(false);
    setShowWizard(false);
    onComplete();
  };

  const handleStartDiscovering = () => {
    setShowCelebration(false);
    onComplete();
    navigate('/discovery');
  };

  // Don't render anything if profile is already completed
  if (profileCompleted) {
    return null;
  }

  return (
    <>
      <WelcomeModal
        isOpen={showWelcome}
        onClose={handleSkipWizard}
        onStartWizard={handleStartWizard}
        userName={userName}
        currentProgress={15}
      />

      {showWizard && (
        <ProfileCompletionWizard
          onComplete={handleWizardComplete}
          onSkip={handleSkipWizard}
        />
      )}

      {showCelebration && (
        <CompletionCelebration
          onStartDiscovering={handleStartDiscovering}
          userName={userName}
        />
      )}
    </>
  );
};
