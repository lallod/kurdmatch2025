import { useState, useEffect } from 'react';
import { ArrowLeft, Phone, CheckCircle, Shield, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { usePhoneVerification } from '@/hooks/usePhoneVerification';
import { supabase } from '@/integrations/supabase/client';
import { useTranslations } from '@/hooks/useTranslations';

const PhoneVerification = () => {
  const navigate = useNavigate();
  const { t } = useTranslations();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [isAlreadyVerified, setIsAlreadyVerified] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const { loading, codeSent, verified, devCode, sendVerificationCode, verifyCode, reset } = usePhoneVerification();

  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase.from('profiles').select('phone_verified, phone_number').eq('id', user.id).single();
          if (profile?.phone_verified) { setIsAlreadyVerified(true); setPhoneNumber(profile.phone_number || ''); }
        }
      } catch (error) { console.error('Error checking verification status:', error); }
      finally { setCheckingStatus(false); }
    };
    checkVerificationStatus();
  }, []);

  const handleSendCode = async () => { await sendVerificationCode(phoneNumber); };
  const handleVerifyCode = async () => { const success = await verifyCode(code); if (success) setIsAlreadyVerified(true); };

  if (checkingStatus) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-24">
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/10">
          <div className="max-w-md mx-auto px-4 h-12 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></Button>
            <div>
              <h1 className="text-lg font-bold text-foreground">{t('phone.title', 'Phone Verification')}</h1>
              <p className="text-xs text-muted-foreground">{t('phone.subtitle', 'Verify your phone number')}</p>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 py-8">
          {isAlreadyVerified || verified ? (
            <Card className="bg-card border-border/20">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center py-8 gap-4 text-center">
                  <div className="h-20 w-20 rounded-full bg-success/20 flex items-center justify-center">
                    <CheckCircle className="h-12 w-12 text-success" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">{t('phone.verified_title', 'Phone Verified!')}</h2>
                  <p className="text-muted-foreground">{t('phone.verified_desc', 'Your phone number ({{phone}}) has been verified').replace('{{phone}}', phoneNumber)}</p>
                  <Button onClick={() => navigate('/settings')} className="mt-4">{t('phone.back_to_settings', 'Back to Settings')}</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="bg-card border-border/20 mb-6">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2"><Shield className="h-5 w-5 text-primary" />{t('phone.why_verify', 'Why Verify Your Phone?')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-muted-foreground">
                    {[t('phone.benefit_trust', 'Increase trust with other users'), t('phone.benefit_recover', 'Recover your account if you lose access'), t('phone.benefit_sms', 'Get important notifications via SMS'), t('phone.benefit_premium', 'Unlock premium features')].map((item, i) => (
                      <li key={i} className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" /><span>{item}</span></li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/20">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    {codeSent ? t('phone.enter_code', 'Enter Verification Code') : t('phone.enter_phone', 'Enter Your Phone Number')}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {codeSent ? t('phone.code_sent_to', 'We sent a 6-digit code to {{phone}}').replace('{{phone}}', phoneNumber) : t('phone.will_send_code', 'We will send you a verification code via SMS')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!codeSent ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-foreground">{t('phone.phone_number', 'Phone Number')}</Label>
                        <Input id="phone" type="tel" placeholder="+1 234 567 8900" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="text-lg" />
                        <p className="text-xs text-muted-foreground">{t('phone.include_country_code', 'Include country code (e.g., +1 for US, +47 for Norway)')}</p>
                      </div>
                      <Button onClick={handleSendCode} disabled={!phoneNumber || loading} className="w-full">
                        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('phone.sending', 'Sending...')}</> : <><Phone className="mr-2 h-4 w-4" />{t('phone.send_code', 'Send Verification Code')}</>}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-foreground">{t('phone.verification_code', 'Verification Code')}</Label>
                        <div className="flex justify-center py-4">
                          <InputOTP maxLength={6} value={code} onChange={(value) => setCode(value)}>
                            <InputOTPGroup>
                              {[0,1,2,3,4,5].map(i => <InputOTPSlot key={i} index={i} />)}
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                        {devCode && <p className="text-xs text-warning text-center bg-warning/10 p-2 rounded">Dev mode code: {devCode}</p>}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => { reset(); setCode(''); }} className="flex-1">{t('phone.change_number', 'Change Number')}</Button>
                        <Button onClick={handleVerifyCode} disabled={code.length !== 6 || loading} className="flex-1">
                          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('phone.verifying', 'Verifying...')}</> : t('phone.verify_code', 'Verify Code')}
                        </Button>
                      </div>
                      <Button variant="ghost" onClick={handleSendCode} disabled={loading} className="w-full text-muted-foreground">{t('phone.resend_code', 'Resend Code')}</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhoneVerification;
