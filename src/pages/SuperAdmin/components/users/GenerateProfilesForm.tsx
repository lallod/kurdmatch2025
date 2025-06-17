
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Users, AlertTriangle } from 'lucide-react';
import { DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface GenerateProfilesFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

const GenerateProfilesForm: React.FC<GenerateProfilesFormProps> = ({ onSuccess, onClose }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleGenerateProfiles = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // This feature is no longer available - show message to user
      toast({
        title: "Feature Disabled",
        description: "Profile generation has been disabled. This system now only works with real users who register through the app.",
        variant: "default",
      });
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Information",
        description: "Profile generation is no longer available in real data mode.",
        variant: "default",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleGenerateProfiles} className="space-y-4 pt-4">
      <Alert>
        <Users className="h-4 w-4" />
        <AlertTitle>Real Users Only</AlertTitle>
        <AlertDescription>
          This application now only supports real users who register through the normal registration process. 
          Profile generation features have been disabled to ensure data authenticity.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>How to Add Users</AlertTitle>
        <AlertDescription>
          To see users in this admin panel, they need to register through your app's registration flow at /register. 
          Test this by creating accounts through the regular user registration process.
        </AlertDescription>
      </Alert>
      
      <DialogFooter>
        <Button type="submit" disabled={isLoading} className="gap-2" variant="outline">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Users size={16} />
              Close
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default GenerateProfilesForm;
