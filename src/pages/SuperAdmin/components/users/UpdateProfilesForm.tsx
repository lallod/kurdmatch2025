
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ImageIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { updateExistingProfiles } from '@/utils/profileGenerator';

interface UpdateProfilesFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

const UpdateProfilesForm: React.FC<UpdateProfilesFormProps> = ({ onSuccess, onClose }) => {
  const [updateCount, setUpdateCount] = useState<number>(50);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const { toast } = useToast();

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
        onSuccess();
        onClose();
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
        <ProgressIndicator progress={progress} />
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
  );
};

export default UpdateProfilesForm;
