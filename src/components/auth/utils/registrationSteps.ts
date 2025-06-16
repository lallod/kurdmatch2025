
import { Mail, User, MapPin, Camera, LucideIcon } from 'lucide-react';
import { RegistrationFormValues } from './registrationSchema';

export interface Step {
  title: string;
  fields: Array<keyof RegistrationFormValues>;
  icon: LucideIcon;
  description: string;
}

export const registrationSteps: Step[] = [
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
