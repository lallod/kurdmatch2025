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
    if (step.category === 'Photos') {
      return {
        name: step.name,
        questions: []
      };
    }
    
    return {
      name: step.name,
      questions: enabledQuestions.filter(q => {
        // Account step - email, password fields
        if (step.category === 'Account') {
          return q.registrationStep === 'Account' || 
                 q.profileField === 'email' || 
                 q.profileField === 'password' ||
                 q.id === 'sys_1' || 
                 q.id === 'sys_2';
        }
        // Personal/Basics step - name, age, location, occupation
        else if (step.category === 'Basics') {
          return q.registrationStep === 'Personal' || 
                 q.category === 'Basics' ||
                 ['firstName', 'lastName', 'dateOfBirth', 'location', 'occupation'].includes(q.profileField) ||
                 q.id === 'sys_3' || 
                 q.id === 'sys_4';
        }
        // Other steps match by category
        else {
          return q.category === step.name || q.registrationStep === step.name;
        }
      })
    };
  }).filter(step => step.questions.length > 0 || step.name === 'Photos');

  console.log('Generated steps:', steps);
  return steps;
};
