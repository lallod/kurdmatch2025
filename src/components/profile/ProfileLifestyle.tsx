
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
        icon={<Wine size={18} />} 
        label="Drinking" 
        value={details.drinking} 
      />
      
      <Separator className={isMobile ? "bg-gray-800" : ""} />
      
      <DetailItem 
        icon={<Cigarette size={18} />} 
        label="Smoking" 
        value={details.smoking} 
      />
      
      <Separator className={isMobile ? "bg-gray-800" : ""} />
      
      <DetailItem 
        icon={<Dumbbell size={18} />} 
        label="Exercise" 
        value={details.exerciseHabits} 
      />
      
      <Separator className={isMobile ? "bg-gray-800" : ""} />
      
      <DetailItem 
        icon={<AlarmClock size={18} />} 
        label="Sleep Schedule" 
        value={details.sleepSchedule} 
      />
      
      <Separator className={isMobile ? "bg-gray-800" : ""} />
      
      <DetailItem 
        icon={<DollarSign size={18} />} 
        label="Financial Habits" 
        value={details.financialHabits || "Not specified"} 
      />
      
      <Separator className={isMobile ? "bg-gray-800" : ""} />
      
      <DetailItem 
        icon={<Calendar size={18} />} 
        label="Weekend Activities" 
        value={formatList(details.weekendActivities) || "Not specified"} 
      />
      
      <Separator className={isMobile ? "bg-gray-800" : ""} />
      
      <DetailItem 
        icon={<Clock4 size={18} />} 
        label="Work-Life Balance" 
        value={details.workLifeBalance || "Not specified"} 
      />
      
      <Separator className={isMobile ? "bg-gray-800" : ""} />
      
      <DetailItem 
        icon={<Utensils size={18} />} 
        label="Dietary Preferences" 
        value={details.dietaryPreferences || "Not specified"} 
      />
      
      <Separator className={isMobile ? "bg-gray-800" : ""} />
      
      <DetailItem 
        icon={<Sun size={18} />} 
        label="Morning Routine" 
        value={details.morningRoutine || "Not specified"} 
      />
      
      <Separator className={isMobile ? "bg-gray-800" : ""} />
      
      <DetailItem 
        icon={<Moon size={18} />} 
        label="Evening Routine" 
        value={details.eveningRoutine || "Not specified"} 
      />
    </div>
  );
};

export default ProfileLifestyle;
