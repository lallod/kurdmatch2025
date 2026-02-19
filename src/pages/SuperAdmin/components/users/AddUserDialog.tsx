
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { comprehensiveTestDataCleanup } from '@/utils/comprehensiveDataCleanup';
import { Loader2, Trash2, Users, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTranslations } from '@/hooks/useTranslations';

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded: () => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ open, onOpenChange, onUserAdded }) => {
  const { t } = useTranslations();
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  

  const handleCleanupTestData = async () => {
    setIsCleaningUp(true);
    try {
      const result = await comprehensiveTestDataCleanup();
      if (result.success) {
        toast.success("All test data has been removed. Only real users will be shown.");
        onUserAdded();
        onOpenChange(false);
      } else {
        toast.error(result.error || "Failed to clean up test data");
      }
    } catch (error) {
      toast.error("An error occurred during cleanup");
    } finally {
      setIsCleaningUp(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('admin.user_management', 'User Management')}</DialogTitle>
          <DialogDescription>
            {t('admin.real_users_dialog_desc', 'Manage real user data and clean up any test/generated content.')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <Alert>
            <Users className="h-4 w-4" />
            <AlertTitle>{t('admin.real_users_only', 'Real Users Only')}</AlertTitle>
            <AlertDescription>
              {t('admin.real_users_dialog_desc', 'This system now only shows real users who registered through the normal app registration process. All profile generation features have been disabled to ensure data authenticity.')}
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                {t('admin.clean_up_test_data', 'Clean Up Test Data')}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {t('admin.clean_up_desc', 'Remove all automatically generated profiles, mock engagement data, and test content from the database. This will only keep real users who registered through your app.')}
              </p>
              <Button 
                onClick={handleCleanupTestData}
                disabled={isCleaningUp}
                variant="destructive"
                className="w-full"
              >
                {isCleaningUp ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {t('admin.cleaning_up', 'Cleaning Up Test Data...')}
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t('admin.clean_up_all', 'Clean Up All Test Data')}
                  </>
                )}
              </Button>
            </div>

            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{t('admin.how_to_add_real_users', 'How to Add Real Users')}</AlertTitle>
              <AlertDescription>
                {t('admin.how_to_add_desc', 'To see users in this admin panel, they need to register through your app\'s normal registration flow at /register. Test this by creating accounts through the regular user registration process.')}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
