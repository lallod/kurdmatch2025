
import { useEffect, useRef, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { formStorage } from '@/utils/formStorage';
import { useToast } from '@/hooks/use-toast';

interface UseAutoSaveProps {
  form: UseFormReturn<any>;
  currentStep: number;
  completedSteps: number[];
  isSubmitting?: boolean;
}

export const useAutoSave = ({ 
  form, 
  currentStep, 
  completedSteps, 
  isSubmitting = false 
}: UseAutoSaveProps) => {
  const { toast } = useToast();
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedDataRef = useRef<string>('');

  const autoSave = useCallback(() => {
    if (isSubmitting) return;

    const formData = form.getValues();
    const currentDataString = JSON.stringify({ formData, currentStep, completedSteps });
    
    // Only save if data has actually changed
    if (currentDataString === lastSavedDataRef.current) return;
    
    formStorage.save(formData, currentStep, completedSteps);
    lastSavedDataRef.current = currentDataString;
  }, [form, currentStep, completedSteps, isSubmitting]);

  const debouncedAutoSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(autoSave, 500);
  }, [autoSave]);

  const loadSavedData = useCallback(() => {
    const savedData = formStorage.load();
    if (!savedData) return null;

    // Load form data
    Object.keys(savedData.formData).forEach(key => {
      const value = savedData.formData[key];
      if (value !== undefined && value !== null) {
        form.setValue(key, value, { shouldValidate: false });
      }
    });

    lastSavedDataRef.current = JSON.stringify({
      formData: savedData.formData,
      currentStep: savedData.currentStep,
      completedSteps: savedData.completedSteps
    });

    return savedData;
  }, [form]);

  const clearSavedData = useCallback(() => {
    formStorage.clear();
    lastSavedDataRef.current = '';
  }, []);

  const getLastSavedTime = useCallback(() => {
    const savedData = formStorage.load();
    return savedData?.lastSaved || null;
  }, []);

  // Watch for form changes and auto-save
  useEffect(() => {
    const subscription = form.watch(() => {
      debouncedAutoSave();
    });

    return () => {
      subscription.unsubscribe();
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [form, debouncedAutoSave]);

  // Auto-save on step change
  useEffect(() => {
    autoSave();
  }, [currentStep, completedSteps, autoSave]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    autoSave,
    loadSavedData,
    clearSavedData,
    getLastSavedTime,
  };
};
