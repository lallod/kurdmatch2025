
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
        // No validation required for AI-generated bio
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
        // Check profileField instead of fieldType for email fields
        if (question.required) {
          schemaObject[question.id] = z.string().email({ message: `Please enter a valid email address` });
        } else {
          schemaObject[question.id] = z.string().email({ message: `Please enter a valid email address` }).optional();
        }
      } else if (question.profileField === 'password') {
        // Add password validation
        if (question.required) {
          schemaObject[question.id] = z.string().min(8, { message: `Password must be at least 8 characters` })
            .refine(val => /[A-Z]/.test(val), { message: 'Password must contain at least one uppercase letter' })
            .refine(val => /[a-z]/.test(val), { message: 'Password must contain at least one lowercase letter' })
            .refine(val => /[0-9]/.test(val), { message: 'Password must contain at least one number' });
        } else {
          schemaObject[question.id] = z.string().min(8).optional();
        }
      } else if (question.fieldType === 'multi-select') {
        // Handle multi-select fields (they will be comma-separated strings in this implementation)
        if (question.required) {
          schemaObject[question.id] = z.string().min(1, { message: `${question.text} is required` });
        } else {
          schemaObject[question.id] = z.string().optional();
        }
      } else if (question.profileField === 'height') {
        // Special validation for height field
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
