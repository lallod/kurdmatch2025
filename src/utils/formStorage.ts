
export interface SavedFormData {
  formData: any;
  currentStep: number;
  completedSteps: number[];
  lastSaved: number;
  version: string;
}

const STORAGE_KEY = 'registration_form_data';
const PROGRESS_KEY = 'registration_progress';
const VERSION = '1.0.0';

export const formStorage = {
  save: (formData: any, currentStep: number, completedSteps: number[]) => {
    try {
      const savedData: SavedFormData = {
        formData,
        currentStep,
        completedSteps,
        lastSaved: Date.now(),
        version: VERSION,
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));
      console.log('Form data auto-saved:', { currentStep, completedSteps });
    } catch (error) {
      console.warn('Failed to save form data:', error);
      // Fallback to sessionStorage
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
          formData,
          currentStep,
          completedSteps,
          lastSaved: Date.now(),
          version: VERSION,
        }));
      } catch (sessionError) {
        console.error('Failed to save to sessionStorage:', sessionError);
      }
    }
  },

  load: (): SavedFormData | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
      if (!data) return null;
      
      const parsed = JSON.parse(data);
      
      // Check if data is expired (30 days)
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      if (parsed.lastSaved < thirtyDaysAgo) {
        formStorage.clear();
        return null;
      }
      
      return parsed;
    } catch (error) {
      console.warn('Failed to load form data:', error);
      return null;
    }
  },

  clear: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(PROGRESS_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(PROGRESS_KEY);
      console.log('Form data cleared');
    } catch (error) {
      console.warn('Failed to clear form data:', error);
    }
  },

  isAvailable: (): boolean => {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
};
