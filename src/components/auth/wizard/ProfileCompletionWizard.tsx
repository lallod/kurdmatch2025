
import React, { useState } from 'react';
import { WizardLayout } from './WizardLayout';
import { Step1AboutYou } from './steps/Step1AboutYou';
import { Step2Lifestyle } from './steps/Step2Lifestyle';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

interface WizardData {
  // Step 1
  height?: string;
  body_type?: string;
  ethnicity?: string;
  kurdistan_region?: string;
  languages?: string[];
  // Step 2
  exercise_habits?: string;
  have_pets?: string;
  drinking?: string;
  smoking?: string;
  dietary_preferences?: string;
  sleep_schedule?: string;
}

interface ProfileCompletionWizardProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const ProfileCompletionWizard: React.FC<ProfileCompletionWizardProps> = ({
  onComplete,
  onSkip
}) => {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState<WizardData>({});
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    {
      title: "About You",
      component: Step1AboutYou,
      validate: (data: WizardData) => {
        // At least one field should be filled
        return !!(data.height || data.body_type || data.ethnicity || data.kurdistan_region || (data.languages && data.languages.length > 0));
      }
    },
    {
      title: "Your Lifestyle", 
      component: Step2Lifestyle,
      validate: (data: WizardData) => {
        // At least one field should be filled
        return !!(data.exercise_habits || data.have_pets || data.drinking || data.smoking || data.dietary_preferences || data.sleep_schedule);
      }
    }
  ];

  const canProceed = steps[currentStep]?.validate(wizardData) || false;

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
      // Complete the wizard
      await handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleComplete = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Update profile with wizard data
      const { error } = await supabase
        .from('profiles')
        .update({
          ...wizardData,
          profile_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile completed! 🎉",
        description: "You're all set to start discovering amazing people!",
      });

      onComplete();
    } catch (error) {
      console.error('Error completing profile:', error);
      toast({
        title: "Error",
        description: "Failed to save your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const CurrentStepComponent = steps[currentStep]?.component;

  if (!CurrentStepComponent) {
    return null;
  }

  return (
    <WizardLayout
      currentStep={currentStep}
      totalSteps={steps.length}
      stepTitle={steps[currentStep].title}
      onNext={handleNext}
      onBack={handleBack}
      onSkip={onSkip}
      canProceed={canProceed}
      isLoading={isLoading}
    >
      <CurrentStepComponent
        data={wizardData}
        onChange={setWizardData}
      />
    </WizardLayout>
  );
};
