
import { z } from 'zod';
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';

// Create a schema builder based on the questions
export const createDynamicSchema = (questions: QuestionItem[]) => {
  const schemaObject: Record<string, any> = {};
  
  questions.forEach(question => {
    if (question.enabled) {
      // Add appropriate validation based on field type and required status
      if (question.required) {
        schemaObject[question.id] = z.string().min(1, { message: `${question.text} is required` });
      } else {
        schemaObject[question.id] = z.string().optional();
      }
      
      // Additional type-specific validation could be added here
    }
  });
  
  return z.object(schemaObject);
};
