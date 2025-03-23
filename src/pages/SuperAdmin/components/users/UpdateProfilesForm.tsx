
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ImageIcon, Activity, AlertTriangle } from 'lucide-react';
import { DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { updateExistingProfiles, generateRandomUserActivity } from '@/utils/profileGenerator';
import ProgressIndicator from './ProgressIndicator';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface UpdateProfilesFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

const UpdateProfilesForm: React.FC<UpdateProfilesFormProps> = ({ onSuccess, onClose }) => {
  const [updateCount, setUpdateCount] = useState<number>(50);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [generateActivity, setGenerateActivity] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleUpdateExistingProfiles = async () => {
    setIsLoading(true);
    setProgress(0);
    setError(null);

    try {
      console.log(`Starting update of ${updateCount} existing profiles...`);
      
      // Update the profiles
      const updatedCount = await updateExistingProfiles(updateCount);
      
      // Set progress to 50% after profile updates
      setProgress(generateActivity ? 50 : 100);
      
      // Generate activity if enabled
      if (generateActivity) {
        console.log("Generating random user activity...");
        const { likesGenerated, matchesGenerated, messagesGenerated } = 
          await generateRandomUserActivity(updateCount);
        
        setProgress(100);
        
        if (likesGenerated === 0 && matchesGenerated === 0 && messagesGenerated === 0) {
          setError("Failed to generate user activity. This may be due to database permission issues.");
          toast({
            title: "Activity Generation Failed",
            description: "Could not generate user activity. This may be due to security permissions.",
            variant: "destructive",
          });
        } else {
          console.log(`Generated ${likesGenerated} likes, ${matchesGenerated} matches, and ${messagesGenerated} messages`);
        }
      }
      
      if (updatedCount === 0) {
        setError("No profiles were found that needed updating, or database permissions prevented updates.");
        toast({
          title: "No Updates Made",
          description: "No profiles were found that needed updating, or database permissions prevented updates.",
          variant: "default",
        });
      } else {
        const activityMsg = generateActivity ? 
          ` and generated user activity (${updatedCount > 10 ? 'hundreds of' : 'several'} interactions)` : '';
        
        toast({
          title: "Success",
          description: `Successfully updated ${updatedCount} profiles with rich personal information${activityMsg}.`,
          variant: "default",
        });
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error updating profiles:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(`Failed to update profiles: ${errorMessage}. This may be due to database permission issues.`);
      
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
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
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
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="generateActivity" 
          checked={generateActivity} 
          onCheckedChange={setGenerateActivity}
        />
        <Label htmlFor="generateActivity" className="cursor-pointer">
          Generate random user activity (likes, matches, messages)
        </Label>
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
                This will add rich information and photos to existing profiles and optionally
                generate user activity data for a more realistic admin dashboard.
              </p>
              <p className="mt-1 font-semibold">
                Note: This operation requires proper database permissions to succeed.
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
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (generateActivity ? <Activity size={16} /> : <ImageIcon size={16} />)}
          {generateActivity ? "Update Profiles & Generate Activity" : "Update Existing Profiles"}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default UpdateProfilesForm;
