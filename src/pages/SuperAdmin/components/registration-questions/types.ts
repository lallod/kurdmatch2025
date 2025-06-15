
export interface QuestionItem {
  id: string;
  text: string;
  category: string;
  fieldType: 'text' | 'textarea' | 'select' | 'multi-select' | 'checkbox' | 'radio' | 'date';
  required: boolean;
  enabled: boolean;
  registrationStep: 'Account' | 'Personal' | 'Physical' | 'Lifestyle' | 'Beliefs' | 'Preferences' | 'Profile';
  displayOrder: number;
  placeholder?: string;
  fieldOptions: string[];
  profileField?: string;
  isSystemField?: boolean;
}

export interface QuestionCategory {
  name: string;
  questions: QuestionItem[];
}
