import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { User } from './types';
import { AlertTriangle } from 'lucide-react';

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userToDelete: User | null;
  isDeleting: boolean;
  onConfirmDelete: (permanent?: boolean) => Promise<void>;
}

const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
  open,
  onOpenChange,
  userToDelete,
  isDeleting,
  onConfirmDelete
}) => {
  const [showPermanent, setShowPermanent] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setShowPermanent(false); }}>
      <AlertDialogContent className="bg-[#141414] border-white/10 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            {showPermanent ? 'Permanently Delete User' : 'User Action'}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-white/60">
            {showPermanent ? (
              <span className="flex items-start gap-2 text-red-400">
                <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                This will permanently delete {userToDelete?.name} and ALL their data. This action cannot be undone.
              </span>
            ) : (
              <>Choose an action for <strong className="text-white">{userToDelete?.name}</strong>:</>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel disabled={isDeleting} className="bg-white/5 border-white/10 text-white hover:bg-white/10">
            Cancel
          </AlertDialogCancel>
          
          {!showPermanent ? (
            <>
              <Button
                onClick={() => onConfirmDelete(false)}
                disabled={isDeleting}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                {isDeleting ? "Processing..." : "Deactivate"}
              </Button>
              <Button
                onClick={() => setShowPermanent(true)}
                disabled={isDeleting}
                variant="destructive"
              >
                Permanent Delete
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => setShowPermanent(false)}
                disabled={isDeleting}
                variant="outline"
                className="border-white/10 text-white hover:bg-white/10"
              >
                Go Back
              </Button>
              <Button
                onClick={() => onConfirmDelete(true)}
                disabled={isDeleting}
                variant="destructive"
              >
                {isDeleting ? "Deleting..." : "Yes, Permanently Delete"}
              </Button>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserDialog;
