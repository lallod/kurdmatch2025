
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface Step {
  title: string;
  icon: LucideIcon;
  description: string;
}

interface StepIndicatorProps {
  currentStep: number;
  completedSteps: number[];
  steps: Step[];
}

const StepIndicator = ({ currentStep, completedSteps, steps }: StepIndicatorProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      {steps.map((s, idx) => {
        const StepIcon = s.icon;
        return (
          <div key={idx} className="contents">
            <div className="flex flex-col items-center">
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300
                ${currentStep === idx + 1 ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-110' : 
                  completedSteps.includes(idx + 1) ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' : 'bg-white/20 backdrop-blur text-gray-400 border border-white/30'}
              `}>
                {completedSteps.includes(idx + 1) ? <CheckCircle size={20} /> : <StepIcon size={20} />}
              </div>
              <span className={`text-xs font-medium transition-colors ${currentStep === idx + 1 ? 'text-white' : completedSteps.includes(idx + 1) ? 'text-green-400' : 'text-gray-400'}`}>
                {s.title}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-2 rounded transition-all duration-500 ${
                completedSteps.includes(idx + 2) ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 
                currentStep > idx + 1 ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-white/20'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
