
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';
import { TablesInsert } from '@/integrations/supabase/types';
import { sanitizeText, sanitizeHtml } from '@/utils/security/inputValidation';

export const mapFormDataToProfile = (
  processedData: Record<string, any>,
  userId: string,
  enabledQuestions: QuestionItem[]
): Partial<TablesInsert<'profiles'>> => {
  const profileInsertData: Partial<TablesInsert<'profiles'>> = {
    id: userId,
  };

  // Map form data to profile fields
  enabledQuestions.forEach(q => {
    if (q.profileField && q.profileField !== 'email' && q.profileField !== 'password' && q.profileField !== 'photos') {
      const formValue = processedData[q.id];
      if (formValue !== undefined && formValue !== null && formValue !== '') {
        if (q.profileField === 'full_name') {
          profileInsertData.name = sanitizeText(String(formValue));
        } else if (q.profileField === 'bio') {
          // Allow basic HTML formatting in bio but sanitize it
          profileInsertData.bio = sanitizeHtml(String(formValue));
        } else if (q.profileField === 'date_of_birth' && typeof formValue === 'string' && formValue) {
          // Calculate age from date of birth
          const birthDate = new Date(formValue);
          if (!isNaN(birthDate.getTime())) {
            const ageDifMs = Date.now() - birthDate.getTime();
            const ageDate = new Date(ageDifMs);
            const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
            // Validate age range
            if (calculatedAge >= 18 && calculatedAge <= 120) {
              profileInsertData.age = calculatedAge;
            }
          }
        } else if (q.fieldType === 'multi-select' && Array.isArray(formValue)) {
          // Handle array fields with sanitization
          const sanitizedArray = formValue.map(item => sanitizeText(String(item)));
          (profileInsertData as any)[q.profileField] = sanitizedArray.length > 0 ? sanitizedArray : null;
        } else if (typeof formValue === 'string') {
          // Handle single value fields with sanitization
          (profileInsertData as any)[q.profileField] = sanitizeText(formValue);
        } else if (typeof formValue === 'number' || typeof formValue === 'boolean') {
          // Handle number and boolean fields without sanitization
          (profileInsertData as any)[q.profileField] = formValue;
        }
      }
    }
  });
  
  // Ensure required fields have sanitized values
  if (!profileInsertData.name) {
    profileInsertData.name = "New User";
  }
  if (profileInsertData.age === undefined || profileInsertData.age === null) {
    profileInsertData.age = 18;
  }
  if (!profileInsertData.location) {
    profileInsertData.location = "Not specified";
  }
  
  return profileInsertData;
};
