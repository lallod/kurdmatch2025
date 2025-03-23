
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateKurdishProfile } from '@/utils/kurdishProfileGenerator';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded: () => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ open, onOpenChange, onUserAdded }) => {
  const [count, setCount] = useState<number>(10);
  const [gender, setGender] = useState<string>('random');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [withPhotos, setWithPhotos] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setProgress(0);

    try {
      // Generate multiple profiles if count > 1
      const totalProfiles = Math.min(50, Math.max(1, count)); // Allow up to 50 profiles
      
      console.log(`Starting generation of ${totalProfiles} Kurdish profiles...`);
      
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
          
          // Create a unique ID and email for the auth user
          const userId = crypto.randomUUID();
          const email = `${userId.slice(0, 8)}@example.com`;
          
          try {
            // First create the auth user - this is necessary for the foreign key constraint
            const { data: authUserData, error: authUserError } = await supabase.rpc(
              'create_dummy_auth_user' as any, 
              { 
                user_uuid: userId,
                email: email
              }
            );
            
            if (authUserError) {
              console.error(`Failed to create auth user: ${authUserError.message}`);
              continue; // Skip this profile if auth user creation fails
            }
            
            console.log(`Successfully created auth user with ID: ${userId} and email: ${email}`);
            
            // Then generate the profile
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
          description: `${successfulProfiles} out of ${totalProfiles} Kurdish profiles were generated successfully.`,
          variant: "default",
        });
        onUserAdded();
        onOpenChange(false);
      } else {
        toast({
          title: "Success",
          description: `${successfulProfiles} Kurdish ${successfulProfiles === 1 ? 'profile' : 'profiles'} generated successfully.`,
          variant: "default",
        });
        onUserAdded();
        onOpenChange(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Kurdish Profiles</DialogTitle>
          <DialogDescription>
            Automatically generate realistic Kurdish user profiles with comprehensive information.
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
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">Maximum 50 profiles per batch</p>
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
          
          {isLoading && progress > 0 && (
            <div className="w-full space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-center text-muted-foreground">{progress}% complete</p>
            </div>
          )}
          
          <DialogFooter>
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw size={16} />}
              Generate Profiles
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
