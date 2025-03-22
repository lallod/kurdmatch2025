
import React from 'react';
import { Check } from 'lucide-react';

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
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-6 relative">
        {/* Progress bar background */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-gray-800 w-full -z-10"></div>
        
        {/* Active progress bar */}
        <div 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-gradient-to-r from-indigo-700 to-purple-700 -z-10 transition-all duration-500 ease-in-out"
          style={{ 
            width: `${(currentStep / (steps.length - 1)) * 100}%`,
            // For the first step, show at least 10% width
            minWidth: '10%'
          }}
        ></div>
        
        {/* Step indicators */}
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
              onClick={() => idx <= currentStep && setCurrentStep(idx)}
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center 
                ${idx < currentStep 
                  ? "bg-purple-900/80 border-2 border-purple-500 text-purple-200" 
                  : idx === currentStep 
                    ? "bg-indigo-700 border-2 border-indigo-500 animate-pulse" 
                    : "bg-gray-800 border-2 border-gray-700"}
                transition-all duration-300 ease-in-out
              `}>
                {idx < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <span className={`text-xs mt-2 ${
                idx < currentStep ? "font-medium" : idx === currentStep ? "font-bold" : ""
              }`}>
                {step.name}
                <span className="ml-1 text-[10px] opacity-70">
                  ({step.questions.length})
                </span>
              </span>
            </div>
            
            {/* Connecting line between steps */}
            {idx < steps.length - 1 && (
              <div className="hidden sm:block w-16 h-0.5 opacity-0"></div>
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Mobile step title (visible on small screens) */}
      <div className="text-center mb-6 sm:hidden">
        <h2 className="text-lg font-bold">
          {steps[currentStep]?.name} 
          <span className="text-sm ml-2 opacity-70">
            (Step {currentStep + 1} of {steps.length})
          </span>
        </h2>
      </div>
    </div>
  );
};

export default StepIndicator;
