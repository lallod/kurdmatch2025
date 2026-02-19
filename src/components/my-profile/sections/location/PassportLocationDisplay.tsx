
import React from 'react';
import { Globe, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from '@/hooks/useTranslations';

interface PassportLocationDisplayProps {
  location: string;
  passportLocation: string;
  onClear: () => void;
}

const PassportLocationDisplay: React.FC<PassportLocationDisplayProps> = ({
  location,
  passportLocation,
  onClear
}) => {
  const { toast } = useToast();
  const { t } = useTranslations();

  const handleClear = () => {
    onClear();
    toast({
      title: t('toast.passport.removed', 'Passport location removed'),
      description: t('toast.passport.removed_desc', 'Your passport location has been reset.')
    });
  };

  return (
    <div className="space-y-3">
      <div className="p-3 bg-muted rounded-md flex items-center">
        <Globe size={16} className="mr-2 text-primary" />
        {passportLocation || location || t('location.no_passport', 'No passport location set')}
      </div>
      
      {passportLocation && (
        <Badge variant="outline" className="gap-1 px-2 py-1">
          <Globe size={12} />
          {passportLocation}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-4 w-4 p-0 ml-1" 
            onClick={handleClear}
          >
            <X size={10} />
            <span className="sr-only">{t('common.remove', 'Remove')}</span>
          </Button>
        </Badge>
      )}
      
      <p className="text-xs text-muted-foreground mt-1">
        {t('location.passport_desc', 'Virtual location for exploring matches in other cities worldwide.')}
      </p>
    </div>
  );
};

export default PassportLocationDisplay;
