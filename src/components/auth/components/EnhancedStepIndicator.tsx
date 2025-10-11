import React from 'react';
import { StepCategory } from '../utils/enhancedStepCategories';
import { CheckCircle, AlertCircle, Circle } from 'lucide-react';

interface EnhancedStepIndicatorProps {
  categories: StepCategory[];
  currentStep: number;
  completionStatus: Record<number, boolean>;
}

const EnhancedStepIndicator: React.FC<EnhancedStepIndicatorProps> = ({
  categories,
  currentStep,
  completionStatus
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      {/* Mobile: Simple dot indicators */}
      <div className="md:hidden">
        <div className="flex items-center justify-center gap-1.5 mb-3">
          {categories.map((category) => {
            const isActive = category.step === currentStep;
            const isCompleted = completionStatus[category.step];
            const isPast = category.step < currentStep;
            
            return (
              <div
                key={category.step}
                className={`
                  h-2 rounded-full transition-all duration-300
                  ${isActive ? 'w-8 bg-purple-500' : 'w-2'}
                  ${isCompleted || isPast ? 'bg-green-400' : 'bg-white/20'}
                `}
              />
            );
          })}
        </div>
        <div className="text-center text-xs text-white/60 mb-2">
          Step {currentStep} of {categories.length}: {categories[currentStep - 1]?.name}
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5">
          <div 
            className="bg-gradient-to-r from-purple-600 to-pink-600 h-1.5 rounded-full transition-all duration-500"
            style={{ 
              width: `${(currentStep / categories.length) * 100}%` 
            }}
          />
        </div>
      </div>

      {/* Desktop: Full step indicators */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {categories.map((category, index) => {
            const isActive = category.step === currentStep;
            const isCompleted = completionStatus[category.step];
            const isPast = category.step < currentStep;
            
            const IconComponent = category.icon;
            
            return (
              <React.Fragment key={category.step}>
                <div className="flex flex-col items-center">
                  {/* Step Circle */}
                  <div className={`
                    relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300
                    ${isActive 
                      ? 'bg-purple-600 border-purple-400 text-white' 
                      : isCompleted || isPast
                      ? 'bg-green-600 border-green-400 text-white'
                      : 'bg-white/10 border-white/30 text-white/60'
                    }
                  `}>
                    {isCompleted || isPast ? (
                      <CheckCircle size={20} />
                    ) : isActive ? (
                      <IconComponent size={20} />
                    ) : (
                      <Circle size={20} />
                    )}
                    
                    {/* Completion Status Indicator */}
                    {isActive && (
                      <div className={`
                        absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white
                        ${isCompleted ? 'bg-green-400' : 'bg-yellow-400'}
                      `}>
                        {isCompleted ? (
                          <CheckCircle size={12} className="text-white" />
                        ) : (
                          <AlertCircle size={12} className="text-white" />
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Step Label */}
                  <div className="text-center mt-2">
                    <div className={`
                      text-xs font-medium transition-colors duration-300
                      ${isActive ? 'text-purple-300' : 'text-white/60'}
                    `}>
                      {category.name}
                    </div>
                    {isActive && (
                      <div className="text-[10px] text-white/40 mt-1">
                        {isCompleted ? 'Complete' : 'In Progress'}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Connector Line */}
                {index < categories.length - 1 && (
                  <div className={`
                    flex-1 h-0.5 mx-2 transition-colors duration-300
                    ${category.step < currentStep ? 'bg-green-400' : 'bg-white/20'}
                  `} />
                )}
              </React.Fragment>
            );
          })}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-white/10 rounded-full h-2 mt-4">
          <div 
            className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${((currentStep - 1) / (categories.length - 1)) * 100}%` 
            }}
          />
        </div>
        
        {/* Completion Summary */}
        <div className="text-center mt-2 text-xs text-white/60">
          {Object.values(completionStatus).filter(Boolean).length} of {categories.length} steps completed
        </div>
      </div>
    </div>
  );
};

export default EnhancedStepIndicator;