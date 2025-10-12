export interface AppTranslation {
  id: string;
  language_code: string;
  translation_key: string;
  translation_value: string;
  context?: string;
  category: string;
  needs_review: boolean;
  auto_translated: boolean;
  created_at: string;
  updated_at: string;
}

export type TranslationCategory = 
  | 'auth'
  | 'common'
  | 'navigation'
  | 'discovery'
  | 'messages'
  | 'profile'
  | 'settings'
  | 'notifications'
  | 'validation';
