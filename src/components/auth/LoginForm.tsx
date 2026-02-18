
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SocialLogin from './components/SocialLogin';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useTranslations } from '@/hooks/useTranslations';
import { supabase } from '@/integrations/supabase/client';
import { SecureInput } from '@/components/security/SecureInput';
import { emailSchema } from '@/utils/security/input-validation';
import { z } from 'zod';

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onLoginSuccess?: (email: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const { toast } = useToast();
  const { signIn } = useSupabaseAuth();
  const navigate = useNavigate();
  const { t } = useTranslations();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { formState } = form;
  const isSubmitting = formState.isSubmitting;

  const onSubmit = async (data: LoginFormValues) => {
    try {
      // Login form submitted
      
      const { error } = await signIn(data.email, data.password);
      
      if (error) throw error;

      if (onLoginSuccess) {
        onLoginSuccess(data.email);
      } else {
        // Default behavior if no callback provided
        toast({
          title: t('toast.login.success', 'Success!'),
          description: t('toast.login.success_desc', 'You have been logged in successfully.'),
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: t('common.error', 'Error'),
        description: error.message || t('toast.login.error', 'Failed to log in. Please try again.'),
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <SecureInput
                label="Email"
                value={field.value}
                onChange={field.onChange}
                type="email"
                maxLength={255}
                placeholder="email@example.com"
                required
                showValidation
                error={form.formState.errors.email?.message}
              />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.password', 'Password')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="******" 
                    className="pl-10" 
                    type="password"
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="remember" 
              className="h-4 w-4 rounded border-gray-600/50 bg-transparent" 
            />
            <label htmlFor="remember" className="text-sm text-gray-400">{t('auth.remember_me', 'Remember me')}</label>
          </div>
          
          <Button 
            type="button" 
            variant="link" 
            className="p-0 h-auto text-sm"
            onClick={async () => {
              const email = form.getValues('email');
              if (!email) {
                toast({ title: t('toast.login.enter_email', 'Enter your email'), description: t('toast.login.enter_email_desc', 'Please enter your email address first'), variant: 'destructive' });
                return;
              }
              try {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                  redirectTo: `${window.location.origin}/reset-password`,
                });
                if (error) throw error;
                toast({ title: t('toast.login.check_email', 'Check your email'), description: t('toast.login.reset_link_sent', 'We sent you a password reset link.') });
              } catch (err: any) {
                toast({ title: t('common.error', 'Error'), description: err.message, variant: 'destructive' });
              }
            }}
          >
            {t('auth.forgot_password', 'Forgot password?')}
          </Button>
        </div>
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('auth.signing_in', 'Signing in...')}
            </>
          ) : (
            t('auth.sign_in', 'Sign in')
          )}
        </Button>
        
        <SocialLogin />
      </form>
    </Form>
  );
};

export default LoginForm;
