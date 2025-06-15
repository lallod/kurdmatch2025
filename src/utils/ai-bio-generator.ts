
import { pipeline, env } from '@huggingface/transformers';

env.allowLocalModels = false;
env.useBrowserCache = true; // Let's cache the model for faster subsequent loads

let generator: any = null;

const initializeGenerator = async () => {
  if (!generator) {
    // Using a smaller model for faster client-side generation
    generator = await pipeline('text-generation', 'Xenova/distilgpt2', {
      device: 'webgpu'
    });
  }
};

export const generateBio = async (tone: string, keywords: string[]): Promise<string> => {
  await initializeGenerator();

  const keywordsString = keywords.length > 0 ? `My interests are ${keywords.join(', ')}.` : '';
  const prompt = `Write a short, ${tone} dating app bio. ${keywordsString} Make it engaging and personal.`;

  try {
    const result = await generator(prompt, {
      max_new_tokens: 50,
      num_return_sequences: 1,
      do_sample: true,
      temperature: 0.7,
      repetition_penalty: 1.1,
      no_repeat_ngram_size: 2,
    });
    
    if (Array.isArray(result) && result[0] && typeof result[0].generated_text === 'string') {
      let generatedBio = result[0].generated_text.replace(prompt, '').trim();
      
      // Clean up the text: remove partial sentences at the end
      const lastSentenceEnd = Math.max(generatedBio.lastIndexOf('.'), generatedBio.lastIndexOf('!'), generatedBio.lastIndexOf('?'));
      if (lastSentenceEnd > -1) {
        generatedBio = generatedBio.substring(0, lastSentenceEnd + 1);
      }

      if (generatedBio.length < 20) {
        return "Lover of adventure and spontaneous trips. Looking for someone to share new experiences with. Let's explore together!";
      }
      return generatedBio;
    }
    throw new Error('Invalid response from AI model');
  } catch (error) {
    console.error('Error generating bio with AI:', error);
    throw error;
  }
};
