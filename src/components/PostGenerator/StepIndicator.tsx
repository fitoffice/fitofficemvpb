import React from 'react';
import { Lightbulb, Type, Image } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: 'ideas' | 'content' | 'image';
  className?: string;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, className = '' }) => {
  const steps = [
    { id: 'ideas', label: 'Generate Ideas', icon: Lightbulb },
    { id: 'content', label: 'Edit Attributes', icon: Type },
    { id: 'image', label: 'Preview Image', icon: Image },
  ];

  return (
    <div className={`flex items-center justify-center w-full ${className}`}>
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isPast = steps.findIndex(s => s.id === currentStep) > index;
        const isCompleted = isPast || isActive;
        
        // Determine the step number
        const stepNumber = index + 1;
        
        return (
          <React.Fragment key={step.id}>
            {/* Step item */}
            <div className="flex flex-col items-center">
              {/* Step circle with number or icon */}
              <div className={`
                flex items-center justify-center w-12 h-12 rounded-full 
                ${isActive 
                  ? 'bg-purple-600 text-white' 
                  : isPast 
                    ? 'bg-gray-300 text-gray-700' 
                    : 'bg-gray-200 text-gray-500'
                }
                transition-all duration-300
              `}>
                {index === 0 && isActive ? (
                  <step.icon size={24} />
                ) : (
                  <span className="text-lg font-semibold">{stepNumber}</span>
                )}
              </div>
              
              {/* Step label */}
              <span className={`
                mt-2 text-sm font-medium
                ${isActive 
                  ? 'text-purple-600' 
                  : isPast 
                    ? 'text-gray-700' 
                    : 'text-gray-500'
                }
              `}>
                {step.label}
              </span>
            </div>
            
            {/* Connector line between steps */}
            {index < steps.length - 1 && (
              <div className={`
                h-px w-24 mx-2
                ${isPast ? 'bg-purple-500' : 'bg-gray-300'}
                transition-all duration-300
              `} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;