
import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTranslations } from '@/hooks/useTranslations';

const PhotoTips = () => {
  const { t } = useTranslations();

  return (
    <>
      <Alert variant="default" className="mt-4 bg-blue-500/10 border-blue-400/30 backdrop-blur">
        <ShieldCheck className="h-4 w-4 !text-blue-400" />
        <AlertTitle className="font-semibold text-blue-300">{t('photo_tips.safety_title', 'Your safety is our priority')}</AlertTitle>
        <AlertDescription className="text-blue-200">
          {t('photo_tips.safety_desc', 'Never share photos that reveal personal information like your home address or workplace. Be mindful of what\'s in the background of your photos.')}
        </AlertDescription>
      </Alert>
      
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2 text-white">{t('photo_tips.title', 'Photo tips:')}</h4>
        <ul className="text-xs text-purple-300 space-y-1 list-disc pl-5">
          <li>{t('photo_tips.tip1', 'Your first photo should clearly show your face')}</li>
          <li>{t('photo_tips.tip2', 'Add up to 5 photos to showcase your personality')}</li>
          <li>{t('photo_tips.tip3', 'Use our free AI editor to enhance your photos')}</li>
          <li>{t('photo_tips.tip4', 'Background removal and filters are completely free')}</li>
          <li>{t('photo_tips.tip5', 'Good lighting makes a big difference')}</li>
        </ul>
      </div>
    </>
  );
};

export default PhotoTips;
