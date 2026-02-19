
import React from 'react';
import { ChoiceChips } from '../fields/ChoiceChips';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Briefcase, GraduationCap } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

interface Step5Data {
  education?: string;
  occupation?: string;
  company?: string;
}

interface Step5CareerProps {
  data: Step5Data;
  onChange: (data: Step5Data) => void;
}

export const Step5Career: React.FC<Step5CareerProps> = ({ data, onChange }) => {
  const { t } = useTranslations();
  const educationOptions = [
    { value: 'high_school', label: t('career.high_school', 'High School'), icon: <GraduationCap className="w-4 h-4" /> },
    { value: 'some_college', label: t('career.some_college', 'Some College'), icon: <GraduationCap className="w-4 h-4" /> },
    { value: 'bachelors', label: t('career.bachelors', "Bachelor's Degree"), icon: <GraduationCap className="w-4 h-4" /> },
    { value: 'masters', label: t('career.masters', "Master's Degree"), icon: <GraduationCap className="w-4 h-4" /> },
    { value: 'doctorate', label: t('career.doctorate', 'Doctorate'), icon: <GraduationCap className="w-4 h-4" /> },
    { value: 'trade_school', label: t('career.trade_school', 'Trade School'), icon: <GraduationCap className="w-4 h-4" /> },
    { value: 'other', label: t('common.other', 'Other'), icon: <GraduationCap className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">{t('career.title', 'Your professional life')}</h2>
        <p className="text-purple-200">{t('career.subtitle', 'Tell us about your education and career')}</p>
      </div>

      <div className="space-y-6">
        {/* Education */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">{t('career.education_level', 'Education Level')}</h3>
          <ChoiceChips
            options={educationOptions}
            value={data.education}
            onChange={(value) => onChange({ ...data, education: value })}
            columns={2}
          />
        </div>

        {/* Occupation */}
        <div className="space-y-3">
          <Label htmlFor="occupation" className="text-lg font-medium text-white">{t('career.occupation', 'Occupation')}</Label>
          <Input
            id="occupation"
            value={data.occupation || ''}
            onChange={(e) => onChange({ ...data, occupation: e.target.value })}
            placeholder={t('career.occupation_placeholder', 'e.g., Software Engineer, Teacher, Doctor')}
            className="text-lg p-4 rounded-xl bg-white/10 backdrop-blur border-white/20 text-white placeholder:text-purple-300"
          />
        </div>

        {/* Company */}
        <div className="space-y-3">
          <Label htmlFor="company" className="text-lg font-medium text-white">{t('career.company', 'Company/Organization')}</Label>
          <Input
            id="company"
            value={data.company || ''}
            onChange={(e) => onChange({ ...data, company: e.target.value })}
            placeholder={t('career.company_placeholder', 'Where do you work?')}
            className="text-lg p-4 rounded-xl bg-white/10 backdrop-blur border-white/20 text-white placeholder:text-purple-300"
          />
        </div>
      </div>
    </div>
  );
};