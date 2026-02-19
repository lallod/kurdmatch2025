
export const SUPPORTED_LANGUAGES = ['en', 'no', 'ku_sorani', 'ku_kurmanci', 'de'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: 'English',
  no: 'Norsk',
  ku_sorani: 'کوردی سۆرانی',
  ku_kurmanci: 'Kurmancî',
  de: 'Deutsch',
};

export interface QuestionTranslations {
  text_en?: string;
  text_no?: string;
  text_ku_sorani?: string;
  text_ku_kurmanci?: string;
  text_de?: string;
  placeholder_en?: string;
  placeholder_no?: string;
  placeholder_ku_sorani?: string;
  placeholder_ku_kurmanci?: string;
  placeholder_de?: string;
  field_options_en?: string[];
  field_options_no?: string[];
  field_options_ku_sorani?: string[];
  field_options_ku_kurmanci?: string[];
  field_options_de?: string[];
}

export interface QuestionItem extends QuestionTranslations {
  id: string;
  text: string;
  category: string;
  fieldType: 'text' | 'textarea' | 'select' | 'multi-select' | 'multi_select' | 'checkbox' | 'radio' | 'date';
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

// Database representation of a question
export interface QuestionItemDB {
  id: string;
  text: string;
  category: string;
  field_type: string;
  required: boolean;
  enabled: boolean;
  registration_step: string;
  display_order: number;
  placeholder?: string;
  field_options: string[];
  profile_field?: string;
  is_system_field?: boolean;
  text_en?: string;
  text_no?: string;
  text_ku_sorani?: string;
  text_ku_kurmanci?: string;
  text_de?: string;
  placeholder_en?: string;
  placeholder_no?: string;
  placeholder_ku_sorani?: string;
  placeholder_ku_kurmanci?: string;
  placeholder_de?: string;
  field_options_en?: string[];
  field_options_no?: string[];
  field_options_ku_sorani?: string[];
  field_options_ku_kurmanci?: string[];
  field_options_de?: string[];
}

// Convert from database format to frontend format
export const fromDbQuestion = (dbQuestion: QuestionItemDB): QuestionItem => {
  return {
    id: dbQuestion.id,
    text: dbQuestion.text,
    category: dbQuestion.category,
    fieldType: dbQuestion.field_type as QuestionItem['fieldType'],
    required: dbQuestion.required,
    enabled: dbQuestion.enabled,
    registrationStep: dbQuestion.registration_step as QuestionItem['registrationStep'],
    displayOrder: dbQuestion.display_order,
    placeholder: dbQuestion.placeholder,
    fieldOptions: dbQuestion.field_options || [],
    profileField: dbQuestion.profile_field,
    isSystemField: dbQuestion.is_system_field,
    text_en: dbQuestion.text_en,
    text_no: dbQuestion.text_no,
    text_ku_sorani: dbQuestion.text_ku_sorani,
    text_ku_kurmanci: dbQuestion.text_ku_kurmanci,
    text_de: dbQuestion.text_de,
    placeholder_en: dbQuestion.placeholder_en,
    placeholder_no: dbQuestion.placeholder_no,
    placeholder_ku_sorani: dbQuestion.placeholder_ku_sorani,
    placeholder_ku_kurmanci: dbQuestion.placeholder_ku_kurmanci,
    placeholder_de: dbQuestion.placeholder_de,
    field_options_en: dbQuestion.field_options_en || [],
    field_options_no: dbQuestion.field_options_no || [],
    field_options_ku_sorani: dbQuestion.field_options_ku_sorani || [],
    field_options_ku_kurmanci: dbQuestion.field_options_ku_kurmanci || [],
    field_options_de: dbQuestion.field_options_de || [],
  };
};

// Convert from frontend format to database format
export const toDbQuestion = (question: QuestionItem): QuestionItemDB => {
  return {
    id: question.id,
    text: question.text,
    category: question.category,
    field_type: question.fieldType,
    required: question.required,
    enabled: question.enabled,
    registration_step: question.registrationStep,
    display_order: question.displayOrder,
    placeholder: question.placeholder,
    field_options: question.fieldOptions || [],
    profile_field: question.profileField,
    is_system_field: question.isSystemField,
    text_en: question.text_en,
    text_no: question.text_no,
    text_ku_sorani: question.text_ku_sorani,
    text_ku_kurmanci: question.text_ku_kurmanci,
    text_de: question.text_de,
    placeholder_en: question.placeholder_en,
    placeholder_no: question.placeholder_no,
    placeholder_ku_sorani: question.placeholder_ku_sorani,
    placeholder_ku_kurmanci: question.placeholder_ku_kurmanci,
    placeholder_de: question.placeholder_de,
    field_options_en: question.field_options_en || [],
    field_options_no: question.field_options_no || [],
    field_options_ku_sorani: question.field_options_ku_sorani || [],
    field_options_ku_kurmanci: question.field_options_ku_kurmanci || [],
    field_options_de: question.field_options_de || [],
  };
};

// Helper to get translated text for a given language
export const getTranslatedText = (question: QuestionItem, field: 'text' | 'placeholder', lang: string): string => {
  const langMap: Record<string, SupportedLanguage> = {
    english: 'en',
    norwegian: 'no',
    'kurdish-sorani': 'ku_sorani',
    'kurdish-kurmanci': 'ku_kurmanci',
    german: 'de',
    en: 'en',
    no: 'no',
    ku_sorani: 'ku_sorani',
    ku_kurmanci: 'ku_kurmanci',
    de: 'de',
  };
  const key = langMap[lang] || 'en';
  const translationKey = `${field}_${key}` as keyof QuestionTranslations;
  const value = question[translationKey];
  if (typeof value === 'string' && value) return value;
  // Fallback to default field
  return field === 'text' ? question.text : (question.placeholder || '');
};

export const getTranslatedOptions = (question: QuestionItem, lang: string): string[] => {
  const langMap: Record<string, SupportedLanguage> = {
    english: 'en',
    norwegian: 'no',
    'kurdish-sorani': 'ku_sorani',
    'kurdish-kurmanci': 'ku_kurmanci',
    german: 'de',
    en: 'en',
    no: 'no',
    ku_sorani: 'ku_sorani',
    ku_kurmanci: 'ku_kurmanci',
    de: 'de',
  };
  const key = langMap[lang] || 'en';
  const translationKey = `field_options_${key}` as keyof QuestionTranslations;
  const value = question[translationKey];
  if (Array.isArray(value) && value.length > 0) return value;
  return question.fieldOptions || [];
};
