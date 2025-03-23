
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, RefreshCw, ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateKurdishProfile, updateExistingProfiles } from '@/utils/kurdishProfileGenerator';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [activeTab, setActiveTab] = useState<string>('generate');
  const [updateCount, setUpdateCount] = useState<number>(50);
  const { toast } = useToast();

  const handleGenerateProfiles = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setProgress(0);

    try {
      // Generate multiple profiles if count > 1
      const totalProfiles = Math.min(100, Math.max(1, count)); // Allow up to 100 profiles
      
      console.log(`Starting generation of ${totalProfiles} diverse profiles...`);
      
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
        onUserAdded();
        onOpenChange(false);
      } else {
        toast({
          title: "Success",
          description: `${successfulProfiles} ${successfulProfiles === 1 ? 'profile' : 'profiles'} generated successfully with rich personal information and photos.`,
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

  const handleUpdateExistingProfiles = async () => {
    setIsLoading(true);
    setProgress(0);

    try {
      console.log(`Starting update of ${updateCount} existing profiles...`);
      
      // Update the profiles
      const updatedCount = await updateExistingProfiles(updateCount);
      
      // Calculate progress percentage (approximate since we don't know exact count in advance)
      setProgress(100);
      
      if (updatedCount === 0) {
        toast({
          title: "No Updates Made",
          description: "No profiles were found that needed updating.",
          variant: "default",
        });
      } else {
        toast({
          title: "Success",
          description: `Successfully updated ${updatedCount} profiles with rich personal information and photos.`,
          variant: "default",
        });
        onUserAdded();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error updating profiles:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      toast({
        title: "Error",
        description: `Failed to update profiles: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Generate Rich User Profiles</DialogTitle>
          <DialogDescription>
            Automatically generate realistic user profiles with comprehensive information and photos.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Generate New</TabsTrigger>
            <TabsTrigger value="update">Update Existing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate">
            <form onSubmit={handleGenerateProfiles} className="space-y-4 pt-4">
              <div className="grid gap-2">
                <Label htmlFor="count">Number of profiles to generate</Label>
                <Input
                  id="count"
                  type="number"
                  min={1}
                  max={100}
                  value={count}
                  onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">Maximum 100 profiles per batch</p>
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
                  Generate Rich Profiles
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="update">
            <div className="space-y-4 pt-4">
              <div className="grid gap-2">
                <Label htmlFor="updateCount">Number of profiles to update</Label>
                <Input
                  id="updateCount"
                  type="number"
                  min={1}
                  max={200}
                  value={updateCount}
                  onChange={(e) => setUpdateCount(Math.min(200, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">Maximum 200 profiles per batch</p>
              </div>
              
              <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ImageIcon className="h-5 w-5 text-amber-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800">Update existing profiles</h3>
                    <div className="mt-2 text-sm text-amber-700">
                      <p>
                        This will add rich information and photos to existing profiles. 
                        Use this to enhance profiles that were previously created.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {isLoading && progress > 0 && (
                <div className="w-full space-y-2">
                  <Progress value={progress} className="w-full" />
                  <p className="text-xs text-center text-muted-foreground">{progress}% complete</p>
                </div>
              )}
              
              <DialogFooter>
                <Button 
                  onClick={handleUpdateExistingProfiles} 
                  disabled={isLoading} 
                  className="gap-2"
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon size={16} />}
                  Update Existing Profiles
                </Button>
              </DialogFooter>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
