
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteAllUsersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userCount: number;
  isDeleting: boolean;
  onConfirmDelete: () => Promise<void>;
}

const DeleteAllUsersDialog: React.FC<DeleteAllUsersDialogProps> = ({
  open,
  onOpenChange,
  userCount,
  isDeleting,
  onConfirmDelete
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete All Users</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete all users? This action cannot be undone and will remove {userCount} users.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              onConfirmDelete();
            }} 
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete All Users"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAllUsersDialog;
