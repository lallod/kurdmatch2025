import { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UnmatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  matchId: string;
  userName: string;
  onUnmatchSuccess: () => void;
}

const UnmatchDialog = ({ 
  open, 
  onOpenChange, 
  matchId, 
  userName,
  onUnmatchSuccess 
}: UnmatchDialogProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleUnmatch = async () => {
    setLoading(true);
    try {
      // Delete the match
      const { error: matchError } = await supabase
        .from('matches')
        .delete()
        .eq('id', matchId);

      if (matchError) throw matchError;

      toast({
        title: "Unmatched",
        description: `You have unmatched with ${userName}`,
      });

      onUnmatchSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error unmatching:', error);
      toast({
        title: "Error",
        description: "Failed to unmatch. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-gradient-to-br from-purple-900 to-pink-900 border-white/20">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <AlertDialogTitle className="text-white text-xl">
              Unmatch with {userName}?
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-purple-200">
            This action cannot be undone. You will no longer be able to message each other, 
            and your conversation history will be lost. {userName} will not be notified.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel 
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            disabled={loading}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleUnmatch}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Unmatching...
              </>
            ) : (
              'Unmatch'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UnmatchDialog;
