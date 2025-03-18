
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
  // Use consistent styles for all status indicators
  const getLifestyleStatusBadge = (value: string, options: string[]) => {
    const index = options.indexOf(value);
    let color = "";
    
    // Create a gradient of colors based on the option position
    if (index === 0) color = "bg-green-100 text-green-800 border-green-200";
    else if (index === options.length - 1) color = "bg-red-100 text-red-800 border-red-200";
    else {
      const midpoint = Math.floor(options.length / 2);
      if (index < midpoint) color = "bg-blue-100 text-blue-800 border-blue-200";
      else color = "bg-amber-100 text-amber-800 border-amber-200";
    }
    
    return (
      <Badge variant="outline" className={`${color} animate-in fade-in duration-300`}>
        {value}
      </Badge>
    );
  };

  return (
    <div className="space-y-1 py-4 animate-fade-in">
      <DetailItem 
        icon={<Wine size={18} className="group-hover:animate-pulse" />} 
        label="Drinking" 
        value={getLifestyleStatusBadge(details.drinking, ["Never", "Rarely", "Socially", "Regularly"])} 
      />
      
      <Separator />
      
      <DetailItem 
        icon={<Cigarette size={18} className="group-hover:animate-pulse" />} 
        label="Smoking" 
        value={getLifestyleStatusBadge(details.smoking, ["Never", "Rarely", "Socially", "Regularly", "Trying to quit"])} 
      />
      
      <Separator />
      
      <DetailItem 
        icon={<Dumbbell size={18} className="group-hover:animate-pulse" />} 
        label="Exercise" 
        value={getLifestyleStatusBadge(details.exerciseHabits, ["Never", "Rarely", "Occasional - 1-3 times per week", "Regular - 4-5 times per week", "Daily"])} 
      />
      
      <Separator />
      
      <DetailItem 
        icon={<AlarmClock size={18} className="group-hover:animate-pulse" />} 
        label="Sleep Schedule" 
        value={getLifestyleStatusBadge(details.sleepSchedule, ["Night owl", "Irregular schedule", "Regular schedule", "Early bird"])} 
      />
      
      <Separator />
      
      <DetailItem 
        icon={<DollarSign size={18} className="group-hover:animate-pulse" />} 
        label="Financial Habits" 
        value={details.financialHabits ? getLifestyleStatusBadge(details.financialHabits, ["Spender", "Balanced", "Saver with occasional splurges", "Saver", "Financial planner"]) : "Not specified"} 
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
