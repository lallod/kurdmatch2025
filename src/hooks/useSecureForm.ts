/**
 * useSecureForm Hook
 * 
 * Custom React hook for handling forms with built-in security features:
 * - Input sanitization
 * - Validation
 * - Rate limiting
 * - Error handling
 */

import { useState } from 'react';
import { z } from 'zod';
import { sanitizeInput } from '@/utils/security/xss-protection';
import { checkRateLimit } from '@/utils/security/input-validation';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from '@/hooks/useTranslations';

interface UseSecureFormOptions<T> {
  schema: z.ZodSchema<T>;
  onSubmit: (data: T) => Promise<void>;
  rateLimitKey?: string;
  rateLimitMax?: number;
  rateLimitWindowMs?: number;
}

export function useSecureForm<T extends Record<string, any>>({
  schema,
  onSubmit,
  rateLimitKey,
  rateLimitMax = 5,
  rateLimitWindowMs = 60000,
}: UseSecureFormOptions<T>) {
  const [formData, setFormData] = useState<Partial<T>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslations();

  const setValue = (field: keyof T, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors((prev) => { const newErrors = { ...prev }; delete newErrors[field as string]; return newErrors; });
    }
  };

  const validateField = (field: keyof T, value: any): boolean => {
    try {
      const fieldSchema = schema instanceof z.ZodObject ? (schema as z.ZodObject<any>).shape[field as string] : null;
      if (fieldSchema) { fieldSchema.parse(value); }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [field as string]: error.errors[0].message }));
      }
      return false;
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) { e.preventDefault(); }
    
    if (rateLimitKey && !checkRateLimit(rateLimitKey, rateLimitMax, rateLimitWindowMs)) {
      toast({ title: t('form.too_many_attempts', 'Too Many Attempts'), description: t('form.rate_limit_desc', `Please wait before trying again. Limit: ${rateLimitMax} per ${rateLimitWindowMs / 1000}s`), variant: 'destructive' });
      return;
    }
    
    try {
      const validated = schema.parse(formData);
      setErrors({});
      setIsSubmitting(true);
      await onSubmit(validated);
      toast({ title: t('common.success', 'Success'), description: t('form.submitted', 'Form submitted successfully') });
      setFormData({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => { if (err.path[0]) { fieldErrors[err.path[0] as string] = err.message; } });
        setErrors(fieldErrors);
        toast({ title: t('form.validation_error', 'Validation Error'), description: t('form.check_errors', 'Please check the form for errors'), variant: 'destructive' });
      } else {
        toast({ title: t('form.submission_error', 'Submission Error'), description: error instanceof Error ? error.message : t('form.submit_failed', 'Failed to submit form'), variant: 'destructive' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => { setFormData({}); setErrors({}); };

  return { formData, errors, isSubmitting, setValue, validateField, handleSubmit, reset };
}
