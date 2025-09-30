import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAIBioGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateBio = async (profileId: string): Promise<string | null> => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-bio', {
        body: { profileId }
      });

      if (error) {
        throw error;
      }

      if (!data?.bio) {
        throw new Error('No bio generated');
      }

      toast({
        title: "Bio generated!",
        description: "Your profile bio has been updated with AI.",
      });

      return data.bio;
    } catch (error) {
      console.error('Error generating bio:', error);
      toast({
        title: "Generation failed",
        description: "Could not generate bio. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateBio, isGenerating };
};
