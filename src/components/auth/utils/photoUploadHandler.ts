
import { supabase } from '@/integrations/supabase/client';
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';
import { validateFileUpload } from '@/utils/security/inputValidation';

export const handlePhotoUploads = async (
  data: Record<string, any>, 
  userId: string, 
  enabledQuestions: QuestionItem[]
): Promise<{ photoUrls: string[]; errors: string[] }> => {
  const photoQuestion = enabledQuestions.find(q => q.profileField === 'photos');
  const photoUrls: string[] = [];
  const errors: string[] = [];
  
  if (photoQuestion && data[photoQuestion.id] && Array.isArray(data[photoQuestion.id])) {
    const photoFiles = data[photoQuestion.id] as string[]; // These are data URLs
    

    for (const [index, fileDataUrl] of photoFiles.entries()) {
      try {
        
        
        // Validate data URL format
        if (!fileDataUrl.startsWith('data:image/')) {
          const error = `Photo ${index + 1}: Invalid image format`;
          console.error(error);
          errors.push(error);
          continue;
        }

        const response = await fetch(fileDataUrl);
        const blob = await response.blob();
        
        // Validate blob size and type
        if (blob.size === 0) {
          const error = `Photo ${index + 1}: Empty file`;
          console.error(error);
          errors.push(error);
          continue;
        }
        
        // Create a File object for validation
        const file = new File([blob], `photo_${index}.${blob.type.split('/')[1]}`, { type: blob.type });
        
        // Validate file upload
        const validation = validateFileUpload(file);
        if (!validation.isValid) {
          const error = `Photo ${index + 1}: ${validation.message}`;
          console.error(error);
          errors.push(error);
          continue;
        }
        
        const fileExt = blob.type.split('/')[1] || 'jpg';
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
          const error = `Photo ${index + 1} upload failed: ${uploadError.message}`;
          console.error(error);
          errors.push(error);
          continue;
        }

        const { data: urlData } = supabase.storage
          .from('profile-photos')
          .getPublicUrl(uploadData.path);
        
        photoUrls.push(urlData.publicUrl);
        
      } catch (error) {
        const errorMsg = `Error processing photo ${index + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error(errorMsg);
        errors.push(errorMsg);
        continue;
      }
    }
  }
  
  
  return { photoUrls, errors };
};
