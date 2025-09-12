import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';
import { Mail, User, MapPin, Heart, Coffee, Briefcase, Camera } from 'lucide-react';

export interface StepCategory {
  name: string;
  title: string;
  description: string;
  icon: any;
  questions: QuestionItem[];
  step: number;
}

export const createEnhancedStepCategories = (questions: QuestionItem[]): StepCategory[] => {
  const categories: StepCategory[] = [
    {
      name: 'Account',
      title: 'Create Account',
      description: 'Set up your secure login credentials',
      icon: Mail,
      questions: questions.filter(q => q.registrationStep === 'Account'),
      step: 1
    },
    {
      name: 'Basic Info',
      title: 'Basic Information',
      description: 'Tell us about yourself',
      icon: User,
      questions: questions.filter(q => q.registrationStep === 'Personal'),
      step: 2
    },
    {
      name: 'Cultural Identity',
      title: 'Cultural Identity',
      description: 'Your heritage and background',
      icon: MapPin,
      questions: questions.filter(q => 
        q.registrationStep === 'Physical' || 
        q.profileField === 'ethnicity' || 
        q.profileField === 'religion' ||
        q.profileField === 'political_views' ||
        q.profileField === 'zodiac_sign' ||
        q.profileField === 'personality_type'
      ),
      step: 3
    },
    {
      name: 'Interests & Values',
      title: 'Interests & Values',
      description: 'What matters to you most',
      icon: Heart,
      questions: questions.filter(q => 
        q.id === 'interests' || 
        q.id === 'hobbies' || 
        q.id === 'values' ||
        q.profileField === 'interests' ||
        q.profileField === 'hobbies' ||
        q.profileField === 'values'
      ),
      step: 4
    },
    {
      name: 'Lifestyle',
      title: 'Lifestyle & Habits',
      description: 'Your daily life and preferences',
      icon: Coffee,
      questions: questions.filter(q => 
        q.registrationStep === 'Lifestyle' ||
        q.profileField === 'dietary_preferences' ||
        q.profileField === 'smoking' ||
        q.profileField === 'drinking' ||
        q.profileField === 'sleep_schedule' ||
        q.profileField === 'have_pets' ||
        q.profileField === 'family_closeness' ||
        q.profileField === 'love_language' ||
        q.profileField === 'communication_style' ||
        q.profileField === 'ideal_date'
      ),
      step: 5
    },
    {
      name: 'Career',
      title: 'Career & Education',
      description: 'Professional background',
      icon: Briefcase,
      questions: questions.filter(q => 
        q.registrationStep === 'Profile' ||
        q.profileField === 'occupation' ||
        q.profileField === 'education'
      ),
      step: 6
    },
    {
      name: 'Photos',
      title: 'Add Photos',
      description: 'Show your best self',
      icon: Camera,
      questions: questions.filter(q => q.profileField === 'photos'),
      step: 7
    }
  ];

  // Filter out categories with no questions
  return categories.filter(category => category.questions.length > 0 || category.name === 'Photos');
};

// Validation helper to check if a step is complete
export const isStepComplete = (
  stepQuestions: QuestionItem[], 
  formValues: Record<string, any>
): boolean => {
  return stepQuestions.every(question => {
    if (!question.required) return true;

    const value = formValues[question.id];
    
    if (question.fieldType === 'multi-select') {
      let minSelections = 1;
      if (question.id === 'interests') minSelections = 3;
      else if (question.id === 'hobbies') minSelections = 2;
      else if (question.id === 'values') minSelections = 3;
      else if (question.id === 'languages') minSelections = 1;
      
      return Array.isArray(value) && value.length >= minSelections;
    }
    
    if (question.fieldType === 'checkbox') {
      return value === true;
    }
    
    if (question.id === 'age') {
      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      return numValue >= 18;
    }
    
    return value && value.toString().trim().length > 0;
  });
};

// Get step completion status
export const getStepCompletionStatus = (
  categories: StepCategory[],
  formValues: Record<string, any>
): Record<number, boolean> => {
  const completionStatus: Record<number, boolean> = {};
  
  categories.forEach(category => {
    // Special handling for account step (step 1)
    if (category.step === 1) {
      const hasEmail = formValues.email && formValues.email.trim().length > 0;
      const hasPassword = formValues.password && formValues.password.length >= 8;
      const passwordsMatch = formValues.password === formValues.confirmPassword;
      completionStatus[category.step] = hasEmail && hasPassword && passwordsMatch;
    }
    // Special handling for photos step
    else if (category.name === 'Photos') {
      completionStatus[category.step] = Array.isArray(formValues.photos) && formValues.photos.length > 0;
    }
    // Regular question validation
    else {
      completionStatus[category.step] = isStepComplete(category.questions, formValues);
    }
  });
  
  return completionStatus;
};