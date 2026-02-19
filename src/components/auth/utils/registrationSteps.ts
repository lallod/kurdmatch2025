
import { Mail, User, MapPin, Camera, LucideIcon } from 'lucide-react';
import { RegistrationFormValues } from './registrationSchema';

export interface Step {
  title: string;
  titleKey: string;
  fields: Array<keyof RegistrationFormValues>;
  icon: LucideIcon;
  description: string;
  descriptionKey: string;
}

export const registrationSteps: Step[] = [
  { 
    title: "Email & Password",
    titleKey: "reg.step_email_password",
    fields: ["email", "password", "confirmPassword"],
    icon: Mail,
    description: "Create your secure account",
    descriptionKey: "reg.step_email_desc"
  },
  { 
    title: "Basic Info",
    titleKey: "reg.step_basic_info",
    fields: ["firstName", "lastName", "dateOfBirth", "gender", "height", "bornIn", "languages", "occupation"],
    icon: User,
    description: "Tell us about yourself",
    descriptionKey: "reg.step_basic_desc"
  },
  { 
    title: "Location & Travel",
    titleKey: "reg.step_location",
    fields: ["location", "dreamVacation"],
    icon: MapPin,
    description: "Where are you from and where do you dream to go?",
    descriptionKey: "reg.step_location_desc"
  },
  { 
    title: "Photos",
    titleKey: "reg.step_photos",
    fields: ["photos"],
    icon: Camera,
    description: "Add your best photos",
    descriptionKey: "reg.step_photos_desc"
  },
];
