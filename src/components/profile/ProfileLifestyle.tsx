
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Wine, Cigarette, Dumbbell, AlarmClock, DollarSign,
  Calendar, Clock4, Utensils, Sun, Moon
} from 'lucide-react';
import DetailItem from './DetailItem';

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
  return (
    <div className="space-y-1 py-4 animate-fade-in">
      <DetailItem 
        icon={<Wine size={18} />} 
        label="Drinking" 
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
        label="Smoking" 
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
        label="Exercise" 
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
        label="Sleep Schedule" 
        value={details.sleepSchedule || 'Not specified'}
        editable={!!onFieldEdit}
        fieldKey="sleepSchedule"
        fieldType="select"
        fieldOptions={["Night owl", "Irregular schedule", "Regular schedule", "Early bird"]}
        onFieldEdit={onFieldEdit}
      />
      <Separator />
      <DetailItem 
        icon={<DollarSign size={18} />} 
        label="Financial Habits" 
        value={details.financialHabits || 'Not specified'}
        editable={!!onFieldEdit}
        fieldKey="financialHabits"
        fieldType="select"
        fieldOptions={["Spender", "Balanced", "Saver with occasional splurges", "Saver", "Financial planner"]}
        onFieldEdit={onFieldEdit}
      />
      <Separator />
      <DetailItem 
        icon={<Calendar size={18} />} 
        label="Weekend Activities" 
        value={formatList(details.weekendActivities) || 'Not specified'}
        editable={!!onFieldEdit}
        fieldKey="weekendActivities"
        fieldType="text"
        onFieldEdit={onFieldEdit}
      />
      <Separator />
      <DetailItem 
        icon={<Clock4 size={18} />} 
        label="Work-Life Balance" 
        value={details.workLifeBalance || 'Not specified'}
        editable={!!onFieldEdit}
        fieldKey="workLifeBalance"
        fieldType="text"
        onFieldEdit={onFieldEdit}
      />
      <Separator />
      <DetailItem 
        icon={<Utensils size={18} />} 
        label="Dietary Preferences" 
        value={details.dietaryPreferences || 'Not specified'}
        editable={!!onFieldEdit}
        fieldKey="dietaryPreferences"
        fieldType="text"
        onFieldEdit={onFieldEdit}
      />
      <Separator />
      <DetailItem 
        icon={<Sun size={18} />} 
        label="Morning Routine" 
        value={details.morningRoutine || 'Not specified'}
      />
      <Separator />
      <DetailItem 
        icon={<Moon size={18} />} 
        label="Evening Routine" 
        value={details.eveningRoutine || 'Not specified'}
      />
    </div>
  );
};

export default ProfileLifestyle;
