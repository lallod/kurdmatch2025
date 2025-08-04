
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
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
          title: "Success!",
          description: "You have been logged in successfully.",
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to log in. Please try again.",
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="email@example.com" 
                    className="pl-10" 
                    type="email"
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
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
            <label htmlFor="remember" className="text-sm text-gray-400">Remember me</label>
          </div>
          
          <Button 
            type="button" 
            variant="link" 
            className="p-0 h-auto text-sm"
          >
            Forgot password?
          </Button>
        </div>
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
        
        <SocialLogin />
      </form>
    </Form>
  );
};

export default LoginForm;
