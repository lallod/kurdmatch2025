
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { 
  Wine, Cigarette, Dumbbell, AlarmClock, DollarSign,
  Calendar, Clock4, Utensils, Sun, Moon
} from 'lucide-react';
import DetailItem from './DetailItem';
import { useTranslations } from '@/hooks/useTranslations';

interface ProfileLifestyleProps {
  details: {
    drinking: string;
    smoking: string;
    exerciseHabits: string;
    sleepSchedule: string;
    financialHabits?: string;
    weekendActivities?: string[] | string;
    workLifeBalance?: string;
    dietaryPreferences?: string;
    morningRoutine?: string;
    eveningRoutine?: string;
  };
  formatList: (value: string[] | string | undefined) => string;
  isMobile: boolean;
  onFieldEdit?: (updates: Record<string, any>) => Promise<void>;
}

const ProfileLifestyle: React.FC<ProfileLifestyleProps> = ({ 
  details, 
  formatList,
  isMobile,
  onFieldEdit
}) => {
  const { t } = useTranslations();
  const notSpecified = t('common.not_specified', 'Not specified');

  return (
    <div className="space-y-1 py-4 animate-fade-in">
      <DetailItem 
        icon={<Wine size={18} />} 
        label={t('profile.drinking', 'Drinking')}
        value={details.drinking}
        editable={!!onFieldEdit}
        fieldKey="drinking"
        fieldType="select"
        fieldOptions={["Never", "Rarely", "Socially", "Regularly"]}
        onFieldEdit={onFieldEdit}
      />
      <Separator />
      <DetailItem 
        icon={<Cigarette size={18} />} 
        label={t('profile.smoking', 'Smoking')}
        value={details.smoking}
        editable={!!onFieldEdit}
        fieldKey="smoking"
        fieldType="select"
        fieldOptions={["Never", "Rarely", "Socially", "Regularly", "Trying to quit"]}
        onFieldEdit={onFieldEdit}
      />
      <Separator />
      <DetailItem 
        icon={<Dumbbell size={18} />} 
        label={t('profile.exercise', 'Exercise')}
        value={details.exerciseHabits}
        editable={!!onFieldEdit}
        fieldKey="exerciseHabits"
        fieldType="select"
        fieldOptions={["Never", "Rarely", "Occasional", "Regular", "Daily"]}
        onFieldEdit={onFieldEdit}
      />
      <Separator />
      <DetailItem 
        icon={<AlarmClock size={18} />} 
        label={t('profile.sleep_schedule', 'Sleep Schedule')}
        value={details.sleepSchedule || notSpecified}
        editable={!!onFieldEdit}
        fieldKey="sleepSchedule"
        fieldType="select"
        fieldOptions={["Night owl", "Irregular schedule", "Regular schedule", "Early bird"]}
        onFieldEdit={onFieldEdit}
      />
      <Separator />
      <DetailItem 
        icon={<DollarSign size={18} />} 
        label={t('profile.financial_habits', 'Financial Habits')}
        value={details.financialHabits || notSpecified}
        editable={!!onFieldEdit}
        fieldKey="financialHabits"
        fieldType="select"
        fieldOptions={["Spender", "Balanced", "Saver with occasional splurges", "Saver", "Financial planner"]}
        onFieldEdit={onFieldEdit}
      />
      <Separator />
      <DetailItem 
        icon={<Calendar size={18} />} 
        label={t('profile.weekend_activities', 'Weekend Activities')}
        value={formatList(details.weekendActivities) || notSpecified}
        editable={!!onFieldEdit}
        fieldKey="weekendActivities"
        fieldType="multi-select"
        fieldOptions={["Hiking", "Reading", "Socializing", "Gaming", "Cooking", "Sports", "Shopping", "Traveling", "Relaxing", "Volunteering"]}
        onFieldEdit={onFieldEdit}
      />
      <Separator />
      <DetailItem 
        icon={<Clock4 size={18} />} 
        label={t('profile.work_life_balance', 'Work-Life Balance')}
        value={details.workLifeBalance || notSpecified}
        editable={!!onFieldEdit}
        fieldKey="workLifeBalance"
        fieldType="select"
        fieldOptions={["Work-focused", "Balanced", "Life-focused", "Flexible", "Struggling"]}
        onFieldEdit={onFieldEdit}
      />
      <Separator />
      <DetailItem 
        icon={<Utensils size={18} />} 
        label={t('profile.dietary_preferences', 'Dietary Preferences')}
        value={details.dietaryPreferences || notSpecified}
        editable={!!onFieldEdit}
        fieldKey="dietaryPreferences"
        fieldType="select"
        fieldOptions={["No restrictions", "Vegetarian", "Vegan", "Halal", "Kosher", "Pescatarian", "Gluten-free", "Other"]}
        onFieldEdit={onFieldEdit}
      />
      <Separator />
      <DetailItem 
        icon={<Sun size={18} />} 
        label={t('profile.morning_routine', 'Morning Routine')}
        value={details.morningRoutine || notSpecified}
        editable={!!onFieldEdit}
        fieldKey="morningRoutine"
        fieldType="select"
        fieldOptions={["Early riser & active", "Slow & relaxed", "Coffee then go", "Exercise first", "Meditation/mindfulness"]}
        onFieldEdit={onFieldEdit}
      />
      <Separator />
      <DetailItem 
        icon={<Moon size={18} />} 
        label={t('profile.evening_routine', 'Evening Routine')}
        value={details.eveningRoutine || notSpecified}
        editable={!!onFieldEdit}
        fieldKey="eveningRoutine"
        fieldType="select"
        fieldOptions={["Early to bed", "Night owl", "Reading/relaxing", "Socializing", "TV/streaming", "Exercise"]}
        onFieldEdit={onFieldEdit}
      />
    </div>
  );
};

export default ProfileLifestyle;