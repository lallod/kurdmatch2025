
import { supabase } from '@/integrations/supabase/client';
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';

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
      const response = await fetch(fileDataUrl);
      const blob = await response.blob();
      const fileExt = blob.type.split('/')[1];
      const fileName = `${userId}/profile_${index + 1}_${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, blob, { 
          cacheControl: '3600', 
          upsert: false, 
          contentType: blob.type 
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(uploadData.path);
      
      photoUrls.push(urlData.publicUrl);
    }
  }
  
  return photoUrls;
};
