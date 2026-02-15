import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { SlidersHorizontal, Lock, X, MapPin } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/useTranslations';

export interface SwipeFilters {
  ageMin?: number;
  ageMax?: number;
  location?: string;
  religion?: string;
  ethnicity?: string;
  kurdistanRegion?: string;
  bodyType?: string;
  heightMin?: number;
  heightMax?: number;
  smoking?: string;
  drinking?: string;
  exerciseHabits?: string;
  education?: string;
  occupation?: string;
  maxDistance?: number;
}

interface SwipeFilterSidebarProps {
  onApplyFilters: (filters: SwipeFilters) => void;
  currentFilters: SwipeFilters;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const selectVal = (v: string) => v || "any";
const fromSelect = (v: string) => v === "any" ? "" : v;

export const SwipeFilterSidebar: React.FC<SwipeFilterSidebarProps> = ({ onApplyFilters, currentFilters, open, onOpenChange }) => {
  const { subscription } = useSubscription();
  const { t } = useTranslations();
  const isSubscribed = subscription?.subscription_type !== 'free';

  const [ageMin, setAgeMin] = useState(currentFilters.ageMin?.toString() || '18');
  const [ageMax, setAgeMax] = useState(currentFilters.ageMax?.toString() || '99');
  const [location, setLocation] = useState(currentFilters.location || '');
  const [religion, setReligion] = useState(currentFilters.religion || '');
  const [ethnicity, setEthnicity] = useState(currentFilters.ethnicity || '');
  const [kurdistanRegion, setKurdistanRegion] = useState(currentFilters.kurdistanRegion || '');
  const [bodyType, setBodyType] = useState(currentFilters.bodyType || '');
  const [heightMin, setHeightMin] = useState(currentFilters.heightMin?.toString() || '');
  const [heightMax, setHeightMax] = useState(currentFilters.heightMax?.toString() || '');
  const [smoking, setSmoking] = useState(currentFilters.smoking || '');
  const [drinking, setDrinking] = useState(currentFilters.drinking || '');
  const [exerciseHabits, setExerciseHabits] = useState(currentFilters.exerciseHabits || '');
  const [education, setEducation] = useState(currentFilters.education || '');
  const [occupation, setOccupation] = useState(currentFilters.occupation || '');
  const [maxDistance, setMaxDistance] = useState(currentFilters.maxDistance || 100);

  const handleApply = () => {
    if (!isSubscribed) {
      toast.error(t('swipe.premium_feature', 'Premium feature'), { description: t('swipe.subscribe_filters', 'Subscribe to use advanced filters'), icon: '⭐' });
      return;
    }
    onApplyFilters({
      ageMin: ageMin ? parseInt(ageMin) : undefined,
      ageMax: ageMax ? parseInt(ageMax) : undefined,
      location: location || undefined,
      religion: religion || undefined,
      ethnicity: ethnicity || undefined,
      kurdistanRegion: kurdistanRegion || undefined,
      bodyType: bodyType || undefined,
      heightMin: heightMin ? parseInt(heightMin) : undefined,
      heightMax: heightMax ? parseInt(heightMax) : undefined,
      smoking: smoking || undefined,
      drinking: drinking || undefined,
      exerciseHabits: exerciseHabits || undefined,
      education: education || undefined,
      occupation: occupation || undefined,
      maxDistance: maxDistance < 100 ? maxDistance : undefined,
    });
    onOpenChange(false);
    toast.success(t('swipe.filters_applied', 'Filters applied'));
  };

  const handleReset = () => {
    setAgeMin('18'); setAgeMax('99'); setLocation(''); setReligion('');
    setEthnicity(''); setKurdistanRegion(''); setBodyType('');
    setHeightMin(''); setHeightMax('');
    setSmoking(''); setDrinking(''); setExerciseHabits('');
    setEducation(''); setOccupation(''); setMaxDistance(100);
    onApplyFilters({});
    onOpenChange(false);
    toast.success(t('swipe.filters_reset', 'Filters reset'));
  };

  if (!open) return null;

  const dis = !isSubscribed;
  const inputCls = "bg-muted/50 border-border text-foreground h-9 text-sm";
  const labelCls = "text-foreground text-sm";

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={() => onOpenChange(false)}>
      <div className="fixed top-0 right-0 h-full w-[90vw] sm:w-[85vw] max-w-sm bg-background shadow-2xl transform transition-transform duration-300 flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="border-b border-border/20 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
              <h2 className="text-base sm:text-lg font-semibold text-foreground">{t('swipe.filters_title', 'Swipe Filters')}</h2>
              {!isSubscribed && (<span className="text-[10px] sm:text-xs bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium">{t('subscription.premium', 'Premium')}</span>)}
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="text-foreground hover:bg-muted h-7 w-7 sm:h-8 sm:w-8"><X className="w-4 h-4 sm:w-5 sm:h-5" /></Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          {!isSubscribed && (
            <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-start gap-2 sm:gap-3">
                <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div><p className="text-xs sm:text-sm font-semibold text-yellow-100">{t('swipe.premium_feature', 'Premium Feature')}</p><p className="text-[10px] sm:text-xs text-yellow-200/80 mt-1">{t('swipe.subscribe_filters', 'Subscribe to unlock advanced filters')}</p></div>
              </div>
            </div>
          )}

          <div className="space-y-4 sm:space-y-5">
            {/* Age Range */}
            <div className="space-y-1.5">
              <Label className={labelCls}>{t('swipe.age_range', 'Age Range')}</Label>
              <div className="flex gap-2 items-center">
                <Input type="number" min="18" max="99" value={ageMin} onChange={(e) => setAgeMin(e.target.value)} className={inputCls} disabled={dis} />
                <span className="text-foreground text-sm">{t('swipe.to', 'to')}</span>
                <Input type="number" min="18" max="99" value={ageMax} onChange={(e) => setAgeMax(e.target.value)} className={inputCls} disabled={dis} />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <Label className={labelCls}>{t('swipe.location', 'Location')}</Label>
              <Input type="text" placeholder={t('swipe.city_or_region', 'City or region...')} value={location} onChange={(e) => setLocation(e.target.value)} className={`${inputCls} placeholder:text-muted-foreground`} disabled={dis} />
            </div>

            {/* Max Distance */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className={labelCls}>
                  <MapPin className="w-3.5 h-3.5 inline mr-1" />
                  Near Me
                </Label>
                <span className="text-xs text-muted-foreground">{maxDistance >= 100 ? 'Any distance' : `${maxDistance} km`}</span>
              </div>
              <Slider
                value={[maxDistance]}
                onValueChange={([v]) => setMaxDistance(v)}
                min={5}
                max={100}
                step={5}
                disabled={dis}
                className="w-full"
              />
              <p className="text-[10px] text-muted-foreground">Uses your current GPS location</p>
            </div>

            <div className="space-y-1.5">
              <Label className={labelCls}>Kurdistan Region</Label>
              <Select value={selectVal(kurdistanRegion)} onValueChange={(v) => setKurdistanRegion(fromSelect(v))} disabled={dis}>
                <SelectTrigger className={inputCls}><SelectValue placeholder="Select region..." /></SelectTrigger>
                <SelectContent className="bg-card border-border max-h-[200px]">
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="Bakur">Bakur (Turkey)</SelectItem>
                  <SelectItem value="Bashur">Bashur (Iraq)</SelectItem>
                  <SelectItem value="Rojava">Rojava (Syria)</SelectItem>
                  <SelectItem value="Rojhelat">Rojhelat (Iran)</SelectItem>
                  <SelectItem value="Diaspora">Diaspora</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Ethnicity */}
            <div className="space-y-1.5">
              <Label className={labelCls}>Ethnicity</Label>
              <Select value={selectVal(ethnicity)} onValueChange={(v) => setEthnicity(fromSelect(v))} disabled={dis}>
                <SelectTrigger className={inputCls}><SelectValue placeholder="Select ethnicity..." /></SelectTrigger>
                <SelectContent className="bg-card border-border max-h-[200px]">
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="Kurdish">Kurdish</SelectItem>
                  <SelectItem value="Arab">Arab</SelectItem>
                  <SelectItem value="Turkish">Turkish</SelectItem>
                  <SelectItem value="Persian">Persian</SelectItem>
                  <SelectItem value="Assyrian">Assyrian</SelectItem>
                  <SelectItem value="Mixed">Mixed</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Religion */}
            <div className="space-y-1.5">
              <Label className={labelCls}>{t('swipe.religion', 'Religion')}</Label>
              <Select value={selectVal(religion)} onValueChange={(v) => setReligion(fromSelect(v))} disabled={dis}>
                <SelectTrigger className={inputCls}><SelectValue placeholder={t('swipe.select_religion', 'Select religion...')} /></SelectTrigger>
                <SelectContent className="bg-card border-border max-h-[200px]">
                  <SelectItem value="any">{t('swipe.any', 'Any')}</SelectItem>
                  <SelectItem value="Muslim">Muslim</SelectItem>
                  <SelectItem value="Christian">Christian</SelectItem>
                  <SelectItem value="Jewish">Jewish</SelectItem>
                  <SelectItem value="Yazidi">Yazidi</SelectItem>
                  <SelectItem value="Spiritual">Spiritual</SelectItem>
                  <SelectItem value="Agnostic">Agnostic</SelectItem>
                  <SelectItem value="Atheist">Atheist</SelectItem>
                  <SelectItem value="Other">{t('swipe.other', 'Other')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Height Range (cm) */}
            <div className="space-y-1.5">
              <Label className={labelCls}>Height (cm)</Label>
              <div className="flex gap-2 items-center">
                <Input type="number" min="140" max="220" placeholder="Min" value={heightMin} onChange={(e) => setHeightMin(e.target.value)} className={inputCls} disabled={dis} />
                <span className="text-foreground text-sm">{t('swipe.to', 'to')}</span>
                <Input type="number" min="140" max="220" placeholder="Max" value={heightMax} onChange={(e) => setHeightMax(e.target.value)} className={inputCls} disabled={dis} />
              </div>
            </div>

            {/* Body Type */}
            <div className="space-y-1.5">
              <Label className={labelCls}>Body Type</Label>
              <Select value={selectVal(bodyType)} onValueChange={(v) => setBodyType(fromSelect(v))} disabled={dis}>
                <SelectTrigger className={inputCls}><SelectValue placeholder="Select body type..." /></SelectTrigger>
                <SelectContent className="bg-card border-border max-h-[200px]">
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="Slim">Slim</SelectItem>
                  <SelectItem value="Athletic">Athletic</SelectItem>
                  <SelectItem value="Average">Average</SelectItem>
                  <SelectItem value="Curvy">Curvy</SelectItem>
                  <SelectItem value="Plus Size">Plus Size</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Smoking */}
            <div className="space-y-1.5">
              <Label className={labelCls}>Smoking</Label>
              <Select value={selectVal(smoking)} onValueChange={(v) => setSmoking(fromSelect(v))} disabled={dis}>
                <SelectTrigger className={inputCls}><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent className="bg-card border-border max-h-[200px]">
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="Never">Never</SelectItem>
                  <SelectItem value="Socially">Socially</SelectItem>
                  <SelectItem value="Regularly">Regularly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Drinking */}
            <div className="space-y-1.5">
              <Label className={labelCls}>Drinking</Label>
              <Select value={selectVal(drinking)} onValueChange={(v) => setDrinking(fromSelect(v))} disabled={dis}>
                <SelectTrigger className={inputCls}><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent className="bg-card border-border max-h-[200px]">
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="Never">Never</SelectItem>
                  <SelectItem value="Socially">Socially</SelectItem>
                  <SelectItem value="Regularly">Regularly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Exercise */}
            <div className="space-y-1.5">
              <Label className={labelCls}>Exercise</Label>
              <Select value={selectVal(exerciseHabits)} onValueChange={(v) => setExerciseHabits(fromSelect(v))} disabled={dis}>
                <SelectTrigger className={inputCls}><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent className="bg-card border-border max-h-[200px]">
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="3-4 times a week">3-4 times a week</SelectItem>
                  <SelectItem value="Occasionally">Occasionally</SelectItem>
                  <SelectItem value="Rarely">Rarely</SelectItem>
                  <SelectItem value="Never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Education */}
            <div className="space-y-1.5">
              <Label className={labelCls}>Education</Label>
              <Select value={selectVal(education)} onValueChange={(v) => setEducation(fromSelect(v))} disabled={dis}>
                <SelectTrigger className={inputCls}><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent className="bg-card border-border max-h-[200px]">
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="High School">High School</SelectItem>
                  <SelectItem value="Bachelor's">Bachelor's</SelectItem>
                  <SelectItem value="Master's">Master's</SelectItem>
                  <SelectItem value="PhD">PhD</SelectItem>
                  <SelectItem value="Trade School">Trade School</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Occupation */}
            <div className="space-y-1.5">
              <Label className={labelCls}>Occupation</Label>
              <Input type="text" placeholder="e.g. Engineer, Doctor..." value={occupation} onChange={(e) => setOccupation(e.target.value)} className={`${inputCls} placeholder:text-muted-foreground`} disabled={dis} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border/20 p-3 sm:p-4">
          <div className="flex gap-2">
            <Button onClick={handleReset} variant="outline" className="flex-1 bg-muted/50 border-border text-foreground hover:bg-muted h-9 text-sm">{t('swipe.reset', 'Reset')}</Button>
            <Button onClick={handleApply} className="flex-1 bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-600 h-9 text-sm" disabled={dis}>{t('swipe.apply_filters', 'Apply Filters')}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
