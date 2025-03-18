
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
}

const ProfileLifestyle: React.FC<ProfileLifestyleProps> = ({ 
  details, 
  formatList,
  isMobile
}) => {
  return (
    <div className="space-y-1 py-4 animate-fade-in">
      <DetailItem 
        icon={<Wine size={18} className="group-hover:animate-pulse" />} 
        label="Drinking" 
        value={details.drinking} 
      />
      
      <Separator />
      
      <DetailItem 
        icon={<Cigarette size={18} className="group-hover:animate-pulse" />} 
        label="Smoking" 
        value={details.smoking} 
      />
      
      <Separator />
      
      <DetailItem 
        icon={<Dumbbell size={18} className="group-hover:animate-pulse" />} 
        label="Exercise" 
        value={details.exerciseHabits} 
      />
      
      <Separator />
      
      <DetailItem 
        icon={<AlarmClock size={18} className="group-hover:animate-pulse" />} 
        label="Sleep Schedule" 
        value={details.sleepSchedule} 
      />
      
      <Separator />
      
      <DetailItem 
        icon={<DollarSign size={18} className="group-hover:animate-pulse" />} 
        label="Financial Habits" 
        value={details.financialHabits || "Not specified"} 
      />
      
      <Separator />
      
      <DetailItem 
        icon={<Calendar size={18} className="group-hover:animate-pulse" />} 
        label="Weekend Activities" 
        value={formatList(details.weekendActivities) || "Not specified"} 
      />
      
      <Separator />
      
      <DetailItem 
        icon={<Clock4 size={18} className="group-hover:animate-pulse" />} 
        label="Work-Life Balance" 
        value={details.workLifeBalance || "Not specified"} 
      />
      
      <Separator />
      
      <DetailItem 
        icon={<Utensils size={18} className="group-hover:animate-pulse" />} 
        label="Dietary Preferences" 
        value={details.dietaryPreferences || "Not specified"} 
      />
      
      <Separator />
      
      <DetailItem 
        icon={<Sun size={18} className="group-hover:animate-pulse" />} 
        label="Morning Routine" 
        value={details.morningRoutine || "Not specified"} 
      />
      
      <Separator />
      
      <DetailItem 
        icon={<Moon size={18} className="group-hover:animate-pulse" />} 
        label="Evening Routine" 
        value={details.eveningRoutine || "Not specified"} 
      />
    </div>
  );
};

export default ProfileLifestyle;
