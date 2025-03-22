
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';

export const useStepCategories = (enabledQuestions: QuestionItem[]) => {
  const stepCategories = [
    { name: 'Account', category: 'Account' },
    { name: 'Basics', category: 'Basics' },
    { name: 'Lifestyle', category: 'Lifestyle' },
    { name: 'Beliefs', category: 'Beliefs' },
    { name: 'Physical', category: 'Physical' },
    { name: 'Preferences', category: 'Preferences' },
    { name: 'Photos', category: 'Photos' }
  ];
  
  const steps = stepCategories.map(step => {
    if (step.category === 'Photos') {
      return {
        name: step.name,
        questions: []
      };
    }
    
    return {
      name: step.name,
      questions: enabledQuestions.filter(q => {
        if (step.category === 'Account') {
          return q.registrationStep === 'Account';
        } else if (step.category === 'Basics') {
          return q.category === step.name || q.registrationStep === 'Personal';
        } else if (step.category === 'Lifestyle' || step.category === 'Physical' || step.category === 'Beliefs' || step.category === 'Preferences') {
          return q.category === step.name && (q.registrationStep === 'Profile' || q.registrationStep === 'Preferences');
        }
        return q.category === step.name;
      })
    };
  }).filter(step => step.questions.length > 0 || step.name === 'Photos');

  return steps;
};
