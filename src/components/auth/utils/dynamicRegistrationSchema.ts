import { z } from 'zod';
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';

export const createDynamicRegistrationSchema = (questions: QuestionItem[]) => {
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  // Always include base auth fields with enhanced validation
  schemaFields.email = z.string().email({ message: 'Please enter a valid email address' });
  schemaFields.password = z.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' });
  schemaFields.confirmPassword = z.string();

  // Add dynamic fields based on questions with enhanced validation
  questions.forEach(question => {
    if (!question.enabled) return;

    const { id, fieldType, required, profileField, text } = question;

    let fieldSchema: z.ZodTypeAny;

    // Force occupation and education to be arrays regardless of their fieldType
    if (id === 'occupation' || id === 'education') {
      fieldSchema = z.array(z.string());
      if (required) {
        fieldSchema = z.array(z.string()).min(1, { 
          message: `Please select at least 1 ${id === 'occupation' ? 'occupation' : 'education level'}` 
        });
      }
    } else {
      switch (fieldType) {
        case 'text':  
        case 'textarea':
          fieldSchema = z.string();
          if (required) {
            fieldSchema = (fieldSchema as z.ZodString).min(1, { message: `${text} is required` });
            // Special validation for bio - minimum 20 characters
            if (profileField === 'bio') {
              fieldSchema = (fieldSchema as z.ZodString).min(20, { message: 'Bio must be at least 20 characters' });
            }
          }
          // Special validation for age field when it's text input (convert to number)
          if (id === 'age') {
            fieldSchema = z.coerce.number().min(18, { message: 'You must be at least 18 years old' });
          }
          break;

        case 'select':
        case 'radio':
          if (question.fieldOptions && question.fieldOptions.length > 0) {
            fieldSchema = z.enum(question.fieldOptions as [string, ...string[]]);
          } else {
            fieldSchema = z.string();
            if (required) {
              fieldSchema = (fieldSchema as z.ZodString).min(1, { message: `Please select ${text.toLowerCase().replace(/\?$/, '')}` });
            }
          }
          break;

        case 'multi-select':
        case 'multi_select':
          fieldSchema = z.array(z.string());
          if (required) {
            let minSelections = 1;
            let errorMessage = `Please select at least one option`;
            
            // Set minimum selections based on field
            if (id === 'interests') {
              minSelections = 3;
              errorMessage = 'Please select at least 3 interests';
            } else if (id === 'hobbies') {
              minSelections = 2;
              errorMessage = 'Please select at least 2 hobbies';
            } else if (id === 'values') {
              minSelections = 3;
              errorMessage = 'Please select at least 3 core values';
            } else if (id === 'languages') {
              minSelections = 1;
              errorMessage = 'Please select at least 1 language';
            }
            
            fieldSchema = z.array(z.string()).min(minSelections, { message: errorMessage });
          }
          break;

        case 'checkbox':
          fieldSchema = z.boolean();
          if (required) {
            fieldSchema = z.boolean().refine(val => val === true, { message: `${text} is required` });
          }
          break;

        case 'date':
          fieldSchema = z.string();
          if (required) {
            fieldSchema = (fieldSchema as z.ZodString).min(1, { message: `${text} is required` });
          }
          // Age validation for date of birth
          if (profileField === 'dateOfBirth') {
            fieldSchema = fieldSchema.refine(value => {
              if (!value) return !required;
              const date = new Date(value);
              const today = new Date();
              const age = today.getFullYear() - date.getFullYear();
              return age >= 18;
            }, { message: 'You must be at least 18 years old' });
          }
          break;

        default:
          fieldSchema = z.string();
          if (required) {
            fieldSchema = (fieldSchema as z.ZodString).min(1, { message: `${text} is required` });
          }
      }
    }

    // Handle photo/file fields separately
    if (profileField === 'photos' || id === 'sys_6' || id === 'photos') {
      fieldSchema = z.array(z.string()).min(1, { message: 'At least one photo is required' });
    }

    // Make optional fields truly optional (except multi-select and photos)
    if (!required && fieldType !== 'multi-select' && fieldType !== 'multi_select' && profileField !== 'photos' && id !== 'sys_6' && id !== 'photos' && id !== 'occupation' && id !== 'education') {
      fieldSchema = fieldSchema.optional();
    }

    schemaFields[id] = fieldSchema;
  });

  // Always include photos field if not present
  if (!schemaFields['sys_6'] && !schemaFields['photos']) {
    schemaFields['photos'] = z.array(z.string()).min(1, { message: 'At least one photo is required' });
  }

  const schema = z.object(schemaFields).refine(data => {
    return data.password === data.confirmPassword;
  }, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

  return schema;
};

// Create step-specific validation schemas for step-blocking validation
export const createStepValidationSchema = (questions: QuestionItem[], step: number) => {
  const schemaFields: Record<string, z.ZodTypeAny> = {};
  
  // Get questions for current step
  const stepQuestions = getQuestionsForStep(questions, step);
  
  stepQuestions.forEach(question => {
    if (!question.enabled) return;

    const { id, fieldType, required, profileField, text } = question;
    let fieldSchema: z.ZodTypeAny;

    // Force occupation and education to be arrays regardless of their fieldType
    if (id === 'occupation' || id === 'education') {
      fieldSchema = z.array(z.string());
      if (required) {
        fieldSchema = z.array(z.string()).min(1, { 
          message: `Please select at least 1 ${id === 'occupation' ? 'occupation' : 'education level'}` 
        });
      }
    } else {
      // Apply same validation logic as main schema
      switch (fieldType) {
        case 'text':
        case 'textarea':
          fieldSchema = z.string();
          if (required) {
            fieldSchema = (fieldSchema as z.ZodString).min(1, { message: `${text} is required` });
          }
          // Special validation for age field when it's text input
          if (id === 'age') {
            fieldSchema = z.coerce.number().min(18, { message: 'You must be at least 18 years old' });
          }
          break;

        case 'select':
        case 'radio':
          if (question.fieldOptions && question.fieldOptions.length > 0) {
            fieldSchema = z.enum(question.fieldOptions as [string, ...string[]]);
          } else {
            fieldSchema = z.string();
            if (required) {
              fieldSchema = (fieldSchema as z.ZodString).min(1, { message: `Please select ${text.toLowerCase().replace(/\?$/, '')}` });
            }
          }
          break;

        case 'multi-select':
        case 'multi_select':
          fieldSchema = z.array(z.string());
          if (required) {
            let minSelections = 1;
            let errorMessage = `Please select at least one option`;
            
            if (id === 'interests') {
              minSelections = 3;
              errorMessage = 'Please select at least 3 interests';
            } else if (id === 'hobbies') {
              minSelections = 2;
              errorMessage = 'Please select at least 2 hobbies';
            } else if (id === 'values') {
              minSelections = 3;
              errorMessage = 'Please select at least 3 core values';
            } else if (id === 'languages') {
              minSelections = 1;
              errorMessage = 'Please select at least 1 language';
            }
            
            fieldSchema = z.array(z.string()).min(minSelections, { message: errorMessage });
          }
          break;

        case 'checkbox':
          fieldSchema = z.boolean();
          if (required) {
            fieldSchema = z.boolean().refine(val => val === true, { message: `${text} is required` });
          }
          break;

        case 'date':
          fieldSchema = z.string();
          if (required) {
            fieldSchema = (fieldSchema as z.ZodString).min(1, { message: `${text} is required` });
          }
          break;

        default:
          fieldSchema = z.string();
          if (required) {
            fieldSchema = (fieldSchema as z.ZodString).min(1, { message: `${text} is required` });
          }
      }
    }

    if (profileField === 'photos' || id === 'photos') {
      fieldSchema = z.array(z.string()).min(1, { message: 'At least one photo is required' });
    }

    if (!required && fieldType !== 'multi-select' && fieldType !== 'multi_select' && profileField !== 'photos' && id !== 'photos' && id !== 'occupation' && id !== 'education') {
      fieldSchema = fieldSchema.optional();
    }

    schemaFields[id] = fieldSchema;
  });

  // Add password confirmation validation for step 1
  if (step === 1) {
    schemaFields.email = z.string().email({ message: 'Please enter a valid email address' });
    schemaFields.password = z.string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
      .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' });
    schemaFields.confirmPassword = z.string();
    
    return z.object(schemaFields).refine(data => {
      return data.password === data.confirmPassword;
    }, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });
  }

  return z.object(schemaFields);
};

// Helper function to get questions for a specific step using actual registrationStep values
const getQuestionsForStep = (questions: QuestionItem[], step: number): QuestionItem[] => {
  switch (step) {
    case 1: // Account Setup
      return questions.filter(q => q.registrationStep === 'Account');
    
    case 2: // Basic Info  
      return questions.filter(q => q.registrationStep === 'Personal');
    
    case 3: // Cultural Identity & Physical
      return questions.filter(q => 
        q.registrationStep === 'Physical' || 
        q.profileField === 'ethnicity' || 
        q.profileField === 'religion' ||
        q.profileField === 'political_views' ||
        q.profileField === 'zodiac_sign' ||
        q.profileField === 'personality_type'
      );
    
    case 4: // Interests & Values
      return questions.filter(q => 
        q.id === 'interests' || 
        q.id === 'hobbies' || 
        q.id === 'values' ||
        q.profileField === 'interests' ||
        q.profileField === 'hobbies' ||
        q.profileField === 'values'
      );
    
    case 5: // Lifestyle & Habits
      return questions.filter(q => 
        q.registrationStep === 'Lifestyle' ||
        q.profileField === 'dietary_preferences' ||
        q.profileField === 'smoking' ||
        q.profileField === 'drinking' ||
        q.profileField === 'sleep_schedule' ||
        q.profileField === 'have_pets' ||
        q.profileField === 'family_closeness' ||
        q.profileField === 'love_language' ||
        q.profileField === 'communication_style' ||
        q.profileField === 'ideal_date'
      );
    
    case 6: // Career & Education  
      return questions.filter(q => 
        q.registrationStep === 'Profile' ||
        q.profileField === 'occupation' ||
        q.profileField === 'education'
      );
    
    case 7: // Photos
      return questions.filter(q => q.profileField === 'photos');
    
    default:
      return [];
  }
};

export type DynamicRegistrationFormValues = Record<string, any>;