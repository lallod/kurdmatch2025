
import React from 'react';

interface Step {
  name: string;
  questions: any[];
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const StepIndicator = ({ steps, currentStep, setCurrentStep }: StepIndicatorProps) => {
  return (
    <div className="flex justify-center items-center mb-6 relative">
      {steps.map((step, idx) => (
        <React.Fragment key={idx}>
          <div 
            className={`flex flex-col items-center cursor-pointer z-10 ${
              idx < currentStep 
                ? "text-purple-400" 
                : idx === currentStep 
                  ? "text-white" 
                  : "text-gray-600"
            }`}
            onClick={() => idx < currentStep && setCurrentStep(idx)}
          >
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center 
              ${idx < currentStep 
                ? "bg-purple-900/50 border-2 border-purple-500" 
                : idx === currentStep 
                  ? "bg-indigo-700 border-2 border-indigo-500 animate-pulse" 
                  : "bg-gray-800 border-2 border-gray-700"}
            `}>
              {idx + 1}
            </div>
            <span className={`text-xs mt-1 ${
              idx < currentStep ? "font-medium" : idx === currentStep ? "font-medium" : ""
            }`}>
              {step.name}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div className={`w-16 h-0.5 ${
              idx < currentStep ? "bg-purple-700" : "bg-gray-800"
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
