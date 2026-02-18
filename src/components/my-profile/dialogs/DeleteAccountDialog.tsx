
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertTriangle, Clock, Shield, Eye, EyeOff, ArrowLeft, ArrowRight } from 'lucide-react';
import { requestAccountDeletion } from '@/api/accountActions';
import { toast } from 'sonner';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useTranslations } from '@/hooks/useTranslations';

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteAccountDialog: React.FC<DeleteAccountDialogProps> = ({ open, onOpenChange }) => {
  const { t } = useTranslations();
  const [step, setStep] = useState(1);
  const [deletionType, setDeletionType] = useState<'deactivate' | 'delete'>('deactivate');
  const [password, setPassword] = useState('');
  const [reason, setReason] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signOut } = useSupabaseAuth();

  const resetDialog = () => {
    setStep(1);
    setDeletionType('deactivate');
    setPassword('');
    setReason('');
    setShowPassword(false);
  };

  const handleClose = () => {
    resetDialog();
    onOpenChange(false);
  };

  const handleFinalConfirmation = async () => {
    if (!password.trim()) {
      toast.error(t('toast.account.enter_password', 'Please enter your password to confirm'));
      return;
    }

    setIsLoading(true);
    try {
      const result = await requestAccountDeletion(deletionType, reason);
      
      if (result.type === 'deactivated') {
        toast.success(t('toast.account.deactivated', 'Account deactivated. You can reactivate by logging in again.'));
        await signOut();
      } else {
        toast.success(t('toast.account.deletion_scheduled', 'Account deletion scheduled. You have 30 days to cancel this request.'));
      }
      
      handleClose();
    } catch (error: any) {
      console.error('Account deletion error:', error);
      toast.error(error.message || t('toast.account.deletion_failed', 'Failed to process account deletion request'));
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <Card className="bg-red-500/10 border-red-500/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
            <div>
              <h4 className="text-red-300 font-medium mb-1">{t('account.important_decision', 'Important Decision')}</h4>
              <p className="text-sm text-red-200">
                {t('account.important_decision_desc', 'This action will affect your account and data. Please choose carefully.')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Label className="text-white text-base">{t('account.choose_action', 'Choose an action:')}</Label>
        <RadioGroup value={deletionType} onValueChange={(value: 'deactivate' | 'delete') => setDeletionType(value)}>
          <Card className="bg-gray-800/50 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="deactivate" id="deactivate" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="deactivate" className="text-white font-medium cursor-pointer">
                    {t('account.deactivate', 'Deactivate Account')}
                  </Label>
                  <p className="text-sm text-gray-400 mt-1">
                    {t('account.deactivate_desc', 'Hide your profile temporarily. You can reactivate anytime by logging in again.')}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Eye className="w-4 h-4 text-orange-400" />
                    <span className="text-xs text-orange-300">{t('account.reversible', 'Reversible • Data preserved')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="delete" id="delete" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="delete" className="text-white font-medium cursor-pointer">
                    {t('account.delete', 'Delete Account')}
                  </Label>
                  <p className="text-sm text-gray-400 mt-1">
                    {t('account.delete_desc', 'Permanently remove your account. You have 30 days to cancel this request.')}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-4 h-4 text-red-400" />
                    <span className="text-xs text-red-300">{t('account.grace_period', '30-day grace period • Data archived')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </RadioGroup>
      </div>

      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={handleClose}
          className="flex-1 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
        >
          {t('common.cancel', 'Cancel')}
        </Button>
        <Button 
          onClick={() => setStep(2)}
          className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        >
          {t('common.continue', 'Continue')}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <Card className="bg-blue-500/10 border-blue-500/30">
        <CardContent className="p-4">
          <h4 className="text-blue-300 font-medium mb-2">
            {deletionType === 'deactivate' ? t('account.deactivate', 'Account Deactivation') : t('account.delete', 'Account Deletion')}
          </h4>
          <p className="text-sm text-blue-200">
            {deletionType === 'deactivate' 
              ? t('account.deactivate_desc', 'Your profile will be hidden from other users, but all your data will be preserved. You can reactivate at any time by logging in.')
              : t('account.delete_desc', 'Your account will be scheduled for deletion in 30 days. During this time, you can cancel the request by logging in.')
            }
          </p>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <div>
          <Label className="text-purple-200">{t('account.reason_label', 'Reason (Optional)')}</Label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t('account.reason_placeholder', 'Help us improve by sharing why you\'re leaving...')}
            className="bg-gray-800 border-gray-600 text-white"
            rows={3}
          />
        </div>

        <div>
          <Label className="text-purple-200">{t('account.confirm_password', 'Confirm Password')}</Label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('account.password_placeholder', 'Enter your password to confirm')}
              className="bg-gray-800 border-gray-600 text-white pr-10"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={() => setStep(1)}
          className="flex-1 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('common.back', 'Back')}
        </Button>
        <Button 
          onClick={() => setStep(3)}
          className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          disabled={!password.trim()}
        >
          {t('common.continue', 'Continue')}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <Card className="bg-red-500/10 border-red-500/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-red-400 mt-0.5" />
            <div>
              <h4 className="text-red-300 font-medium mb-1">{t('account.final_confirmation', 'Final Confirmation')}</h4>
              <p className="text-sm text-red-200">
                {deletionType === 'deactivate' 
                  ? t('account.deactivate_desc', 'Your account will be deactivated immediately. You can reactivate by logging in again.')
                  : t('account.delete_desc', 'Your account will be scheduled for deletion in 30 days. You can cancel this request by logging in before the deadline.')
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-4">
          <h4 className="text-white font-medium mb-3">{t('account.summary', 'Summary')}</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">{t('account.action', 'Action:')}</span>
              <span className="text-white capitalize">{deletionType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">{t('account.effect', 'Effect:')}</span>
              <span className="text-white">
                {deletionType === 'deactivate' ? t('account.immediate', 'Immediate') : t('account.thirty_day_delay', '30-day delay')}
              </span>
            </div>
            {reason && (
              <div className="flex justify-between">
                <span className="text-gray-400">{t('account.reason_label', 'Reason:')}</span>
                <span className="text-white text-right max-w-32 truncate">{reason}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={() => setStep(2)}
          className="flex-1 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
          disabled={isLoading}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('common.back', 'Back')}
        </Button>
        <Button 
          onClick={handleFinalConfirmation}
          className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
          disabled={isLoading}
        >
          {isLoading ? t('common.processing', 'Processing...') : (deletionType === 'deactivate' ? t('account.confirm_deactivation', 'Confirm Deactivation') : t('account.confirm_deletion', 'Confirm Deletion'))}
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
            {t('account.management_step', 'Account Management - Step {{step}} of 3', { step })}
          </DialogTitle>
        </DialogHeader>
        
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccountDialog;
