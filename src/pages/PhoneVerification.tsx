import { useState, useEffect } from 'react';
import { ArrowLeft, Phone, CheckCircle, Shield, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import BottomNavigation from '@/components/BottomNavigation';
import { usePhoneVerification } from '@/hooks/usePhoneVerification';
import { supabase } from '@/integrations/supabase/client';

const PhoneVerification = () => {
  const navigate = useNavigate();
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
          const { data: profile } = await supabase
            .from('profiles')
            .select('phone_verified, phone_number')
            .eq('id', user.id)
            .single();

          if (profile?.phone_verified) {
            setIsAlreadyVerified(true);
            setPhoneNumber(profile.phone_number || '');
          }
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkVerificationStatus();
  }, []);

  const handleSendCode = async () => {
    await sendVerificationCode(phoneNumber);
  };

  const handleVerifyCode = async () => {
    const success = await verifyCode(code);
    if (success) {
      setIsAlreadyVerified(true);
    }
  };

  if (checkingStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex flex-col">
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-24">
        {/* Header */}
        <div className="bg-black/20 backdrop-blur shadow-sm border-b border-white/20 sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Phone Verification</h1>
              <p className="text-sm text-purple-200">Verify your phone number</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto px-4 py-8">
          {isAlreadyVerified || verified ? (
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center py-8 gap-4 text-center">
                  <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="h-12 w-12 text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Phone Verified!</h2>
                  <p className="text-purple-200">
                    Your phone number ({phoneNumber}) has been verified
                  </p>
                  <Button 
                    onClick={() => navigate('/settings')}
                    className="mt-4"
                  >
                    Back to Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Benefits */}
              <Card className="bg-white/10 backdrop-blur border-white/20 mb-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="h-5 w-5 text-purple-400" />
                    Why Verify Your Phone?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-purple-200">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                      <span>Increase trust with other users</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                      <span>Recover your account if you lose access</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                      <span>Get important notifications via SMS</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                      <span>Unlock premium features</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Verification Form */}
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Phone className="h-5 w-5 text-purple-400" />
                    {codeSent ? 'Enter Verification Code' : 'Enter Your Phone Number'}
                  </CardTitle>
                  <CardDescription className="text-purple-200">
                    {codeSent 
                      ? `We sent a 6-digit code to ${phoneNumber}`
                      : 'We will send you a verification code via SMS'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!codeSent ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-white">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 234 567 8900"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 text-lg"
                        />
                        <p className="text-xs text-purple-300">
                          Include country code (e.g., +1 for US, +47 for Norway)
                        </p>
                      </div>

                      <Button 
                        onClick={handleSendCode} 
                        disabled={!phoneNumber || loading}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Phone className="mr-2 h-4 w-4" />
                            Send Verification Code
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-white">Verification Code</Label>
                        <div className="flex justify-center py-4">
                          <InputOTP
                            maxLength={6}
                            value={code}
                            onChange={(value) => setCode(value)}
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0} className="bg-white/10 border-white/30 text-white" />
                              <InputOTPSlot index={1} className="bg-white/10 border-white/30 text-white" />
                              <InputOTPSlot index={2} className="bg-white/10 border-white/30 text-white" />
                              <InputOTPSlot index={3} className="bg-white/10 border-white/30 text-white" />
                              <InputOTPSlot index={4} className="bg-white/10 border-white/30 text-white" />
                              <InputOTPSlot index={5} className="bg-white/10 border-white/30 text-white" />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                        {devCode && (
                          <p className="text-xs text-amber-400 text-center bg-amber-900/30 p-2 rounded">
                            Dev mode code: {devCode}
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
                          className="flex-1 border-white/20 text-white hover:bg-white/10"
                        >
                          Change Number
                        </Button>
                        <Button 
                          onClick={handleVerifyCode} 
                          disabled={code.length !== 6 || loading}
                          className="flex-1 bg-purple-600 hover:bg-purple-700"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            'Verify Code'
                          )}
                        </Button>
                      </div>

                      <Button 
                        variant="ghost" 
                        onClick={handleSendCode}
                        disabled={loading}
                        className="w-full text-purple-200 hover:text-white hover:bg-white/10"
                      >
                        Resend Code
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default PhoneVerification;
