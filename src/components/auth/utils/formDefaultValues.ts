
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';

export const getFormDefaultValues = (enabledQuestions: QuestionItem[]) => {
  const defaults: Record<string, any> = {};
  
  // Always set photos as an empty array
  defaults['sys_6'] = [];
  defaults['photos'] = [];
  
  enabledQuestions.forEach(q => {
    console.log(`Setting default for question ${q.id}: fieldType=${q.fieldType}, profileField=${q.profileField}`);
    
    if (q.profileField !== 'bio') {
      if (q.fieldType === 'multi-select') {
        defaults[q.id] = [];
      } else if (q.fieldType === 'checkbox') {
        defaults[q.id] = 'false';
      } else if (q.profileField === 'photos') {
        defaults[q.id] = [];
      } else {
        defaults[q.id] = '';
      }
    }
  });
  
  console.log('Form default values:', defaults);
  return defaults;
};
