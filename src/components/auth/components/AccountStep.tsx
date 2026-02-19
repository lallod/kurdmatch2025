import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Mail, Lock, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useEmailValidation } from '@/hooks/useEmailValidation';
import { Link } from 'react-router-dom';
import { useTranslations } from '@/hooks/useTranslations';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';

interface AccountStepProps {
  form: UseFormReturn<any>;
}

const AccountStep = ({ form }: AccountStepProps) => {
  const { t } = useTranslations();
  const { isChecking, isEmailTaken, validationMessage, checkEmail } = useEmailValidation();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/30"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gradient-to-r from-primary-dark to-primary px-2 sm:px-3 text-primary-foreground/80 text-xs sm:text-sm">
            {t('auth.or_sign_up_email', 'Or sign up with email')}
          </span>
        </div>
      </div>
      
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white text-sm">{t('auth.email_address', 'Email Address')}</FormLabel>
            <FormControl>
              <div className="relative">
                <Mail className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3 h-4 w-4 text-primary" />
                <Input 
                  placeholder={t('auth.email_placeholder', 'your@email.com')}
                  className="pl-9 sm:pl-10 h-9 sm:h-10 text-sm bg-white/10 backdrop-blur border-white/30 text-white placeholder:text-white/60 focus:border-primary focus:ring-primary/20"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    checkEmail(e.target.value);
                  }}
                />
              </div>
            </FormControl>
            
            {/* Live validation feedback - always reserve space */}
            <div className="min-h-[20px] mt-2" data-testid="email-validation-container">
              {validationMessage && (
                <div className="flex items-center gap-2 text-xs transition-all duration-200">
                  {isChecking && (
                    <span className="text-warning flex items-center gap-1 animate-pulse font-medium">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      {validationMessage}
                    </span>
                  )}
                  {!isChecking && isEmailTaken && (
                    <span className="text-destructive flex items-center gap-1 font-medium">
                      <XCircle className="w-3 h-3" />
                      {validationMessage}{' '}
                      <Link to="/auth" className="underline hover:text-destructive/80 transition-colors">
                        {t('auth.sign_in_question', 'Sign in?')}
                      </Link>
                    </span>
                  )}
                  {!isChecking && !isEmailTaken && field.value?.includes('@') && (
                    <span className="text-success flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      {validationMessage}
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white text-sm">{t('auth.password', 'Password')}</FormLabel>
            <FormControl>
              <div className="relative">
                <Lock className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3 h-4 w-4 text-primary" />
                <Input 
                  placeholder={t('auth.create_strong_password', 'Create a strong password')}
                  className="pl-9 sm:pl-10 h-9 sm:h-10 text-sm bg-white/10 backdrop-blur border-white/30 text-white placeholder:text-white/60 focus:border-primary focus:ring-primary/20"
                  type="password"
                  autoComplete="new-password"
                  {...field} 
                />
              </div>
            </FormControl>
            <FormDescription className="text-xs text-primary-foreground/70">
              {t('auth.password_requirements', 'Must be 8+ characters with uppercase, lowercase, and number')}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white text-sm">{t('auth.confirm_password', 'Confirm Password')}</FormLabel>
            <FormControl>
              <div className="relative">
                <Lock className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3 h-4 w-4 text-primary" />
                <Input 
                  placeholder={t('auth.confirm_your_password', 'Confirm your password')}
                  className="pl-9 sm:pl-10 h-9 sm:h-10 text-sm bg-white/10 backdrop-blur border-white/30 text-white placeholder:text-white/60 focus:border-primary focus:ring-primary/20"
                  type="password"
                  autoComplete="new-password"
                  {...field} 
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AccountStep;
