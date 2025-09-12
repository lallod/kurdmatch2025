import { z } from 'zod';
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';

export const createDynamicRegistrationSchema = (questions: QuestionItem[]) => {
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  // Always include base auth fields
  schemaFields.email = z.string().email({ message: 'Please enter a valid email address' });
  schemaFields.password = z.string().min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' });
  schemaFields.confirmPassword = z.string();

  // Add dynamic fields based on questions
  questions.forEach(question => {
    if (!question.enabled) return;

    const { id, fieldType, required, profileField } = question;

    // Skip bio field as it's AI generated
    if (profileField === 'bio') return;

    let fieldSchema: z.ZodTypeAny;

    switch (fieldType) {
      case 'text':
      case 'textarea':
        fieldSchema = z.string();
        if (required) {
          (fieldSchema as z.ZodString) = (fieldSchema as z.ZodString).min(1, { message: `${question.text} is required` });
        }
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

      case 'select':
      case 'radio':
        if (question.fieldOptions && question.fieldOptions.length > 0) {
          fieldSchema = z.enum(question.fieldOptions as [string, ...string[]]);
        } else {
          fieldSchema = z.string();
          if (required) {
            fieldSchema = (fieldSchema as z.ZodString).min(1, { message: `${question.text} is required` });
          }
        }
        break;

      case 'multi-select':
        fieldSchema = z.array(z.string());
        if (required) {
          (fieldSchema as z.ZodArray<any>) = (fieldSchema as z.ZodArray<any>).min(1, { message: `Please select at least one ${question.text.toLowerCase()}` });
        }
        break;

      case 'checkbox':
        fieldSchema = z.string().default('false');
        break;

      case 'date':
        fieldSchema = z.string();
        if (required) {
          (fieldSchema as z.ZodString) = (fieldSchema as z.ZodString).min(1, { message: `${question.text} is required` });
        }
        break;

      default:
        fieldSchema = z.string();
        if (required) {
          (fieldSchema as z.ZodString) = (fieldSchema as z.ZodString).min(1, { message: `${question.text} is required` });
        }
    }

    // Handle photo/file fields separately since they're not in the enum
    if (profileField === 'photos' || id === 'sys_6') {
      fieldSchema = z.array(z.string());
      if (required) {
        (fieldSchema as z.ZodArray<any>) = (fieldSchema as z.ZodArray<any>).min(1, { message: 'At least one photo is required' });
      }
    }

    if (!required && fieldType !== 'multi-select' && fieldType !== 'checkbox' && profileField !== 'photos' && id !== 'sys_6') {
      fieldSchema = fieldSchema.optional();
    }

    schemaFields[id] = fieldSchema;
  });

  // Always include photos field
  if (!schemaFields['sys_6'] && !schemaFields['photos']) {
    schemaFields['photos'] = z.array(z.string()).min(1, { message: 'At least one photo is required' });
  }

  const schema = z.object(schemaFields).refine(data => {
    // @ts-ignore
    return data.password === data.confirmPassword;
  }, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

  return schema;
};

export type DynamicRegistrationFormValues = Record<string, any>;