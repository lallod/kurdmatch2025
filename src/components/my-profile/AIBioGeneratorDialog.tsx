
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, RefreshCw, Check } from 'lucide-react';
import { toast } from 'sonner';
import { ProfileData } from '@/types/profile';

interface AIBioGeneratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (newBio: string) => void;
  profileData: ProfileData;
}

const bioStyles = [
  { id: 'professional', name: 'Professional', description: 'Polished and career-focused' },
  { id: 'casual', name: 'Casual', description: 'Relaxed and friendly' },
  { id: 'romantic', name: 'Romantic', description: 'Heart-warming and sweet' },
  { id: 'adventurous', name: 'Adventurous', description: 'Bold and exciting' },
  { id: 'humorous', name: 'Humorous', description: 'Fun and playful' }
];

const AIBioGeneratorDialog: React.FC<AIBioGeneratorDialogProps> = ({
  open,
  onOpenChange,
  onGenerate,
  profileData,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBios, setGeneratedBios] = useState<string[]>([]);
  const [selectedBio, setSelectedBio] = useState<string>('');

  const generatePersonalizedBios = async () => {
    setIsGenerating(true);
    toast.info('AI is crafting 5 personalized bios for you...');
    
    try {
      const bios = await Promise.all(bioStyles.map(async (style) => {
        // Create personalized prompts based on user data
        const interests = profileData.interests.slice(0, 3).join(', ');
        const values = profileData.values.slice(0, 2).join(' and ');
        const location = profileData.location;
        const occupation = profileData.occupation;
        const age = profileData.age;
        
        let prompt = `Write a ${style.id} dating bio for ${profileData.name}, ${age}, a ${occupation} from ${location}.`;
        
        if (interests) prompt += ` Interests: ${interests}.`;
        if (values) prompt += ` Values: ${values}.`;
        if (profileData.languages.length > 1) prompt += ` Speaks ${profileData.languages.join(', ')}.`;
        if (profileData.kurdistanRegion) prompt += ` From ${profileData.kurdistanRegion}.`;
        
        prompt += ` Make it ${style.description.toLowerCase()}, engaging, and authentic. Keep it under 300 characters.`;
        
        // Simulate AI generation with realistic bios
        return generateBioForStyle(style.id, profileData);
      }));
      
      setGeneratedBios(bios);
      toast.success('5 personalized bios generated!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate bios. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateBioForStyle = (styleId: string, data: ProfileData): string => {
    const interests = data.interests.slice(0, 3).join(', ');
    const firstName = data.name.split(' ')[0];
    
    const templates = {
      professional: `${firstName}, ${data.age} • ${data.occupation} passionate about ${interests}. Looking for meaningful connections and shared growth. ${data.kurdistanRegion} roots, global mindset. Let's build something beautiful together.`,
      
      casual: `Hey! I'm ${firstName} 👋 Love ${interests} and good conversations. ${data.occupation} by day, adventurer by heart. Originally from ${data.kurdistanRegion}. Always up for trying new things!`,
      
      romantic: `Dreamer, ${data.occupation}, and hopeless romantic seeking my person. I find joy in ${interests} and believe in love that grows stronger each day. From ${data.kurdistanRegion} with love 💕`,
      
      adventurous: `${firstName} here! 🌟 Life's too short for boring moments. ${data.occupation} who loves ${interests} and spontaneous adventures. ${data.kurdistanRegion} born, world explorer. Ready for our next chapter?`,
      
      humorous: `${data.occupation} who takes work seriously but life with a smile 😄 Hobbies include ${interests} and making terrible puns. Warning: may cause excessive laughter and good times!`
    };
    
    return templates[styleId as keyof typeof templates] || templates.casual;
  };

  const handleSelectBio = (bio: string) => {
    setSelectedBio(bio);
  };

  const handleUseBio = () => {
    if (selectedBio) {
      onGenerate(selectedBio);
      onOpenChange(false);
      toast.success('Bio updated successfully!');
    }
  };

  const handleRegenerate = () => {
    setGeneratedBios([]);
    setSelectedBio('');
    generatePersonalizedBios();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Sparkles className="text-purple-400" /> AI Bio Generator
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Get 5 personalized bio options crafted from your profile data. Choose your favorite style!
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {generatedBios.length === 0 ? (
            <div className="text-center py-8">
              <Button 
                onClick={generatePersonalizedBios} 
                disabled={isGenerating}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate 5 Personalized Bios
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Choose Your Style</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRegenerate}
                  className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {bioStyles.map((style, index) => (
                  <Card 
                    key={style.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedBio === generatedBios[index]
                        ? 'ring-2 ring-purple-500 bg-purple-500/10'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                    onClick={() => handleSelectBio(generatedBios[index])}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            {style.name}
                          </Badge>
                          <span className="text-sm text-gray-400">{style.description}</span>
                        </div>
                        {selectedBio === generatedBios[index] && (
                          <Check className="h-5 w-5 text-green-400" />
                        )}
                      </div>
                      <p className="text-white leading-relaxed">
                        {generatedBios[index]}
                      </p>
                      <div className="mt-2 text-xs text-gray-400">
                        {generatedBios[index]?.length || 0} characters
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
          >
            Cancel
          </Button>
          {selectedBio && (
            <Button 
              onClick={handleUseBio}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              Use This Bio
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIBioGeneratorDialog;
