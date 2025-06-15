
import { QuestionItem } from '../types';

export const systemQuestions: QuestionItem[] = [
  // Account Information
  {
    id: "sys_1",
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
    id: "sys_2",
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
  
  // Personal Information
  {
    id: "sys_3",
    text: "Full Name",
    category: "Basics",
    fieldType: "text",
    required: true,
    enabled: true,
    registrationStep: "Personal",
    displayOrder: 3,
    placeholder: "Your full name",
    fieldOptions: [],
    profileField: "full_name",
    isSystemField: true
  },
  {
    id: "sys_7",
    text: "Date of Birth",
    category: "Basics",
    fieldType: "date",
    required: true,
    enabled: true,
    registrationStep: "Personal",
    displayOrder: 4,
    placeholder: "YYYY-MM-DD",
    fieldOptions: [],
    profileField: "date_of_birth",
    isSystemField: true
  },
  {
    id: "sys_8",
    text: "Gender",
    category: "Basics",
    fieldType: "select",
    required: true,
    enabled: true,
    registrationStep: "Personal",
    displayOrder: 5,
    placeholder: "Select your gender",
    fieldOptions: ["Male", "Female", "Non-binary", "Prefer not to say"],
    profileField: "gender",
    isSystemField: true
  },
  {
    id: "sys_9",
    text: "Location",
    category: "Basics",
    fieldType: "text",
    required: true,
    enabled: true,
    registrationStep: "Personal",
    displayOrder: 6,
    placeholder: "Your city or region",
    fieldOptions: [],
    profileField: "location",
    isSystemField: true
  },
  {
    id: "sys_10",
    text: "Occupation",
    category: "Basics",
    fieldType: "text",
    required: false,
    enabled: true,
    registrationStep: "Personal",
    displayOrder: 7,
    placeholder: "What do you do for work?",
    fieldOptions: [],
    profileField: "occupation",
    isSystemField: true
  },
  {
    id: "sys_17",
    text: "Education Level",
    category: "Basics",
    fieldType: "select",
    required: false,
    enabled: true,
    registrationStep: "Personal",
    displayOrder: 8,
    placeholder: "Your highest education level",
    fieldOptions: ["High School", "Some College", "Bachelor's Degree", "Master's Degree", "PhD", "Trade School", "Other"],
    profileField: "education",
    isSystemField: true
  },
  {
    id: "sys_21",
    text: "Languages",
    category: "Basics",
    fieldType: "multi-select",
    required: false,
    enabled: true,
    registrationStep: "Personal",
    displayOrder: 9,
    placeholder: "Languages you speak",
    fieldOptions: [
      "Kurdish (Sorani)", "Kurdish (Kurmanji)", "Arabic", "Turkish", "Persian", "English", 
      "German", "French", "Spanish", "Italian", "Dutch", "Swedish", "Norwegian"
    ],
    profileField: "languages",
    isSystemField: true
  },
  
  // Physical Information
  {
    id: "sys_11",
    text: "Height",
    category: "Physical",
    fieldType: "text",
    required: false,
    enabled: true,
    registrationStep: "Physical",
    displayOrder: 10,
    placeholder: "e.g., 175 cm",
    fieldOptions: [],
    profileField: "height",
    isSystemField: true
  },
  
  // Lifestyle
  {
    id: "sys_12",
    text: "Do you drink alcohol?",
    category: "Lifestyle",
    fieldType: "select",
    required: false,
    enabled: true,
    registrationStep: "Lifestyle",
    displayOrder: 11,
    placeholder: "Select your drinking habits",
    fieldOptions: ["Never", "Rarely", "Socially", "Regularly", "Prefer not to say"],
    profileField: "drinking",
    isSystemField: true
  },
  {
    id: "sys_13",
    text: "Do you smoke?",
    category: "Lifestyle",
    fieldType: "select",
    required: false,
    enabled: true,
    registrationStep: "Lifestyle",
    displayOrder: 12,
    placeholder: "Select your smoking habits",
    fieldOptions: ["Never", "Occasionally", "Socially", "Regularly", "Trying to quit"],
    profileField: "smoking",
    isSystemField: true
  },
  {
    id: "sys_14",
    text: "Exercise Habits",
    category: "Lifestyle",
    fieldType: "select",
    required: false,
    enabled: true,
    registrationStep: "Lifestyle",
    displayOrder: 13,
    placeholder: "How often do you exercise?",
    fieldOptions: ["Never", "Rarely", "Few times a week", "Daily", "I'm a fitness enthusiast"],
    profileField: "exercise_habits",
    isSystemField: true
  },
  {
    id: "sys_15",
    text: "Do you have pets?",
    category: "Lifestyle",
    fieldType: "select",
    required: false,
    enabled: true,
    registrationStep: "Lifestyle",
    displayOrder: 14,
    placeholder: "Do you have any pets?",
    fieldOptions: ["No pets", "Dog", "Cat", "Multiple pets", "Want pets", "Allergic to pets"],
    profileField: "have_pets",
    isSystemField: true
  },
  {
    id: "sys_20",
    text: "Interests & Hobbies",
    category: "Lifestyle",
    fieldType: "multi-select",
    required: false,
    enabled: true,
    registrationStep: "Lifestyle",
    displayOrder: 15,
    placeholder: "Select your interests",
    fieldOptions: [
      "Travel", "Cooking", "Reading", "Music", "Movies", "Sports", "Fitness", "Art", "Photography", 
      "Gaming", "Dancing", "Hiking", "Swimming", "Yoga", "Technology", "Fashion", "Food", "Nature",
      "Adventure", "Culture", "Learning", "Meditation", "Writing", "Science", "History"
    ],
    profileField: "interests",
    isSystemField: true
  },
  
  // Beliefs and Values
  {
    id: "sys_16",
    text: "Religion",
    category: "Beliefs",
    fieldType: "select",
    required: false,
    enabled: true,
    registrationStep: "Beliefs",
    displayOrder: 16,
    placeholder: "Your religious beliefs",
    fieldOptions: ["Islam", "Christianity", "Judaism", "Buddhism", "Hinduism", "Atheist", "Agnostic", "Spiritual", "Other", "Prefer not to say"],
    profileField: "religion",
    isSystemField: true
  },
  
  // Relationship Goals
  {
    id: "sys_18",
    text: "What are you looking for?",
    category: "Preferences",
    fieldType: "select",
    required: false,
    enabled: true,
    registrationStep: "Preferences",
    displayOrder: 17,
    placeholder: "Your relationship goals",
    fieldOptions: ["Serious relationship", "Something casual", "Marriage", "Friendship", "Not sure yet"],
    profileField: "relationship_goals",
    isSystemField: true
  },
  {
    id: "sys_19",
    text: "Do you want children?",
    category: "Preferences",
    fieldType: "select",
    required: false,
    enabled: true,
    registrationStep: "Preferences",
    displayOrder: 18,
    placeholder: "Your thoughts on having children",
    fieldOptions: ["Want children", "Don't want children", "Have children", "Open to children", "Not sure"],
    profileField: "want_children",
    isSystemField: true
  },
  
  // Bio and Photos
  {
    id: "sys_5",
    text: "Bio",
    category: "Basics",
    fieldType: "textarea",
    required: false,
    enabled: true,
    registrationStep: "Profile",
    displayOrder: 19,
    placeholder: "Tell us about yourself",
    fieldOptions: [],
    profileField: "bio",
    isSystemField: true
  },
  {
    id: "sys_6",
    text: "Profile Photos",
    category: "Photos",
    fieldType: "text",
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
