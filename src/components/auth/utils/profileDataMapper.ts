
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

  // Map form data to profile fields - only save actual user input
  enabledQuestions.forEach(q => {
    if (q.profileField && q.profileField !== 'email' && q.profileField !== 'password' && q.profileField !== 'photos') {
      const formValue = processedData[q.id];
      
      // Skip empty values - don't save placeholders
      if (formValue === undefined || formValue === null || formValue === '' || 
          (Array.isArray(formValue) && formValue.length === 0)) {
        return;
      }

      // Map based on profile field name
      if (q.profileField === 'name') {
        profileInsertData.name = sanitizeText(String(formValue));
      } else if (q.profileField === 'age') {
        // Handle direct age input
        const numAge = Number(formValue);
        if (!isNaN(numAge) && numAge >= 18 && numAge <= 120) {
          profileInsertData.age = numAge;
        }
      } else if (q.profileField === 'date_of_birth' && typeof formValue === 'string') {
        // Calculate age from date of birth
        const birthDate = new Date(formValue);
        if (!isNaN(birthDate.getTime())) {
          const ageDifMs = Date.now() - birthDate.getTime();
          const ageDate = new Date(ageDifMs);
          const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
          if (calculatedAge >= 18 && calculatedAge <= 120) {
            profileInsertData.age = calculatedAge;
          }
        }
      } else if (q.profileField === 'bio') {
        // Allow basic HTML formatting in bio but sanitize it
        profileInsertData.bio = sanitizeHtml(String(formValue));
      } else if (q.fieldType === 'multi-select' || q.fieldType === 'multi_select') {
        // Handle array fields with sanitization
        if (Array.isArray(formValue) && formValue.length > 0) {
          const sanitizedArray = formValue.map(item => sanitizeText(String(item)));
          (profileInsertData as any)[q.profileField] = sanitizedArray;
        }
      } else if (typeof formValue === 'string') {
        // Handle single value fields with sanitization
        (profileInsertData as any)[q.profileField] = sanitizeText(formValue);
      } else if (typeof formValue === 'number' || typeof formValue === 'boolean') {
        // Handle number and boolean fields without sanitization
        (profileInsertData as any)[q.profileField] = formValue;
      }
    }
  });
  
  // Only set minimum required defaults if truly missing
  if (!profileInsertData.name) {
    profileInsertData.name = "User";
  }
  if (!profileInsertData.age) {
    profileInsertData.age = 18;
  }
  
  return profileInsertData;
};
