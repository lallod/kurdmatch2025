
import { z } from 'zod';

export const registrationSchema = z.object({
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
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  dreamVacation: z.string().optional(),
  photos: z.array(z.string()).min(1, { message: 'At least one photo is required' }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type RegistrationFormValues = z.infer<typeof registrationSchema>;
