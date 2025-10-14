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
      questions: questions.filter(q => 
        q.registrationStep === 'Account' || 
        q.profileField === 'email' || 
        q.profileField === 'password' ||
        q.id === 'email' ||
        q.id === 'password'
      ),
      step: 1
    },
    {
      name: 'Basic Info',
      title: 'Basic Information',
      description: 'Tell us about yourself',
      icon: User,
      questions: questions.filter(q => 
        q.registrationStep === 'Personal' ||
        q.profileField === 'name' ||
        q.profileField === 'age' ||
        q.profileField === 'gender' ||
        q.id === 'full_name' ||
        q.id === 'age' ||
        q.id === 'gender'
      ),
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
        q.profileField === 'personality_type' ||
        q.profileField === 'location' ||
        q.profileField === 'height' ||
        q.profileField === 'body_type' ||
        q.profileField === 'kurdistan_region' ||
        q.profileField === 'dream_vacation' ||
        q.id === 'location' ||
        q.id === 'height' ||
        q.id === 'body_type' ||
        q.id === 'kurdistan_region' ||
        q.id === 'ethnicity' ||
        q.id === 'religion' ||
        q.id === 'political_views' ||
        q.id === 'personality_type' ||
        q.id === 'dreamVacation'
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
        q.profileField === 'ideal_date' ||
        q.profileField === 'relationship_goals' ||
        q.profileField === 'want_children' ||
        q.profileField === 'exercise_habits' ||
        q.id === 'dietary_preferences' ||
        q.id === 'smoking' ||
        q.id === 'drinking' ||
        q.id === 'sleep_schedule' ||
        q.id === 'have_pets' ||
        q.id === 'family_closeness' ||
        q.id === 'love_language' ||
        q.id === 'communication_style' ||
        q.id === 'ideal_date' ||
        q.id === 'relationship_goals' ||
        q.id === 'want_children' ||
        q.id === 'exercise_habits'
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
        q.profileField === 'education' ||
        q.profileField === 'languages' ||
        q.id === 'occupation' ||
        q.id === 'education' ||
        q.id === 'languages'
      ),
      step: 6
    },
    {
      name: 'Photos',
      title: 'Add Photos',
      description: 'Show your best self',
      icon: Camera,
      questions: questions.filter(q => q.profileField === 'photos' || q.id === 'photos' || q.id === 'sys_6'),
      step: 7
    }
  ];

  // Remove duplicate questions across categories (keep in first occurrence)
  const assignedQuestionIds = new Set<string>();
  categories.forEach(category => {
    category.questions = category.questions.filter(q => {
      if (assignedQuestionIds.has(q.id)) {
        return false;
      }
      assignedQuestionIds.add(q.id);
      return true;
    });
  });

  // Filter out categories with no questions (but always keep Account and Photos)
  return categories.filter(category => 
    category.questions.length > 0 || 
    category.name === 'Photos' ||
    category.name === 'Account'
  );
};

// Validation helper to check if a step is complete
export const isStepComplete = (
  stepQuestions: QuestionItem[], 
  formValues: Record<string, any>
): boolean => {
  // Filter out only required questions for validation
  const requiredQuestions = stepQuestions.filter(q => q.required);
  
  return requiredQuestions.every(question => {
    const value = formValues[question.id];
    
    // Multi-select fields with specific minimum requirements (check both formats)
    const isMultiSelect = question.fieldType === 'multi-select' || 
                          (question.fieldType as string) === 'multi_select';
    
    if (isMultiSelect) {
      let minSelections = 1;
      if (question.id === 'interests') minSelections = 3;
      else if (question.id === 'hobbies') minSelections = 2;
      else if (question.id === 'values') minSelections = 3;
      else if (question.id === 'languages') minSelections = 1;
      
      return Array.isArray(value) && value.length >= minSelections;
    }
    
    // Checkbox fields
    if (question.fieldType === 'checkbox') {
      return value === true;
    }
    
    // Age validation
    if (question.id === 'age') {
      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      return numValue >= 18;
    }
    
    // Standard text/select fields
    return value !== undefined && value !== null && value.toString().trim().length > 0;
  });
};

// Get step completion status
export const getStepCompletionStatus = (
  categories: StepCategory[],
  formValues: Record<string, any>
): Record<number, boolean> => {
  const completionStatus: Record<number, boolean> = {};
  
  console.log('🔍 Checking step completion for all steps');
  
  categories.forEach(category => {
    console.log(`\n📋 Step ${category.step} (${category.name}):`, {
      totalQuestions: category.questions.length,
      questionIds: category.questions.map(q => q.id),
      requiredQuestions: category.questions.filter(q => q.required).map(q => q.id)
    });
    // Special handling for account step (step 1)
    if (category.step === 1) {
      const hasEmail = formValues.email && formValues.email.trim().length > 0;
      const hasPassword = formValues.password && formValues.password.length >= 8;
      const passwordsMatch = formValues.password === formValues.confirmPassword;
      completionStatus[category.step] = hasEmail && hasPassword && passwordsMatch;
      console.log(`✅ Account step complete: ${completionStatus[category.step]}`);
    }
    // Special handling for photos step
    else if (category.name === 'Photos') {
      completionStatus[category.step] = Array.isArray(formValues.photos) && formValues.photos.length > 0;
      console.log(`✅ Photos step complete: ${completionStatus[category.step]}`);
    }
    // Regular question validation
    else {
      const isComplete = isStepComplete(category.questions, formValues);
      completionStatus[category.step] = isComplete;
      console.log(`✅ ${category.name} complete: ${isComplete}`);
      
      // Log each field value for debugging
      category.questions.filter(q => q.required).forEach(q => {
        console.log(`  - ${q.id}: ${formValues[q.id] ? '✓ filled' : '✗ empty'} (value: ${JSON.stringify(formValues[q.id])})`);
      });
    }
  });
  
  return completionStatus;
};