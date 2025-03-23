
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GenerateProfilesForm from './GenerateProfilesForm';
import UpdateProfilesForm from './UpdateProfilesForm';

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded: () => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ open, onOpenChange, onUserAdded }) => {
  const [activeTab, setActiveTab] = useState<string>('generate');

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
            <GenerateProfilesForm onSuccess={onUserAdded} onClose={() => onOpenChange(false)} />
          </TabsContent>
          
          <TabsContent value="update">
            <UpdateProfilesForm onSuccess={onUserAdded} onClose={() => onOpenChange(false)} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
