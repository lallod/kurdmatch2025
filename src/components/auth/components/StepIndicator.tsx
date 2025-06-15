
import React from 'react';
import { Check, Sparkles } from 'lucide-react';

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
      <div className="relative mb-4">
        <div className="hidden md:block absolute top-5 left-0 w-full h-1 bg-gray-700 -z-10" />
        <div
          className="hidden md:block absolute top-5 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
        <div className="flex justify-between items-start flex-wrap -mx-2">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="flex-1 min-w-[90px] px-2 flex flex-col items-center text-center cursor-pointer group"
              onClick={() => idx <= currentStep && setCurrentStep(idx)}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 transition-all duration-300 ${
                  idx < currentStep
                    ? 'bg-indigo-600 border-indigo-400'
                    : idx === currentStep
                    ? 'bg-purple-600 border-purple-400 scale-110'
                    : 'bg-gray-800 border-gray-600'
                }`}
              >
                {idx < currentStep ? (
                  <Check className="h-5 w-5 text-white" />
                ) : (
                  <span className={`font-bold text-sm ${idx === currentStep ? 'text-white' : 'text-gray-400'}`}>
                    {idx + 1}
                  </span>
                )}
              </div>
              <p
                className={`text-xs font-medium transition-colors ${
                  idx === currentStep ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                }`}
              >
                {step.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center my-4 animate-fade-in">
        <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
          {steps[currentStep]?.name}
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Steg {currentStep + 1} av {steps.length}
        </p>
      </div>
    </div>
  );
};

export default StepIndicator;
