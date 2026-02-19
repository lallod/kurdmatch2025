
import React from 'react';
import { Navigation, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/useTranslations';

interface CurrentLocationTabProps {
  location: string;
  isLoading: boolean;
  onDetectLocation: () => void;
}

const CurrentLocationTab: React.FC<CurrentLocationTabProps> = ({
  location,
  isLoading,
  onDetectLocation
}) => {
  const { t } = useTranslations();
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{t('location.device_location', 'Device Location')}</label>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary h-7 px-2"
          onClick={onDetectLocation}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 size={16} className="mr-1 animate-spin" />
          ) : (
            <Navigation size={16} className="mr-1" />
          )}
          {isLoading ? t('location.updating', 'Updating...') : t('location.update', 'Update')}
        </Button>
      </div>
      <div className="p-3 bg-muted rounded-md flex items-center">
        {isLoading ? (
          <Loader2 size={16} className="mr-2 text-primary animate-spin" />
        ) : (
          <Navigation size={16} className="mr-2 text-primary" />
        )}
        {isLoading ? t('location.detecting', 'Detecting location...') : location}
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {t('location.gps_desc', "This uses your device's GPS to determine your exact location.")}
      </p>
    </div>
  );
};

export default CurrentLocationTab;
