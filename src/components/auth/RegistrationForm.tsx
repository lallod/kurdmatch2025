
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { 
  CheckCircle,
  Circle,
  ChevronRight, 
  ChevronLeft,
  Mail, 
  User, 
  Lock, 
  Calendar,
  MapPin,
  Briefcase,
  Loader2 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const registrationSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  confirmPassword: z.string(),
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  dateOfBirth: z.string().refine(value => {
    const date = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    return age >= 18;
  }, { message: 'You must be at least 18 years old' }),
  location: z.string().min(2, { message: 'Location is required' }),
  occupation: z.string().optional(),
  aboutMe: z.string().max(500, { message: 'Bio must be less than 500 characters' }).optional(),
  termsAccepted: z.boolean().refine(val => val === true, { message: 'You must accept the terms and conditions' }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

const RegistrationForm = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      location: '',
      occupation: '',
      aboutMe: '',
      termsAccepted: false,
    },
    mode: 'onChange',
  });

  const { formState } = form;
  const isSubmitting = formState.isSubmitting;

  const steps = [
    { title: "Account", fields: ["email", "password", "confirmPassword"] },
    { title: "Personal", fields: ["firstName", "lastName", "dateOfBirth", "location"] },
    { title: "Profile", fields: ["occupation", "aboutMe", "termsAccepted"] },
  ];

  const validateStep = async (stepIndex: number) => {
    const currentStepFields = steps[stepIndex - 1].fields as Array<keyof RegistrationFormValues>;
    
    const result = await form.trigger(currentStepFields);
    if (result) {
      if (!completedSteps.includes(stepIndex)) {
        setCompletedSteps([...completedSteps, stepIndex]);
      }
      return true;
    }
    return false;
  };

  const nextStep = async () => {
    const isValid = await validateStep(step);
    if (isValid && step < steps.length) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const onSubmit = async (data: RegistrationFormValues) => {
    try {
      // Add registration logic here (in a real app this would connect to an auth service)
      // Registration form submitted
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Success!",
        description: "Your account has been created successfully.",
      });

      // In a real app, redirect to login page or dashboard after successful registration
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex justify-between items-center mb-6">
        {steps.map((s, idx) => (
          <React.Fragment key={idx}>
            <div 
              className={`flex flex-col items-center cursor-pointer`} 
              onClick={() => completedSteps.includes(idx + 1) && setStep(idx + 1)}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center 
                ${step === idx + 1 ? 'bg-primary text-primary-foreground' : 
                  completedSteps.includes(idx + 1) ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}
              `}>
                {completedSteps.includes(idx + 1) ? <CheckCircle size={16} /> : idx + 1}
              </div>
              <span className={`text-xs mt-1 ${step === idx + 1 ? 'font-medium' : 'text-muted-foreground'}`}>
                {s.title}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`w-full h-1 max-w-16 ${completedSteps.includes(idx + 2) ? 'bg-primary/60' : 'bg-muted'}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderFormByStep = () => {
    switch (step) {
      case 1:
        return (
          <>
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
                        placeholder="Create a strong password" 
                        className="pl-10" 
                        type="password"
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs">
                    Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number
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
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Confirm your password" 
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
          </>
        );
      case 2:
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="John" 
                          className="pl-10" 
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
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Doe" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="date" 
                        className="pl-10" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs">
                    You must be at least 18 years old to register
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="City, Country" 
                        className="pl-10" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      case 3:
        return (
          <>
            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Occupation</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Software Engineer, Doctor, Artist, etc." 
                        className="pl-10" 
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
              name="aboutMe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About Me</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us a bit about yourself..." 
                      className="resize-none min-h-[100px]" 
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    {field.value?.length || 0}/500 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
                  <FormControl>
                    <div 
                      className={`rounded-full p-1 cursor-pointer ${field.value ? 'text-primary' : 'text-muted-foreground'}`}
                      onClick={() => field.onChange(!field.value)}
                    >
                      {field.value ? <CheckCircle size={20} /> : <Circle size={20} />}
                    </div>
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm">
                      I agree to the Terms of Service and Privacy Policy
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {renderStepIndicator()}
        
        {renderFormByStep()}
        
        <div className="flex justify-between mt-6">
          {step > 1 ? (
            <Button 
              type="button" 
              variant="outline" 
              onClick={prevStep}
              className="gap-2"
            >
              <ChevronLeft size={16} />
              Back
            </Button>
          ) : (
            <div></div>
          )}
          
          {step < steps.length ? (
            <Button 
              type="button" 
              onClick={nextStep}
              className="gap-2"
            >
              Next
              <ChevronRight size={16} />
            </Button>
          ) : (
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default RegistrationForm;
