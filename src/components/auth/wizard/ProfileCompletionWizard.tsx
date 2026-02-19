
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
import { useTranslations } from '@/hooks/useTranslations';

interface WizardData {
  // Step 1 - Updated structure
  height?: string;
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
  // Step 3 - Removed political_views
  religion?: string;
  values?: string[];
  zodiac_sign?: string;
  personality_type?: string;
  // Step 4
  relationship_goals?: string;
  want_children?: string;
  children_status?: string;
  family_closeness?: string;
  love_language?: string[];
  // Step 5 - Removed career_ambitions and work_life_balance
  education?: string;
  occupation?: string;
  company?: string;
  // Step 6
  interests?: string[];
  hobbies?: string[];
  creative_pursuits?: string[];
  weekend_activities?: string[];
  music_instruments?: string[];
  tech_skills?: string[];
  // Step 7
  favorite_books?: string[];
  favorite_movies?: string[];
  favorite_music?: string[];
  favorite_foods?: string[];
  favorite_games?: string[];
  favorite_podcasts?: string[];
  // Step 8 - Removed favorite_quote
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
  const { t } = useTranslations();
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState<WizardData>({});
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    {
      title: "About You",
      component: Step1AboutYou,
      validate: (data: WizardData) => {
        return !!(data.height || data.ethnicity || data.kurdistan_region || (data.languages && data.languages.length > 0));
      }
    },
    {
      title: t('wizard.your_lifestyle', 'Your Lifestyle'), 
      component: Step2Lifestyle,
      validate: (data: WizardData) => {
        return !!(data.exercise_habits || data.have_pets || data.drinking || data.smoking || data.dietary_preferences || data.sleep_schedule);
      }
    },
    {
      title: t('wizard.values_beliefs', 'Values & Beliefs'),
      component: Step3Values,
      validate: (data: WizardData) => {
        return !!(data.religion || (data.values && data.values.length > 0) || data.zodiac_sign || data.personality_type);
      }
    },
    {
      title: t('wizard.relationships_family', 'Relationships & Family'),
      component: Step4Relationships,
      validate: (data: WizardData) => {
        return !!(data.relationship_goals || data.want_children || data.children_status || data.family_closeness || (data.love_language && data.love_language.length > 0));
      }
    },
    {
      title: t('wizard.career_education', 'Career & Education'),
      component: Step5Career,
      validate: (data: WizardData) => {
        return !!(data.education || data.occupation || data.company);
      }
    },
    {
      title: t('wizard.interests_hobbies', 'Interests & Hobbies'),
      component: Step6Interests,
      validate: (data: WizardData) => {
        return !!(
          (data.interests && data.interests.length > 0) ||
          (data.hobbies && data.hobbies.length > 0) ||
          (data.creative_pursuits && data.creative_pursuits.length > 0) ||
          (data.weekend_activities && data.weekend_activities.length > 0) ||
          (data.music_instruments && data.music_instruments.length > 0) ||
          (data.tech_skills && data.tech_skills.length > 0)
        );
      }
    },
    {
      title: t('wizard.your_favorites', 'Your Favorites'),
      component: Step7Favorites,
      validate: (data: WizardData) => {
        return !!(
          (data.favorite_books && data.favorite_books.length > 0) ||
          (data.favorite_movies && data.favorite_movies.length > 0) ||
          (data.favorite_music && data.favorite_music.length > 0) ||
          (data.favorite_foods && data.favorite_foods.length > 0) ||
          (data.favorite_games && data.favorite_games.length > 0) ||
          (data.favorite_podcasts && data.favorite_podcasts.length > 0)
        );
      }
    },
    {
      title: t('wizard.final_touches', 'Final Touches'),
      component: Step8FinalTouches,
      validate: (data: WizardData) => {
        return !!(data.dream_vacation || data.ideal_date);
      }
    }
  ];

  const canProceed = steps[currentStep]?.validate(wizardData) || false;

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
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
      // Convert love_language array to string if it exists and remove updated_at
      const updateData = {
        ...wizardData,
        love_language: wizardData.love_language ? wizardData.love_language.join(', ') : undefined
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: t('wizard.profile_completed', 'Profile completed! 🎉'),
        description: t('wizard.profile_completed_desc', "You're all set to start discovering amazing people!"),
      });

      onComplete();
    } catch (error) {
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
