
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
      <div className="flex justify-between items-center mb-6 relative overflow-x-auto pb-4">
        {/* Fancy progress bar background */}
        <div className="absolute left-0 top-[18px] h-1.5 bg-gray-800/40 backdrop-blur-sm w-full rounded-full -z-10"></div>
        
        {/* Active progress bar with gradient */}
        <div 
          className="absolute left-0 top-[18px] h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-full shadow-lg shadow-purple-500/20 -z-10 transition-all duration-700 ease-out"
          style={{ 
            width: `${(currentStep / (steps.length - 1)) * 100}%`,
            minWidth: '5%'
          }}
        ></div>
        
        {/* Step indicators */}
        <div className="flex justify-between min-w-full">
          {steps.map((step, idx) => (
            <div 
              key={idx}
              className={`flex flex-col items-center cursor-pointer z-10 mx-1 transition-all duration-300 ${
                idx < currentStep 
                  ? "text-purple-300" 
                  : idx === currentStep 
                    ? "text-white" 
                    : "text-gray-500"
              }`}
              onClick={() => idx <= currentStep && setCurrentStep(idx)}
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                transition-all duration-500 ease-in-out
                ${idx < currentStep 
                  ? "bg-gradient-to-br from-purple-700 to-indigo-800 shadow-md shadow-purple-900/30 border border-purple-500/50" 
                  : idx === currentStep 
                    ? "bg-gradient-to-br from-indigo-500 to-purple-700 shadow-lg shadow-purple-700/40 border border-indigo-400/50 animate-pulse scale-110" 
                    : "bg-gray-800/80 border border-gray-700/50"}
              `}>
                {idx < currentStep ? (
                  <Check className="h-5 w-5 text-purple-200" />
                ) : idx === currentStep ? (
                  <div className="relative">
                    <span className="text-sm font-medium">{idx + 1}</span>
                    <Sparkles className="absolute -top-1 -right-2 h-3 w-3 text-yellow-300 animate-pulse" />
                  </div>
                ) : (
                  <span className="text-sm opacity-70">{idx + 1}</span>
                )}
              </div>
              <span className={`text-xs mt-2 font-medium whitespace-nowrap ${
                idx < currentStep ? "font-medium" : idx === currentStep ? "font-bold" : ""
              }`}>
                {step.name}
                <span className={`ml-1 text-[10px] opacity-70 hidden sm:inline ${
                  idx === currentStep ? "text-yellow-300" : ""
                }`}>
                  ({step.questions.length})
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Current step title with enhanced styling */}
      <div className="text-center mb-6 animate-fade-in">
        <div className="inline-block relative">
          <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
            {steps[currentStep]?.name}
            <span className="absolute -top-1 -right-4">
              {currentStep === steps.length - 1 && (
                <Sparkles className="h-4 w-4 text-yellow-300" />
              )}
            </span>
          </h2>
          <div className="h-0.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mt-1 rounded-full"></div>
        </div>
        <p className="text-sm text-gray-400 mt-2 flex items-center justify-center gap-1">
          <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded-full font-medium">
            Step {currentStep + 1}/{steps.length}
          </span>
          <span className="text-xs">•</span>
          <span>
            {steps[currentStep]?.questions.length} question{steps[currentStep]?.questions.length !== 1 ? 's' : ''}
          </span>
        </p>
      </div>
    </div>
  );
};

export default StepIndicator;
