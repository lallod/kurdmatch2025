
import { supabase } from '@/integrations/supabase/client';
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';
import { validateFileUpload } from '@/utils/security/inputValidation';

export const handlePhotoUploads = async (
  data: Record<string, any>, 
  userId: string, 
  enabledQuestions: QuestionItem[]
): Promise<string[]> => {
  const photoQuestion = enabledQuestions.find(q => q.profileField === 'photos');
  const photoUrls: string[] = [];
  
  if (photoQuestion && data[photoQuestion.id] && Array.isArray(data[photoQuestion.id])) {
    const photoFiles = data[photoQuestion.id] as string[]; // These are data URLs

    for (const [index, fileDataUrl] of photoFiles.entries()) {
      try {
        const response = await fetch(fileDataUrl);
        const blob = await response.blob();
        
        // Create a File object for validation
        const file = new File([blob], `photo_${index}.${blob.type.split('/')[1]}`, { type: blob.type });
        
        // Validate file upload
        const validation = validateFileUpload(file);
        if (!validation.isValid) {
          console.error(`Photo ${index + 1} validation failed:`, validation.message);
          continue; // Skip invalid files
        }
        
        const fileExt = blob.type.split('/')[1];
        // Sanitize filename to prevent path traversal
        const sanitizedFileName = `${userId}/profile_${index + 1}_${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('profile-photos')
          .upload(sanitizedFileName, blob, { 
            cacheControl: '3600', 
            upsert: false, 
            contentType: blob.type 
          });

        if (uploadError) {
          console.error(`Photo ${index + 1} upload failed:`, uploadError);
          continue; // Skip failed uploads
        }

        const { data: urlData } = supabase.storage
          .from('profile-photos')
          .getPublicUrl(uploadData.path);
        
        photoUrls.push(urlData.publicUrl);
      } catch (error) {
        console.error(`Error processing photo ${index + 1}:`, error);
        continue; // Skip errored photos
      }
    }
  }
  
  return photoUrls;
};
