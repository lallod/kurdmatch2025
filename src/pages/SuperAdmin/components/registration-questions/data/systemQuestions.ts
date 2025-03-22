
import { QuestionItem } from '../types';

export const systemQuestions: QuestionItem[] = [
  {
    id: "1",
    text: "Email Address",
    category: "Basics",
    fieldType: "text",
    required: true,
    enabled: true,
    registrationStep: "Account",
    displayOrder: 1,
    placeholder: "Enter your email address",
    fieldOptions: [],
    profileField: "email",
    isSystemField: true
  },
  {
    id: "2",
    text: "Password",
    category: "Basics",
    fieldType: "text",
    required: true,
    enabled: true,
    registrationStep: "Account",
    displayOrder: 2,
    placeholder: "Create a secure password",
    fieldOptions: [],
    profileField: "password",
    isSystemField: true
  },
  {
    id: "3",
    text: "First Name",
    category: "Basics",
    fieldType: "text",
    required: true,
    enabled: true,
    registrationStep: "Personal",
    displayOrder: 3,
    placeholder: "Your first name",
    fieldOptions: [],
    profileField: "firstName",
    isSystemField: true
  },
  {
    id: "4",
    text: "Last Name",
    category: "Basics",
    fieldType: "text",
    required: true,
    enabled: true,
    registrationStep: "Personal",
    displayOrder: 4,
    placeholder: "Your last name",
    fieldOptions: [],
    profileField: "lastName",
    isSystemField: true
  },
  {
    id: "5",
    text: "Bio",
    category: "Basics",
    fieldType: "textarea",
    required: false,
    enabled: true,
    registrationStep: "Profile",
    displayOrder: 10,
    placeholder: "Tell us about yourself",
    fieldOptions: [],
    profileField: "bio",
    isSystemField: true
  },
  {
    id: "6",
    text: "Profile Photos",
    category: "Photos",
    fieldType: "multi-select",
    required: true,
    enabled: true,
    registrationStep: "Profile",
    displayOrder: 20,
    placeholder: "Upload your profile photos",
    fieldOptions: [],
    profileField: "photos",
    isSystemField: true
  }
];
