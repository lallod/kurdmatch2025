
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useTranslations } from '@/hooks/useTranslations';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { 
  LogOut, 
  Flag, 
  User as UserIcon, 
  Settings, 
  HelpCircle 
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

const UserMenu = () => {
  const { user, signOut } = useSupabaseAuth();
  const { toast } = useToast();
  const { t } = useTranslations();
  const navigate = useNavigate();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportText, setReportText] = useState('');

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: t('toast.logged_out', 'Logged out'),
        description: t('toast.logged_out_desc', 'You have been successfully logged out'),
      });
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: t('common.error', 'Error'),
        description: t('toast.logout_failed', 'Failed to log out. Please try again.'),
        variant: 'destructive',
      });
    }
  };

  const handleReport = () => {
    setIsReportDialogOpen(true);
  };

  const submitReport = () => {
    if (!reportText.trim()) {
      toast({
        title: t('common.error', 'Error'),
        description: t('toast.report.provide_desc', 'Please provide a description for your report'),
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: t('toast.report.submitted', 'Report Submitted'),
      description: t('toast.report.submitted_desc', 'Thank you for your feedback. We will review your report.'),
    });
    
    setReportText('');
    setIsReportDialogOpen(false);
  };

  if (!user) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <UserIcon className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">{user.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/my-profile')}>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>{t('nav.my_profile', 'My Profile')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleReport}>
            <Flag className="mr-2 h-4 w-4" />
            <span>{t('nav.report_issue', 'Report an Issue')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/help')}>
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>{t('nav.help_support', 'Help & Support')}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t('nav.log_out', 'Log out')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('nav.report_issue', 'Report an Issue')}</DialogTitle>
            <DialogDescription>
              {t('toast.report.dialog_desc', 'Please describe the issue you\'re experiencing or the content you want to report.')}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder={t('toast.report.placeholder', 'Describe the issue in detail...')}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t('common.cancel', 'Cancel')}</Button>
            </DialogClose>
            <Button onClick={submitReport}>{t('toast.report.submit', 'Submit Report')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserMenu;
