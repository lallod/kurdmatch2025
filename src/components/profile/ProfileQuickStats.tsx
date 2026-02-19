
import React, { useState } from 'react';
import { 
  GraduationCap, Briefcase, Heart, Star, Pencil, Check, Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface ProfileQuickStatsProps {
  education: string;
  occupation: string;
  company: string;
  relationshipGoals: string;
  zodiacSign: string;
  personalityType: string;
  tinderBadgeStyle: string;
  isMobile: boolean;
  onFieldEdit?: (updates: Record<string, any>) => Promise<void>;
}

const educationOptions = ["High School", "Some College", "Associate's Degree", "Bachelor's Degree", "Master's Degree", "Doctorate", "Trade School", "Self-taught"];
const relationshipOptions = ["Long-term relationship", "Short-term relationship", "Marriage", "Friendship", "Not sure yet", "Casual dating"];
const zodiacOptions = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

const ProfileQuickStats: React.FC<ProfileQuickStatsProps> = ({ 
  education, 
  occupation, 
  company, 
  relationshipGoals, 
  zodiacSign, 
  personalityType,
  tinderBadgeStyle,
  isMobile,
  onFieldEdit
}) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');
  const [saving, setSaving] = useState(false);

  const handleStartEdit = (field: string, currentValue: string) => {
    if (!onFieldEdit) return;
    setEditingField(field);
    setTempValue(currentValue || '');
  };

  const handleSave = async (field: string, value: string) => {
    if (!onFieldEdit) return;
    setSaving(true);
    try {
      await onFieldEdit({ [field]: value });
    } catch {}
    setSaving(false);
    setEditingField(null);
  };

  const editable = !!onFieldEdit;

  const cardClass = "bg-card/60 backdrop-blur-sm p-4 rounded-2xl border border-border/10 group relative";
  const iconContainerClass = "w-8 h-8 flex items-center justify-center rounded-full bg-primary/10";

  const renderEditButton = (field: string, currentValue: string) => {
    if (!editable) return null;
    if (editingField === field && saving) {
      return <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground absolute top-3 right-3" />;
    }
    return (
      <button
        onClick={(e) => { e.stopPropagation(); handleStartEdit(field, currentValue); }}
        className="absolute top-3 right-3 h-6 w-6 rounded-full flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-primary/10 transition-all"
      >
        <Pencil className="h-3 w-3 text-primary" />
      </button>
    );
  };

  const renderSelectEditor = (field: string, options: string[]) => (
    <Select
      value={tempValue}
      onValueChange={(val) => {
        setTempValue(val);
        handleSave(field, val);
      }}
    >
      <SelectTrigger className="h-8 text-xs w-full mt-1">
        <SelectValue placeholder="Select..." />
      </SelectTrigger>
      <SelectContent className="bg-popover border border-border z-50">
        {options.map((opt) => (
          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const renderTextEditor = (field: string) => (
    <Input
      autoFocus
      value={tempValue}
      onChange={(e) => setTempValue(e.target.value)}
      onBlur={() => handleSave(field, tempValue)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleSave(field, tempValue);
        if (e.key === 'Escape') setEditingField(null);
      }}
      className="h-8 text-xs w-full mt-1"
    />
  );

  const educationDisplay = Array.isArray(education) 
    ? (education as string[])[0] 
    : (education || '').replace(/[\[\]"]/g, '').split(',')[0];

  const relationshipDisplay = isMobile && relationshipGoals
    ? relationshipGoals.replace('looking for ', '')
    : relationshipGoals;

  return (
    <div className={`${isMobile ? 'mt-4' : 'mb-6'} grid grid-cols-2 gap-2.5 animate-fade-in`}>
      {/* Education */}
      <div className={cardClass}>
        {renderEditButton('education', educationDisplay)}
        <div className="flex items-center gap-2.5 mb-2">
          <div className={iconContainerClass}>
            <GraduationCap size={15} className="text-primary" />
          </div>
          <h4 className="text-xs font-semibold text-foreground">Education</h4>
        </div>
        {editingField === 'education' 
          ? renderSelectEditor('education', educationOptions)
          : <p className="text-xs text-muted-foreground leading-relaxed">{educationDisplay || 'Not set'}</p>
        }
      </div>

      {/* Work */}
      <div className={cardClass}>
        {renderEditButton('occupation', occupation)}
        <div className="flex items-center gap-2.5 mb-2">
          <div className={iconContainerClass}>
            <Briefcase size={15} className="text-primary" />
          </div>
          <h4 className="text-xs font-semibold text-foreground">Work</h4>
        </div>
        {editingField === 'occupation'
          ? renderTextEditor('occupation')
          : <p className="text-xs text-muted-foreground leading-relaxed">{occupation || 'Not set'}</p>
        }
      </div>

      {/* Relationship Goals */}
      <div className={cardClass}>
        {renderEditButton('relationshipGoals', relationshipGoals)}
        <div className="flex items-center gap-2.5 mb-2">
          <div className={iconContainerClass}>
            <Heart size={15} className="text-primary" />
          </div>
          <h4 className="text-xs font-semibold text-foreground">Looking for</h4>
        </div>
        {editingField === 'relationshipGoals'
          ? renderSelectEditor('relationshipGoals', relationshipOptions)
          : <p className="text-xs text-muted-foreground leading-relaxed">{relationshipDisplay || 'Not set'}</p>
        }
      </div>

      {/* Zodiac */}
      <div className={cardClass}>
        {renderEditButton('zodiacSign', zodiacSign)}
        <div className="flex items-center gap-2.5 mb-2">
          <div className={iconContainerClass}>
            <Star size={15} className="text-primary" />
          </div>
          <h4 className="text-xs font-semibold text-foreground">Zodiac</h4>
        </div>
        {editingField === 'zodiacSign'
          ? renderSelectEditor('zodiacSign', zodiacOptions)
          : zodiacSign
            ? <Badge className="bg-primary/15 text-primary border-0 rounded-full text-[11px] px-2.5 py-0.5">{zodiacSign}</Badge>
            : <p className="text-xs text-muted-foreground">Not set</p>
        }
      </div>
    </div>
  );
};

export default ProfileQuickStats;
