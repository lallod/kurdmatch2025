
import React, { useState } from 'react';
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface DeleteAllUsersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userCount: number;
  isDeleting: boolean;
  onConfirmDelete: (role: string) => Promise<void>;
}

const DeleteAllUsersDialog: React.FC<DeleteAllUsersDialogProps> = ({
  open,
  onOpenChange,
  userCount,
  isDeleting,
  onConfirmDelete
}) => {
  const [selectedRole, setSelectedRole] = useState<string>("all");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Users by Role</AlertDialogTitle>
          <AlertDialogDescription>
            Choose which users to delete based on their role. This action cannot be undone.
            <strong className="block mt-2 text-destructive">
              This will delete ALL users with the selected role from the database, not just the current page.
            </strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4">
          <Label htmlFor="role-select" className="mb-2 block">Select Role</Label>
          <Select
            value={selectedRole}
            onValueChange={setSelectedRole}
            disabled={isDeleting}
          >
            <SelectTrigger className="w-full" id="role-select">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Users ({userCount})</SelectItem>
                <SelectItem value="user">Regular Users</SelectItem>
                <SelectItem value="moderator">Moderators</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              onConfirmDelete(selectedRole);
            }} 
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : `Delete ${selectedRole === 'all' ? 'All' : selectedRole} Users`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAllUsersDialog;
