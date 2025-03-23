
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateKurdishProfile } from '@/utils/kurdishProfileGenerator';
import { supabase } from '@/integrations/supabase/client';

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded: () => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ open, onOpenChange, onUserAdded }) => {
  const [count, setCount] = useState<number>(1);
  const [gender, setGender] = useState<string>('random');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [withPhotos, setWithPhotos] = useState<boolean>(true);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Generate multiple profiles if count > 1
      const generationPromises = [];
      
      for (let i = 0; i < count; i++) {
        const selectedGender = gender === 'random' 
          ? (Math.random() > 0.5 ? 'male' : 'female') 
          : gender;
          
        generationPromises.push(generateKurdishProfile(selectedGender, withPhotos));
      }
      
      await Promise.all(generationPromises);
      
      toast({
        title: "Success",
        description: `${count} Kurdish ${count === 1 ? 'profile' : 'profiles'} generated successfully.`,
        variant: "default",
      });
      
      onUserAdded();
      onOpenChange(false);
    } catch (error) {
      console.error('Error generating profiles:', error);
      toast({
        title: "Error",
        description: "Failed to generate profiles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Kurdish Profiles</DialogTitle>
          <DialogDescription>
            Automatically generate realistic Kurdish user profiles with AI.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="count">Number of profiles to generate</Label>
            <Input
              id="count"
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={(e) => setCount(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="gender">Gender preference</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="random">Random</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="withPhotos" 
              checked={withPhotos} 
              onCheckedChange={(checked) => setWithPhotos(checked as boolean)}
            />
            <Label htmlFor="withPhotos" className="cursor-pointer">Generate with profile photos</Label>
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Profiles
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
