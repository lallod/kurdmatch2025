
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';

export const useStepCategories = (enabledQuestions: QuestionItem[]) => {
  const stepCategories = [
    { name: 'Account', category: 'Account' },
    { name: 'Personal', category: 'Basics' },
    { name: 'Lifestyle', category: 'Lifestyle' },
    { name: 'Beliefs', category: 'Beliefs' },
    { name: 'Physical', category: 'Physical' },
    { name: 'Preferences', category: 'Preferences' },
    { name: 'Photos', category: 'Photos' }
  ];
  
  const steps = stepCategories.map(step => {
    // The photo step is special, it doesn't contain questions but a special component.
    // It should contain the photo question for validation purposes.
    if (step.name === 'Photos') {
      const photoQuestion = enabledQuestions.find(q => q.profileField === 'photos');
      return {
        name: step.name,
        questions: photoQuestion ? [photoQuestion] : []
      };
    }
    
    return {
      name: step.name,
      questions: enabledQuestions.filter(q => {
        // Bio is auto-generated and should not appear in any step
        if (q.profileField === 'bio') {
          return false;
        }

        if (step.name === 'Account') {
          return q.registrationStep === 'Account';
        }
        if (step.name === 'Personal') {
          return q.registrationStep === 'Personal';
        }
        // For other steps, match registrationStep with step name
        return q.registrationStep === step.name;
      })
    };
  }).filter(step => step.questions.length > 0 || step.name === 'Photos');

  console.log('Generated steps:', steps);
  return steps;
};
