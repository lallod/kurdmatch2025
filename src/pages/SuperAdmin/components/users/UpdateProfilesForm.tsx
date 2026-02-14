
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Users, AlertTriangle } from 'lucide-react';
import { DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface UpdateProfilesFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

const UpdateProfilesForm: React.FC<UpdateProfilesFormProps> = ({ onSuccess, onClose }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  

  const handleUpdateProfiles = async () => {
    setIsLoading(true);

    try {
      // This feature is no longer available - show message to user
      toast.info("Profile updating has been disabled. This system now only works with real user data.");
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.info("Profile updating is no longer available in real data mode.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 pt-4">
      <Alert>
        <Users className="h-4 w-4" />
        <AlertTitle>Real Data Mode</AlertTitle>
        <AlertDescription>
          This application now operates in real data mode. Only actual user profiles from real registrations are shown.
          Profile generation and updating features have been disabled to ensure data authenticity.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>User Profile Management</AlertTitle>
        <AlertDescription>
          To manage user profiles, users must update their own profiles through the regular app interface. 
          Admins can view and moderate content but cannot generate or artificially update user profiles.
        </AlertDescription>
      </Alert>
      
      <DialogFooter>
        <Button 
          onClick={handleUpdateProfiles} 
          disabled={isLoading} 
          className="gap-2"
          variant="outline"
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Users size={16} />}
          Close
        </Button>
      </DialogFooter>
    </div>
  );
};

export default UpdateProfilesForm;
