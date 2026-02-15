
import React from 'react';
import { useTranslations } from '@/hooks/useTranslations';

const BasicInfoHeader = () => {
  const { t } = useTranslations();
  return (
    <div className="text-center mb-6">
      <h2 className="text-2xl font-bold text-foreground">{t('auth.basic_info', 'Basic Info')}</h2>
      <p className="text-muted-foreground mt-1">{t('auth.tell_about_yourself', 'Tell us about yourself')}</p>
    </div>
  );
};

export default BasicInfoHeader;
