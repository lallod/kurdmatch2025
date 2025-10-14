
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';

export const getFormDefaultValues = (enabledQuestions: QuestionItem[]) => {
  const defaults: Record<string, any> = {};
  
  // Always set photos as an empty array
  defaults['sys_6'] = [];
  defaults['photos'] = [];
  
  enabledQuestions.forEach(q => {
    if (q.profileField !== 'bio') {
      // Fix: Handle multi-select field type (also handle database format)
      const fieldTypeLower = q.fieldType.toLowerCase().replace('_', '-');
      if (fieldTypeLower === 'multi-select' || q.fieldType === 'multi_select') {
        defaults[q.id] = [];  // ✅ Array for multi-select fields
      } else if (q.fieldType === 'checkbox') {
        defaults[q.id] = false;  // ✅ Boolean for checkbox
      } else if (q.profileField === 'photos') {
        defaults[q.id] = [];  // ✅ Array for photos
      } else {
        defaults[q.id] = '';  // String for all other fields
      }
    }
  });
  
  return defaults;
};
