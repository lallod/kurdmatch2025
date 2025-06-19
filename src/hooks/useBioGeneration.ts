
import { useState, useEffect } from 'react';
import { generateBio } from '@/utils/ai-bio-generator';
import { Profile } from '@/types/swipe';

export const useBioGeneration = (profile: Profile) => {
  const [generatedBio, setGeneratedBio] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generateProfileBio();
  }, [profile.id]);

  const generateProfileBio = async () => {
    if (profile.bio) {
      setGeneratedBio(profile.bio);
      return;
    }

    try {
      setIsGenerating(true);
      const tone = 'friendly';
      const keywords = profile.interests || [];
      const bio = await generateBio(tone, keywords);
      setGeneratedBio(bio);
    } catch (error) {
      console.error('Error generating bio:', error);
      // Fallback bio based on profile data
      const fallbackBio = `${profile.name} is a ${profile.age}-year-old ${profile.occupation} from ${profile.location}. ${profile.interests?.length ? `Passionate about ${profile.interests.slice(0, 3).join(', ')}.` : ''} Looking for ${profile.relationshipGoals || 'meaningful connections'}.`;
      setGeneratedBio(fallbackBio);
    } finally {
      setIsGenerating(false);
    }
  };

  return { generatedBio, isGenerating };
};
