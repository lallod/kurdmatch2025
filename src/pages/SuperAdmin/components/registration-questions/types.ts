
export interface QuestionItem {
  id: string;
  text: string;
  category: string;
  fieldType: 'text' | 'textarea' | 'select' | 'multi-select' | 'radio' | 'checkbox' | 'date';
  required: boolean;
  enabled: boolean;
  registrationStep: 'Account' | 'Personal' | 'Profile' | 'Preferences';
  displayOrder: number;
  placeholder: string;
  fieldOptions: string[];
  profileField: string;
  isSystemField?: boolean; // New field to identify system fields that should be protected
}
