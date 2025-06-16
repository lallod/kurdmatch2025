
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';
import { TablesInsert } from '@/integrations/supabase/types';

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
          profileInsertData.name = String(formValue);
        } else if (q.profileField === 'date_of_birth' && typeof formValue === 'string' && formValue) {
          // Calculate age from date of birth
          const birthDate = new Date(formValue);
          if (!isNaN(birthDate.getTime())) {
            const ageDifMs = Date.now() - birthDate.getTime();
            const ageDate = new Date(ageDifMs);
            profileInsertData.age = Math.abs(ageDate.getUTCFullYear() - 1970);
          }
        } else if (q.fieldType === 'multi-select' && Array.isArray(formValue)) {
          // Handle array fields
          (profileInsertData as any)[q.profileField] = formValue.length > 0 ? formValue : null;
        } else if (typeof formValue === 'string' || typeof formValue === 'number' || typeof formValue === 'boolean') {
          // Handle single value fields
          (profileInsertData as any)[q.profileField] = formValue;
        }
      }
    }
  });
  
  // Ensure required fields have values
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
