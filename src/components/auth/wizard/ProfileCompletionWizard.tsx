
import React, { useState } from 'react';
import { WizardLayout } from './WizardLayout';
import { Step1AboutYou } from './steps/Step1AboutYou';
import { Step2Lifestyle } from './steps/Step2Lifestyle';
import { Step3Values } from './steps/Step3Values';
import { Step4Relationships } from './steps/Step4Relationships';
import { Step5Career } from './steps/Step5Career';
import { Step6Interests } from './steps/Step6Interests';
import { Step7Favorites } from './steps/Step7Favorites';
import { Step8FinalTouches } from './steps/Step8FinalTouches';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { mapWizardDataToProfile } from '../utils/enhancedProfileDataMapper';

interface WizardData {
  // Step 1 - About You
  height?: string;
  ethnicity?: string;
  kurdistan_region?: string;
  languages?: string[];
  
  // Step 2 - Lifestyle
  exercise_habits?: string;
  have_pets?: string;
  drinking?: string;
  smoking?: string;
  dietary_preferences?: string;
  sleep_schedule?: string;
  
  // Step 3 - Values
  religion?: string;
  values?: string[];
  zodiac_sign?: string;
  personality_type?: string;
  
  // Step 4 - Relationships
  relationship_goals?: string;
  want_children?: string;
  children_status?: string;
  family_closeness?: string;
  love_language?: string[];
  
  // Step 5 - Career
  education?: string;
  occupation?: string;
  company?: string;
  
  // Step 6 - Interests
  interests?: string[];
  hobbies?: string[];
  creative_pursuits?: string[];
  weekend_activities?: string[];
  music_instruments?: string[];
  tech_skills?: string[];
  
  // Step 7 - Favorites
  favorite_books?: string[];
  favorite_movies?: string[];
  favorite_music?: string[];
  favorite_foods?: string[];
  favorite_games?: string[];
  favorite_podcasts?: string[];
  
  // Step 8 - Final Touches
  dream_vacation?: string;
  ideal_date?: string;
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
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [wizardData, setWizardData] = useState<WizardData>({});

  const totalSteps = 8;

  const updateStepData = (stepData: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...stepData }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "No user found. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Map wizard data to profile format
      const profileData = mapWizardDataToProfile(wizardData, user.id);
      
      console.log('Saving wizard data to profile:', profileData);

      // Update the user's profile with all wizard data
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);

      if (error) {
        console.error('Error saving wizard data:', error);
        toast({
          title: "Error",
          description: "Failed to save your profile. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Profile Completed!",
        description: "Your profile has been successfully updated.",
      });

      onComplete();
    } catch (error) {
      console.error('Error completing wizard:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1AboutYou
            data={wizardData}
            onChange={updateStepData}
          />
        );
      case 2:
        return (
          <Step2Lifestyle
            data={wizardData}
            onChange={updateStepData}
          />
        );
      case 3:
        return (
          <Step3Values
            data={wizardData}
            onChange={updateStepData}
          />
        );
      case 4:
        return (
          <Step4Relationships
            data={wizardData}
            onChange={updateStepData}
          />
        );
      case 5:
        return (
          <Step5Career
            data={wizardData}
            onChange={updateStepData}
          />
        );
      case 6:
        return (
          <Step6Interests
            data={wizardData}
            onChange={updateStepData}
          />
        );
      case 7:
        return (
          <Step7Favorites
            data={wizardData}
            onChange={updateStepData}
          />
        );
      case 8:
        return (
          <Step8FinalTouches
            data={wizardData}
            onChange={updateStepData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <WizardLayout
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={handleNext}
      onBack={handleBack}
      onSkip={onSkip}
      isLoading={isLoading}
      isLastStep={currentStep === totalSteps}
    >
      {renderStep()}
    </WizardLayout>
  );
};
