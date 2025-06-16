
import React from 'react';
import { ChoiceChips } from '../fields/ChoiceChips';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Briefcase, GraduationCap } from 'lucide-react';

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
  const educationOptions = [
    { value: 'high_school', label: 'High School', icon: <GraduationCap className="w-4 h-4" /> },
    { value: 'some_college', label: 'Some College', icon: <GraduationCap className="w-4 h-4" /> },
    { value: 'bachelors', label: "Bachelor's Degree", icon: <GraduationCap className="w-4 h-4" /> },
    { value: 'masters', label: "Master's Degree", icon: <GraduationCap className="w-4 h-4" /> },
    { value: 'doctorate', label: 'Doctorate', icon: <GraduationCap className="w-4 h-4" /> },
    { value: 'trade_school', label: 'Trade School', icon: <GraduationCap className="w-4 h-4" /> },
    { value: 'other', label: 'Other', icon: <GraduationCap className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Your professional life</h2>
        <p className="text-gray-600">Tell us about your education and career</p>
      </div>

      <div className="space-y-6">
        {/* Education */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Education Level</h3>
          <ChoiceChips
            options={educationOptions}
            value={data.education}
            onChange={(value) => onChange({ ...data, education: value })}
            columns={2}
          />
        </div>

        {/* Occupation */}
        <div className="space-y-3">
          <Label htmlFor="occupation" className="text-lg font-medium">Occupation</Label>
          <Input
            id="occupation"
            value={data.occupation || ''}
            onChange={(e) => onChange({ ...data, occupation: e.target.value })}
            placeholder="e.g., Software Engineer, Teacher, Doctor"
            className="text-lg p-4 rounded-xl"
          />
        </div>

        {/* Company */}
        <div className="space-y-3">
          <Label htmlFor="company" className="text-lg font-medium">Company/Organization</Label>
          <Input
            id="company"
            value={data.company || ''}
            onChange={(e) => onChange({ ...data, company: e.target.value })}
            placeholder="Where do you work?"
            className="text-lg p-4 rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};
