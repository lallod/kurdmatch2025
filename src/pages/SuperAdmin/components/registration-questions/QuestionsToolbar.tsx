
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { useTranslations } from '@/hooks/useTranslations';

interface QuestionsToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterSelect: (filter: string) => void;
}

const QuestionsToolbar: React.FC<QuestionsToolbarProps> = ({
  searchQuery,
  onSearchChange,
  onFilterSelect
}) => {
  const { t } = useTranslations();

  return (
    <div className="flex justify-between items-center">
      <div>
        <CardTitle className="text-white">{t('admin.registration_questions', 'Registration Questions')}</CardTitle>
        <CardDescription className="text-white/60">
          {t('admin.configure_questions', 'Configure questions users will answer during registration')}
        </CardDescription>
      </div>
      <div className="flex items-center space-x-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('admin.search_questions', 'Search questions...')}
            className="pl-8 w-[250px]"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{t('admin.filter_questions', 'Filter Questions')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onFilterSelect('required')}>
              {t('admin.required_questions', 'Required Questions')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterSelect('optional')}>
              {t('admin.optional_questions', 'Optional Questions')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterSelect('enabled')}>
              {t('admin.enabled_questions', 'Enabled Questions')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterSelect('disabled')}>
              {t('admin.disabled_questions', 'Disabled Questions')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default QuestionsToolbar;
