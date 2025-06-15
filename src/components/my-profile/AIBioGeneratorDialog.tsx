
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { generateBio } from '@/utils/ai-bio-generator';
import { Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface AIBioGeneratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (newBio: string) => void;
}

const AIBioGeneratorDialog: React.FC<AIBioGeneratorDialogProps> = ({
  open,
  onOpenChange,
  onGenerate,
}) => {
  const [tone, setTone] = useState('friendly');
  const [keywords, setKeywords] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    toast.info('AI is crafting your bio...');
    try {
      const bio = await generateBio(
        tone,
        keywords
          .split(',')
          .map((k) => k.trim())
          .filter(Boolean)
      );
      onGenerate(bio);
      toast.success('New bio generated!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate bio. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="text-primary" /> AI Bio Generator
          </DialogTitle>
          <DialogDescription>
            Let AI help you write the perfect bio. Provide some keywords and
            select a tone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <Label htmlFor="tone">Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger id="tone">
                <SelectValue placeholder="Select a tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="witty">Witty</SelectItem>
                <SelectItem value="adventurous">Adventurous</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="mysterious">Mysterious</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="keywords">Keywords (comma-separated)</Label>
            <Input
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g., hiking, coffee, design"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIBioGeneratorDialog;
