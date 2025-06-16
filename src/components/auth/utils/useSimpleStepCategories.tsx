
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';

export const useSimpleStepCategories = (enabledQuestions: QuestionItem[]) => {
  const stepCategories = [
    { name: 'Account', category: 'Account' },
    { name: 'Personal', category: 'Basics' },
    { name: 'Location', category: 'Location' },
    { name: 'Photos', category: 'Photos' }
  ];
  
  const steps = stepCategories.map(step => {
    // The photo step is special, it doesn't contain questions but a special component.
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
          return ['email', 'password'].includes(q.profileField || '');
        }
        if (step.name === 'Personal') {
          return ['first_name', 'last_name', 'date_of_birth', 'gender'].includes(q.profileField || '');
        }
        if (step.name === 'Location') {
          return ['location', 'about_me'].includes(q.profileField || '');
        }
        
        return false;
      })
    };
  }).filter(step => step.questions.length > 0 || step.name === 'Photos');

  console.log('Generated simplified steps:', steps);
  return steps;
};
