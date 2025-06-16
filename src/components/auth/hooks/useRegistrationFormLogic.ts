
import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useNavigate } from 'react-router-dom';
import { useLocationManager } from '@/components/my-profile/sections/location/useLocationManager';
import { useAutoSave } from '@/hooks/useAutoSave';
import { registrationSchema, RegistrationFormValues } from '../utils/registrationSchema';
import { registrationSteps } from '../utils/registrationSteps';

export const useRegistrationFormLogic = () => {
  const { toast } = useToast();
  const { signUp } = useSupabaseAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [hasLoadedSavedData, setHasLoadedSavedData] = useState(false);
  
  // Ensure proper default values for all fields
  const defaultValues: RegistrationFormValues = {
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'male',
    height: '',
    bornIn: '',
    languages: [], // Ensure this is always an array
    occupation: '',
    location: '',
    dreamVacation: '',
    photos: [], // Ensure this is always an array
  };

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues,
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

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Load saved data on component mount
  useEffect(() => {
    if (!hasLoadedSavedData) {
      try {
        console.log('Loading saved data...');
        const savedData = loadSavedData();
        if (savedData) {
          console.log('Saved data found:', savedData);
          // Ensure languages field is always an array
          const processedData = {
            ...savedData.formData,
            languages: Array.isArray(savedData.formData.languages) ? savedData.formData.languages : [],
            photos: Array.isArray(savedData.formData.photos) ? savedData.formData.photos : []
          };
          
          console.log('Processed data:', processedData);
          
          // Reset form with processed data
          form.reset(processedData);
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
        } else {
          console.log('No saved data found, using defaults');
          form.reset(defaultValues);
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
        // Ensure form has proper defaults even if loading fails
        form.reset(defaultValues);
      }
      setHasLoadedSavedData(true);
    }
  }, [hasLoadedSavedData, loadSavedData, getLastSavedTime, toast, form]);

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

  const validateStep = async (stepIndex: number) => {
    try {
      const currentStepFields = registrationSteps[stepIndex - 1].fields;
      console.log('Validating step', stepIndex, 'with fields:', currentStepFields);
      
      const result = await form.trigger(currentStepFields);
      console.log('Validation result:', result);
      
      if (result) {
        if (!completedSteps.includes(stepIndex)) {
          setCompletedSteps([...completedSteps, stepIndex]);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error during validation:', error);
      return false;
    }
  };

  const nextStep = async () => {
    try {
      const isValid = await validateStep(step);
      if (isValid && step < registrationSteps.length) {
        setStep(step + 1);
      }
    } catch (error) {
      console.error('Error in nextStep:', error);
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
      
      clearSavedData();
      
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

  return {
    form,
    step,
    setStep,
    completedSteps,
    isSubmitting,
    location,
    locationLoading,
    nextStep,
    prevStep,
    onSubmit,
  };
};
