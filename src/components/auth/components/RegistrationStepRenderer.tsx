
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import AccountStep from './AccountStep';
import BasicInfoStep from './BasicInfoStep';
import LocationStep from './LocationStep';
import PhotoUploadStep from './PhotoUploadStep';
import SocialLogin from './SocialLogin';
import { RegistrationFormValues } from '../utils/registrationSchema';
import { registrationSteps } from '../utils/registrationSteps';
import { useTranslations } from '@/hooks/useTranslations';

interface RegistrationStepRendererProps {
  step: number;
  form: UseFormReturn<RegistrationFormValues>;
  location: string;
  locationLoading: boolean;
}

const RegistrationStepRenderer = ({ 
  step, 
  form, 
  location, 
  locationLoading 
}: RegistrationStepRendererProps) => {
  const { t } = useTranslations();
  
  switch (step) {
    case 1:
      return (
        <div className="space-y-4 sm:space-y-6">
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">{t(registrationSteps[0].titleKey, registrationSteps[0].title)}</h2>
            <p className="text-purple-200 mt-1 text-sm sm:text-base">{t(registrationSteps[0].descriptionKey, registrationSteps[0].description)}</p>
          </div>
          
          <SocialLogin />
          
          <AccountStep form={form} />
        </div>
      );
    case 2:
      return <BasicInfoStep form={form} />;
    case 3:
      return <LocationStep form={form} location={location} locationLoading={locationLoading} />;
    case 4:
      return (
        <div className="space-y-4 sm:space-y-6">
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">{t(registrationSteps[3].titleKey, registrationSteps[3].title)}</h2>
            <p className="text-purple-200 mt-1 text-sm sm:text-base">{t(registrationSteps[3].descriptionKey, registrationSteps[3].description)}</p>
          </div>
          
          <PhotoUploadStep 
            form={form}
            question={{ id: 'photos', profileField: 'photos' } as any}
          />
        </div>
      );
    default:
      return null;
  }
};

export default RegistrationStepRenderer;
