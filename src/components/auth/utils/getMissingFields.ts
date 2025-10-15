import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';
import { getFieldLabel, getFieldRequirement } from './fieldLabels';

export interface MissingFieldInfo {
  id: string;
  label: string;
  reason: string;
}

// Get list of missing required fields for a step
export const getMissingFields = (
  stepQuestions: QuestionItem[],
  formValues: Record<string, any>
): MissingFieldInfo[] => {
  const missingFields: MissingFieldInfo[] = [];

  stepQuestions.forEach((question) => {
    const { id, fieldType, required } = question;
    const value = formValues[id];

    // Skip zodiac_sign as it's auto-calculated
    if (id === 'zodiac_sign') return;

    // Check if field is incomplete
    let isIncomplete = false;
    let reason = '';

    if (required) {
      // Multi-select validation
      if (fieldType === 'multi-select' || fieldType === 'multi_select') {
        // Determine minimum required based on field ID
        let minRequired = 1;
        if (id === 'interests') minRequired = 3;
        else if (id === 'hobbies') minRequired = 2;
        else if (id === 'values') minRequired = 3;
        else if (id === 'languages') minRequired = 1;
        
        const arrayValue = Array.isArray(value) ? value : [];
        if (arrayValue.length < minRequired) {
          isIncomplete = true;
          reason = getFieldRequirement(question);
        }
      }
      // Checkbox validation
      else if (fieldType === 'checkbox') {
        if (value !== true) {
          isIncomplete = true;
          reason = getFieldRequirement(question);
        }
      }
      // Age validation
      else if (id === 'age') {
        const age = parseInt(value);
        if (isNaN(age) || age < 18) {
          isIncomplete = true;
          reason = getFieldRequirement(question);
        }
      }
      // Date of birth validation (calculate age)
      else if (id === 'date_of_birth') {
        if (!value) {
          isIncomplete = true;
          reason = 'Please enter your date of birth';
        } else {
          const birthDate = new Date(value);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          if (age < 18) {
            isIncomplete = true;
            reason = 'Must be 18 or older';
          }
        }
      }
      // Standard field validation (text, select, etc.)
      else {
        // Handle both string and array values (some fields might be stored as arrays)
        let hasValue = false;
        
        if (Array.isArray(value)) {
          hasValue = value.length > 0 && value.some(v => v && v.toString().trim() !== '');
        } else if (typeof value === 'string') {
          hasValue = value.trim() !== '';
        } else {
          hasValue = value !== null && value !== undefined;
        }
        
        if (!hasValue) {
          isIncomplete = true;
          reason = getFieldRequirement(question);
        }
      }
    }

    if (isIncomplete) {
      missingFields.push({
        id,
        label: getFieldLabel(id),
        reason,
      });
    }
  });

  return missingFields;
};
