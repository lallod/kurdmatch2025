
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  ChevronRight, 
  ChevronLeft,
  Mail, 
  User, 
  Lock, 
  Calendar,
  MapPin,
  Camera,
  Loader2 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useNavigate } from 'react-router-dom';

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
  gender: z.string().min(1, { message: 'Please select your gender' }),
  location: z.string().min(2, { message: 'Location is required' }),
  bio: z.string().max(500, { message: 'Bio must be less than 500 characters' }).optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

const SimpleRegistrationForm = () => {
  const { toast } = useToast();
  const { signUp } = useSupabaseAuth();
  const navigate = useNavigate();
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
      gender: '',
      location: '',
      bio: '',
    },
    mode: 'onChange',
  });

  const { formState } = form;
  const isSubmitting = formState.isSubmitting;

  const steps = [
    { 
      title: "Email & Password", 
      fields: ["email", "password", "confirmPassword"],
      icon: Mail,
      description: "Create your secure account"
    },
    { 
      title: "Basic Info", 
      fields: ["firstName", "lastName", "dateOfBirth", "gender"],
      icon: User,
      description: "Tell us about yourself"
    },
    { 
      title: "Location & Bio", 
      fields: ["location", "bio"],
      icon: MapPin,
      description: "Where are you from?"
    },
    { 
      title: "Photos", 
      fields: [],
      icon: Camera,
      description: "Add your best photos"
    },
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
    if (step === 4) {
      // Skip photo validation for now - will be handled in final implementation
      setStep(step + 1);
      return;
    }
    
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
      console.log('Registration form submitted:', data);
      
      const { data: signUpData, error: signUpError } = await signUp(data.email, data.password);
      if (signUpError) throw signUpError;
      
      // TODO: Create profile with additional data
      
      toast({
        title: "Success!",
        description: "Your account has been created. Please check your email to verify your account.",
      });

      navigate('/auth');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex justify-between items-center mb-8">
        {steps.map((s, idx) => {
          const StepIcon = s.icon;
          return (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center mb-2
                  ${step === idx + 1 ? 'bg-purple-500 text-white' : 
                    completedSteps.includes(idx + 1) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}
                `}>
                  {completedSteps.includes(idx + 1) ? <CheckCircle size={20} /> : <StepIcon size={20} />}
                </div>
                <span className={`text-xs text-center max-w-20 ${step === idx + 1 ? 'font-medium text-purple-600' : 'text-gray-500'}`}>
                  {s.title}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 ${completedSteps.includes(idx + 2) ? 'bg-green-500' : step > idx + 1 ? 'bg-purple-500' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const renderFormByStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{steps[0].title}</h2>
              <p className="text-gray-600 mt-1">{steps[0].description}</p>
            </div>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="your@email.com" 
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
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Create a strong password" 
                        className="pl-10" 
                        type="password"
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs">
                    Must be 8+ characters with uppercase, lowercase, and number
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
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
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
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{steps[1].title}</h2>
              <p className="text-gray-600 mt-1">{steps[1].description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
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
                      <Input placeholder="Doe" {...field} />
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
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        type="date" 
                        className="pl-10" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs">
                    You must be at least 18 years old
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="man">Man</SelectItem>
                      <SelectItem value="woman">Woman</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{steps[2].title}</h2>
              <p className="text-gray-600 mt-1">{steps[2].description}</p>
            </div>
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Location</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
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
            
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About Me (Optional)</FormLabel>
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
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{steps[3].title}</h2>
              <p className="text-gray-600 mt-1">{steps[3].description}</p>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Your Photos</h3>
              <p className="text-gray-600 mb-4">Add at least one photo to complete your profile</p>
              <Button type="button" variant="outline">
                Choose Photos
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                JPG, PNG up to 10MB each. Minimum 1 photo required.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {renderStepIndicator()}
        
        {renderFormByStep()}
        
        <div className="flex justify-between mt-8 pt-6 border-t">
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
              className="gap-2 bg-purple-500 hover:bg-purple-600"
            >
              Continue
              <ChevronRight size={16} />
            </Button>
          ) : (
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="gap-2 bg-purple-500 hover:bg-purple-600"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Complete Registration"
              )}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default SimpleRegistrationForm;
