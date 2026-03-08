import { useState } from 'react';
import { Phone, CheckCircle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { usePhoneVerification } from '@/hooks/usePhoneVerification';
import { useTranslations } from '@/hooks/useTranslations';

interface PhoneVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerified?: () => void;
}

export const PhoneVerificationDialog = ({
  open,
  onOpenChange,
  onVerified,
}: PhoneVerificationDialogProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const { loading, codeSent, verified, devCode, sendVerificationCode, verifyCode, reset } = usePhoneVerification();
  const { t } = useTranslations();

  const handleSendCode = async () => {
    const success = await sendVerificationCode(phoneNumber);
    if (success) {
      setCode('');
    }
  };

  const handleVerifyCode = async () => {
    const success = await verifyCode(code);
    if (success) {
      onVerified?.();
      setTimeout(() => {
        onOpenChange(false);
        reset();
        setPhoneNumber('');
        setCode('');
      }, 1500);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    reset();
    setPhoneNumber('');
    setCode('');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            {t('verification.phone_verification', 'Phone Verification')}
          </DialogTitle>
          <DialogDescription>
            {t('verification.phone_description', 'Verify your phone number to increase trust and security')}
          </DialogDescription>
        </DialogHeader>

        {verified ? (
          <div className="flex flex-col items-center py-8 gap-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <p className="text-lg font-medium text-green-600">{t('verification.phone_verified', 'Phone Verified!')}</p>
          </div>
        ) : !codeSent ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">{t('verification.phone_number', 'Phone Number')}</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 234 567 8900"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="text-lg"
              />
              <p className="text-xs text-muted-foreground">
                {t('verification.include_country_code', 'Include country code (e.g., +1 for US, +44 for UK)')}
              </p>
            </div>

            <Button 
              onClick={handleSendCode} 
              disabled={!phoneNumber || loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('verification.sending', 'Sending...')}
                </>
              ) : (
                t('verification.send_code', 'Send Verification Code')
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('verification.enter_6_digit', 'Enter 6-digit code')}</Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={code}
                  onChange={(value) => setCode(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                {t('verification.code_sent_to', 'Code sent to {{phone}}', { phone: phoneNumber })}
              </p>
              {devCode && (
                <p className="text-xs text-amber-600 text-center bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
                  Dev mode: {devCode}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => {
                  reset();
                  setCode('');
                }}
                className="flex-1"
              >
                {t('verification.change_number', 'Change Number')}
              </Button>
              <Button 
                onClick={handleVerifyCode} 
                disabled={code.length !== 6 || loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('verification.verifying', 'Verifying...')}
                  </>
                ) : (
                  t('verification.verify', 'Verify')
                )}
              </Button>
            </div>

            <Button 
              variant="ghost" 
              onClick={handleSendCode}
              disabled={loading}
              className="w-full text-sm"
            >
              {t('verification.resend_code', 'Resend Code')}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
