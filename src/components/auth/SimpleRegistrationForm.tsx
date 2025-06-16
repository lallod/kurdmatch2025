
import React, { useState, useEffect } from 'react';
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
import PhotoUploadStep from '@/components/auth/components/PhotoUploadStep';
import { useLocationManager } from '@/components/my-profile/sections/location/useLocationManager';

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
  photos: z.array(z.string()).min(1, { message: 'At least one photo is required' }),
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
      photos: [],
    },
    mode: 'onChange',
  });

  const { formState } = form;
  const isSubmitting = formState.isSubmitting;

  // Location management for step 3
  const { location, handleLocationDetection, isLoading: locationLoading } = useLocationManager('');

  // Auto-detect location when reaching step 3
  useEffect(() => {
    if (step === 3 && !form.getValues('location')) {
      handleLocationDetection();
    }
  }, [step]);

  // Update form when location is detected
  useEffect(() => {
    if (location && step === 3) {
      form.setValue('location', location, { shouldValidate: true });
    }
  }, [location, step, form]);

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
      fields: ["photos"],
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
      
      // TODO: Create profile with additional data including photos
      
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
                  w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300
                  ${step === idx + 1 ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-110' : 
                    completedSteps.includes(idx + 1) ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' : 'bg-white/20 backdrop-blur text-gray-400 border border-white/30'}
                `}>
                  {completedSteps.includes(idx + 1) ? <CheckCircle size={20} /> : <StepIcon size={20} />}
                </div>
                <span className={`text-xs text-center max-w-20 transition-colors ${step === idx + 1 ? 'font-medium text-white' : 'text-gray-300'}`}>
                  {s.title}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 rounded transition-all duration-500 ${
                  completedSteps.includes(idx + 2) ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 
                  step > idx + 1 ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-white/20'
                }`} />
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
              <h2 className="text-2xl font-bold text-white">{steps[0].title}</h2>
              <p className="text-gray-300 mt-1">{steps[0].description}</p>
            </div>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                      <Input 
                        placeholder="your@email.com" 
                        className="pl-10 bg-white/10 backdrop-blur border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20" 
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
                  <FormLabel className="text-white">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                      <Input 
                        placeholder="Create a strong password" 
                        className="pl-10 bg-white/10 backdrop-blur border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20" 
                        type="password"
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-gray-400">
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
                  <FormLabel className="text-white">Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                      <Input 
                        placeholder="Confirm your password" 
                        className="pl-10 bg-white/10 backdrop-blur border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20" 
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
              <h2 className="text-2xl font-bold text-white">{steps[1].title}</h2>
              <p className="text-gray-300 mt-1">{steps[1].description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" className="bg-white/10 backdrop-blur border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20" {...field} />
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
                    <FormLabel className="text-white">Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" className="bg-white/10 backdrop-blur border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20" {...field} />
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
                  <FormLabel className="text-white">Date of Birth</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                      <Input 
                        type="date" 
                        className="pl-10 bg-white/10 backdrop-blur border-white/20 text-white focus:border-purple-500 focus:ring-purple-500/20" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-gray-400">
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
                  <FormLabel className="text-white">Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/10 backdrop-blur border-white/20 text-white focus:border-purple-500 focus:ring-purple-500/20">
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-900/95 backdrop-blur border-white/20">
                      <SelectItem value="man" className="text-white hover:bg-white/10">Man</SelectItem>
                      <SelectItem value="woman" className="text-white hover:bg-white/10">Woman</SelectItem>
                      <SelectItem value="non-binary" className="text-white hover:bg-white/10">Non-binary</SelectItem>
                      <SelectItem value="prefer-not-to-say" className="text-white hover:bg-white/10">Prefer not to say</SelectItem>
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
              <h2 className="text-2xl font-bold text-white">{steps[2].title}</h2>
              <p className="text-gray-300 mt-1">{steps[2].description}</p>
            </div>
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Current Location</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                      {locationLoading ? (
                        <div className="flex items-center gap-2 p-3 bg-white/10 backdrop-blur border border-white/20 rounded-lg text-white">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Detecting your location...</span>
                        </div>
                      ) : (
                        <Input 
                          placeholder="Detecting location..." 
                          className="pl-10 bg-white/10 backdrop-blur border-white/20 text-white placeholder:text-gray-400 cursor-not-allowed opacity-75" 
                          value={field.value}
                          readOnly
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-gray-400">
                    Your location is automatically detected. You can change this later in settings.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">About Me (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us a bit about yourself..." 
                      className="resize-none min-h-[100px] bg-white/10 backdrop-blur border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20" 
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-400">
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
              <h2 className="text-2xl font-bold text-white">{steps[3].title}</h2>
              <p className="text-gray-300 mt-1">{steps[3].description}</p>
            </div>
            
            <PhotoUploadStep 
              form={form}
              question={{ id: 'photos', profileField: 'photos' } as any}
            />
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
        
        <div className="flex justify-between mt-8 pt-6 border-t border-white/20">
          {step > 1 ? (
            <Button 
              type="button" 
              variant="outline" 
              onClick={prevStep}
              className="gap-2 bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20"
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
              className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
            >
              Continue
              <ChevronRight size={16} />
            </Button>
          ) : (
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
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
