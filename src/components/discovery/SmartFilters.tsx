import { useState } from 'react';
import { Filter, Sparkles, MapPin, Heart, Briefcase, GraduationCap, Star, ChevronDown, Lock } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SmartFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  activeFilterCount?: number;
}

interface FilterState {
  ageRange: [number, number];
  distance: number;
  verifiedOnly: boolean;
  videoVerifiedOnly: boolean;
  hasPhotos: boolean;
  relationshipGoals: string[];
  education: string[];
  occupation: string;
  region: string;
  recentlyActive: boolean;
  compatibilityMin: number;
}

const RELATIONSHIP_GOALS = [
  'Long-term relationship',
  'Marriage',
  'Dating',
  'Friendship',
  'Not sure yet',
];

const EDUCATION_LEVELS = [
  'High School',
  'Some College',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'PhD',
  'Trade School',
];

const REGIONS = [
  'Hewlêr (Erbil)',
  'Silêmanî (Sulaymaniyah)',
  'Duhok',
  'Kirkuk',
  'Diaspora - Europe',
  'Diaspora - North America',
  'Diaspora - Other',
];

export const SmartFilters = ({ onFiltersChange, activeFilterCount = 0 }: SmartFiltersProps) => {
  const { hasFeature } = useSubscription();
  const isPremium = hasFeature('basic');
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    ageRange: [18, 50],
    distance: 100,
    verifiedOnly: false,
    videoVerifiedOnly: false,
    hasPhotos: true,
    relationshipGoals: [],
    education: [],
    occupation: '',
    region: '',
    recentlyActive: false,
    compatibilityMin: 0,
  });

  const [expandedSections, setExpandedSections] = useState<string[]>(['basic']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const toggleRelationshipGoal = (goal: string) => {
    setFilters(prev => ({
      ...prev,
      relationshipGoals: prev.relationshipGoals.includes(goal)
        ? prev.relationshipGoals.filter(g => g !== goal)
        : [...prev.relationshipGoals, goal],
    }));
  };

  const toggleEducation = (edu: string) => {
    setFilters(prev => ({
      ...prev,
      education: prev.education.includes(edu)
        ? prev.education.filter(e => e !== edu)
        : [...prev.education, edu],
    }));
  };

  const applyFilters = () => {
    if (!isPremium) {
      toast.error('Premium feature', { description: 'Upgrade to use Smart Filters', icon: '⭐' });
      return;
    }
    onFiltersChange(filters);
    setIsOpen(false);
  };

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      ageRange: [18, 50],
      distance: 100,
      verifiedOnly: false,
      videoVerifiedOnly: false,
      hasPhotos: true,
      relationshipGoals: [],
      education: [],
      occupation: '',
      region: '',
      recentlyActive: false,
      compatibilityMin: 0,
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const countActiveFilters = () => {
    let count = 0;
    if (filters.ageRange[0] !== 18 || filters.ageRange[1] !== 50) count++;
    if (filters.distance !== 100) count++;
    if (filters.verifiedOnly) count++;
    if (filters.videoVerifiedOnly) count++;
    if (filters.relationshipGoals.length > 0) count++;
    if (filters.education.length > 0) count++;
    if (filters.occupation) count++;
    if (filters.region) count++;
    if (filters.recentlyActive) count++;
    if (filters.compatibilityMin > 0) count++;
    return count;
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {countActiveFilters() > 0 && (
            <Badge 
              variant="secondary" 
              className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary text-primary-foreground"
            >
              {countActiveFilters()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Smart Filters
            {!isPremium && (
              <span className="text-xs bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-2 py-0.5 rounded-full font-medium">Premium</span>
            )}
          </SheetTitle>
        </SheetHeader>

        {!isPremium && (
          <div className="mx-4 mt-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold">Premium Feature</p>
                <p className="text-xs text-muted-foreground mt-1">Upgrade to unlock advanced Smart Filters</p>
              </div>
            </div>
          </div>
        )}

        <div className="py-4 space-y-4">
          {/* Basic Filters */}
          <Collapsible 
            open={expandedSections.includes('basic')} 
            onOpenChange={() => toggleSection('basic')}
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-3 h-auto">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Basic Preferences</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.includes('basic') ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 p-3">
              <div className="space-y-2">
                <Label>Age Range: {filters.ageRange[0]} - {filters.ageRange[1]}</Label>
                <Slider
                  value={filters.ageRange}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, ageRange: value as [number, number] }))}
                  min={18}
                  max={70}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <Label>Distance: {filters.distance === 100 ? 'Unlimited' : `${filters.distance} km`}</Label>
                <Slider
                  value={[filters.distance]}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, distance: value[0] }))}
                  min={5}
                  max={100}
                  step={5}
                />
              </div>

              <div className="space-y-2">
                <Label>Region</Label>
                <Select 
                  value={filters.region} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, region: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any region</SelectItem>
                    {REGIONS.map(region => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Verification Filters */}
          <Collapsible 
            open={expandedSections.includes('verification')} 
            onOpenChange={() => toggleSection('verification')}
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-3 h-auto">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  <span>Verification</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.includes('verification') ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 p-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="verified">Verified profiles only</Label>
                <Switch
                  id="verified"
                  checked={filters.verifiedOnly}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, verifiedOnly: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="videoVerified">Video verified only</Label>
                <Switch
                  id="videoVerified"
                  checked={filters.videoVerifiedOnly}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, videoVerifiedOnly: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="recentlyActive">Recently active (24h)</Label>
                <Switch
                  id="recentlyActive"
                  checked={filters.recentlyActive}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, recentlyActive: checked }))}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Relationship Goals */}
          <Collapsible 
            open={expandedSections.includes('goals')} 
            onOpenChange={() => toggleSection('goals')}
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-3 h-auto">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span>Relationship Goals</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.includes('goals') ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-3">
              <div className="flex flex-wrap gap-2">
                {RELATIONSHIP_GOALS.map(goal => (
                  <Badge
                    key={goal}
                    variant={filters.relationshipGoals.includes(goal) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleRelationshipGoal(goal)}
                  >
                    {goal}
                  </Badge>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Education & Career */}
          <Collapsible 
            open={expandedSections.includes('career')} 
            onOpenChange={() => toggleSection('career')}
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-3 h-auto">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  <span>Education</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.includes('career') ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-3">
              <div className="flex flex-wrap gap-2">
                {EDUCATION_LEVELS.map(edu => (
                  <Badge
                    key={edu}
                    variant={filters.education.includes(edu) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleEducation(edu)}
                  >
                    {edu}
                  </Badge>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* AI Compatibility */}
          <Collapsible 
            open={expandedSections.includes('compatibility')} 
            onOpenChange={() => toggleSection('compatibility')}
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-3 h-auto">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span>AI Compatibility</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.includes('compatibility') ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 p-3">
              <div className="space-y-2">
                <Label>Minimum compatibility: {filters.compatibilityMin}%</Label>
                <Slider
                  value={[filters.compatibilityMin]}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, compatibilityMin: value[0] }))}
                  min={0}
                  max={90}
                  step={5}
                />
                <p className="text-xs text-muted-foreground">
                  Only show profiles with at least {filters.compatibilityMin}% AI-calculated compatibility
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <SheetFooter className="flex gap-2">
          <Button variant="outline" onClick={resetFilters} className="flex-1">
            Reset
          </Button>
          <Button onClick={applyFilters} className="flex-1" disabled={!isPremium}>
            {isPremium ? 'Apply Filters' : '⭐ Upgrade to Apply'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
