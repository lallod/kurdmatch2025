
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Mail, User, MapPin, Camera, LucideIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useNavigate } from 'react-router-dom';
import { useLocationManager } from '@/components/my-profile/sections/location/useLocationManager';
import { useAutoSave } from '@/hooks/useAutoSave';

// Import the new components
import StepIndicator from '@/components/auth/components/StepIndicator';
import AccountStep from '@/components/auth/components/AccountStep';
import BasicInfoStep from '@/components/auth/components/BasicInfoStep';
import LocationBioStep from '@/components/auth/components/LocationBioStep';
import PhotoUploadStep from '@/components/auth/components/PhotoUploadStep';
import FormNavigation from '@/components/auth/components/FormNavigation';
import AutoSaveIndicator from '@/components/auth/components/AutoSaveIndicator';

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
  gender: z.enum(['male', 'female'], { message: 'Please select your gender' }),
  height: z.string().min(1, { message: 'Height is required' }),
  bornIn: z.string().min(2, { message: 'Born in country is required' }),
  languages: z.array(z.string()).min(1, { message: 'Please select at least one language' }),
  occupation: z.string().min(1, { message: 'Occupation is required' }),
  location: z.string().min(2, { message: 'Location is required' }),
  dreamVacation: z.string().optional(),
  photos: z.array(z.string()).min(1, { message: 'At least one photo is required' }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

interface Step {
  title: string;
  fields: Array<keyof RegistrationFormValues>;
  icon: LucideIcon;
  description: string;
}

const SimpleRegistrationForm = () => {
  const { toast } = useToast();
  const { signUp } = useSupabaseAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [hasLoadedSavedData, setHasLoadedSavedData] = useState(false);
  
  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'male',
      height: '',
      bornIn: '',
      languages: [],
      occupation: '',
      location: '',
      dreamVacation: '',
      photos: [],
    },
    mode: 'onChange',
  });

  const { formState } = form;
  const isSubmitting = formState.isSubmitting;

  // Auto-save integration
  const { loadSavedData, clearSavedData, getLastSavedTime } = useAutoSave({
    form,
    currentStep: step,
    completedSteps,
    isSubmitting,
  });

  // Location management for step 3
  const { location, handleLocationDetection, isLoading: locationLoading } = useLocationManager('');

  // Load saved data on component mount
  useEffect(() => {
    if (!hasLoadedSavedData) {
      const savedData = loadSavedData();
      if (savedData) {
        setStep(savedData.currentStep);
        setCompletedSteps(savedData.completedSteps);
        
        const lastSavedTime = getLastSavedTime();
        if (lastSavedTime) {
          const timeAgo = Math.round((Date.now() - lastSavedTime) / (1000 * 60));
          toast({
            title: "Welcome back!",
            description: `Resuming your registration from ${timeAgo} minute${timeAgo !== 1 ? 's' : ''} ago.`,
          });
        }
      }
      setHasLoadedSavedData(true);
    }
  }, [hasLoadedSavedData, loadSavedData, getLastSavedTime, toast]);

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

  // Prevent accidental navigation away
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (step > 1 && !isSubmitting) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [step, isSubmitting]);

  const steps: Step[] = [
    { 
      title: "Email & Password", 
      fields: ["email", "password", "confirmPassword"],
      icon: Mail,
      description: "Create your secure account"
    },
    { 
      title: "Basic Info", 
      fields: ["firstName", "lastName", "dateOfBirth", "gender", "height", "bornIn", "languages", "occupation"],
      icon: User,
      description: "Tell us about yourself"
    },
    { 
      title: "Location & Travel", 
      fields: ["location", "dreamVacation"],
      icon: MapPin,
      description: "Where are you from and where do you dream to go?"
    },
    { 
      title: "Photos", 
      fields: ["photos"],
      icon: Camera,
      description: "Add your best photos"
    },
  ];

  const validateStep = async (stepIndex: number) => {
    const currentStepFields = steps[stepIndex - 1].fields;
    
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
      
      // Clear saved data on successful submission
      clearSavedData();
      
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

  const renderFormByStep = () => {
    switch (step) {
      case 1:
        return <AccountStep form={form} />;
      case 2:
        return <BasicInfoStep form={form} />;
      case 3:
        return <LocationBioStep form={form} location={location} locationLoading={locationLoading} />;
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
        <StepIndicator 
          currentStep={step}
          completedSteps={completedSteps}
          steps={steps}
        />
        
        <AutoSaveIndicator />
        
        {renderFormByStep()}
        
        <FormNavigation
          currentStep={step}
          totalSteps={steps.length}
          onPrevStep={prevStep}
          onNextStep={nextStep}
          isSubmitting={isSubmitting}
        />
      </form>
    </Form>
  );
};

export default SimpleRegistrationForm;
