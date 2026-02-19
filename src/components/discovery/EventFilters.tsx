import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, Users, X, Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslations } from '@/hooks/useTranslations';

interface EventFiltersProps {
  category: string;
  location: string;
  dateFrom: string;
  dateTo: string;
  searchQuery: string;
  onCategoryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onClearFilters: () => void;
}

const EventFilters: React.FC<EventFiltersProps> = ({
  category,
  location,
  dateFrom,
  dateTo,
  searchQuery,
  onCategoryChange,
  onLocationChange,
  onDateFromChange,
  onDateToChange,
  onSearchChange,
  onClearFilters,
}) => {
  const { t } = useTranslations();
  const hasActiveFilters = category !== 'all' || location || dateFrom || dateTo || searchQuery;

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">{t('events.filter_events', 'Filter Events')}</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4 mr-1" />
            {t('common.clear', 'Clear')}
          </Button>
        )}
      </div>

      {/* Search Input */}
      <div className="space-y-2">
        <Label className="text-white/80 text-sm flex items-center gap-2">
          <Search className="w-4 h-4" />
          {t('common.search', 'Search')}
        </Label>
        <Input
          type="text"
          placeholder={t('events.search_placeholder', 'Search events by title, description...')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category */}
        <div className="space-y-2">
          <Label className="text-white/80 text-sm flex items-center gap-2">
            <Users className="w-4 h-4" />
            {t('events.category', 'Category')}
          </Label>
          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('events.all_categories', 'All Categories')}</SelectItem>
              <SelectItem value="Music">{t('events.music', 'Music')}</SelectItem>
              <SelectItem value="Culture">{t('events.culture', 'Culture')}</SelectItem>
              <SelectItem value="Food">{t('events.food', 'Food')}</SelectItem>
              <SelectItem value="Sports">{t('events.sports', 'Sports')}</SelectItem>
              <SelectItem value="Art">{t('events.art', 'Art')}</SelectItem>
              <SelectItem value="Education">{t('events.education', 'Education')}</SelectItem>
              <SelectItem value="Social">{t('events.social', 'Social')}</SelectItem>
              <SelectItem value="Other">{t('common.other', 'Other')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label className="text-white/80 text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {t('common.location', 'Location')}
          </Label>
          <Input
            type="text"
            placeholder={t('events.filter_location', 'Filter by location...')}
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>

        {/* Date From */}
        <div className="space-y-2">
          <Label className="text-white/80 text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {t('events.from_date', 'From Date')}
          </Label>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            className="bg-white/10 border-white/20 text-white"
          />
        </div>

        {/* Date To */}
        <div className="space-y-2">
          <Label className="text-white/80 text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {t('events.to_date', 'To Date')}
          </Label>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            className="bg-white/10 border-white/20 text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default EventFilters;
