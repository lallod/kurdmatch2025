import { useState } from 'react';
import { generateBio } from '@/api/ai';
import { Profile } from '@/types/swipe';

export const useBioGeneration = (profile: Profile) => {
  const [generatedBio, setGeneratedBio] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateBio = async () => {
    if (!profile.id) {
      return;
    }

    setIsGenerating(true);
    try {
      const { bio } = await generateBio(profile.id);
      setGeneratedBio(bio);
    } catch (error) {
      console.error('Error generating bio:', error);
      // Fallback to a generic bio if generation fails
      setGeneratedBio(`${profile.name} loves exploring new experiences and connecting with like-minded people. Looking for meaningful connections and shared adventures.`);
    } finally {
      setIsGenerating(false);
    }
  };

  return { generatedBio, isGenerating, handleGenerateBio };
};
