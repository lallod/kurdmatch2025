
import { useState, useEffect } from 'react';
import { generateBio } from '@/utils/ai-bio-generator';
import { Profile } from '@/types/swipe';

export const useBioGeneration = (profile: Profile) => {
  const [generatedBio, setGeneratedBio] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const generateUserBio = async () => {
      if (profile.bio) {
        setGeneratedBio(profile.bio);
        return;
      }

      setIsGenerating(true);
      try {
        const tone = 'engaging';
        const keywords = profile.interests?.slice(0, 3) || [];
        const bio = await generateBio(tone, keywords);
        setGeneratedBio(bio);
      } catch (error) {
        // Fallback to a generic bio if generation fails
        setGeneratedBio(`${profile.name} loves exploring new experiences and connecting with like-minded people. Looking for meaningful connections and shared adventures.`);
      } finally {
        setIsGenerating(false);
      }
    };

    generateUserBio();
  }, [profile]);

  return { generatedBio, isGenerating };
};
