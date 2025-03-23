
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, RefreshCw, UserPlus, Users } from 'lucide-react';
import { DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { generateKurdishProfile, generateDiverseKurdishProfiles } from '@/utils/profileGenerator';
import ProgressIndicator from './ProgressIndicator';

interface GenerateProfilesFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

const GenerateProfilesForm: React.FC<GenerateProfilesFormProps> = ({ onSuccess, onClose }) => {
  const [count, setCount] = useState<number>(10);
  const [gender, setGender] = useState<string>('random');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [withPhotos, setWithPhotos] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [generateDiverse, setGenerateDiverse] = useState<boolean>(true);
  const [generateActivity, setGenerateActivity] = useState<boolean>(true);
  const { toast } = useToast();

  const handleGenerateProfiles = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setProgress(0);

    try {
      // Generate multiple profiles if count > 1
      const totalProfiles = Math.min(200, Math.max(1, count)); // Allow up to 200 profiles
      
      if (generateDiverse) {
        // Use the new diverse generation function
        console.log(`Starting generation of ${totalProfiles} diverse Kurdish profiles...`);
        setProgress(10);
        
        const result = await generateDiverseKurdishProfiles(totalProfiles, {
          gender: gender === 'random' ? 'random' : gender === 'male' ? 'male' : 'female',
          generateActivity
        });
        
        setProgress(100);
        
        if (result.generatedCount === 0) {
          toast({
            title: "Generation Failed",
            description: "We couldn't create any profiles. Please check the console for error details.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success",
            description: `Generated ${result.generatedCount} diverse Kurdish profiles with ${result.likesGenerated} likes, ${result.matchesGenerated} matches, and ${result.messagesGenerated} messages.`,
            variant: "default",
          });
          onSuccess();
          onClose();
        }
      } else {
        // Original approach - generate profiles one by one
        console.log(`Starting generation of ${totalProfiles} profiles with gender: ${gender}...`);
        
        // Process profiles in batches for better UI feedback
        let successfulProfiles = 0;
        const batchSize = 5;
        const batches = Math.ceil(totalProfiles / batchSize);
        
        for (let batch = 0; batch < batches; batch++) {
          const batchPromises = [];
          const start = batch * batchSize;
          const end = Math.min(start + batchSize, totalProfiles);
          
          for (let i = start; i < end; i++) {
            const selectedGender = gender === 'random' 
              ? (Math.random() > 0.5 ? 'male' : 'female') 
              : gender;
            
            // Create a unique ID for the profile
            const userId = crypto.randomUUID();
            
            try {
              // Generate the profile with the user ID and photos
              batchPromises.push(
                generateKurdishProfile(selectedGender, withPhotos, userId)
                  .then(id => {
                    successfulProfiles++;
                    setProgress(Math.floor((successfulProfiles / totalProfiles) * 100));
                    return id;
                  })
                  .catch(err => {
                    console.error(`Error generating profile ${i+1}:`, err);
                    return null; // Return null for failed profiles so Promise.all continues
                  })
              );
            } catch (err) {
              console.error(`Exception in profile creation process for profile ${i+1}:`, err);
            }
          }
          
          // Wait for current batch to complete before starting next batch
          const batchResults = await Promise.allSettled(batchPromises);
          console.log(`Batch ${batch+1}/${batches} completed:`, batchResults);
        }
        
        if (successfulProfiles === 0) {
          toast({
            title: "Generation Failed",
            description: "We couldn't create any profiles. Please check the console for error details.",
            variant: "destructive",
          });
        } else if (successfulProfiles < totalProfiles) {
          toast({
            title: "Partial Success",
            description: `${successfulProfiles} out of ${totalProfiles} profiles were generated successfully.`,
            variant: "default",
          });
          onSuccess();
          onClose();
        } else {
          toast({
            title: "Success",
            description: `${successfulProfiles} ${successfulProfiles === 1 ? 'profile' : 'profiles'} generated successfully with rich personal information and photos.`,
            variant: "default",
          });
          onSuccess();
          onClose();
        }
      }
    } catch (error) {
      console.error('Error generating profiles:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      toast({
        title: "Error",
        description: `Failed to generate profiles: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  return (
    <form onSubmit={handleGenerateProfiles} className="space-y-4 pt-4">
      <div className="grid gap-2">
        <Label htmlFor="count">Number of profiles to generate</Label>
        <Input
          id="count"
          type="number"
          min={1}
          max={200}
          value={count}
          onChange={(e) => setCount(Math.min(200, Math.max(1, parseInt(e.target.value) || 1)))}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">Maximum 200 profiles per batch</p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="generateDiverse" 
          checked={generateDiverse} 
          onCheckedChange={(checked) => setGenerateDiverse(checked as boolean)}
        />
        <Label htmlFor="generateDiverse" className="cursor-pointer">
          Generate diverse Kurdish profiles with activity
        </Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="generateActivity" 
          checked={generateActivity} 
          onCheckedChange={(checked) => setGenerateActivity(checked as boolean)}
        />
        <Label htmlFor="generateActivity" className="cursor-pointer">
          Generate random user activity (likes, matches, messages)
        </Label>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="gender">Gender preference</Label>
        <Select value={gender} onValueChange={setGender}>
          <SelectTrigger id="gender" className="w-full">
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="random">Random</SelectItem>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {!generateDiverse && (
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="withPhotos" 
            checked={withPhotos} 
            onCheckedChange={(checked) => setWithPhotos(checked as boolean)}
          />
          <Label htmlFor="withPhotos" className="cursor-pointer">Generate with profile photos</Label>
        </div>
      )}
      
      {isLoading && progress > 0 && (
        <ProgressIndicator progress={progress} />
      )}
      
      <DialogFooter>
        <Button type="submit" disabled={isLoading} className="gap-2">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating Profiles...
            </>
          ) : (
            <>
              <UserPlus size={16} />
              {generateDiverse ? "Generate Diverse Kurdish Profiles" : "Generate Rich Profiles"}
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default GenerateProfilesForm;
