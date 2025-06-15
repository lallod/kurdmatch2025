
import { z } from 'zod';
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';

// Create a schema builder based on the questions
export const createDynamicSchema = (questions: QuestionItem[]) => {
  const schemaObject: Record<string, any> = {};
  
  questions.forEach(question => {
    if (question.enabled) {
      // Special handling for photos
      if (question.profileField === 'photos') {
        schemaObject[question.id] = z.array(z.string()).min(1, { message: 'Please upload at least one photo' });
        return;
      }
      
      // Skip validation for AI-generated fields (like bio)
      if (question.profileField === 'bio') {
        schemaObject[question.id] = z.string().optional();
        return;
      }
      
      // Add appropriate validation based on field type and required status
      if (question.fieldType === 'date') {
        if (question.required) {
          schemaObject[question.id] = z.string().min(1, { message: `${question.text} is required` });
        } else {
          schemaObject[question.id] = z.string().optional();
        }
      } else if (question.profileField === 'email') {
        if (question.required) {
          schemaObject[question.id] = z.string().email({ message: `Please enter a valid email address` });
        } else {
          schemaObject[question.id] = z.string().email({ message: `Please enter a valid email address` }).optional();
        }
      } else if (question.profileField === 'password') {
        if (question.required) {
          schemaObject[question.id] = z.string().min(8, { message: `Password must be at least 8 characters` })
            .refine(val => /[A-Z]/.test(val), { message: 'Password must contain at least one uppercase letter' })
            .refine(val => /[a-z]/.test(val), { message: 'Password must contain at least one lowercase letter' })
            .refine(val => /[0-9]/.test(val), { message: 'Password must contain at least one number' });
        } else {
          schemaObject[question.id] = z.string().min(8).optional();
        }
      } else if (question.fieldType === 'multi-select') {
        if (question.required) {
          schemaObject[question.id] = z.array(z.string()).min(1, { message: `Please select at least one ${question.text.toLowerCase()}` });
        } else {
          schemaObject[question.id] = z.array(z.string()).optional();
        }
      } else if (question.profileField === 'height') {
        if (question.required) {
          schemaObject[question.id] = z.string().min(1, { message: `${question.text} is required` });
        } else {
          schemaObject[question.id] = z.string().optional();
        }
      } else if (question.required) {
        schemaObject[question.id] = z.string().min(1, { message: `${question.text} is required` });
      } else {
        schemaObject[question.id] = z.string().optional();
      }
    }
  });
  
  return z.object(schemaObject);
};
