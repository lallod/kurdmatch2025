
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';
import { TablesInsert } from '@/integrations/supabase/types';
import { sanitizeText, sanitizeHtml } from '@/utils/security/inputValidation';

export const mapWizardDataToProfile = (
  wizardData: Record<string, any>,
  userId: string
): Partial<TablesInsert<'profiles'>> => {
  const profileData: Partial<TablesInsert<'profiles'>> = {
    id: userId,
  };

  // Basic Info
  if (wizardData.height) profileData.height = sanitizeText(wizardData.height);
  if (wizardData.ethnicity) profileData.ethnicity = sanitizeText(wizardData.ethnicity);
  if (wizardData.kurdistan_region) profileData.kurdistan_region = sanitizeText(wizardData.kurdistan_region);
  if (wizardData.languages && Array.isArray(wizardData.languages)) {
    (profileData as any).languages = wizardData.languages.map(lang => sanitizeText(lang));
  }

  // Lifestyle
  if (wizardData.exercise_habits) profileData.exercise_habits = sanitizeText(wizardData.exercise_habits);
  if (wizardData.have_pets) profileData.have_pets = sanitizeText(wizardData.have_pets);
  if (wizardData.drinking) profileData.drinking = sanitizeText(wizardData.drinking);
  if (wizardData.smoking) profileData.smoking = sanitizeText(wizardData.smoking);
  if (wizardData.dietary_preferences) profileData.dietary_preferences = sanitizeText(wizardData.dietary_preferences);
  if (wizardData.sleep_schedule) profileData.sleep_schedule = sanitizeText(wizardData.sleep_schedule);

  // Values & Beliefs
  if (wizardData.religion) profileData.religion = sanitizeText(wizardData.religion);
  if (wizardData.values && Array.isArray(wizardData.values)) {
    (profileData as any).values = wizardData.values.map(value => sanitizeText(value));
  }
  if (wizardData.zodiac_sign) profileData.zodiac_sign = sanitizeText(wizardData.zodiac_sign);
  if (wizardData.personality_type) profileData.personality_type = sanitizeText(wizardData.personality_type);

  // Relationships
  if (wizardData.relationship_goals) profileData.relationship_goals = sanitizeText(wizardData.relationship_goals);
  if (wizardData.want_children) profileData.want_children = sanitizeText(wizardData.want_children);
  if (wizardData.children_status) profileData.children_status = sanitizeText(wizardData.children_status);
  if (wizardData.family_closeness) profileData.family_closeness = sanitizeText(wizardData.family_closeness);
  if (wizardData.love_language && Array.isArray(wizardData.love_language)) {
    (profileData as any).love_language = wizardData.love_language.map(lang => sanitizeText(lang));
  }

  // Career
  if (wizardData.education) profileData.education = sanitizeText(wizardData.education);
  if (wizardData.occupation) profileData.occupation = sanitizeText(wizardData.occupation);
  if (wizardData.company) profileData.company = sanitizeText(wizardData.company);

  // Interests
  if (wizardData.interests && Array.isArray(wizardData.interests)) {
    (profileData as any).interests = wizardData.interests.map(interest => sanitizeText(interest));
  }
  if (wizardData.hobbies && Array.isArray(wizardData.hobbies)) {
    (profileData as any).hobbies = wizardData.hobbies.map(hobby => sanitizeText(hobby));
  }
  if (wizardData.creative_pursuits && Array.isArray(wizardData.creative_pursuits)) {
    (profileData as any).creative_pursuits = wizardData.creative_pursuits.map(pursuit => sanitizeText(pursuit));
  }
  if (wizardData.weekend_activities && Array.isArray(wizardData.weekend_activities)) {
    (profileData as any).weekend_activities = wizardData.weekend_activities.map(activity => sanitizeText(activity));
  }
  if (wizardData.music_instruments && Array.isArray(wizardData.music_instruments)) {
    (profileData as any).music_instruments = wizardData.music_instruments.map(instrument => sanitizeText(instrument));
  }
  if (wizardData.tech_skills && Array.isArray(wizardData.tech_skills)) {
    (profileData as any).tech_skills = wizardData.tech_skills.map(skill => sanitizeText(skill));
  }

  // Favorites
  if (wizardData.favorite_books && Array.isArray(wizardData.favorite_books)) {
    (profileData as any).favorite_books = wizardData.favorite_books.map(book => sanitizeText(book));
  }
  if (wizardData.favorite_movies && Array.isArray(wizardData.favorite_movies)) {
    (profileData as any).favorite_movies = wizardData.favorite_movies.map(movie => sanitizeText(movie));
  }
  if (wizardData.favorite_music && Array.isArray(wizardData.favorite_music)) {
    (profileData as any).favorite_music = wizardData.favorite_music.map(music => sanitizeText(music));
  }
  if (wizardData.favorite_foods && Array.isArray(wizardData.favorite_foods)) {
    (profileData as any).favorite_foods = wizardData.favorite_foods.map(food => sanitizeText(food));
  }
  if (wizardData.favorite_games && Array.isArray(wizardData.favorite_games)) {
    (profileData as any).favorite_games = wizardData.favorite_games.map(game => sanitizeText(game));
  }
  if (wizardData.favorite_podcasts && Array.isArray(wizardData.favorite_podcasts)) {
    (profileData as any).favorite_podcasts = wizardData.favorite_podcasts.map(podcast => sanitizeText(podcast));
  }

  // Final touches
  if (wizardData.dream_vacation) profileData.dream_vacation = sanitizeText(wizardData.dream_vacation);
  if (wizardData.ideal_date) profileData.ideal_date = sanitizeHtml(wizardData.ideal_date);

  return profileData;
};

export const mapFormDataToProfile = (
  processedData: Record<string, any>,
  userId: string,
  enabledQuestions: QuestionItem[]
): Partial<TablesInsert<'profiles'>> => {
  const profileInsertData: Partial<TablesInsert<'profiles'>> = {
    id: userId,
  };

  // Map form data to profile fields
  enabledQuestions.forEach(q => {
    if (q.profileField && q.profileField !== 'email' && q.profileField !== 'password' && q.profileField !== 'photos') {
      const formValue = processedData[q.id];
      if (formValue !== undefined && formValue !== null && formValue !== '') {
        if (q.profileField === 'full_name') {
          profileInsertData.name = sanitizeText(String(formValue));
        } else if (q.profileField === 'bio') {
          profileInsertData.bio = sanitizeHtml(String(formValue));
        } else if (q.profileField === 'date_of_birth' && typeof formValue === 'string' && formValue) {
          const birthDate = new Date(formValue);
          if (!isNaN(birthDate.getTime())) {
            const ageDifMs = Date.now() - birthDate.getTime();
            const ageDate = new Date(ageDifMs);
            const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
            if (calculatedAge >= 18 && calculatedAge <= 120) {
              profileInsertData.age = calculatedAge;
            }
          }
        } else if (q.fieldType === 'multi-select' && Array.isArray(formValue)) {
          const sanitizedArray = formValue.map(item => sanitizeText(String(item)));
          (profileInsertData as any)[q.profileField] = sanitizedArray.length > 0 ? sanitizedArray : null;
        } else if (typeof formValue === 'string') {
          (profileInsertData as any)[q.profileField] = sanitizeText(formValue);
        } else if (typeof formValue === 'number' || typeof formValue === 'boolean') {
          (profileInsertData as any)[q.profileField] = formValue;
        }
      }
    }
  });
  
  // Ensure required fields have sanitized values
  if (!profileInsertData.name) {
    profileInsertData.name = "New User";
  }
  if (profileInsertData.age === undefined || profileInsertData.age === null) {
    profileInsertData.age = 18;
  }
  if (!profileInsertData.location) {
    profileInsertData.location = "Not specified";
  }
  
  return profileInsertData;
};
